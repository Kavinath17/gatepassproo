#!/bin/sh
# wait-for-db.sh

set -e

host="$1"
shift
cmd="$@"

until mysql -h "$host" -u "$DB_USER" -p"$DB_PASSWORD" -e 'select 1'; do
  >&2 echo "MySQL is unavailable - sleeping"
  sleep 2
done

>&2 echo "MySQL is up - executing command"
exec $cmd
#!/bin/sh
# wait-for-db.sh

set -e

host="$1"
shift
cmd="$@"

until mysql -h "$host" -u "$DB_USER" -p"$DB_PASSWORD" -e 'select 1'; do
  >&2 echo "MySQL is unavailable - sleeping"
  sleep 2
done

>&2 echo "MySQL is up - executing command"
exec $cmd
