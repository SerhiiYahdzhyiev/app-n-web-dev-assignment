#! /bin/bash

# This script makes a db dump of from a running mongo container

AUTH_DB="admin"
DUMP_DEST="/data/dump"

USAGE="usage: dump_db <dev_db_container_name>"

if [ "$#" != "1" ]; then
    echo $USAGE
    exit 1
fi

if [ ! -f "back/.env" ]; then
    echo "error: no .env file found in 'back' directory"
    exit 1
fi

c_name="$1"

. back/.env
DUMP_CMD="mongodump --authenticationDatabase $AUTH_DB -u $DB_USER -p $DB_PASSWORD --db $DB_NAME --out $DUMP_DEST"

docker exec -it $c_name bash -c "$DUMP_CMD"
docker cp $c_name:/data/dump ./dump
