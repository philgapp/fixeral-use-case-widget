FROM node:latest
WORKDIR /root
COPY . /root
RUN yarn install
RUN yarn build
CMD exec /bin/bash -c "trap : TERM INT; sleep infinity & wait"
