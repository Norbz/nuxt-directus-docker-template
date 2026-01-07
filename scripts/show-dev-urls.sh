#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo ""
echo -e "${GREEN}🚀 Development Services${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Get the project name (directory name by default)
PROJECT_NAME=${COMPOSE_PROJECT_NAME:-$(basename "$(pwd)")}

# Function to get the host port for a service
get_host_port() {
    local service=$1
    local container_port=$2
    local container_name="${PROJECT_NAME}-${service}-1"
    
    # Try to get the port from docker inspect
    port=$(docker inspect --format='{{range $p, $conf := .NetworkSettings.Ports}}{{if eq $p "'${container_port}'/tcp"}}{{(index $conf 0).HostPort}}{{end}}{{end}}' "$container_name" 2>/dev/null)
    
    echo "$port"
}

# Check if containers are running
if ! docker compose ps --quiet > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  No containers are running${NC}"
    echo -e "   Start them with: ${BLUE}docker compose up${NC}"
    echo ""
    exit 0
fi

# Directus
directus_port=$(get_host_port "directus" "8055")
if [ -n "$directus_port" ]; then
    echo -e "  ${BLUE}Directus CMS${NC}"
    echo -e "  ➜ http://localhost:${directus_port}"
    echo ""
fi

# Frontend
frontend_port=$(get_host_port "frontend" "3000")
if [ -n "$frontend_port" ]; then
    echo -e "  ${BLUE}Frontend (Nuxt)${NC}"
    echo -e "  ➜ http://localhost:${frontend_port}"
    echo ""
fi

# PostgreSQL
postgres_port=$(get_host_port "postgres" "5432")
if [ -n "$postgres_port" ]; then
    echo -e "  ${BLUE}PostgreSQL${NC}"
    echo -e "  ➜ localhost:${postgres_port}"
    echo ""
fi

# Redis
redis_port=$(get_host_port "redis" "6379")
if [ -n "$redis_port" ]; then
    echo -e "  ${BLUE}Redis${NC}"
    echo -e "  ➜ localhost:${redis_port}"
    echo ""
fi

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
