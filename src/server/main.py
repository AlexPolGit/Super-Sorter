from flask import Flask
from flask.logging import default_handler
from flask_restx import Api
from flask_cors import CORS
from util.logging import GLOBAL_LOGGER as logger
from util.env_vars import getEnvironmentVariable
from objects.exceptions.base import BaseSorterException
from endpoints.sessions.sessions import sessions
from endpoints.anilist.anilist import anilist

app = Flask(__name__)
app.config['ERROR_404_HELP'] = False
app.logger.removeHandler(default_handler)
app.logger.addHandler(logger)
CORS(app)

api = Api(
    app,
    version = "1.0.0",
    title = "Sorter API",
    description = "API for the Super Sorter App."
)

api.add_namespace(sessions, path='/session')
api.add_namespace(anilist, path='/anilist')

@api.errorhandler(BaseSorterException)
def handleSorterException(error: BaseSorterException):
    if hasattr(error, "type"):
        logger.error(f"[{error.type}] {str(error)}")
        return {"message": str(error)}, error.errorCode
    else:
        logger.error(f"[GENERIC ERROR] {str(error)}")
        return {"message": str(error)}, 500

if __name__ == "__main__":
    port = int(getEnvironmentVariable("APP_PORT"))

    logger.info(f"Runnig sorter server on port {port}.")
    app.run(host = "0.0.0.0", port = port)
