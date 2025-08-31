#!/usr/bin/env bash
set -e
docker compose up -d
sleep 8
docker exec -i mysql-pinto mysql -uroot -prootpass < /docker-entrypoint-initdb.d/pinto.sql
