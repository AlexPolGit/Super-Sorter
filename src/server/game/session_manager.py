from uuid import uuid4
from util.logging import GLOBAL_LOGGER as logger
from objects.session_data import SessionData
from objects.sorts.sorter import Comparison, ComparisonRequest
from objects.sortable_item import SortableItem
from db.sessions.sessions import SessionsDataBase
from game.session import Session

class SessionManager:
    database: SessionsDataBase
    sessionCache: dict[str, Session]

    def __init__(self) -> None:
        self.database = SessionsDataBase()
        self.sessionCache = {}

    def getAllSessions(self) -> list:
        sessionList = []
        for sessionObject in self.database.getSessions():
            session = Session.fromSchema(sessionObject)
            sessionList.append(self.__getSessionResponseObject(session, options = None, full = False))
        return sessionList

    def createSession(self, name: str, type: str, items: list[str]):
        sessionId = str(uuid4())
        startingItemList: list[SortableItem] = []
        for item in items:
            startingItemList.append(SortableItem(item))
        newSession = Session(sessionId, name, type, startingItemList)
        logger.info(f"Created {type} session \"{name}\": [{sessionId}]")
        self.database.createSession(sessionId, name, type, items, newSession.seed)
        return self.runIteration(sessionId, full = True)
    
    def runIteration(self, sessionId: str, userChoice: Comparison | None = None, full: bool = False, save: bool = True):
        session = self.__getSession(sessionId)
        result = session.runIteration(userChoice)
        if (save):
            self.__saveSession(session)
        return self.__getSessionResponseObject(session, result, full)
    
    def undo(self, sessionId: str, full: bool = False):
        session = self.__getSession(sessionId)
        result = session.undo()
        self.__saveSession(session)
        return self.__getSessionResponseObject(session, result, full)
    
    def restart(self, sessionId: str, full: bool = False):
        session = self.__getSession(sessionId)
        result = session.restart()
        self.__saveSession(session)
        return self.__getSessionResponseObject(session, result, full)
    
    def delete(self, sessionId: str, toDelete: str, full: bool = False):
        session = self.__getSession(sessionId)
        result = session.delete(toDelete)
        self.__saveSession(session)
        return self.__getSessionResponseObject(session, result, full)
    
    def undoDelete(self, sessionId: str, toUndelete: str, full: bool = False):
        session = self.__getSession(sessionId)
        result = session.undoDelete(toUndelete)
        self.__saveSession(session)
        return self.__getSessionResponseObject(session, result, full)
    
    def __getSession(self, sessionId: str) -> Session:
        return Session.fromSchema(self.database.getSession(sessionId))

    def __saveSession(self, session: Session) -> None:
        items = session.itemListAsRepresentation()
        deletedItems = session.deletedItemListAsRepresentation()
        (history, deletedHistory) = session.sorter.history.getRepresentation()
        self.database.saveSession(session.id, items, deletedItems, history, deletedHistory)

    def __getSessionResponseObject(self, session: Session, options: ComparisonRequest | None = None, full: bool = False):
        if (not options):
            full = True
        return SessionData(session, options, full).getJson()
