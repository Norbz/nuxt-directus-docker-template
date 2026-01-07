#!/bin/bash
set -e

# Restore script for website
# Restores database dump and uploads archive
# Usage: ./scripts/restore.sh [TIMESTAMP] [BACKUP_DIR] [--preserve-users]
#   TIMESTAMP: Optional. Format: YYYYMMDD-HHMMSS. If not provided, uses latest backup.
#   BACKUP_DIR: Optional. Directory containing backups. Defaults to ./backups
#   --preserve-users: Optional. If provided, restores content only and preserves existing users and tokens

echo "[INFO] Starting restore process..."

# Get current directory (should be project root)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

# Parse arguments
TIMESTAMP="$1"
BACKUP_DIR="${2:-$PROJECT_ROOT/backups}"
PRESERVE_USERS=false

# Check for --preserve-users flag in any position
for arg in "$@"; do
  if [ "$arg" = "--preserve-users" ]; then
    PRESERVE_USERS=true
    break
  fi
done

# If no timestamp provided, find latest backup
if [ -z "$TIMESTAMP" ]; then
  echo "[INFO] No timestamp provided, finding latest backup..."
  LATEST_DB=$(ls -t "$BACKUP_DIR"/db-backup-*.sql 2>/dev/null | head -1)
  
  if [ -z "$LATEST_DB" ]; then
    echo "[ERROR] No backups found in $BACKUP_DIR"
    ls -lh "$BACKUP_DIR" 2>/dev/null || echo "Backup directory does not exist"
    exit 1
  fi
  
  TIMESTAMP=$(basename "$LATEST_DB" | sed 's/db-backup-\(.*\)\.sql/\1/')
  echo "[INFO] Using latest backup: $TIMESTAMP"
fi

# Define backup file paths
if [ "$PRESERVE_USERS" = true ]; then
  DB_BACKUP="$BACKUP_DIR/db-content-backup-${TIMESTAMP}.sql"
  echo "[INFO] Using content-only backup to preserve users"
else
  DB_BACKUP="$BACKUP_DIR/db-backup-${TIMESTAMP}.sql"
  echo "[INFO] Using full backup (will replace all data including users)"
fi
UPLOADS_BACKUP="$BACKUP_DIR/uploads-backup-${TIMESTAMP}.tar.gz"

echo "[INFO] Restore configuration:"
echo "[INFO]   Timestamp: $TIMESTAMP"
echo "[INFO]   Database backup: $DB_BACKUP"
echo "[INFO]   Uploads backup: $UPLOADS_BACKUP"

# Verify all backup files exist
if [ ! -f "$DB_BACKUP" ]; then
  echo "[ERROR] Database backup not found: $DB_BACKUP"
  exit 1
fi

if [ ! -f "$UPLOADS_BACKUP" ]; then
  echo "[ERROR] Uploads backup not found: $UPLOADS_BACKUP"
  exit 1
fi

echo "[INFO] All backup files verified"

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

echo "[INFO] Database: $DB_DATABASE (user: $DB_USER)"

# Stop services
echo "[INFO] Stopping services..."
docker compose down

# Start postgres only
echo "[INFO] Starting postgres..."
docker compose up -d postgres
sleep 5

# Wait for postgres to be ready
echo "[INFO] Waiting for postgres to be ready..."
for i in {1..30}; do
  if docker compose exec -T postgres pg_isready -U "$DB_USER" > /dev/null 2>&1; then
    echo "[INFO] Postgres is ready"
    break
  fi
  echo "[INFO] Waiting for postgres... ($i/30)"
  sleep 2
done

# Restore database
echo "[INFO] Restoring database..."
if [ "$PRESERVE_USERS" = true ]; then
  echo "[INFO] Preserving users - restoring content only..."
  echo "[INFO] Terminating existing connections..."
  docker compose exec -T postgres psql -U "$DB_USER" postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$DB_DATABASE' AND pid != pg_backend_pid();" || true
  
  # For content-only restore, we need to drop content tables but preserve user tables
  echo "[INFO] Backing up existing user data..."
  TEMP_USER_BACKUP="/tmp/users-temp-${TIMESTAMP}.sql"
  USER_TABLES="directus_users directus_roles directus_permissions directus_policies directus_access directus_sessions directus_shares directus_activity directus_notifications directus_presets directus_dashboards directus_panels"
  
  # Create include options for user tables
  INCLUDE_OPTS=""
  for table in $USER_TABLES; do
    INCLUDE_OPTS="$INCLUDE_OPTS --table=$table"
  done
  
  docker compose exec -T postgres pg_dump -U "$DB_USER" $INCLUDE_OPTS "$DB_DATABASE" > "$TEMP_USER_BACKUP"
  
  echo "[INFO] Dropping and recreating database..."
  docker compose exec -T postgres dropdb -U "$DB_USER" --if-exists "$DB_DATABASE"
  docker compose exec -T postgres createdb -U "$DB_USER" "$DB_DATABASE"
  
  echo "[INFO] Importing content backup..."
  docker compose exec -T postgres psql -U "$DB_USER" "$DB_DATABASE" < "$DB_BACKUP"
  
  echo "[INFO] Restoring user data..."
  docker compose exec -T postgres psql -U "$DB_USER" "$DB_DATABASE" < "$TEMP_USER_BACKUP"
  
  echo "[INFO] Cleaning up temporary user backup..."
  rm -f "$TEMP_USER_BACKUP"
  
  echo "[INFO] Database restored with preserved users"
else
  echo "[INFO] Full restore - replacing all data including users..."
  echo "[INFO] Terminating existing connections..."
  docker compose exec -T postgres psql -U "$DB_USER" postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$DB_DATABASE' AND pid != pg_backend_pid();" || true
  
  echo "[INFO] Dropping existing database..."
  docker compose exec -T postgres dropdb -U "$DB_USER" --if-exists "$DB_DATABASE"
  
  echo "[INFO] Creating database..."
  docker compose exec -T postgres createdb -U "$DB_USER" "$DB_DATABASE"
  
  echo "[INFO] Importing database backup..."
  docker compose exec -T postgres psql -U "$DB_USER" "$DB_DATABASE" < "$DB_BACKUP"
  echo "[INFO] Database restored successfully"
fi

# Restore uploads to Docker volume
echo "[INFO] Restoring uploads to Docker volume..."
COMPOSE_PROJECT_NAME=$(docker compose config --format json | grep -o '"name":"[^"]*' | head -1 | cut -d'"' -f4)
if [ -z "$COMPOSE_PROJECT_NAME" ]; then
  COMPOSE_PROJECT_NAME="nuxt-directus-docker-template"
fi

docker run --rm \
  -v "${COMPOSE_PROJECT_NAME}_directus_uploads:/data" \
  -v "$BACKUP_DIR:/backup" \
  alpine sh -c "rm -rf /data/* && tar xzf /backup/uploads-backup-${TIMESTAMP}.tar.gz -C /data"
echo "[INFO] Uploads restored successfully"

# Rebuild and start all services
echo "[INFO] Rebuilding and starting all services..."
docker compose up --build -d

# Wait for services to be ready
echo "[INFO] Waiting for services to be ready..."
sleep 10

# Check Directus health
for i in {1..20}; do
  if docker compose exec -T directus wget --no-verbose --tries=1 -O- http://127.0.0.1:8055/server/health 2>/dev/null | grep -q '"status":"ok"'; then
    echo "[INFO] Directus is ready!"
    break
  fi
  echo "[INFO] Waiting for Directus... ($i/20)"
  sleep 5
done

# Show final status
echo "[INFO] Restore complete. Service status:"
docker compose ps

echo "[INFO] =========================================="
echo "[INFO] Restore Summary:"
echo "[INFO]   Timestamp: $TIMESTAMP"if [ "$PRESERVE_USERS" = true ]; then
  echo "[INFO]   Mode: Content-only (users preserved)"
else
  echo "[INFO]   Mode: Full restore (all data replaced)"
fiecho "[INFO]   Database: Restored from $DB_BACKUP"
echo "[INFO]   Uploads: Restored from $UPLOADS_BACKUP"
echo "[INFO] =========================================="
