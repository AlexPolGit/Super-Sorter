import random
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

    def getHistory(self, index: int) -> Comparison | None:
        if (index >= len(self.history)):
            return None
        else:
            return self.history[index]
        
    def getHistoryTop(self) -> Comparison | None:
        return self.getHistory(len(self.history) - 1)

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
        history = ""
        for i, comparison in enumerate(self.history):
            history += comparison.getRepresentation()
            if (i < len(self.history) - 1):
                history += "|"

        deleted = ""
        for i, deletedComparison in enumerate(self.deleted):
            deleted += deletedComparison.getRepresentation()
            if (i < len(self.deleted) - 1):
                deleted += "|"
        
        return (history, deleted)
    
    def fromRepresentation(history: str, deleted: str):
        historyList: list[Comparison] = []
        if (len(history) > 0):
            comparisons: list[str] = history.split("|")
            for comparison in comparisons:
                historyList.append(Comparison.fromRepresentation(comparison))

        deletedList: list[Comparison] = []
        if (len(deleted) > 0):
            deletedComparisons: list[str] = deleted.split("|")
            for deleted in deletedComparisons:
                deletedList.append(Comparison.fromRepresentation(deleted))
        
        return SortHistory(historyList, deletedList)

class DoneForNow(Exception):
    comparisonRequest: ComparisonRequest

    def __init__(self, comparisonRequest: ComparisonRequest, *args: object) -> None:
        super().__init__(*args)
        self.comparisonRequest = comparisonRequest

class Sorter:
    SORT_NAME = "Base"
    itemArray: list[SortableItem]
    history: SortHistory
    compareTracker: int = -1
    random: any

    def __init__(self, array: list[SortableItem], history: str = "", deleted: str = "", seed: int = 10) -> None:
        self.itemArray = array
        self.history = SortHistory.fromRepresentation(history, deleted)
        self.random = random.Random()
        self.random.seed(seed)

    def doSort(self, latestChoice: Comparison | None = None) -> ComparisonRequest | None:
        raise NotImplementedError()
    
    def undo(self) -> ComparisonRequest | None:
        self.history.undoHistory()
        return self.doSort()
    
    def restart(self) -> ComparisonRequest | None:
        self.history = SortHistory.fromRepresentation("", "")
        return self.doSort()
    
    def deleteItem(self, toDelete: str) -> ComparisonRequest | None:
        self.itemArray = [ item for item in self.itemArray if (not item.getIdentifier() == toDelete) ]
        self.history.deleteItem(toDelete)
        return self.doSort()
    
    def undeleteItem(self, toUndelete: str) -> ComparisonRequest | None:
        self.itemArray = self.itemArray.append(SortableItem(toUndelete))
        self.history.undeleteItem(toUndelete)
        return self.doSort()

    def compare(self, itemA: SortableItem, itemB: SortableItem) -> bool:
        choice = None
        print(f"Current history: {self.history.history}")
        for i in self.history.history:
            if (
                (i.itemA.getIdentifier() == itemA.getIdentifier() and i.itemB.getIdentifier() == itemB.getIdentifier()) or
                (i.itemB.getIdentifier() == itemA.getIdentifier() and i.itemA.getIdentifier() == itemB.getIdentifier())):
                choice = i
                break

        if (not choice == None):
            return choice.choice
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
