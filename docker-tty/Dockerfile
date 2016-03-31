FROM node:5.9

WORKDIR /root
RUN npm install -g tty.js
RUN apt-get update && apt-get install -y vim
ADD tty.js.json /root/.tty.js/config.json

EXPOSE 8080

ENTRYPOINT tty.js