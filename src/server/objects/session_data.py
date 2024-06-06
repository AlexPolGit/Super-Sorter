import json
from objects.sorts.sorter import ComparisonRequest
from objects.sortable_item import SortableItem
from game.session import Session

class SessionData:
    def __init__(
            self,
            session: Session,
            options: ComparisonRequest | list[SortableItem],
            full: bool = False
        ) -> None:

        self.sessionId = session.id
        self.name = session.name
        self.type = session.type
        self.seed = session.seed

        if (options):
            self.estimate = session.sorter.getTotalEstimate()
        
        itemList: list[str] = []
        deletedList: list[str] = []
        historyList: list[str] = []
        deletedHistoryList: list[str] = []

        if (full):
            for i in session.sorter.getList():
                itemList.append(i.getIdentifier())

            for d in session.deletedItems:
                deletedList.append(d.getIdentifier())

            for h in session.sorter.history.getList():
                historyList.append(h.getRepresentation())

            for dh in session.sorter.history.getDeletedList():
                deletedHistoryList.append(dh.getRepresentation())

        self.items = itemList
        self.deleted = deletedList
        self.history = historyList
        self.deletedHistory = deletedHistoryList

        if (isinstance(options, list)):
            resultList: list[str] = []
            for r in options:
                resultList.append(r.getIdentifier())
            self.results = resultList
        elif (isinstance(options, ComparisonRequest)):
            self.options = {
                "itemA": options.itemA.getIdentifier(),
                "itemB": options.itemB.getIdentifier()
            }

    def getJson(self):
        jsonObj = json.loads(json.dumps(self, default = lambda o: getattr(o, '__dict__', str(o))))
        return jsonObj
