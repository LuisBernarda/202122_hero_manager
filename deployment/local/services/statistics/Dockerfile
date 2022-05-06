FROM node:alpine

WORKDIR /app/services/statistics

RUN npm install -g nodemon

COPY package.json .
RUN npm install

ENTRYPOINT [ "nodemon", "src/" ]