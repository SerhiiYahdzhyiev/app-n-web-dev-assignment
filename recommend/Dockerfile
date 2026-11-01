FROM node:lts-alpine AS deps

COPY package*.json ./

RUN npm ci

FROM deps AS builder

COPY . .

RUN npm run build

FROM node:lts-alpine AS dev

ENV PATH=/home/node/node_modules/.bin:$PATH

COPY --from=deps --chown=node:node /node_modules /home/node/node_modules

USER node

WORKDIR /home/node/app

CMD ["npm", "run", "dev"]
