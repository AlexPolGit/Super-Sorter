import json
from objects.exceptions.base import BaseSorterException
from objects.sortable_item import SortableItem
from objects.sorts.sorter import SortHistory
from util.db.database import DataBase

class SessionNotFoundException(BaseSorterException):
    errorCode = 404
    def __init__(self, sessionId: str) -> None:
        super().__init__(f"Session not found: {sessionId}.")

class DbSessionObject:
    def __init__(self, id: str, name: str, type: str, items: any, history: str, seed: int) -> None:
        self.id = id
        self.name = name
        self.type = type
        self.items = items
        self.history = history
        self.seed = seed

class SessionsDataBase(DataBase):

    def __init__(self) -> None:
        super().__init__()

    def getSessions(self) -> list[DbSessionObject]:
        username = self.getUserName()
        query = f"SELECT id, name, type FROM sessions WHERE owner = '{username}'"
        res = self.fetchAll(query)
        sessions: list[DbSessionObject] = []
        for item in res:
            id, name, type = item[0], item[1], item[2]
            sessions.append(DbSessionObject(id, name, type, None, "", -1))
        return sessions

    def createSession(self, sessionId: str, name: str, type: str, items: list[str], seed: int) -> None:
        username = self.getUserName()
        itemList = json.dumps(items)
        query = f"INSERT INTO sessions (id, owner, name, type, items, seed) VALUES ('{sessionId}', '{username}', '{name}', '{type}', '{itemList}', {seed})"
        self.execute(query)
    
    def getSession(self, sessionId: str) -> DbSessionObject:
        username = self.getUserName()
        query = f"SELECT id, name, type, items, history, seed FROM sessions WHERE id = '{sessionId}' AND owner = '{username}'"
        res = self.fetchAll(query)
        if (len(res) == 0):
            raise SessionNotFoundException(sessionId)
        session = res[0]
        id, name, type, items, history, seed = session[0], session[1], session[2], session[3], session[4], session[5]
        return DbSessionObject(id, name, type, items, history, seed)
    
    def saveSession(self, sessionId: str, itemList: list[str], history: SortHistory) -> None:
        query = f"UPDATE sessions SET items = '{json.dumps(itemList)}', history = '{history.getRepresentation()}' WHERE id = '{sessionId}'"
        self.execute(query)
