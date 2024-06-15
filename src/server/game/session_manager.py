import random
from uuid import uuid4
from flask import request
from util.logging import GLOBAL_LOGGER as logger
from objects.session_data import SessionData
from objects.sorts.sorter import Comparison, ComparisonRequest
from objects.sortable_item import SortableItem
from db.sessions.sessions import SessionsDataBase
from game.session import Session

class SessionManager:
    sessionDatabase: SessionsDataBase
    sessionCache: dict[str, Session]

    def __init__(self) -> None:
        self.sessionDatabase = SessionsDataBase()
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
    
    def updateSession(
            self,
            sessionId: str,
            name: str = None,
            items: list[str] = None,
            deletedItems: list[str] = None,
            history: list[str] = None,
            deletedHistory: list[str] = None,
            algorithm: str = None,
            seed: int = None
        ):
        session = self.__getSession(sessionId)

        if (not name is None):
            logger.debug(f"[{sessionId}] New session name: {name}")
            session.name = name
        if (not algorithm is None):
            logger.debug(f"[{sessionId}] New session algorithm: {algorithm}")
            session.algorithm = algorithm
        if (not seed is None):
            logger.debug(f"[{sessionId}] New session seed: {seed}")
            session.seed = seed
        if (not items is None):
            logger.debug(f"[{sessionId}] New session items: {items}")
            session.items = []
            for item in items:
                session.items.append(SortableItem(item))
        if ((not deletedItems is None) and (not history is None) and (not deletedHistory is None)):
            logger.debug(f"[{sessionId}] New session deletedItems: {deletedItems}")
            logger.debug(f"[{sessionId}] New session history: {history}")
            logger.debug(f"[{sessionId}] New session deletedHistory: {deletedHistory}")
            session.deletedItems = []
            for deletedItem in deletedItems:
                session.deletedItems.append(SortableItem(deletedItem))
            for historyItem in history:
                session.sorter.history.history.append(Comparison.fromRepresentation(historyItem))
            for deletedHistoryItem in deletedHistory:
                session.sorter.history.history.append(Comparison.fromRepresentation(deletedHistoryItem))

        logger.info(f"Updated session \"{session.name}\": [{sessionId}]")
        self.__updateSession(session)
        return self.__getSessionResponseObject(session, None, True)
    
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
        self.sessionDatabase.saveSession(
            username,
            session.id,
            items,
            deletedItems,
            history,
            deletedHistory
        )

    def __updateSession(self, session: Session) -> None:
        username = self.__getCurrentUser()
        items = session.itemListAsRepresentation()
        deletedItems = session.deletedItemListAsRepresentation()
        (history, deletedHistory) = session.sorter.history.getRepresentation()
        self.sessionDatabase.updateSession(
            username,
            session.id,
            items,
            deletedItems,
            history,
            deletedHistory,
            session.name,
            session.algorithm,
            session.seed
        )

    def __getSessionResponseObject(self, session: Session, options: ComparisonRequest | list[SortableItem], full: bool = True):
        if (not options):
            full = True
        return SessionData(session, options, full).getJson()
    
    def __getCurrentUser(self):
        return request.authorization.username
