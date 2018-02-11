#!/usr/bin/env bash
yarn &&
npm run build &&
docker build -t filmsfr-api . && docker run -p 3333:3333 filmsfr-api