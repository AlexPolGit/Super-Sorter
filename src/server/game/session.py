import json
import random
from objects.exceptions.base import BaseSorterException
from objects.sortable_item import SortableItem
from objects.sorts.sorter import Sorter, Comparison
from objects.sorts.sort_manager import getSortingAlgorithm
from db.sessions.schema import SessionObject

class ItemNotFoundException(BaseSorterException):
    errorCode = 404
    def __init__(self, id: str) -> None:
        super().__init__(f"Item not found: {id}.")

class Session:
    id: str
    name: str
    type: str
    items: list[SortableItem]
    deletedItems: list[SortableItem]
    algorithm: str
    seed: int
    sorter: Sorter

    def __init__(
            self,
            id: str,
            name: str,
            type: str = "generic",
            items: list[SortableItem] = [],
            deletedItems: list[SortableItem] = [],
            history: list[Comparison] = [],
            deletedHistory: list[Comparison] = [],
            algorithm: str = "queue-merge",
            seed: int = None
        ) -> None:

        self.id = id
        self.name = name
        self.type = type
        self.items = items
        self.deletedItems = deletedItems
        self.algorithm = algorithm
        self.seed = seed if seed else random.randint(0, 1000000000)
        self.sorter = getSortingAlgorithm(algorithm, history, deletedHistory, seed)

    def fromSchema(sessionObject: SessionObject):
        return Session(
            sessionObject.id,
            sessionObject.name,
            sessionObject.type,
            sessionObject.items,
            sessionObject.deleted_items,
            sessionObject.history,
            sessionObject.deleted_history,
            sessionObject.algorithm,
            sessionObject.seed
        )

    def runIteration(self, userChoice: Comparison | None = None):
        return self.sorter.doSort(self.items, userChoice)
        
    def undo(self, toUndo: Comparison):
        return self.sorter.undo(toUndo, self.items)
    
    def restart(self):
        self.items = self.items + self.deletedItems
        self.deletedItems = []
        return self.sorter.restart(self.items)
    
    def delete(self, toDelete: str):
        deleteIndex = -1
        for i, item in enumerate(self.items):
            if (item.getIdentifier() == toDelete):
                deleteIndex = i
                break
        if (deleteIndex == -1):
            raise ItemNotFoundException(toDelete)
        self.deletedItems.append(self.items.pop(deleteIndex))
        return self.sorter.deleteItem(self.items, toDelete)
    
    def undoDelete(self, toUndelete: str):
        undeleteIndex = -1
        for i, item in enumerate(self.deletedItems):
            if (item.getIdentifier() == toUndelete):
                undeleteIndex = i
                break
        if (undeleteIndex == -1):
            raise ItemNotFoundException(toUndelete)
        self.items.append(self.deletedItems.pop(undeleteIndex))
        return self.sorter.undeleteItem(self.items, toUndelete)
    
    def itemListAsRepresentation(self) -> str:
        items: list[str] = []
        for item in self.items:
            items.append(item.getIdentifier())
        return json.dumps(items)
    
    def deletedItemListAsRepresentation(self) -> str:
        deletedItems: list[str] = []
        for deletedItem in self.deletedItems:
            deletedItems.append(deletedItem.getIdentifier())
        return json.dumps(deletedItems)
