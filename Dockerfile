FROM node:16-alpine
WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig.json ./
COPY ./src ./
RUN ls -la
RUN npm ci
RUN npm run build
CMD [ "node", "build/index.js" ]