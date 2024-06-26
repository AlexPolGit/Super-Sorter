from flask import request
from flask_restx import Namespace
from domain.objects.sorters.sorter import Comparison
from domain.objects.session_data import ResponseType
from endpoints.common import COMMON_ERROR_MODEL, GLOBAL_SESSION_MANAGER as manager, AuthenticatedResource
from endpoints.sessions.models import NEW_SESSION, UPDATE_SESSION, DELETE_SESSION, USER_BASIC, USER_CHOICE, USER_DELETE, USER_UNDELETE, OPTIONS, SESSION_DATA, SESSION_LIST

sessions = Namespace("Game Sessions", description = "Game session-related endpoints for the sorter.")

sessions.add_model("Options", OPTIONS)
CommonErrorModel = sessions.add_model("Error", COMMON_ERROR_MODEL)
BasicUserInputModel = sessions.add_model("BasicUserInput", USER_BASIC)
NewSessionModel = sessions.add_model("NewSession", NEW_SESSION)
UpdateSessionModel = sessions.add_model("UpdateSession", UPDATE_SESSION)
DeleteSessionModel = sessions.add_model("DeleteSession", DELETE_SESSION)
UserChoiceModel = sessions.add_model("UserChoice", USER_CHOICE)
UserDeleteModel = sessions.add_model("UserDelete", USER_DELETE)
UserUndeleteModel = sessions.add_model("UserUndelete", USER_UNDELETE)
SessionDataModel = sessions.add_model("SessionData", SESSION_DATA)
SessionListModel = sessions.add_model("SessionList", SESSION_LIST)

@sessions.route("/all")
@sessions.response(500, "InternalError", CommonErrorModel)
class GetAllSessions(AuthenticatedResource):
    @sessions.response(200, "List of session for user.", SessionListModel)
    @sessions.doc(security='basicAuth')
    def get(self):
        return { "sessions": manager.getAllSessions() }

@sessions.route("/")
@sessions.response(500, "InternalError", CommonErrorModel)
class Sessions(AuthenticatedResource):
    @sessions.expect(NewSessionModel)
    @sessions.response(200, "Initial result of newly created session.", SessionDataModel)
    @sessions.doc(security='basicAuth')
    def post(self):
        requestData = request.json
        return manager.createSession(requestData["name"], requestData["type"], requestData["items"], requestData["algorithm"], requestData["shuffle"])
    
    @sessions.expect(DeleteSessionModel)
    @sessions.response(200, "List of session for user after deletion.", SessionListModel)
    @sessions.doc(security='basicAuth')
    def delete(self):
        requestData = request.json
        return { "sessions": manager.deleteSession(requestData["id"]) }

@sessions.route("/<sessionId>")
@sessions.response(500, "InternalError", CommonErrorModel)
class SessionData(AuthenticatedResource):
    @sessions.response(200, "Get current state of session.", SessionDataModel)
    @sessions.response(404, "Session not found.", CommonErrorModel)
    @sessions.doc(security='basicAuth')
    def get(self, sessionId):
        return manager.runIteration(sessionId, userChoice = None, type = ResponseType.FULL, save = False)
    
    @sessions.expect(UpdateSessionModel)
    @sessions.response(200, "Get current state of updated session.", SessionDataModel)
    @sessions.response(404, "Session not found.", CommonErrorModel)
    @sessions.doc(security='basicAuth')
    def post(self, sessionId):
        requestData = request.json
        print(requestData)
        return manager.updateSession(
            sessionId,
            requestData["name"] if "name" in requestData else None,
            requestData["items"] if "items" in requestData else None,
            requestData["deleted"] if "deleted" in requestData else None,
            requestData["history"] if "history" in requestData else None,
            requestData["deletedHistory"] if "deletedHistory" in requestData else None,
            requestData["algorithm"] if "algorithm" in requestData else None,
            requestData["seed"] if "seed" in requestData else None
        )

@sessions.route("/<sessionId>/choice")
@sessions.response(500, "InternalError", CommonErrorModel)
class UserChoice(AuthenticatedResource):  
    @sessions.expect(UserChoiceModel)
    @sessions.response(200, "Get result for a user input.", SessionDataModel)
    @sessions.doc(security='basicAuth')
    def post(self, sessionId):
        requestData = request.json
        return manager.runIteration(sessionId, userChoice = Comparison.fromRaw(requestData["itemA"], requestData["itemB"], requestData["choice"]), type = ResponseType.FULL if requestData["fullData"] else ResponseType.TINY)
    
@sessions.route("/<sessionId>/undo")
@sessions.response(500, "InternalError", CommonErrorModel)
class UndoChoice(AuthenticatedResource):
    @sessions.expect(UserChoiceModel)
    @sessions.response(200, "Get data after undoing the user input.", SessionDataModel)
    @sessions.response(404, "Session not found.", CommonErrorModel)
    @sessions.doc(security='basicAuth')
    def post(self, sessionId):
        requestData = request.json
        return manager.undo(sessionId, Comparison.fromRaw(requestData["itemA"], requestData["itemB"], requestData["choice"]), type = ResponseType.FULL if requestData["fullData"] else ResponseType.TINY)
    
@sessions.route("/<sessionId>/restart")
@sessions.response(500, "InternalError", CommonErrorModel)
class Restart(AuthenticatedResource):
    @sessions.expect(BasicUserInputModel)
    @sessions.response(200, "Get data after restarting the session.", SessionDataModel)
    @sessions.response(404, "Session not found.", CommonErrorModel)
    @sessions.doc(security='basicAuth')
    def post(self, sessionId):
        requestData = request.json
        return manager.restart(sessionId, type = ResponseType.FULL if requestData["fullData"] else ResponseType.TINY)
    
@sessions.route("/<sessionId>/delete/<toDelete>")
@sessions.response(500, "InternalError", CommonErrorModel)
class DeleteChoice(AuthenticatedResource):
    @sessions.expect(UserDeleteModel)
    @sessions.response(200, "Get data after deleting an item.", SessionDataModel)
    @sessions.response(404, "Session not found.", CommonErrorModel)
    @sessions.doc(security='basicAuth')
    def post(self, sessionId, toDelete):
        requestData = request.json
        return manager.delete(sessionId, toDelete, type = ResponseType.FULL if requestData["fullData"] else ResponseType.TINY)
    
@sessions.route("/<sessionId>/undelete/<toUndelete>")
@sessions.response(500, "InternalError", CommonErrorModel)
class UndeleteChoice(AuthenticatedResource):
    @sessions.expect(UserUndeleteModel)
    @sessions.response(200, "Get data after undoing deletion of an item.", SessionDataModel)
    @sessions.response(404, "Session not found.", CommonErrorModel)
    @sessions.doc(security='basicAuth')
    def post(self, sessionId, toUndelete):
        requestData = request.json
        return manager.undoDelete(sessionId, toUndelete, type = ResponseType.FULL if requestData["fullData"] else ResponseType.TINY)
