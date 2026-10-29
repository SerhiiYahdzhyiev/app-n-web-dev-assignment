FROM node:lts-alpine AS deps

COPY package*.json ./
RUN npm ci

FROM node:lts-alpine AS dev

COPY --from=deps --chown=node:node /node_modules /home/node/node_modules

ENV PATH=/home/node/node_modules:$PATH

USER node
WORKDIR /home/node/app

CMD ["npm", "run", "dev"]

FROM deps AS builder

COPY ./ /app/

RUN npm run build

FROM nginx:1.31-alpine

COPY --from=builder /app/dist/sy-ecommerce/browser/ /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
