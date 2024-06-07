import json
from objects.exceptions.base import BaseSorterException
from db.database import DataBase
from db.accounts.accounts import AccountsDataBase
from db.sessions.schema import SessionObject

class SessionNotFoundException(BaseSorterException):
    errorCode = 404
    def __init__(self, sessionId: str) -> None:
        super().__init__(f"Session not found: {sessionId}.")

class UserNotFoundException(BaseSorterException):
    errorCode = 404
    def __init__(self, username: str) -> None:
        super().__init__(f"User not found: {username}.")

class SessionsDataBase(AccountsDataBase):

    def getSessions(self) -> list[SessionObject]:
        username = self.getUserName()
        query = f"SELECT id, owner, name, type, algorithm FROM sessions WHERE owner = '{username}'"
        res = self.fetchAll(query)
        if (len(res) == 0):
            raise UserNotFoundException(username)
        sessions: list[SessionObject] = []
        for item in res:
            sessions.append(SessionObject.fromPartialQuery(item))
        return sessions

    def createSession(self, sessionId: str, name: str, type: str, items: list[str], algorithm: str, seed: int) -> None:
        username = self.getUserName()
        itemList = json.dumps(items)
        query = f"INSERT INTO sessions (id, owner, name, type, items, algorithm, seed) VALUES ('{sessionId}', '{username}', '{name}', '{type}', '{itemList}', '{algorithm}', {seed})"
        self.execute(query)
    
    def getSession(self, sessionId: str) -> SessionObject:
        username = self.getUserName()
        query = f"SELECT id, owner, name, type, items, deleted_items, history, deleted_history, algorithm, seed FROM sessions WHERE id = '{sessionId}' AND owner = '{username}'"
        res = self.fetchAll(query)
        if (len(res) == 0):
            raise SessionNotFoundException(sessionId)
        return SessionObject.fromFullQuery(res[0])
    
    def saveSession(self, sessionId: str, items: str, deletedItems: str, history: str, deletedHistory:str) -> None:
        query = f"UPDATE sessions SET items = '{items}', deleted_items = '{deletedItems}', history = '{history}', deleted_history = '{deletedHistory}' WHERE id = '{sessionId}'"
        self.execute(query)
