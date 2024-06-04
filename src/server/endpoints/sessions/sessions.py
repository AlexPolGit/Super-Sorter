from flask import request
from flask_restx import Namespace
from endpoints.common import COMMON_ERROR_MODEL, GLOBAL_SESSION_MANAGER as manager, AuthenticatedResource
from endpoints.sessions.models import NEW_SESSION, USER_CHOICE, OPTIONS, SESSION_RESPONSE, SESSION_DATA, SESSION_LIST
from game.session import SessionObject

sessions = Namespace("Game Sessions", description = "Game session-related endpoints for the Super Sorter.")

sessions.add_model("Options", OPTIONS)
CommonErrorModel = sessions.add_model("Error", COMMON_ERROR_MODEL)
NewSessionModel = sessions.add_model("NewSession", NEW_SESSION)
UserChoiceModel = sessions.add_model("UserChoice", USER_CHOICE)
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
        initial = manager.getSession(sessionId).runInitial()
        return initial

@sessions.route("/<sessionId>")
@sessions.response(500, "InternalError", CommonErrorModel)
class UserChoice(AuthenticatedResource):
    @sessions.response(200, "SessionResponse", SessionResponseModel)
    @sessions.doc(security='basicAuth')
    def get(self, sessionId):
        session = manager.restoreSession(sessionId)
        response = session.runInitial()
        return response
    
    @sessions.expect(UserChoiceModel)
    @sessions.response(200, "SessionResponse", SessionResponseModel)
    @sessions.doc(security='basicAuth')
    def post(self, sessionId):
        session = manager.getSession(sessionId)
        requestData = request.json
        response = session.runIteration(requestData["choice"])
        manager.saveSession(sessionId)
        return response
    
@sessions.route("/<sessionId>/undo")
@sessions.response(500, "InternalError", CommonErrorModel)
class UndoChoice(AuthenticatedResource):
    @sessions.response(200, "SessionResponse", SessionResponseModel)
    @sessions.doc(security='basicAuth')
    def post(self, sessionId):
        response = manager.getSession(sessionId).undo()
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
