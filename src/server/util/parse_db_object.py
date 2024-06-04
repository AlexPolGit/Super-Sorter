import json
from game.session import Session
from objects.sortable_item import SortableItem
from util.db.sessions import DbSessionObject

def parseSession(dbSession: DbSessionObject) -> Session:
    sessionId = dbSession.id
    sessionName = dbSession.name
    sessionType = dbSession.type
    seed = dbSession.seed
    history = dbSession.history
    deleted = dbSession.deleted

    sorterItems: list[SortableItem] = []
    if (dbSession.items):
        items = json.loads(dbSession.items)
        for item in items:
            sorterItems.append(SortableItem(item))

    session = Session(sessionId, sessionName, sessionType, sorterItems, history, deleted, seed)
    session.id = sessionId

    return session

def parseAllSessions(dbSessions: list[DbSessionObject]) -> list[Session]:
    sessionsList: list[Session] = []
    for dbSession in dbSessions:
        sessionsList.append(parseSession(dbSession))
    return sessionsList
