FROM node:22.14

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

RUN npm install

EXPOSE 1234

CMD ["npm","start"]