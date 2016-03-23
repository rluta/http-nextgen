FROM node:5.9

WORKDIR /root
RUN npm install -g tty.js
ADD tty.js.json /root

EXPOSE 8080

ENTRYPOINT tty.js