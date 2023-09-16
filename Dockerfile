FROM node:16

WORKDIR /app
COPY ./package*.json ./
RUN npm install
COPY . .
RUN npm run docker_build
EXPOSE 3001
CMD ["npm","run","docker_run"]