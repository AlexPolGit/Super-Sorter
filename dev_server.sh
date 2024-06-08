cd ./src/server
waitress-serve --port=7000 --call main:create_app
