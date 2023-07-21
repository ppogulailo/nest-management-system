FROM node:16 AS builder

# Create app directory
WORKDIR /usr/src/app


# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npm i puppeteer

COPY . /usr/src/app
COPY . /usr/src/app/dist/main
# Install app dependencies

RUN npm run build
EXPOSE 3000
CMD ["npm", "run","start:prod"]