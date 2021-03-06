FROM node:lts-alpine

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

# Copy epg updater
COPY docker-epgupdater /etc/periodic/daily/epgupdater
CMD crond -l 2 -f

# Create config.ts from the sample
RUN cp config.sample.ts config.ts && \
# Replace localhost domain with environment variable DOMAIN
    sed -i "s/domain: 'localhost'/domain: process.env.DOMAIN/" config.ts && \
# Replace empty email with environment variable EMAIL
    sed -i "s/email: ''/email: process.env.EMAIL/" config.ts && \
# Replace empty email with environment variable PASSWORD
    sed -i "s/password: ''/password: process.env.PASSWORD/" config.ts && \
# Install production only dependencies
    npm install --only=production && \
# Install typescript for conversion
    npm install -g typescript && \
# Convert typescript source to javascript
    npx tsc main.ts && \
# Create epg.xml
    touch epg.xml

RUN mkdir log

EXPOSE 9999
CMD [ "npm", "start" ]

# Build docker image:
#   sudo docker build -t digionline https://github.com/droM4X/digionline.git
# Create and run docker container:
#   sudo docker run -d -p 9999:9999 --restart unless-stopped --env DOMAIN=IP_or_DOMAIN --env EMAIL=user@domain.hu --env PASSWORD=password --name digionline digionline
# Kodi PVR IPTV Simple Client addon
#   TV channel list: http://IP_or_DOMAIN:9999/channels_IPTV.m3u8
#   TV EPG source: http://IP_or_DOMAIN:9999/epg.xml

