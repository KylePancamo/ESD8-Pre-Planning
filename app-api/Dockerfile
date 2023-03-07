FROM node:16

WORKDIR /app-api
COPY package*.json . 
RUN npm install
COPY . .
CMD node ./server.js