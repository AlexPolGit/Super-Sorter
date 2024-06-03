from uuid import uuid4
from game.session import Session
from objects.sortable_item import SortableItem
from util.db.sessions import DbSessionObject, SessionsDataBase
from util.parse_db_object import parseSession, parseSessions

class SessionManager:
    database: SessionsDataBase
    sessions: dict[str, Session]

    def __init__(self) -> None:
        self.database = SessionsDataBase()
        self.sessions = {}

    def getSessions(self) -> list[Session]:
        dbSessions: list[DbSessionObject] = self.database.getSessions()
        # Do not restore them yet.
        return parseSessions(dbSessions)

    def createSession(self, name: str, type: str, items: list[str]) -> Session:
        sessionId = str(uuid4())
        startingItemList: list[SortableItem] = []
        for item in items:
            startingItemList.append(SortableItem(item))
        session = Session(name, type, startingItemList)
        self.sessions[sessionId] = session
        print(f"Created {type} session \"{name}\": [{sessionId}]")
        print(startingItemList)
        self.database.createSession(sessionId, name, type, items, session.seed)
        return sessionId
    
    def restoreSession(self, sessionId: str) -> Session:
        dbSession: DbSessionObject = self.database.getSession(sessionId)
        self.sessions[sessionId] = parseSession(dbSession)
        return self.getSession(sessionId)

    def saveSession(self, sessionId: str) -> None:
        session = self.sessions[sessionId]
        self.database.saveSession(sessionId, session.history.asIntegers())

    def getSession(self, sessionId: str) -> Session:
        return self.sessions[sessionId]
