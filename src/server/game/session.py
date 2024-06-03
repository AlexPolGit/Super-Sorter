import random
import json
from objects.sortable_item import SortableItem
from objects.sorts.merge import MergeSorter
from objects.sorts.sorter import Pair, SortHistory

class SessionObject:
    def __init__(self, sessionId: str, name: str, type: str, items: list[SortableItem], seed: str) -> None:
        itemList: list[str] = []
        for i in items:
            itemList.append(i.getIdentifier())
        self.sessionId = sessionId
        self.name = name
        self.type = type
        self.items = itemList
        self.seed = seed

class SessionOptions:
    def __init__(self, itemA: str, itemB: str) -> None:
        self.itemA = itemA
        self.itemB = itemB

class SessionResponse:
    def __init__(self, sessionId: str, response: Pair | list[SortableItem]) -> None:
        self.sessionId = sessionId

        if (type(response).__name__ == "list"):
            list = []
            for i in response:
                list.append(str(i))
            self.response = list
        else:
            self.options = SessionOptions(response.itemA.id, response.itemB.id)

class Session:
    id: str
    name: str
    type: str
    initialList: list[SortableItem]
    history: SortHistory
    seed: int

    def __init__(self, id: str, name: str, type: str, initialList: list[SortableItem], seed: int = None) -> None:
        self.id = id
        self.name = name
        self.type = type
        self.initialList = initialList
        self.history = SortHistory()
        self.seed = seed if seed else random.randint(0, 1000000000)

    def runInitial(self) -> SessionResponse:
        return self.__doSort()

    def runIteration(self, choice: bool) -> SessionResponse:
        self.history.add(choice)
        return self.__doSort()

    def undo(self) -> SessionResponse:
        self.history.undo()
        return self.__doSort()

    def __doSort(self) -> SessionResponse:
        sorter = MergeSorter(self.initialList, self.history, self.seed)
        sessionResult = sorter.doSort()
        response = self.getResponseObject(sessionResult)
        return response
    
    def asObject(self):
        return self.__getJson(SessionObject(self.id, self.name, self.type, self.initialList, self.seed))
    
    def getResponseObject(self, response: Pair | list[SortableItem]):
        return self.__getJson(SessionResponse(self.id, response))
    
    def __getJson(self, obj):
        jsonObj = json.loads(json.dumps(obj, default=lambda o: getattr(o, '__dict__', str(o))))
        print(json.dumps(self, default=lambda o: getattr(o, '__dict__', str(o))))
        print(jsonObj)
        return jsonObj
