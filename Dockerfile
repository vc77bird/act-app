FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install -g vite

COPY . .

CMD ["npm", "run", "dev"]
