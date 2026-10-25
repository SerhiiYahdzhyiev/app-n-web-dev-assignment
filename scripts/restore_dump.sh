#! /bin/bash

# This script makes a db dump of from a running mongo container

AUTH_DB="admin"
DUMP_DEST="/data/dump"

USAGE="usage: restore_db <dev_db_container_name> <dump_dir> <env_file_path>"

if [ "$#" != "3" ]; then
    echo $USAGE
    exit 1
fi

c_name="$1"
dump_dir="$2"
env_file="$3"

if [ ! -f $env_file ]; then
    echo "error: $env_file: file not found"
    exit 1
fi

. $env_file

CMD="mongorestore --authenticationDatabase $AUTH_DB -u $DB_USER -p $DB_PASSWORD --drop --db $DB_NAME $DUMP_DEST/$DB_NAME"

docker cp $dump_dir $c_name:$DUMP_DEST
docker exec -it $c_name bash -c "$CMD"
