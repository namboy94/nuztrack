#!/bin/bash

set -e

if [ "$#" -ne 1 ]; then
    echo "Usage: backup.sh <backup-file>"
    exit 1
fi

DB="nuztrack-db"
AUTHDB="nuztrack-auth-db"

TARGET=$1

rm -rf backup
mkdir backup

docker-compose up --no-recreate -d
sleep 20
docker exec -i "$DB" bash -c 'pg_dump $POSTGRES_DB -U $POSTGRES_USER' > backup/db.sql
docker exec -i "$AUTHDB" bash -c 'pg_dump $POSTGRES_DB -U $POSTGRES_USER' > backup/authdb.sql
tar -zcvpf "$TARGET" backup
rm -rf backup
