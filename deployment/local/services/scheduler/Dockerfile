FROM node:alpine

WORKDIR /app/services/scheduler

RUN npm install -g nodemon

COPY package.json .
RUN npm install

ENTRYPOINT [ "nodemon", "src/" ]