# Deployment Environments

This folder contains environment-specific configuration files for GitHub deployments.

## Usage

1. Copy the example file for your environment:
   ```bash
   cp .env.staging.example .env.staging
   # or
   cp .env.staging.example .env.production
   ```

2. Fill in all required values in your `.env.<environment>` file

3. Run the configuration script:
   ```bash
   # Configure specific environment
   npm run gh:config:env -- --env staging
   
   # Or configure all environments at once
   npm run gh:config:env
   ```

The script will automatically:
- Create the GitHub environment if it doesn't exist
- Add secrets to GitHub Secrets (SSH keys, passwords, tokens)
- Add variables to GitHub Variables (server info, URLs)
- Skip any secrets/variables that already exist

## Files

- `.env.staging.example` - Template for staging environment
- `.env.staging` - Your staging configuration (gitignored)
- `.env.production` - Your production configuration (gitignored)

## Security

- Never commit actual `.env.<environment>` files (without `.example` suffix)
- These files contain sensitive credentials and should remain local
- The `.gitignore` is configured to exclude them automatically
