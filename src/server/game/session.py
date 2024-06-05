import random
from objects.sortable_item import SortableItem
from objects.sorts.merge import MergeSorter
from objects.sorts.sorter import Sorter, Swap
from objects.session_data import SessionData

class Session:
    id: str
    name: str
    type: str
    sorter: Sorter
    seed: int
    itemList: list[SortableItem]

    def __init__(self, id: str, name: str, type: str, itemList: list[SortableItem], history: str = "", deleted: str = "", seed: int = None) -> None:
        self.id = id
        self.name = name
        self.type = type
        self.seed = seed if seed else random.randint(0, 1000000000)
        self.itemList = itemList
        self.sorter = MergeSorter(itemList, history, deleted, seed)

    def runIteration(self, userChoice: Swap | None = None, full: bool = False) -> SessionData:
        return self.getResponseObject(self.sorter.doSort(userChoice), full)
        
    def undo(self, full: bool = False) -> SessionData:
        return self.getResponseObject(self.sorter.undo(), full)
    
    def delete(self, toDelete: str, full: bool = False) -> SessionData:
        self.itemList = [item for item in self.itemList if not item.getIdentifier() == toDelete]
        return self.getResponseObject(self.sorter.deleteItem(toDelete), full)
    
    def undoDelete(self, toUndelete: str, full: bool = False) -> SessionData:
        self.itemList.append(SortableItem(toUndelete))
        return self.getResponseObject(self.sorter.undeleteItem(toUndelete), full)
    
    def itemListAsStrings(self) -> list[str]:
        items: list[str] = []
        for item in self.itemList:
            items.append(item.getIdentifier())
        return items
    
    def getResponseObject(self, options: Swap | None = None, full: bool = False) -> SessionData:
        if (not options):
            full = True
        return SessionData(
            self.id,
            self.name,
            self.type,
            self.seed,
            self.sorter,
            options,
            full
        ).getJson()
