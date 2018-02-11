FROM node:9.5.0

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY ./build/dist /usr/src/app/build/dist
COPY ./package.json /usr/src/app/package.json
COPY ./db/low.json /usr/src/app/db/low.json

RUN yarn --production

ENV APP_HTTP_PORT=3333
ENV APP_MAP_BOX_KEY="pk.eyJ1IjoiZy1tYW4iLCJhIjoiY2pkZzhzNm9vMGJ5ZzJ3bnoyd2NsaW12MCJ9.Ujhx7KNL5irrxpCOFS3wAA"
ENV NODE_ENV="production"


CMD [ "npm", "start" ]
