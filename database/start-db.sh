#!/usr/bin/env bash
# MovieFlix — one-command MariaDB setup (no sudo needed).
# Runs MariaDB as the current user in ~/.movie-db-data, creates the
# database and imports database/movie_recommender.sql if needed.

set -u

DATADIR="${HOME}/.movie-db-data"
SOCK="${DATADIR}/mysql.sock"
PORT=3306
DB="movie_recommender"
SQL="$(dirname "$0")/movie_recommender.sql"

mkdir -p "$DATADIR"

if [ ! -d "$DATADIR/mysql" ]; then
    echo "==> Initializing MariaDB data directory..."
    mariadb-install-db --datadir="$DATADIR" \
        --auth-root-authentication-method=normal --skip-test-db || exit 1
fi

if ! mysqladmin --socket="$SOCK" -u root ping >/dev/null 2>&1; then
    echo "==> Starting MariaDB on 127.0.0.1:${PORT}..."
    nohup mariadbd --datadir="$DATADIR" \
        --socket="$SOCK" \
        --port="$PORT" \
        --bind-address=127.0.0.1 \
        --pid-file="$DATADIR/mysqld.pid" \
        --log-error="$DATADIR/error.log" >/dev/null 2>&1 &
    for i in $(seq 1 30); do
        mysqladmin --socket="$SOCK" -u root ping >/dev/null 2>&1 && break
        sleep 1
    done
fi

echo "==> Ensuring root password is 'root'..."
mysql --socket="$SOCK" -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'root'; FLUSH PRIVILEGES;" 2>/dev/null || true

echo "==> Creating database '${DB}' and importing dump..."
mysql -h 127.0.0.1 -u root -proot -e "CREATE DATABASE IF NOT EXISTS ${DB} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null

if [ -z "$(mysql -h 127.0.0.1 -u root -proot -N -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='${DB}';" 2>/dev/null)" ]; then
    mysql -h 127.0.0.1 -u root -proot "$DB" < "$SQL" 2>/dev/null
fi

echo "==> Ensuring extra tables (reviews, watch_history)..."
mysql -h 127.0.0.1 -u root -proot "$DB" < "$(dirname "$0")/schema-extra.sql" 2>/dev/null

echo "==> Done. Users in DB:"
mysql -h 127.0.0.1 -u root -proot -e "SELECT COUNT(*) AS users FROM ${DB}.users;" 2>/dev/null

echo ""
echo "Start the app with:  node app.js"
