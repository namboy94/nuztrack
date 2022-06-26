#!/bin/bash

set -e

if [ "$#" -ne 1 ]; then
    echo "Usage: restore.sh <backup-file>"
    exit 1
fi

APP="nuztrack-app"
DB="nuztrack-db"
AUTH="nuztrack-auth"
AUTHDB="nuztrack-auth-db"
TARGET=$1

rm -rf backup .env
tar xvf "$TARGET"
cp backup/.env .env
docker-compose down
docker-compose up -d
docker stop "$APP"
docker stop "$AUTH"
sleep 20

docker exec -i "$DB" bash -c 'dropdb $POSTGRES_DB -U $POSTGRES_USER'
docker exec -i "$DB" bash -c 'createdb $POSTGRES_DB -U $POSTGRES_USER'
docker exec -i "$DB" bash -c 'psql $POSTGRES_DB -U $POSTGRES_USER' < backup/db.sql

docker exec -i "$AUTHDB" bash -c 'dropdb $POSTGRES_DB -U $POSTGRES_USER'
docker exec -i "$AUTHDB" bash -c 'createdb $POSTGRES_DB -U $POSTGRES_USER'
docker exec -i "$AUTHDB" bash -c 'psql $POSTGRES_DB -U $POSTGRES_USER' < backup/authdb.sql

docker-compose up -d
rm -rf backup
