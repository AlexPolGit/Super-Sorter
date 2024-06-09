import random
from uuid import uuid4
from util.logging import GLOBAL_LOGGER as logger
from objects.session_data import SessionData
from objects.sorts.sorter import Comparison, ComparisonRequest
from objects.sortable_item import SortableItem
from db.sessions.sessions import SessionsDataBase
from db.accounts.accounts import AccountsDataBase
from game.session import Session

class SessionManager:
    sessionDatabase: SessionsDataBase
    accountsDataBase: AccountsDataBase
    sessionCache: dict[str, Session]

    def __init__(self) -> None:
        self.sessionDatabase = SessionsDataBase()
        self.accountsDataBase = AccountsDataBase()
        self.sessionCache = {}

    def getAllSessions(self) -> list:
        username = self.__getCurrentUser()
        sessionList = []
        for sessionObject in self.sessionDatabase.getSessions(username):
            session = Session.fromSchema(sessionObject)
            sessionList.append(self.__getSessionResponseObject(session, options = None, full = False))
        return sessionList

    def createSession(self, name: str, type: str, items: list[str], algorithm: str = "queue-merge", shuffleItems: bool = True):
        username = self.__getCurrentUser()
        sessionId = str(uuid4())
        startingItemList: list[SortableItem] = []
        if (shuffleItems):
            random.shuffle(items)
        for item in items:
            startingItemList.append(SortableItem(item))
        newSession = Session(sessionId, name, type, startingItemList)
        logger.info(f"Created {type} session \"{name}\": [{sessionId}]")
        self.sessionDatabase.createSession(username, sessionId, name, type, items, algorithm, newSession.seed)
        return self.runIteration(sessionId, full = True)
    
    def deleteSession(self, sessionId: str) -> list:
        username = self.__getCurrentUser()
        self.sessionDatabase.deleteSession(username, sessionId)
        return self.getAllSessions()
    
    def runIteration(self, sessionId: str, userChoice: Comparison | None = None, full: bool = True, save: bool = True):
        session = self.__getSession(sessionId)
        result = session.runIteration(userChoice)
        if (save):
            self.__saveSession(session)
        return self.__getSessionResponseObject(session, result, full)
    
    def undo(self, sessionId: str, toUndo: Comparison, full: bool = True):
        session = self.__getSession(sessionId)
        result = session.undo(toUndo)
        self.__saveSession(session)
        return self.__getSessionResponseObject(session, result, full)
    
    def restart(self, sessionId: str, full: bool = True):
        session = self.__getSession(sessionId)
        result = session.restart()
        self.__saveSession(session)
        return self.__getSessionResponseObject(session, result, full)
    
    def delete(self, sessionId: str, toDelete: str, full: bool = True):
        session = self.__getSession(sessionId)
        beforeCount = len(session.items)
        result = session.delete(toDelete)
        afterCount = len(session.items)
        assert (afterCount == beforeCount - 1)
        self.__saveSession(session)
        return self.__getSessionResponseObject(session, result, full)
    
    def undoDelete(self, sessionId: str, toUndelete: str, full: bool = True):
        session = self.__getSession(sessionId)
        beforeCount = len(session.items)
        result = session.undoDelete(toUndelete)
        afterCount = len(session.items)
        assert (afterCount == beforeCount + 1)
        self.__saveSession(session)
        return self.__getSessionResponseObject(session, result, full)
    
    def __getSession(self, sessionId: str) -> Session:
        username = self.__getCurrentUser()
        return Session.fromSchema(self.sessionDatabase.getSession(username, sessionId))

    def __saveSession(self, session: Session) -> None:
        username = self.__getCurrentUser()
        items = session.itemListAsRepresentation()
        deletedItems = session.deletedItemListAsRepresentation()
        (history, deletedHistory) = session.sorter.history.getRepresentation()
        self.sessionDatabase.saveSession(username, session.id, items, deletedItems, history, deletedHistory)

    def __getSessionResponseObject(self, session: Session, options: ComparisonRequest | list[SortableItem], full: bool = True):
        if (not options):
            full = True
        return SessionData(session, options, full).getJson()
    
    def __getCurrentUser(self):
        return self.accountsDataBase.getUserName()
