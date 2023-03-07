# Stage 1
FROM node:14 as build-stage

WORKDIR /app-ui
COPY package*.json .
RUN npm install
COPY . .

ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

RUN npm start

# Stage 2
