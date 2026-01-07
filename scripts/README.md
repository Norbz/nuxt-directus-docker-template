# Backup and Restore Scripts

Scripts for backing up and restoring the website database and uploads.

## Local Usage

### Backup

Create a backup of your local environment:

```bash
./scripts/backup.sh
```

This creates:
- `backups/db-backup-YYYYMMDD-HHMMSS.sql` - Full database dump
- `backups/db-content-backup-YYYYMMDD-HHMMSS.sql` - Content-only dump (excludes users)
- `backups/uploads-backup-YYYYMMDD-HHMMSS.tar.gz` - Uploads volume archive

### Restore

#### Full Restore (replaces everything including users)

Restore from the latest backup:

```bash
./scripts/restore.sh
```

Restore from a specific backup:

```bash
./scripts/restore.sh 20251217-160940
```

#### Content-Only Restore (preserves users and tokens)

Restore content while preserving existing users and their authentication tokens:

```bash
./scripts/restore-content-only.sh
```

Or with specific timestamp:

```bash
./scripts/restore-content-only.sh 20251217-160940
```

Or using the main script with the `--preserve-users` flag:

```bash
./scripts/restore.sh 20251217-160940 ./backups --preserve-users
```

Restore from a custom backup directory:

```bash
./scripts/restore.sh 20251217-160940 /path/to/backups
```

## How It Works

### backup.sh
- Checks if Postgres is running
- Reads DB configuration from `docker compose config`
- Creates **two** database dumps:
  - Full backup: Complete database including users (`db-backup-*.sql`)
  - Content backup: Content only, excluding user tables (`db-content-backup-*.sql`)
- Archives uploads Docker volume using Alpine container
- Stores backups in `./backups/` with timestamp
- Saves timestamp to `/tmp/latest-timestamp.txt` for workflows

### restore.sh
- Accepts optional timestamp (defaults to latest)
- Accepts optional `--preserve-users` flag for content-only restore
- Stops all services
- Starts Postgres only
- **Full restore mode** (default):
  - Drops and recreates database
  - Imports full SQL dump
- **Content-only mode** (`--preserve-users`):
  - Backs up existing user tables temporarily
  - Drops and recreates database
  - Imports content-only backup
  - Restores user tables
- Restores uploads to Docker volume
- Restarts all services
- Waits for Directus health check

### restore-content-only.sh
- Convenience wrapper for content-only restoration
- Prompts for confirmation before proceeding
- Calls `restore.sh` with `--preserve-users` flag

## User Preservation

When using the `--preserve-users` flag or `restore-content-only.sh`, the following tables are preserved:

- `directus_users` - User accounts
- `directus_roles` - User roles and permissions
- `directus_permissions` - Permission rules
- `directus_policies` - Access policies
- `directus_access` - Access tokens
- `directus_sessions` - User sessions
- `directus_shares` - Shared links
- `directus_activity` - Activity log
- `directus_notifications` - User notifications
- `directus_presets` - User preferences
- `directus_dashboards` - User dashboards
- `directus_panels` - Dashboard panels

This ensures that:
- Users don't need to log in again after restore
- Authentication tokens remain valid
- User preferences and settings are preserved
- The same SECRET value can be used across environments safely

## GitHub Actions Integration

The workflows automatically:
1. **Backup Workflow**: Runs `backup.sh` on the server, then downloads artifacts
2. **Restore Workflow**: Downloads backup artifacts, uploads to server, runs `restore.sh`

## Notes

- Scripts require Docker and Docker Compose
- Project files backup is only created by workflows (not needed locally - use git)
- Backups are stored for 90 days in GitHub Actions artifacts
- Local backups are not automatically cleaned up
