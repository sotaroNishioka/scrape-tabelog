FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
COPY ./*.js ./
RUN npm install
CMD [ "node", "dist/app.js" ]