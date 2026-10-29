FROM node:lts-alpine AS deps

COPY package*.json ./
RUN npm ci

FROM node:lts-alpine AS dev

# INFO: For healthcheck
RUN apk add --no-cache curl

COPY --from=deps --chown=node:node /node_modules /home/node/node_modules

ENV PATH=/home/node/node_modules/.bin:$PATH

USER node

WORKDIR /home/node/app

CMD [ "npm", "run", "dev" ]
