from flask import request
from flask_restx import Namespace
from game.session import SessionObject
from objects.sorts.sorter import Swap
from endpoints.common import COMMON_ERROR_MODEL, GLOBAL_SESSION_MANAGER as manager, AuthenticatedResource
from endpoints.sessions.models import NEW_SESSION, USER_CHOICE, USER_DELETE, USER_UNDELETE, OPTIONS, SESSION_RESPONSE, SESSION_DATA, SESSION_LIST

sessions = Namespace("Game Sessions", description = "Game session-related endpoints for the Super Sorter.")

sessions.add_model("Options", OPTIONS)
CommonErrorModel = sessions.add_model("Error", COMMON_ERROR_MODEL)
NewSessionModel = sessions.add_model("NewSession", NEW_SESSION)
UserChoiceModel = sessions.add_model("UserChoice", USER_CHOICE)
UserDeleteModel = sessions.add_model("UserDelete", USER_DELETE)
UserUndeleteModel = sessions.add_model("UserUndelete", USER_UNDELETE)
SessionResponseModel = sessions.add_model("SessionResponse", SESSION_RESPONSE)
SessionDataModel = sessions.add_model("SessionData", SESSION_DATA)
SessionListModel = sessions.add_model("SessionList", SESSION_LIST)

@sessions.route("/all")
@sessions.response(500, "InternalError", CommonErrorModel)
class AllSessions(AuthenticatedResource):
    @sessions.response(200, "SessionList", SessionListModel)
    @sessions.doc(security='basicAuth')
    def get(self):
        sessions = manager.getSessions()
        allSessions: list[SessionObject] = []
        for session in sessions:
            allSessions.append(session.asObject())
        return { "sessions": allSessions }

@sessions.route("/")
@sessions.response(500, "InternalError", CommonErrorModel)
class NewSession(AuthenticatedResource):
    @sessions.expect(NewSessionModel)
    @sessions.response(200, "SessionResponse", SessionResponseModel)
    @sessions.doc(security='basicAuth')
    def post(self):
        requestData = request.json
        sessionId = manager.createSession(requestData["name"], requestData["type"], requestData["items"])
        initial = manager.getSession(sessionId).runIteration()
        manager.saveSession(sessionId)
        return initial

@sessions.route("/<sessionId>")
@sessions.response(500, "InternalError", CommonErrorModel)
class UserChoice(AuthenticatedResource):
    @sessions.response(200, "SessionResponse", SessionResponseModel)
    @sessions.doc(security='basicAuth')
    def get(self, sessionId):
        response = manager.restoreSession(sessionId).runIteration()
        return response
    
    @sessions.expect(UserChoiceModel)
    @sessions.response(200, "SessionResponse", SessionResponseModel)
    @sessions.doc(security='basicAuth')
    def post(self, sessionId):
        requestData = request.json
        response = manager.restoreSession(sessionId).runIteration(Swap.fromRaw(requestData["itemA"], requestData["itemB"], requestData["choice"]))
        manager.saveSession(sessionId)
        return response
    
@sessions.route("/<sessionId>/undo")
@sessions.response(500, "InternalError", CommonErrorModel)
class UndoChoice(AuthenticatedResource):
    @sessions.response(200, "SessionResponse", SessionResponseModel)
    @sessions.doc(security='basicAuth')
    def post(self, sessionId):
        response = manager.restoreSession(sessionId).undo()
        manager.saveSession(sessionId)
        return response
    
@sessions.route("/<sessionId>/delete/<toDelete>")
@sessions.response(500, "InternalError", CommonErrorModel)
class DeleteChoice(AuthenticatedResource):
    @sessions.expect(UserDeleteModel)
    @sessions.response(200, "SessionResponse", SessionResponseModel)
    @sessions.doc(security='basicAuth')
    def post(self, sessionId, toDelete):
        response = manager.restoreSession(sessionId).delete(toDelete)
        manager.saveSession(sessionId)
        return response
    
@sessions.route("/<sessionId>/undelete/<toUndelete>")
@sessions.response(500, "InternalError", CommonErrorModel)
class UndeleteChoice(AuthenticatedResource):
    @sessions.expect(UserUndeleteModel)
    @sessions.response(200, "SessionResponse", SessionResponseModel)
    @sessions.doc(security='basicAuth')
    def post(self, sessionId, toUndelete):
        response = manager.restoreSession(sessionId).undoDelete(toUndelete)
        manager.saveSession(sessionId)
        return response
    
@sessions.route("/<sessionId>/data")
@sessions.response(500, "InternalError", CommonErrorModel)
class SessionData(AuthenticatedResource):
    @sessions.response(200, "SessionData", SessionDataModel)
    @sessions.doc(security='basicAuth')
    def get(self, sessionId):
        session = manager.restoreSession(sessionId)
        return session.asObject()
