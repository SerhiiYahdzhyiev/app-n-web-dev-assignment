FROM node:lts-alpine as build

WORKDIR /usr/src/app

COPY package.json .

RUN npm i --legacy-peer-deps

COPY . .

RUN npm run build

FROM nginx:latest

COPY --from=build /usr/src/app/dist/sy-ecommerce/browser/ /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
