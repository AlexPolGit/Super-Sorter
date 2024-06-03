from flask import Flask, request
from flask_restx import Resource, Api, fields
from flask_cors import CORS
from game.session_manager import SessionManager
from objects.sortable_item import SortableItem
from objects.sorts.sorter import Pair

app = Flask(__name__)
CORS(app)
api = Api(app)

manager = SessionManager()

def getSessionResponse(sessionId: str, response: Pair | list[SortableItem]):
    if (not type(response).__name__ == "list"):
        return {
            "sessionId": sessionId,
            "options": {
                "itemA": response.itemA,
                "itemB": response.itemB
            }
        }
    else:
        return {
            "sessionId": sessionId,
            "result": response
        }

NEW_SESSION = api.model("NewSession", {
    "name": fields.String(example="My Sort Session"),
    "type": fields.String(example="character"),
    "items": fields.List(fields.String)
})

USER_CHOICE = api.model("UserChoice", {
    "choice": fields.Boolean(example=True)
})

OPTIONS = api.model("Options", {
    "itemA": fields.String,
    "itemB": fields.String
})

class NullableNested(fields.Raw):
    __schema_type__ = ['object', 'null']
    __schema_example__ = 'nullable'

SESSION_RESPONSE = api.model("SessionResponse", {
    "sessionId": fields.String,
    "options": fields.Nested(OPTIONS),
    "result": fields.List(fields.String)
})

SESSION_DATA = api.model("SessionData", {
    "sessionId": fields.String,
    "name": fields.String,
    "type": fields.String,
    "items": fields.List(fields.String),
    "seed": fields.Integer
})

SESSION_LIST = api.model("SessionList", {
    "sessions": fields.List(fields.Nested(SESSION_DATA))
})

@api.route("/sessions")
class SessionData(Resource):
    @api.marshal_with(SESSION_LIST)
    def get(self):
        allSessions = []
        sessions = manager.getSessions()
        for session in sessions:
            itemList: list[str] = []
            for i in session.initialList:
                itemList.append(i.getIdentifier())
            allSessions.append({
                "sessionId": session.id,
                "name": session.name,
                "type": session.type,
                "items": [],
                "seed": -1
            })
        return {
            "sessions": allSessions
        }

@api.route("/session")
class NewSession(Resource):
    @api.expect(NEW_SESSION)
    @api.marshal_with(SESSION_RESPONSE)
    def post(self):
        requestData = request.json
        items: list[str] = requestData["items"]
        sessionId = manager.createSession(requestData["name"], requestData["type"], items)
        initial = manager.getSession(sessionId).runInitial()
        return getSessionResponse(sessionId, initial)

@api.route("/session/<sessionId>")
class UserChoice(Resource):
    @api.marshal_with(SESSION_RESPONSE)
    def get(self, sessionId):
        session = manager.restoreSession(sessionId)
        response = session.runInitial()
        return getSessionResponse(sessionId, response)
    
    @api.expect(USER_CHOICE)
    @api.marshal_with(SESSION_RESPONSE)
    def post(self, sessionId):
        session = manager.getSession(sessionId)
        requestData = request.json
        response = session.runIteration(requestData["choice"])
        manager.saveSession(sessionId)
        return getSessionResponse(sessionId, response)
    
@api.route("/session/<sessionId>/undo")
class UndoChoice(Resource):
    @api.expect(USER_CHOICE)
    @api.marshal_with(SESSION_RESPONSE)
    def post(self, sessionId):
        response = manager.getSession(sessionId).undo()
        manager.saveSession(sessionId)
        return getSessionResponse(sessionId, response)
    
@api.route("/session/<sessionId>/data")
class SessionData(Resource):
    @api.marshal_with(SESSION_DATA)
    def get(self, sessionId):
        session = manager.restoreSession(sessionId)
        itemList: list[str] = []
        for i in session.initialList:
            itemList.append(i.getIdentifier())
        return {
            "sessionId": sessionId,
            "name": session.name,
            "type": session.type,
            "items": itemList,
            "seed": session.seed
        }


if __name__ == "__main__":
    app.run(host = "0.0.0.0", port = 6900)
