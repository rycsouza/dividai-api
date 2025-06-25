FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY . .

RUN npm i

EXPOSE 8282

CMD ["sh", "-c", "node ace serve --watch"]
