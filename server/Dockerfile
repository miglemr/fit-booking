FROM node:20-alpine3.18 AS builder

WORKDIR /app

COPY ../package*.json .
COPY client/package*.json client/
COPY server/package*.json server/
RUN npm ci

COPY server/ server/

WORKDIR /app/server

EXPOSE 3000

CMD ["npm", "run", "start"]
