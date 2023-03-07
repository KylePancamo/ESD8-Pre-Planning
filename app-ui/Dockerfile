# Stage 2
FROM node:18.12.1 as build-stage

WORKDIR /app-ui
COPY package*.json .
RUN npm install
COPY . .

CMD ["npm", "start"]