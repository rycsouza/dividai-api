FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY . .

RUN npm i

EXPOSE 3000

CMD ["sh", "-c", "node ace serve --watch", "node ace migration:run --force"]
