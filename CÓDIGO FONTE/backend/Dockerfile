FROM node:20.12.2

WORKDIR /usr/app

RUN rm -rf ./node_modules

RUN rm -rf package-lock.json

COPY package.json /usr/app/

RUN npm install

COPY . /usr/app/

CMD [ "npm", "run", "dev" ]