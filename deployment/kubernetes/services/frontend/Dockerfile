FROM node:alpine

WORKDIR /app/frontend

RUN npm install -g http-server


COPY src/ src/


ENTRYPOINT [ "http-server", "src/" ]
