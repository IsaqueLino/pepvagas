FROM node:20.12.2

WORKDIR /usr/app


COPY package.json /usr/app/

RUN npm install

COPY www .

FROM nginx:1.25.5-alpine-slim

ENV TZ=America/Sao_Paulo

RUN apk add --update --no-cache tzdata

COPY www /var/www/app.dev

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
