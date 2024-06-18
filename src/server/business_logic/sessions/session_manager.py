import random
from flask import request
from util.logging import GLOBAL_LOGGER as logger
from database.sessions import SessionsDataBase
from business_logic.objects.session_data import ResponseType, SessionData
from business_logic.objects.sorters.sorter import Comparison, ComparisonRequest
from business_logic.objects.sortable_item import SortableItem
from business_logic.objects.models.session import Session

class SessionManager:
    sessionDatabase: SessionsDataBase
    sessionCache: dict[str, Session]

    def __init__(self) -> None:
        self.sessionDatabase = SessionsDataBase()
        self.sessionCache = {}

    def getAllSessions(self) -> list:
        username = self.__getCurrentUser()
        sessionList = []
        for session in self.sessionDatabase.getSessions(username):
            sessionList.append(self.__getSessionResponseObject(session, options = None, type = ResponseType.SMALL))
        return sessionList

    def createSession(self, name: str, type: str, items: list[str], algorithm: str = "queue-merge", shuffleItems: bool = True):
        username = self.__getCurrentUser()
        if (shuffleItems):
            random.shuffle(items)
        sessionId = self.sessionDatabase.createSession(username, name, type, items, algorithm)
        logger.info(f"Created {type} session \"{name}\": [{sessionId}]")
        return self.runIteration(sessionId, type = ResponseType.FULL)
    
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
        self.sessionDatabase.updateSession(
            owner = self.__getCurrentUser(),
            sessionId = sessionId,
            name = name,
            items = items,
            deletedItems = deletedItems,
            history = history,
            deletedHistory = deletedHistory,
            algorithm = algorithm,
            seed = seed
        )
        session = self.__getSession(sessionId)
        return self.__getSessionResponseObject(session, options = None, type = ResponseType.FULL)
    
    def deleteSession(self, sessionId: str) -> list:
        username = self.__getCurrentUser()
        self.sessionDatabase.deleteSession(username, sessionId)
        return self.getAllSessions()
    
    def runIteration(self, sessionId: str, userChoice: Comparison = None, type = ResponseType.TINY, save: bool = True):
        session = self.__getSession(sessionId)
        result = session.runIteration(userChoice)
        if (save):
            self.__saveSessionProgress(session)
        return self.__getSessionResponseObject(session, result, type)
    
    def undo(self, sessionId: str, toUndo: Comparison, type = ResponseType.TINY):
        session = self.__getSession(sessionId)
        result = session.undo(toUndo)
        self.__saveSessionProgress(session)
        return self.__getSessionResponseObject(session, result, type)
    
    def restart(self, sessionId: str, type = ResponseType.TINY):
        session = self.__getSession(sessionId)
        result = session.restart()
        self.__saveSessionProgress(session)
        return self.__getSessionResponseObject(session, result, type)
    
    def delete(self, sessionId: str, toDelete: str, type = ResponseType.TINY):
        session = self.__getSession(sessionId)
        beforeCount = len(session.allItems)
        result = session.delete(toDelete)
        afterCount = len(session.allDeletedItems)
        assert (afterCount == beforeCount - 1)
        self.__saveSessionProgress(session)
        return self.__getSessionResponseObject(session, result, type)
    
    def undoDelete(self, sessionId: str, toUndelete: str, type = ResponseType.TINY):
        session = self.__getSession(sessionId)
        beforeCount = len(session.allItems)
        result = session.undoDelete(toUndelete)
        afterCount = len(session.allDeletedItems)
        assert (afterCount == beforeCount + 1)
        self.__saveSessionProgress(session)
        return self.__getSessionResponseObject(session, result, type)
    
    def __getSession(self, sessionId: str) -> Session:
        username = self.__getCurrentUser()
        return self.sessionDatabase.getSession(username, sessionId)

    def __saveSessionProgress(self, session: Session) -> None:
        username = self.__getCurrentUser()
        history = session.sorter.history.getRepresentation()
        items: list[str] = []
        deletedItems: list[str] = []
        for i in session.allItems:
            items.append(i.getIdentifier())
        for d in session.allDeletedItems:
            deletedItems.append(d.getIdentifier())
        self.sessionDatabase.updateSession(
            owner = username,
            sessionId = session.id,
            items = items,
            deletedItems = deletedItems,
            history = history[0],
            deletedHistory = history[1]
        )

    def __getSessionResponseObject(self, session: Session, options: ComparisonRequest | list[SortableItem], type: ResponseType = ResponseType.SMALL):
        return SessionData(session, options, type).getJson()
    
    def __getCurrentUser(self):
        return request.authorization.username
