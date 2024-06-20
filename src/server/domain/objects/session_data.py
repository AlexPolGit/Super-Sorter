import json
from enum import Enum
from domain.objects.sorters.sorter import ComparisonRequest
from domain.objects.sortable_item import SortableItem
from domain.objects.models.session import Session

class ResponseType(Enum):
    FULL = "full"
    SMALL = "small"
    TINY = "tiny"

class SessionData:
    def __init__(
            self,
            session: Session,
            options: ComparisonRequest | list[SortableItem],
            type: ResponseType = ResponseType.SMALL
        ) -> None:

        self.sessionId = session.id
        
        if (type == ResponseType.SMALL or type == ResponseType.FULL):
            self.name = session.name
            self.type = session.type
            self.algorithm = session.algorithm
            self.seed = session.seed

        if (type == ResponseType.FULL):
            itemList: list[str] = []
            deletedList: list[str] = []
            historyList: list[str] = []
            deletedHistoryList: list[str] = []

            for i in session.allItems:
                itemList.append(i.getIdentifier())

            for d in session.allDeletedItems:
                deletedList.append(d.getIdentifier())

            for h in session.sorter.history.getList():
                historyList.append(h.getRepresentation())

            for dh in session.sorter.history.getDeletedList():
                deletedHistoryList.append(dh.getRepresentation())

            self.items = itemList
            self.deleted = deletedList
            self.history = historyList
            self.deletedHistory = deletedHistoryList

        if (options):
            self.estimate = session.sorter.getTotalEstimate(session.items)
            self.progress = session.sorter.getCurrentProgress()

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
