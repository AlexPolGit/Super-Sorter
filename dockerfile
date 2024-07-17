FROM node:22.4.1-slim AS build-library
WORKDIR /usr/local/app/lib
COPY ./app/lib /usr/local/app/lib
RUN npm install
RUN npm run build

FROM node:22.4.1-slim AS build-server
WORKDIR /usr/local/app/server
COPY --from=build-library /usr/local/app/lib /usr/local/app/lib
COPY ./app/server /usr/local/app/server
RUN npm install
RUN npm run build

FROM node:22.4.1 AS build-client
WORKDIR /usr/local/app/client
COPY --from=build-library /usr/local/app/lib /usr/local/app/lib
COPY --from=build-server /usr/local/app/server /usr/local/app/server
COPY ./app/client /usr/local/app/client
RUN npm install
RUN npx ng build --configuration production

FROM node:22.4.1-slim
WORKDIR /usr/local/app/server
COPY --from=build-library /usr/local/app/lib /usr/local/app/lib
COPY --from=build-client /usr/local/app/client/dist/app /usr/local/app/client
COPY --from=build-server /usr/local/app/server /usr/local/app/server
RUN mkdir /usr/local/app/data
CMD node dist/index.js
