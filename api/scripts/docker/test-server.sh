#!/bin/sh

LAQULDIR=/var/www/laqul
ARTISAN="php ${LAQULDIR}/artisan"

# Ensure storage directories are present
STORAGE=${LAQULDIR}/storage
mkdir -p ${STORAGE}/logs
mkdir -p ${STORAGE}/app/public
mkdir -p ${STORAGE}/framework/views
mkdir -p ${STORAGE}/framework/cache
mkdir -p ${STORAGE}/framework/sessions
chown -R laqul:apache ${STORAGE}
chmod -R g+rw ${STORAGE}

if [[ -z ${APP_KEY:-} || "$APP_KEY" == "ChangeMeBy32KeyLengthOrGenerated" ]]; then
  ${ARTISAN} key:generate --no-interaction
else
  echo "APP_KEY already set"
fi

# Run migrations
${ARTISAN} laqul:update --force

# Run cron
crond -b &

# Run apache2
rm -f /run/apache2/httpd.pid
httpd -DFOREGROUND
