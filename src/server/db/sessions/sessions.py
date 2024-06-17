from objects.exceptions.base import BaseSorterException
from db.database import SorterDataBase
from db.sessions.model import Session

class SessionNotFoundException(BaseSorterException):
    errorCode = 404
    def __init__(self, sessionId: str) -> None:
        super().__init__(f"Session not found: {sessionId}.")

class UserNotFoundException(BaseSorterException):
    errorCode = 404
    def __init__(self, username: str) -> None:
        super().__init__(f"User not found: {username}.")

class SessionsDataBase(SorterDataBase):
  
    def getSessions(self, owner: str) -> list[Session]:
        return self._selectAll(Session, Session.owner == owner)

    def createSession(
            self,
            owner: str,
            name: str,
            type: str = None,
            items: list[str] = [],
            algorithm: str = None,
            seed: int = None
        ) -> str:

        session = {
            "owner": owner,
            "name": name,
            "items": items
        }
        
        if (not type == None):
            session["type"] = type
        if (not algorithm == None):
            session["algorithm"] = algorithm
        if (not seed == None):
            session["seed"] = seed
        
        newSession: Session = self._insertOne(Session, session, Session.id)
        return newSession.id
    
    def getSession(self, owner: str, sessionId: str) -> Session:
        return self._selectOne(Session, Session.id == sessionId and Session.owner == owner)

    def updateSession(
            self,
            owner: str,
            sessionId: str,
            name: str = None,
            type: str = None,
            items: list[str] = None,
            deletedItems: list[str] = None,
            history: list[str] = None,
            deletedHistory: list[str] = None,
            algorithm: str = None,
            seed: int = None
        ) -> None:
        
        valuesToUpdate = {}

        if (not name == None):
            valuesToUpdate["name"] = name
        if (not type == None):
            valuesToUpdate["type"] = type
        if (not items == None):
            valuesToUpdate["items"] = items
        if (not deletedItems == None):
            valuesToUpdate["deletedItems"] = deletedItems
        if (not history == None):
            valuesToUpdate["history"] = history
        if (not deletedHistory == None):
            valuesToUpdate["deletedHistory"] = deletedHistory
        if (not algorithm == None):
            valuesToUpdate["algorithm"] = algorithm
        if (not seed == None):
            valuesToUpdate["seed"] = seed

        self._updateOne(Session, Session.id == sessionId and Session.owner == owner, valuesToUpdate)

    def deleteSession(self, owner: str, sessionId: str) -> str:
        deleted: Session = self._deleteOne(Session, Session.id == sessionId and Session.owner == owner, Session.id)
        return deleted.id
