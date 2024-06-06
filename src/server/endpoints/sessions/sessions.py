from flask import request
from flask_restx import Namespace
from objects.sorts.sorter import Comparison
from endpoints.common import COMMON_ERROR_MODEL, GLOBAL_SESSION_MANAGER as manager, AuthenticatedResource
from endpoints.sessions.models import NEW_SESSION, USER_CHOICE, USER_DELETE, USER_UNDELETE, OPTIONS, SESSION_DATA, SESSION_LIST

sessions = Namespace("Game Sessions", description = "Game session-related endpoints for the Super Sorter.")

sessions.add_model("Options", OPTIONS)
CommonErrorModel = sessions.add_model("Error", COMMON_ERROR_MODEL)
NewSessionModel = sessions.add_model("NewSession", NEW_SESSION)
UserChoiceModel = sessions.add_model("UserChoice", USER_CHOICE)
UserDeleteModel = sessions.add_model("UserDelete", USER_DELETE)
UserUndeleteModel = sessions.add_model("UserUndelete", USER_UNDELETE)
SessionDataModel = sessions.add_model("SessionData", SESSION_DATA)
SessionListModel = sessions.add_model("SessionList", SESSION_LIST)

@sessions.route("/all")
@sessions.response(500, "InternalError", CommonErrorModel)
class AllSessions(AuthenticatedResource):
    @sessions.response(200, "List of session for user.", SessionListModel)
    @sessions.doc(security='basicAuth')
    def get(self):
        return { "sessions": manager.getAllSessions() }

@sessions.route("/")
@sessions.response(500, "InternalError", CommonErrorModel)
class NewSession(AuthenticatedResource):
    @sessions.expect(NewSessionModel)
    @sessions.response(200, "Initial result of newly created session.", SessionDataModel)
    @sessions.doc(security='basicAuth')
    def post(self):
        requestData = request.json
        return manager.createSession(requestData["name"], requestData["type"], requestData["items"], requestData["algorithm"])

@sessions.route("/<sessionId>")
@sessions.response(500, "InternalError", CommonErrorModel)
class UserChoice(AuthenticatedResource):
    @sessions.response(200, "Get current state of session.", SessionDataModel)
    @sessions.response(404, "Session not found.", CommonErrorModel)
    @sessions.doc(security='basicAuth')
    def get(self, sessionId):
        return manager.runIteration(sessionId, userChoice = None, full = True, save = False)
    
    @sessions.expect(UserChoiceModel)
    @sessions.response(200, "Get result for a user input.", SessionDataModel)
    @sessions.doc(security='basicAuth')
    def post(self, sessionId):
        requestData = request.json
        return manager.runIteration(sessionId, userChoice = Comparison.fromRaw(requestData["itemA"], requestData["itemB"], requestData["choice"]))
    
@sessions.route("/<sessionId>/undo")
@sessions.response(500, "InternalError", CommonErrorModel)
class UndoChoice(AuthenticatedResource):
    @sessions.expect(UserChoiceModel)
    @sessions.response(200, "Get data after undoing the user input.", SessionDataModel)
    @sessions.response(404, "Session not found.", CommonErrorModel)
    @sessions.doc(security='basicAuth')
    def post(self, sessionId):
        requestData = request.json
        return manager.undo(sessionId, Comparison.fromRaw(requestData["itemA"], requestData["itemB"], requestData["choice"]))
    
@sessions.route("/<sessionId>/restart")
@sessions.response(500, "InternalError", CommonErrorModel)
class UndoChoice(AuthenticatedResource):
    @sessions.response(200, "Get data after restarting the session.", SessionDataModel)
    @sessions.response(404, "Session not found.", CommonErrorModel)
    @sessions.doc(security='basicAuth')
    def post(self, sessionId):
        return manager.restart(sessionId)
    
@sessions.route("/<sessionId>/delete/<toDelete>")
@sessions.response(500, "InternalError", CommonErrorModel)
class DeleteChoice(AuthenticatedResource):
    @sessions.expect(UserDeleteModel)
    @sessions.response(200, "Get data after deleting an item.", SessionDataModel)
    @sessions.response(404, "Session not found.", CommonErrorModel)
    @sessions.doc(security='basicAuth')
    def post(self, sessionId, toDelete):
        return manager.delete(sessionId, toDelete)
    
@sessions.route("/<sessionId>/undelete/<toUndelete>")
@sessions.response(500, "InternalError", CommonErrorModel)
class UndeleteChoice(AuthenticatedResource):
    @sessions.expect(UserUndeleteModel)
    @sessions.response(200, "Get data after undoing deletion of an item.", SessionDataModel)
    @sessions.response(404, "Session not found.", CommonErrorModel)
    @sessions.doc(security='basicAuth')
    def post(self, sessionId, toUndelete):
        return manager.undoDelete(sessionId, toUndelete)
