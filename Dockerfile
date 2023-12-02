FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
COPY ./*.js ./
RUN npm install &&\
 npx webpack &&\
 ls|egrep -v '^dist$'|xargs rm -r
CMD [ "node", "dist/app.js" ]