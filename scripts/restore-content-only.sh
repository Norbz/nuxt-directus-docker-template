#!/bin/bash
set -e

# Convenience script for restoring content while preserving users and tokens
# Usage: ./scripts/restore-content-only.sh [TIMESTAMP] [BACKUP_DIR]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "[INFO] Restoring content while preserving users and tokens..."
echo "[INFO] This will:"
echo "[INFO]   - Restore all content data (pages, posts, blocks, etc.)"
echo "[INFO]   - Preserve existing users and their authentication tokens" 
echo "[INFO]   - Restore uploads/media files"
echo ""

# Prompt for confirmation
read -p "Continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "[INFO] Restore cancelled."
    exit 0
fi

# Call the main restore script with preserve-users flag
exec "$SCRIPT_DIR/restore.sh" "$1" "$2" --preserve-users