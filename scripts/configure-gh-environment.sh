#!/usr/bin/env bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Define secrets and variables based on deployment.md
SECRETS=(
  "SSH_PRIVATE_KEY"
  "DIRECTUS_SECRET"
  "DIRECTUS_ADMIN_EMAIL"
  "DIRECTUS_ADMIN_PASSWORD"
  "DIRECTUS_ADMIN_TOKEN"
  "DB_PASSWORD"
  "VISUAL_EDITOR_TOKEN"
)

VARIABLES=(
  "SERVER_HOST"
  "SSH_USER"
  "DEPLOY_PATH"
  "DB_DATABASE"
  "DB_USER"
  "FRONTEND_PUBLIC_URL"
  "API_PUBLIC_URL"
)

# Function to check if gh CLI is installed
check_gh_cli() {
  if ! command -v gh &> /dev/null; then
    echo -e "${RED}Error: GitHub CLI (gh) is not installed${NC}"
    echo "Install it from: https://cli.github.com/"
    exit 1
  fi
  
  # Check if authenticated
  if ! gh auth status &> /dev/null; then
    echo -e "${RED}Error: Not authenticated with GitHub CLI${NC}"
    echo "Run: gh auth login"
    exit 1
  fi
}

# Function to create environment if it doesn't exist
create_environment_if_needed() {
  local env_name=$1
  
  echo -e "${YELLOW}Checking if environment '$env_name' exists...${NC}"
  
  # Try to get environment info
  if gh api "repos/:owner/:repo/environments/$env_name" &> /dev/null; then
    echo -e "${GREEN}Environment '$env_name' already exists${NC}"
  else
    echo -e "${YELLOW}Creating environment '$env_name'...${NC}"
    gh api --method PUT "repos/:owner/:repo/environments/$env_name" \
      -f wait_timer=0 \
      -F prevent_self_review=false \
      -F reviewers='[]' \
      -F deployment_branch_policy='null' > /dev/null
    echo -e "${GREEN}Environment '$env_name' created${NC}"
  fi
}

# Function to check if a secret exists
secret_exists() {
  local env_name=$1
  local secret_name=$2
  
  gh secret list --env "$env_name" 2>/dev/null | grep -q "^$secret_name"
}

# Function to check if a variable exists
variable_exists() {
  local env_name=$1
  local var_name=$2
  
  gh variable list --env "$env_name" 2>/dev/null | grep -q "^$var_name"
}

# Function to set a secret
set_secret() {
  local env_name=$1
  local secret_name=$2
  local secret_value=$3
  
  if secret_exists "$env_name" "$secret_name"; then
    echo -e "${YELLOW}  Secret $secret_name already exists, skipping${NC}"
  else
    echo -e "${GREEN}  Setting secret $secret_name${NC}"
    echo "$secret_value" | gh secret set "$secret_name" --env "$env_name"
  fi
}

# Function to set a variable
set_variable() {
  local env_name=$1
  local var_name=$2
  local var_value=$3
  
  if variable_exists "$env_name" "$var_name"; then
    echo -e "${YELLOW}  Variable $var_name already exists, skipping${NC}"
  else
    echo -e "${GREEN}  Setting variable $var_name${NC}"
    gh variable set "$var_name" --env "$env_name" --body "$var_value"
  fi
}

# Function to generate random base64 string
generate_random_base64() {
  openssl rand -base64 32
}

# Function to process an environment file
process_env_file() {
  local env_file=$1
  local env_name=$2
  
  echo -e "\n${GREEN}=== Processing environment: $env_name ===${NC}"
  
  # Create environment if needed
  create_environment_if_needed "$env_name"
  
  # Read the .env file
  if [ ! -f "$env_file" ]; then
    echo -e "${RED}Error: File $env_file not found${NC}"
    return 1
  fi
  
  # Process each line in the .env file
  while IFS= read -r line || [ -n "$line" ]; do
    # Skip comments and empty lines
    [[ "$line" =~ ^#.*$ ]] && continue
    [[ -z "$line" ]] && continue
    
    # Extract key and value
    if [[ "$line" =~ ^([A-Z_][A-Z0-9_]*)=(.*)$ ]]; then
      key="${BASH_REMATCH[1]}"
      value="${BASH_REMATCH[2]}"
      
      # Remove quotes if present
      value="${value%\"}"
      value="${value#\"}"
      value="${value%\'}"
      value="${value#\'}"
      
      # Determine if it's a secret or variable
      if [[ " ${SECRETS[@]} " =~ " ${key} " ]]; then
        set_secret "$env_name" "$key" "$value"
      elif [[ " ${VARIABLES[@]} " =~ " ${key} " ]]; then
        set_variable "$env_name" "$key" "$value"
      else
        # Unknown key, treat as variable
        echo -e "${YELLOW}  Unknown key $key, adding as variable${NC}"
        set_variable "$env_name" "$key" "$value"
      fi
    fi
  done < "$env_file"
  
  # Handle DIRECTUS_SECRET if not in .env file
  if ! grep -q "^DIRECTUS_SECRET=" "$env_file" 2>/dev/null; then
    if ! secret_exists "$env_name" "DIRECTUS_SECRET"; then
      echo -e "${GREEN}  Generating and setting DIRECTUS_SECRET${NC}"
      local random_secret=$(generate_random_base64)
      set_secret "$env_name" "DIRECTUS_SECRET" "$random_secret"
    fi
  fi
  
  echo -e "${GREEN}Environment '$env_name' configured successfully${NC}"
}

# Main script
main() {
  local env_name=""
  
  # Parse arguments
  while [[ $# -gt 0 ]]; do
    case $1 in
      --env)
        env_name="$2"
        shift 2
        ;;
      *)
        echo -e "${RED}Unknown option: $1${NC}"
        echo "Usage: $0 [--env <environment>]"
        exit 1
        ;;
    esac
  done
  
  # Check prerequisites
  check_gh_cli
  
  if [ -n "$env_name" ]; then
    # Process specific environment from environments/ folder
    local env_file="environments/.env.$env_name"
    if [ ! -f "$env_file" ]; then
      echo -e "${RED}Error: $env_file not found${NC}"
      echo "Create it from environments/.env.staging.example"
      exit 1
    fi
    process_env_file "$env_file" "$env_name"
  else
    # Process all .env files in environments/ folder except examples
    echo -e "${GREEN}Processing all environment files from environments/ folder...${NC}"
    
    local found_files=false
    for env_file in environments/.env.*; do
      # Skip if no files match
      [ -e "$env_file" ] || continue
      
      # Extract environment name
      local env=$(echo "$env_file" | sed 's/^environments\/\.env\.//')
      
      # Skip example files
      if [[ "$env" =~ \.example$ ]]; then
        echo -e "${YELLOW}Skipping $env_file${NC}"
        continue
      fi
      
      found_files=true
      process_env_file "$env_file" "$env"
    done
    
    if [ "$found_files" = false ]; then
      echo -e "${YELLOW}No .env files found in environments/ folder${NC}"
      echo "Create them from environments/.env.staging.example"
    fi
  fi
  
  echo -e "\n${GREEN}=== Configuration complete ===${NC}"
}

main "$@"
