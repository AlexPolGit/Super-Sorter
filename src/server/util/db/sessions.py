import json
from util.db.database import DataBase

class DbSessionObject:
    id: str
    name: str
    type: str
    items: any
    history: str
    seed: int

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
        query = f"SELECT id, name, type, items, history, seed FROM sessions"
        res = self.fetchAll(query)
        sessions: list[DbSessionObject] = []
        for item in res:
            id = item[0]
            name = item[1]
            type = item[2]
            items = item[3]
            history = item[4]
            seed = item[5]
            sessions.append(DbSessionObject(id, name, type, items, history, seed))
        return sessions

    def createSession(self, sessionId: str, name: str, type: str, items: list[str], seed: int) -> None:
        itemList = json.dumps(items)
        query = f"INSERT INTO sessions (id, name, type, items, seed) VALUES ('{sessionId}', '{name}', '{type}', '{itemList}', {seed})"
        self.execute(query)
    
    def getSession(self, sessionId: str) -> DbSessionObject:
        query = f"SELECT id, name, type, items, history, seed FROM sessions WHERE id = '{sessionId}'"
        res = self.fetchAll(query)[0]
        id = res[0]
        name = res[1]
        type = res[2]
        items = res[3]
        history = res[4]
        seed = res[5]
        return DbSessionObject(id, name, type, items, history, seed)
    
    def saveSession(self, sessionId: str, history: list[int]) -> None:
        historyList = json.dumps(history)
        print(historyList)
        query = f"UPDATE sessions SET history = '{historyList}' WHERE id = '{sessionId}'"
        self.execute(query)
