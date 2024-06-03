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

    sorterItems: list[SortableItem] = []
    historyItems: list[bool] = []

    items = json.loads(dbSession.items)
    for item in items:
        if (sessionType == "anilist-character" or sessionType == "general-character"):
            # print(f"Found {sessionType}: \"{item}\"")
            sorterItems.append(SortableItem(item))
        else:
            raise Exception(f"Unknown session type: {sessionType}")
    
    history = json.loads(dbSession.history)
    for historyItem in history:
        historyItems.append(historyItem == 1)

    session = Session(sessionName, sessionType, sorterItems, seed)
    session.id = sessionId
    session.history = SortHistory(historyItems)
    return session

def parseSessions(dbSessions: list[DbSessionObject]) -> list[Session]:
    sessionsList: list[Session] = []
    for dbSession in dbSessions:
        sessionsList.append(parseSession(dbSession))
    return sessionsList
