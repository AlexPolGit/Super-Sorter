from flask import request
from flask_restx import Namespace
from endpoints.common import COMMON_ERROR_MODEL, GLOBAL_CLIENT_LOGGING as clientLogging, AuthenticatedResource
from endpoints.logging.models import ADD_LOG

logging = Namespace("Logging", description = "Endpoints for saving important front-end logs.")

CommonErrorModel = logging.add_model("Error", COMMON_ERROR_MODEL)

AddLogModel = logging.add_model("AddLog", ADD_LOG) 

@logging.route("/save")
@logging.response(500, "InternalError", CommonErrorModel)
class Items(AuthenticatedResource):
    @logging.expect(AddLogModel)
    @logging.doc(security='basicAuth')
    def post(self):
        return clientLogging.saveLog(request.json)
