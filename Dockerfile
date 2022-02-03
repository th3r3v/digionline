FROM node:lts-alpine

# Create app directory
WORKDIR /app

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
HEALTHCHECK --timeout=3s CMD wget --no-verbose --tries=1 --spider http://localhost:9999 || exit 1
CMD [ "npm", "start" ]

