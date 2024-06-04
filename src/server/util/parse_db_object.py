import json
from game.session import Session
from objects.sortable_item import SortableItem
from objects.sorts.sorter import SortHistory
from util.db.sessions import DbSessionObject

def parseSession(dbSession: DbSessionObject) -> Session:
    sessionId = dbSession.id
    sessionName = dbSession.name
    sessionType = dbSession.type
    seed = dbSession.seed
    history = dbSession.history

    sorterItems: list[SortableItem] = []
    if (dbSession.items):
        items = json.loads(dbSession.items)
        for item in items:
            if (sessionType == "anilist-character" or sessionType == "anilist-staff"):
                sorterItems.append(SortableItem(item))
            else:
                raise Exception(f"Unknown session type: {sessionType}")

    session = Session(sessionId, sessionName, sessionType, sorterItems, history, seed)
    session.id = sessionId

    return session

def parseAllSessions(dbSessions: list[DbSessionObject]) -> list[Session]:
    sessionsList: list[Session] = []
    for dbSession in dbSessions:
        sessionsList.append(parseSession(dbSession))
    return sessionsList
