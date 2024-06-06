cd ./src/server
waitress-serve --port=6900 --call main:create_app
