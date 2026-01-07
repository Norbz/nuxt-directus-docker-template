#!/bin/bash
set -e

# Backup script for the website
# Creates database dump and uploads archive
# Usage: ./scripts/backup.sh

echo "[INFO] Starting backup process..."

# Get current directory (should be project root)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

# Create backup directory
BACKUP_DIR="$PROJECT_ROOT/backups"
mkdir -p "$BACKUP_DIR"

# Generate timestamp
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
echo "[INFO] Backup timestamp: $TIMESTAMP"

# Load environment variables from api/.env
if [ -f "$PROJECT_ROOT/api/.env" ]; then
  export $(grep -v '^#' "$PROJECT_ROOT/api/.env" | xargs)
  echo "[INFO] Loaded configuration from api/.env"
else
  echo "[ERROR] api/.env file not found"
  exit 1
fi

# Use environment variables with defaults
DB_USER=${DB_USER:-directus}
DB_DATABASE=${DB_DATABASE:-directus}

# Check if postgres container is running
if ! docker compose ps postgres 2>&1 | grep -q "Up"; then
  echo "[INFO] Postgres is not running. Skipping backup (first deploy or stopped)."
  exit 0
fi

echo "[INFO] Database: $DB_DATABASE (user: $DB_USER)"

# Check if database has tables
TABLE_COUNT=$(docker compose exec -T postgres psql -U "$DB_USER" -d "$DB_DATABASE" -tAc "SELECT count(*) FROM information_schema.tables WHERE table_schema='public';" 2>&1 || echo "0")
echo "[INFO] Table count: $TABLE_COUNT"

if [ "$TABLE_COUNT" = "0" ] || [ -z "$TABLE_COUNT" ]; then
  echo "[INFO] Database is empty or not initialized. Skipping backup."
  exit 0
fi

# Backup database (full backup)
echo "[INFO] Backing up full database..."
DB_BACKUP_FILE="$BACKUP_DIR/db-backup-${TIMESTAMP}.sql"
docker compose exec -T postgres pg_dump -U "$DB_USER" "$DB_DATABASE" > "$DB_BACKUP_FILE"
echo "[INFO] Full database backup saved to: $DB_BACKUP_FILE"

# Backup content only (excluding user tables)
echo "[INFO] Backing up content data (excluding users)..."
DB_CONTENT_BACKUP_FILE="$BACKUP_DIR/db-content-backup-${TIMESTAMP}.sql"

# List of user-related tables to exclude from content backup
USER_TABLES="directus_users directus_roles directus_permissions directus_policies directus_access directus_sessions directus_shares directus_activity directus_notifications directus_presets directus_dashboards directus_panels"

# Build exclude options for pg_dump
EXCLUDE_OPTS=""
for table in $USER_TABLES; do
  EXCLUDE_OPTS="$EXCLUDE_OPTS --exclude-table=$table"
done

docker compose exec -T postgres pg_dump -U "$DB_USER" $EXCLUDE_OPTS "$DB_DATABASE" > "$DB_CONTENT_BACKUP_FILE"
echo "[INFO] Content backup saved to: $DB_CONTENT_BACKUP_FILE"

# Backup uploads volume
echo "[INFO] Backing up uploads volume..."
UPLOADS_BACKUP_FILE="$BACKUP_DIR/uploads-backup-${TIMESTAMP}.tar.gz"
COMPOSE_PROJECT_NAME=$(docker compose config --format json | grep -o '"name":"[^"]*' | head -1 | cut -d'"' -f4)
if [ -z "$COMPOSE_PROJECT_NAME" ]; then
  COMPOSE_PROJECT_NAME="nuxt-directus-docker-template"
fi

docker run --rm \
  -v "${COMPOSE_PROJECT_NAME}_directus_uploads:/data" \
  -v "$BACKUP_DIR:/backup" \
  alpine tar czf "/backup/uploads-backup-${TIMESTAMP}.tar.gz" -C /data .

echo "[INFO] Uploads backup saved to: $UPLOADS_BACKUP_FILE"

# Save timestamp for workflows
echo "$TIMESTAMP" > /tmp/latest-timestamp.txt

# Summary
echo "[INFO] =========================================="
echo "[INFO] Backup completed successfully!"
echo "[INFO] Timestamp: $TIMESTAMP"
echo "[INFO] Full Database: $DB_BACKUP_FILE"
echo "[INFO] Content Database: $DB_CONTENT_BACKUP_FILE"
echo "[INFO] Uploads: $UPLOADS_BACKUP_FILE"
echo "[INFO] =========================================="

# Return timestamp for workflows to use
echo "$TIMESTAMP"
