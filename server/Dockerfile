FROM node:10

WORKDIR /server

COPY package*.json /server/

RUN npm install

COPY . ./server/

EXPOSE 3001

CMD [ "npm", "run", "build" ]

CMD [ "npm", "run", "start" ]