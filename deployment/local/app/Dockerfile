FROM node:alpine

WORKDIR /app/backend

COPY backend/package.json .
RUN npm install -g nodemon


RUN npm install

ENTRYPOINT [ "nodemon", "src/" ]
