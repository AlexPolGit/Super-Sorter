import json
from objects.sortable_item import SortableItem
from objects.sorts.sorter import Comparison

class SessionObject:
    id: str = ""
    owner: str = ""
    name: str = ""
    type: str = ""
    items: list[SortableItem] = []
    deleted_items: list[SortableItem] = []
    history: list[Comparison] = []
    deleted_history: list[Comparison] = []
    algorithm: str = ""
    seed: int = -1

    def fromFullQuery(queryResult: any):
        schema = SessionObject()

        schema.id = queryResult[0]
        schema.owner = queryResult[1]
        schema.name = queryResult[2]
        schema.type = queryResult[3]
        schema.items = SessionObject.parseItems(queryResult[4])
        schema.deleted_items = SessionObject.parseDeletedItems(queryResult[5])
        schema.history = SessionObject.parseHistory(queryResult[6])
        schema.deleted_history = SessionObject.parseDeletedHistory(queryResult[7])
        schema.algorithm = queryResult[8]
        schema.seed = queryResult[9]

        return schema
    
    def fromPartialQuery(queryResult: any):
        schema = SessionObject()

        schema.id = queryResult[0]
        schema.owner = queryResult[1]
        schema.name = queryResult[2]
        schema.type = queryResult[3]
        schema.algorithm = queryResult[4]
        
        return schema
    
    def parseItems(raw: str) -> list[SortableItem]:
        items: list[SortableItem] = []
        itemStrings: list[str] = json.loads(raw)
        for i in itemStrings:
            items.append(SortableItem(i))
        return items
    
    def parseDeletedItems(raw: str) -> list[SortableItem]:
        deletedItems: list[SortableItem] = []
        itemStrings: list[str] = json.loads(raw)
        for d in itemStrings:
            deletedItems.append(SortableItem(d))
        return deletedItems

    def parseHistory(raw: str) -> list[Comparison]:
        history: list[Comparison] = []
        historyStrings: list[str] = json.loads(raw)
        for h in historyStrings:
            history.append(Comparison.fromRepresentation(h))
        return history
    
    def parseDeletedHistory(raw: str) -> list[Comparison]:
        deletedHistory: list[Comparison] = []
        deletedHistoryStrings: list[str] = json.loads(raw)
        for d in deletedHistoryStrings:
            deletedHistory.append(Comparison.fromRepresentation(d))
        return deletedHistory