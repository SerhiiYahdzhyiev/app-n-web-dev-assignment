FROM node:lts-alpine as build

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

RUN yarn build

FROM nginx:latest

COPY --from=build /usr/src/app/dist/sy-ecommerce/browser/ /usr/share/nginx/html

EXPOSE 80
