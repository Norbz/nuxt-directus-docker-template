# Deployment Guide

This document describes how to deploy the website to a production server using GitHub Actions.

## Overview

The deployment process uses GitHub Actions to:
1. Connect to your server via SSH
2. Backup the database and project files
3. Sync the latest code
4. Generate environment files from GitHub secrets
5. Rebuild and restart Docker containers
6. Pull Directus schema updates

### Environment Files Structure

The project uses multiple `.env` files for different purposes:

- **Root `.env`**: Used for CLI operations (schema sync, database backup/restore) and docker-compose variables
  - `DIRECTUS_ADMIN_TOKEN`: Admin token for CLI operations
  - `FRONTEND_PUBLIC_URL`: Public URL of frontend (used by docker-compose)
  - `API_PUBLIC_URL`: Public URL of API (used by docker-compose)

- **`api/.env`**: Directus configuration
  - `SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`: Directus admin setup
  - `DB_*`: Database connection settings
  - `PUBLIC_URL`: Directus API public URL
  - `FRONTEND_PUBLIC_URL`: For Content Security Policy (CSP)

- **`frontend/.env`**: Nuxt configuration (optional, docker-compose overrides these)
  - Only used for local development outside Docker
  - In production, all frontend env vars are set in docker-compose.yml

## Prerequisites

### Server Requirements
- Ubuntu/Debian server with Docker and Docker Compose installed
- SSH access with public key authentication
- Ports 80, 443, 8055 (Directus), 3000 (Frontend) accessible

### GitHub Repository Setup

By default, the deploy workflow will deploy to a `staging` environment when a new release is published.
Deployment to `production` will be manually triggered since Github does not support manual validation steps even when paying for Github pro.

#### 1. Create a Production Environment
1. Go to your repository on GitHub
2. Navigate to **Settings** → **Environments**
3. Click **New environment**
4. Name it `staging` or `production`
5. Configure any protection rules (e.g., required reviewers)

#### 2. Configure GitHub Secrets

Navigate to **Settings** → **Secrets and variables** → **Actions** → **Environment secrets** (under the `production` environment).

Add the following **Secrets**:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `SSH_PRIVATE_KEY` | Private SSH key for deployment (see below) | `-----BEGIN OPENSSH PRIVATE KEY-----\n...` |
| `DIRECTUS_SECRET` | Random secret for Directus | Generate with `openssl rand -base64 32` |
| `DIRECTUS_ADMIN_EMAIL` | Admin email for Directus | `admin@host.tld` |
| `DIRECTUS_ADMIN_PASSWORD` | Admin password for Directus | Strong password |
| `DIRECTUS_ADMIN_TOKEN` | Static admin token for CLI operations | Generate in Directus admin panel |
| `DB_PASSWORD` | PostgreSQL database password | Strong password |
| `VISUAL_EDITOR_TOKEN` | Token for Visual Editor and live preview access | Static token associated to a directus user with read only access to relevant collections|

##### Generating and Adding an SSH Key

1. **Generate an SSH Key**:
   On your local machine, run the following command to generate an SSH key pair:
   ```bash
   ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
   ```
   - When prompted, specify a file to save the key (e.g., `~/.ssh/id_rsa`) or press Enter to use the default location.
   - If the key is used on your computer, set a passphrase for added security (recommended).
   - If the key is generated specifically for GitHub Actions, do NOT set a passphrase. Delete the key afterward or store it securely

2. **Add the Public Key to Your Server**:
   Copy the public key to your server:
   ```bash
   ssh-copy-id -i ~/.ssh/id_rsa.pub user@your_server_ip
   ```
   Replace `user` with your server username and `your_server_ip` with your server's IP address or hostname.

3. **Test the Connection**:
   Verify that you can connect to the server without a password:
   ```bash
   ssh user@your_server_ip
   ```

4. **Add the Private Key to GitHub Secrets**:
   - Open your GitHub repository.
   - Click on **Settings** > **Environments**.
   - Create or select an environment (e.g., staging or production).
   - Add a new secret named `HOST_SSH_PRIVATE_KEY` to the environment settings and paste the contents of your private key (e.g., `~/.ssh/id_rsa`).

   **Important**: Never share your private key and keep it secure.


#### 3. Configure GitHub Variables

Navigate to **Settings** → **Secrets and variables** → **Actions** → **Environment variables** (under the `production` environment).

Add the following **Variables**:

| Variable Name | Description | Example |
|---------------|-------------|---------|
| `SERVER_HOST` | Your server's IP or domain | `123.45.67.89` or `server.host.tld` |
| `SSH_USER` | SSH username on the server | `deploy` |
| `DEPLOY_PATH` | Absolute path where to deploy | `/var/www/your_website` |
| `DB_DATABASE` | PostgreSQL database name | `directus` |
| `DB_USER` | PostgreSQL database user | `directus` |
| `FRONTEND_PUBLIC_URL` | Public URL of your frontend site | `https://host.tld` |
| `API_PUBLIC_URL` | Public URL of your API/Directus | `https://api.host.tld` |
| `API_PORT` | Fixed port for Directus (for reverse proxy) | `8055` |
| `FRONTEND_PORT` | Fixed port for frontend (for reverse proxy) | `3000` |

## Server Setup

### 1. Create Deployment User

```bash
# On your server
sudo adduser deploy
sudo usermod -aG docker deploy
```

### 2. Configure SSH Access (see above)

```bash
# On your local machine, generate a new SSH key pair
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/your_website_deploy

# Copy the public key to your server
ssh-copy-id -i ~/.ssh/your_website_deploy.pub deploy@your-server.com

# Test the connection
ssh -i ~/.ssh/your_website_deploy deploy@your-server.com

# Copy the PRIVATE key content and add it to GitHub secrets as SSH_PRIVATE_KEY
cat ~/.ssh/your_website_deploy
```

### 3. Create Deployment Directory

```bash
# On your server as the deploy user
mkdir -p /var/www/your_website
cd /var/www/your_website
```

### 4. Install Docker and Docker Compose

See the official Docker documentation for [installing Docker](https://docs.docker.com/engine/install/ubuntu/) and [Docker Compose](https://docs.docker.com/compose/install/).

## Deployment Process

### Automatic Deployment

Deployments are triggered automatically when:
1. A new release is published on GitHub
2. Manual trigger via **Actions** → **Deploy to Production Server** → **Run workflow**

### Manual Deployment

1. Go to your repository on GitHub
2. Click **Actions** tab
3. Select **Deploy to Production Server** workflow
4. Click **Run workflow**
5. Select the branch to deploy (usually `main`)
6. Click **Run workflow**

### What Happens During Deployment

1. **Checkout code**: Latest code is pulled from GitHub
2. **Setup SSH**: Secure connection to your server is established
3. **Create .env files**: Environment files are generated from GitHub secrets
4. **Deploy files**: Code is synced to the server (excluding git history, node_modules, build artifacts)
5. **Rebuild services**: Docker images are rebuilt and containers are restarted
6. **Cleanup**: Old Docker images are removed to save space

### Monitoring Deployment

Watch the deployment progress in the **Actions** tab. Each step will show:
- ✅ Green checkmark if successful
- ❌ Red X if failed
- Click on a step to see detailed logs

## Post-Deployment

### Verify Deployment

```bash
# SSH into your server
ssh deploy@your-server.com

# Navigate to deployment directory
cd /var/www/your_website

# Check running containers
docker compose ps

# View logs
docker compose logs -f frontend
docker compose logs -f directus
```

### Access Your Application

- **Frontend**: `http://your-server.com:3000`
- **Directus**: `http://your-server.com:8055`

### Setup Reverse Proxy (Recommended)

For production, use Nginx or Caddy as a reverse proxy with SSL.

**Important**: Set `API_PORT` and `FRONTEND_PORT` in your environment configuration to ensure containers bind to fixed ports. Without these, Docker will assign random ports on each restart.

```nginx
# Example Nginx configuration
# Assumes API_PORT=8055 and FRONTEND_PORT=3000 are set in your .env
server {
    listen 80;
    server_name host.tld www.host.tld;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

server {
    listen 80;
    server_name api.host.tld;
    
    location / {
        proxy_pass http://localhost:8055;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Then use Certbot to add SSL:
```bash
sudo certbot --nginx -d host.tld -d www.host.tld -d api.host.tld
```

## Troubleshooting

### Deployment Fails

1. Check GitHub Actions logs for error messages
2. Verify all secrets and variables are correctly set
3. Ensure SSH key has correct permissions
4. Test SSH connection manually from your local machine

### Containers Not Starting

```bash
# Check container logs
docker compose logs

# Check if ports are already in use
sudo netstat -tulpn | grep :3000
sudo netstat -tulpn | grep :8055

# Rebuild from scratch
docker compose down -v  # Will remove volumes and delete data !
docker compose up --build -d
```

### Database Issues

```bash
# Access PostgreSQL container
docker compose exec postgres psql -U directus -d directus

# Backup database
docker compose exec postgres pg_dump -U directus directus > backup.sql

# Restore database
docker compose exec -T postgres psql -U directus directus < backup.sql
```

#### Password Authentication Failed

If you see `password authentication failed for user "directus"`, this means the database was initialized with a different password than what's in your current `.env` files. PostgreSQL persists credentials in the volume and doesn't update them when environment variables change.

**Solution 1: Reset the database (loses data)**
```bash
cd /path/to/deployment
docker compose down -v  # Removes volumes
docker compose up --build -d
```

**Solution 2: Update password in existing database (preserves data)**
```bash
# Replace NEW_PASSWORD with the password from your secrets
docker compose exec postgres psql -U postgres -c "ALTER USER directus WITH PASSWORD 'NEW_PASSWORD';"
docker compose restart directus
```

**Solution 3: Match .env to existing password**
Update your GitHub secrets to match the password that was used when the database was first initialized.

## Rollback

If a deployment fails, you can using the Github action "restore".
The action will take a specified backup (or the latest one) and restore it on the server.
The backup restores :
- Database
- Uploads folder
- Directus extensions (api/ folder)
- Frontend code (frontend/ folder)

## Security Best Practices

1. **Use strong passwords** for all services
2. **Restrict SSH access** to specific IPs if possible
3. **Use GitHub environment protection rules** to require approvals
4. **Regularly update** Docker images and server packages
5. **Enable firewall** on your server (UFW):
   ```bash
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```
6. **Setup automated backups** for database and uploads
7. **Monitor logs** for suspicious activity

## Backup Strategy

### Automated Backup

A github action runs every day on a "production" environment to create a backup of the database and uploads folder.
Note that if the "production" environment is not configured, the action will create an empty environment and will fail.
For this purpose, it is recommended during development to disable the action in github until you have your production env setted up

The backup is stored as an artifact in the github actions, and can be used to restore the server if needed.

⚠️ These backups are stored for 90 days only. It is recommended to implement an additional offsite backup strategy. You can extend the artifact retention period in the repository settings if needed.

## Support

For issues or questions:
- Check the [GitHub Issues](/issues)
- Review Docker and application logs

### Configure Helper Tool

The `configure-gh-environment` helper tool automates the process of setting up GitHub environments for deployment. It reads environment-specific `.env` files from the `environments/` folder and:

- Creates the GitHub environment if it doesn't exist
- Adds secrets (e.g., SSH keys, tokens) to GitHub Secrets
- Adds variables (e.g., server info, URLs) to GitHub Variables
- Skips any secrets/variables that already exist

For detailed instructions, refer to the [dedicated README](../environments/README.md).
