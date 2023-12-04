FROM node:16-alpine
WORKDIR /usr/src/app
COPY package*.json ./
COPY ./*.ts ./
COPY ./*.js ./
RUN npm ci --only=production
RUN npm run build
CMD [ "node", "dist/app.js" ]