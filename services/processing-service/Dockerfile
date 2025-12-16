
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY src ./src
COPY nest-cli.json tsconfig.json tsconfig.build.json ./

RUN npm config set fetch-retry-maxtimeout 600000 && \
    npm config set fetch-retry-mintimeout 10000 && \
    npm install --include=dev --no-audit --no-fund

RUN npm run build

RUN npm prune --omit=dev

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]
