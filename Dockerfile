FROM node:lts-alpine

# Create app directory
WORKDIR /app

# Bundle app source
COPY . .

# Create config.json from the sample
RUN cp config.sample.json config.json && \
# Replace localhost domain with environment variable DOMAIN
    sed -i "s/domain: 'localhost'/domain: process.env.DOMAIN/" config.json && \
# Replace localhost port with environment variable PORT
    sed -i "s/port: 9999/port: process.env.PORT/" config.ts && \
# Replace empty email with environment variable EMAIL
    sed -i "s/email: ''/email: process.env.EMAIL/" config.json && \
# Replace empty email with environment variable PASSWORD
    sed -i "s/password: ''/password: process.env.PASSWORD/" config.json && \
# Replace logging level to stdout instead of local logging
    sed -i "s/level: 'minimal'/level: 'stdout'/" config.json && \
# Install production only dependencies
    npm install --only=production && \
# Install typescript for conversion
    npm install -g typescript && \
# Convert typescript source to javascript
    npx tsc main.ts && \
# Create epg.xml
    touch epg.xml

EXPOSE ${PORT:-9999}
HEALTHCHECK --timeout=3s CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/channels.csv || exit 1
CMD [ "npm", "start" ]

