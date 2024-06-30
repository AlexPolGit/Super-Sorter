FROM node:latest as node
WORKDIR /usr/local/app/client
COPY ./src/client /usr/local/app/client
RUN npm install
RUN npx ng build --configuration production

FROM python:3 as python
WORKDIR /usr/local/app/server
COPY --from=node /usr/local/app/client/dist/ /usr/local/app/client
COPY ./src/server /usr/local/app/server
RUN pip install -r ./requirements.txt --break-system-packages
RUN mkdir -p logs
RUN mkdir /usr/local/app/data
CMD python main.py
