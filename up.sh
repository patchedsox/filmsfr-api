#!/usr/bin/env bash
yarn &&
yarn build &&
docker build -t filmsfr-api . && docker run -d -p 3333:3333 filmsfr-api