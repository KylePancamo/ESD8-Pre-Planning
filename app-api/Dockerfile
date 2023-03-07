FROM node:18.12.1 as build-stage

WORKDIR /app-api
COPY package*.json .
RUN npm install

COPY . .

CMD ["node", "./server.js"]