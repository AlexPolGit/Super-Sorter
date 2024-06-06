import json
import random
from objects.exceptions.base import ServerError
from util.logging import GLOBAL_LOGGER as logger
from objects.sortable_item import SortableItem

class ComparisonRequest:
    itemA: SortableItem
    itemB: SortableItem

    def __init__(self, itemA: SortableItem, itemB: SortableItem) -> None:
        self.itemA = itemA
        self.itemB = itemB
    
    def getRepresentation(self) -> str:
        return f"{self.itemA.getIdentifier()},{self.itemB.getIdentifier()}"
    
    def fromRepresentation(rep: str):
        parts: list[str] = rep.split(",")
        return ComparisonRequest(SortableItem(parts[0]), SortableItem(parts[1]))
    
    def fromRaw(itemA: str, itemB: str):
        comparisonRequest = ComparisonRequest(SortableItem(itemA), SortableItem(itemB))
        return comparisonRequest
    
    def __str__(self) -> str:
        return f"({self.getRepresentation()})"
    
    def __repr__(self) -> str:
        return f"({self.getRepresentation()})"

class Comparison:
    itemA: SortableItem
    itemB: SortableItem
    choice: SortableItem

    def __init__(self, itemA: SortableItem, itemB: SortableItem, choice: SortableItem) -> None:
        self.itemA = itemA
        self.itemB = itemB
        self.choice = choice
        assert type(self.itemA).__name__ == SortableItem.__name__
        assert type(self.itemB).__name__ == SortableItem.__name__
        assert type(self.choice).__name__ == SortableItem.__name__
        assert (not self.itemA.getIdentifier() == self.itemB.getIdentifier())
        assert (self.choice.getIdentifier() == self.itemA.getIdentifier()) or (self.choice.getIdentifier() == self.itemB.getIdentifier())

    def getRepresentation(self) -> str:
        return f"{self.itemA.getIdentifier()},{self.itemB.getIdentifier()},{self.choice.getIdentifier()}"
    
    def fromRepresentation(rep: str):
        parts: list[str] = rep.split(",")
        return Comparison(SortableItem(parts[0]), SortableItem(parts[1]), SortableItem(parts[2]))
    
    def fromRaw(itemA: str, itemB: str, choice: str):
        comparison = Comparison(SortableItem(itemA), SortableItem(itemB), SortableItem(choice))
        return comparison
    
    def __str__(self) -> str:
        return f"({self.getRepresentation()})"
    
    def __repr__(self) -> str:
        return f"({self.getRepresentation()})"

class SortHistory:
    history: list[Comparison]
    deleted: list[Comparison]

    def __init__(self, history: list[Comparison] = [], deleted: list[Comparison] = []) -> None:
        self.history = history
        self.deleted = deleted

    def getList(self) -> list[Comparison]:
        return self.history
    
    def getDeletedList(self) -> list[Comparison]:
        return self.deleted
    
    def getHistory(self, itemA: SortableItem, itemB: SortableItem) -> SortableItem | None:
        for historicalComparison in self.history:
            if (
                historicalComparison.itemA.getIdentifier() == itemA.getIdentifier() and
                historicalComparison.itemB.getIdentifier() == itemB.getIdentifier()
            ):
                return historicalComparison.choice
            elif (
                historicalComparison.itemA.getIdentifier() == itemB.getIdentifier() and
                historicalComparison.itemB.getIdentifier() == itemA.getIdentifier()
            ):
                return historicalComparison.choice
        return None

    def addHistory(self, comparison: Comparison):
        self.history.append(comparison)

    def undoHistory(self):
        if (len(self.history) > 0):
            self.history.pop()

    def historySize(self) -> int:
        return len(self.history)
    
    def deletedSize(self) -> int:
        return len(self.deleted)

    def deleteItem(self, toDelete: str):
        remainders: list[Comparison] = []
        deleted: list[Comparison] = []
        for item in self.history:
            if (item.itemA.getIdentifier() == toDelete or item.itemB.getIdentifier() == toDelete):
                deleted.append(item)
            else:
                remainders.append(item)
        self.history = remainders
        self.deleted = self.deleted + deleted

    def undeleteItem(self, toUndelete: str):
        stayDeleted: list[Comparison] = []
        bringBack: list[Comparison] = []
        for deletedItem in self.deleted:
            if (deletedItem.itemA.getIdentifier() == toUndelete or deletedItem.itemB.getIdentifier() == toUndelete):
                stayDeleted.append(deletedItem)
            else:
                bringBack.append(deletedItem)
        self.deleted = stayDeleted
        self.history = self.history + bringBack

    def getRepresentation(self) -> tuple[str, str]:
        historyList: list[str] = []
        for comparison in self.history:
            historyList.append(comparison.getRepresentation())

        deletedList: list[str] = []
        for comparison in self.deleted:
            deletedList.append(comparison.getRepresentation())
        
        return (json.dumps(historyList), json.dumps(deletedList))
    
    def fromRepresentation(history: str, deleted: str):
        historyList: list[Comparison] = []
        for comparison in json.loads(history):
            historyList.append(Comparison.fromRepresentation(comparison))

        deletedList: list[Comparison] = []
        for comparison in json.loads(deleted):
            deletedList.append(Comparison.fromRepresentation(comparison))
        
        return SortHistory(historyList, deletedList)
    
    def __str__(self) -> str:
        return f"<{self.getRepresentation()}>"
    
    def __repr__(self) -> str:
        return f"<{self.getRepresentation()}>"

class DoneForNow(Exception):
    comparisonRequest: ComparisonRequest

    def __init__(self, comparisonRequest: ComparisonRequest, *args: object) -> None:
        super().__init__(*args)
        self.comparisonRequest = comparisonRequest

class Sorter:
    SORT_NAME = "base"
    itemArray: list[SortableItem]
    history: SortHistory
    compareTracker: int = -1
    random: any

    def __init__(self, array: list[SortableItem], history: list[Comparison] = [], deleted: list[Comparison] = [], seed: int = 0) -> None:
        self.itemArray = array
        self.history = SortHistory(history, deleted)
        self.random = random.Random()
        self.random.seed(seed)

    def doSort(self, latestChoice: Comparison | None = None) -> ComparisonRequest | list[SortableItem]:
        raise NotImplementedError()
    
    def undo(self) -> ComparisonRequest | list[SortableItem]:
        self.history.undoHistory()
        return self.doSort()
    
    def restart(self) -> ComparisonRequest | list[SortableItem]:
        self.history = SortHistory([], [])
        return self.doSort()
    
    def deleteItem(self, toDelete: str) -> ComparisonRequest | list[SortableItem]:
        self.itemArray = [ item for item in self.itemArray if (not item.getIdentifier() == toDelete) ]
        self.history.deleteItem(toDelete)
        return self.doSort()
    
    def undeleteItem(self, toUndelete: str) -> ComparisonRequest | list[SortableItem]:
        self.history.undeleteItem(toUndelete)
        return self.doSort()

    def compare(self, itemA: SortableItem, itemB: SortableItem) -> bool:
        choice = self.history.getHistory(itemA, itemB)

        if (choice):
            if (choice.getIdentifier() == itemA.getIdentifier()):
                return False
            elif (choice.getIdentifier() == itemB.getIdentifier()):
                return True
            else:
                raise ServerError("Invalid history check.")
        else:
            comparisonRequest = ComparisonRequest(itemA, itemB)
            logger.debug(f"Comparison not found for {comparisonRequest}")
            raise DoneForNow(comparisonRequest)

    def getList(self) -> list[SortableItem]:
        return self.itemArray

    def getTotalEstimate(self) -> int:
        raise NotImplementedError()
    
    def getRemainingEstimate(self) -> int:
        return (self.getTotalEstimate() - self.history.historySize())
    
    def getHistoryAsRepresentation(self) -> tuple[str, str]:
        return self.history.getRepresentation()
