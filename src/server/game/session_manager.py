from uuid import uuid4
from objects.session_data import SessionData
from objects.sorts.sorter import Swap
from util.logging import GLOBAL_LOGGER as logger
from game.session import Session
from objects.sortable_item import SortableItem
from util.db.sessions import SessionsDataBase
from util.parse_db_object import parseAllSessions, parseSession

class SessionManager:
    database: SessionsDataBase
    # sessions: dict[str, Session]

    def __init__(self) -> None:
        self.database = SessionsDataBase()
        # self.sessions = {}

    def getAllSessions(self) -> list[Session]:
        return parseAllSessions(self.database.getSessions())

    def createSession(self, name: str, type: str, items: list[str]) -> SessionData:
        sessionId = str(uuid4())
        startingItemList: list[SortableItem] = []
        for item in items:
            startingItemList.append(SortableItem(item))
        newSession = Session(sessionId, name, type, startingItemList)
        logger.info(f"Created {type} session \"{name}\": [{sessionId}]")
        self.database.createSession(sessionId, name, type, items, newSession.seed)
        return self.runIteration(sessionId, full = True)
    
    def runIteration(self, sessionId: str, userChoice: Swap | None = None, full: bool = False, save: bool = True) -> SessionData:
        session = self.__getSession(sessionId)
        result = session.runIteration(userChoice, full)
        if (save):
            self.__saveSession(session)
        return result
    
    def undo(self, sessionId: str, full: bool = False) -> SessionData:
        session = self.__getSession(sessionId)
        result = session.undo(full)
        self.__saveSession(session)
        return result
    
    def delete(self, sessionId: str, toDelete: str, full: bool = False) -> SessionData:
        session = self.__getSession(sessionId)
        result = session.delete(toDelete, full)
        self.__saveSession(session)
        return result
    
    def undoDelete(self, sessionId: str, toUndelete: str, full: bool = False) -> SessionData:
        session = self.__getSession(sessionId)
        result = session.undoDelete(toUndelete, full)
        self.__saveSession(session)
        return result
    
    def __getSession(self, sessionId: str) -> Session:
        return parseSession(self.database.getSession(sessionId))

    def __saveSession(self, session: Session) -> None:
        (history, deleted) = session.sorter.getHistoryAsRepresentation()
        self.database.saveSession(session.id, session.itemListAsStrings(), history, deleted)
