import random
import json
from objects.sortable_item import SortableItem
from objects.sorts.merge import MergeSorter
from objects.sorts.sorter import Sorter, Swap

class SessionOptions:
    def __init__(self, itemA: str, itemB: str) -> None:
        self.itemA = itemA
        self.itemB = itemB

class SessionResponse:
    def __init__(self, sessionId: str, response: Swap | list[SortableItem]) -> None:
        self.sessionId = sessionId

        if (type(response).__name__ == "list"):
            list = []
            for i in response:
                list.append(str(i))
            self.result = list
        else:
            self.options = SessionOptions(response.itemA.getIdentifier(), response.itemB.getIdentifier())

class Session:
    id: str
    name: str
    type: str
    sorter: Sorter
    seed: int
    itemList: list[SortableItem]

    def __init__(self, id: str, name: str, type: str, itemList: list[SortableItem], history: str = "", seed: int = None) -> None:
        self.id = id
        self.name = name
        self.type = type
        self.seed = seed if seed else random.randint(0, 1000000000)
        self.itemList = itemList
        self.sorter = MergeSorter(itemList, history, seed)

    def runIteration(self, userChoice: Swap | None = None) -> SessionResponse:
        return self.getResponseObject(self.sorter.doSort(userChoice))
        
    def undo(self) -> SessionResponse:
        return self.getResponseObject(self.sorter.undo())
    
    def delete(self, toDelete: str) -> SessionResponse:
        return self.getResponseObject(self.sorter.deleteItem(toDelete))
    
    def asObject(self):
        return self.__getJson(SessionObject(self))
    
    def getResponseObject(self, response: Swap | list[SortableItem]):
        return self.__getJson(SessionResponse(self.id, response))
    
    def __getJson(self, obj):
        jsonObj = json.loads(json.dumps(obj, default=lambda o: getattr(o, '__dict__', str(o))))
        # print(json.dumps(self, default=lambda o: getattr(o, '__dict__', str(o))))
        # print(jsonObj)
        return jsonObj

class SessionObject:
    def __init__(self, session: Session) -> None:
        itemList: list[str] = []
        for i in session.itemList:
            itemList.append(i.getIdentifier())
        self.sessionId = session.id
        self.name = session.name
        self.type = session.type
        self.items = itemList
        self.seed = session.seed
        self.history = session.sorter.history.getRepresentation()
