FROM node:lts-alpine

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

# Create config.ts from the sample
RUN cp config.sample.ts config.ts && \
# Replace localhost domain with environment variable DOMAIN
    sed -i "s/domain: 'localhost'/domain: process.env.DOMAIN/" config.ts && \
# Replace empty email with environment variable EMAIL
    sed -i "s/email: ''/email: process.env.EMAIL/" config.ts && \
# Replace empty email with environment variable PASSWORD
    sed -i "s/password: ''/password: process.env.PASSWORD/" config.ts && \
# Replace logging level to stdout instead of local logging
    sed -i "s/level: 'minimal'/level: 'stdout'/" config.ts && \
# Replace mode to docker
    sed -i "s/mode: 'standalone'/mode: 'docker'/" config.ts && \
# Install production only dependencies
    npm install --only=production && \
# Install typescript for conversion
    npm install -g typescript && \
# Convert typescript source to javascript
    npx tsc main.ts && \
# Create epg.xml
    touch epg.xml

EXPOSE 9999
HEALTHCHECK --interval=5m --timeout=3s CMD wget --no-verbose --tries=1 --spider http://localhost:9999 || exit 1
CMD [ "npm", "start" ]

# Build docker image:
#   sudo docker build -t digionline https://github.com/droM4X/digionline.git
# Create and run docker container:
#   sudo docker run -d -p 9999:9999 --restart unless-stopped --env DOMAIN=IP_or_DOMAIN --env EMAIL=user@domain.hu --env PASSWORD=password --name digionline digionline
# Kodi PVR IPTV Simple Client addon
#   TV channel list: http://IP_or_DOMAIN:9999/channels_IPTV.m3u8
#   TV EPG source: http://IP_or_DOMAIN:9999/epg.xml

