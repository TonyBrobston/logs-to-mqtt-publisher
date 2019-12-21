FROM node:10.13-alpine
WORKDIR /usr/src/app
COPY /src ./src
COPY /package.json ./
COPY /tsconfig.json ./
RUN yarn
RUN ls
RUN yarn build
CMD yarn start
