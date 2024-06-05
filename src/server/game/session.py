import json
import random
from objects.sortable_item import SortableItem
from objects.sorts.sorter import Sorter, Comparison
from objects.sorts.sort_manager import getSortingAlgorithm
from db.sessions.schema import SessionObject

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
            algorithm: str = "merge",
            seed: int = None
        ) -> None:

        self.id = id
        self.name = name
        self.type = type
        self.items = items
        self.deletedItems = deletedItems
        self.algorithm = algorithm
        self.seed = seed if seed else random.randint(0, 1000000000)
        self.sorter = getSortingAlgorithm(algorithm, self.items, history, deletedHistory, seed)

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
        return self.sorter.doSort(userChoice)
        
    def undo(self):
        return self.sorter.undo()
    
    def restart(self):
        return self.sorter.restart()
    
    def delete(self, toDelete: str):
        self.items = [item for item in self.items if not item.getIdentifier() == toDelete]
        return self.sorter.deleteItem(toDelete)
    
    def undoDelete(self, toUndelete: str):
        self.items.append(SortableItem(toUndelete))
        return self.sorter.undeleteItem(toUndelete)
    
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
