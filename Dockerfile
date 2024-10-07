FROM node:latest
WORKDIR /node
COPY ./node/package*.json ./
RUN npm install
COPY ./node /node
CMD ["node", "index.js"]