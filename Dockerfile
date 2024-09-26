FROM node:latest
COPY ./node /node
CMD ["node","index.js"]