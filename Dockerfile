FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm insall

COPY . .

EXPOSE 1234

CMD ["npm", "start"]
