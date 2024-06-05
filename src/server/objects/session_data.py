import json
from objects.sorts.sorter import Sorter, ComparisonRequest

class SessionData:
    def __init__(
            self,
            sessionId: str,
            name: str,
            type: str,
            seed: int,
            sorter: Sorter,
            options: ComparisonRequest | None = None,
            full: bool = False
        ) -> None:

        self.sessionId = sessionId
        self.name = name
        self.type = type
        self.seed = seed

        itemList: list[str] = []
        if (full):
            for i in sorter.getList():
                itemList.append(i.getIdentifier())
        self.items = itemList

        if (full):
            (history, deleted) = sorter.history.getRepresentation()
        else:
            (history, deleted) = ("", "")
        self.history = history
        self.deleted = deleted

        if (options):
            self.options = {
                "itemA": options.itemA.getIdentifier(),
                "itemB": options.itemB.getIdentifier()
            }

    def getJson(self):
        jsonObj = json.loads(json.dumps(self, default = lambda o: getattr(o, '__dict__', str(o))))
        return jsonObj
