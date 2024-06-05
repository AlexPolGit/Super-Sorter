import random
from util.logging import GLOBAL_LOGGER as logger
from objects.sortable_item import SortableItem

class Pair:
    itemA: SortableItem
    itemB: SortableItem

    def __init__(self, itemA: SortableItem, itemB: SortableItem) -> None:
        self.itemA = itemA
        self.itemB = itemB

class Swap:
    itemA: SortableItem
    itemB: SortableItem
    choice: bool | None

    def __init__(self, itemA: SortableItem, itemB: SortableItem, choice: bool | None = None) -> None:
        self.itemA = itemA
        self.itemB = itemB
        self.choice = choice
        assert type(self.itemA).__name__ == SortableItem.__name__
        assert type(self.itemB).__name__ == SortableItem.__name__

    def getRepresentation(self) -> str:
        return f"{self.itemA.getIdentifier()},{self.itemB.getIdentifier()},{1 if self.choice else (0 if not self.choice == None else 'X')}"
    
    def fromRepresentation(rep: str):
        parts: list[str] = rep.split(",")
        itemA = SortableItem(parts[0])
        itemB = SortableItem(parts[1])
        if (parts[2] == "0"):
            choice = False
        elif (parts[2] == "1"):
            choice = True
        else:
            choice = None
        return Swap(itemA, itemB, choice)
    
    def fromRaw(itemA: str, itemB: str, choice: bool | None = None):
        swap = Swap(SortableItem(itemA), SortableItem(itemB), choice)
        return swap
    
    def __str__(self) -> str:
        return f"({self.getRepresentation()})"
    
    def __repr__(self) -> str:
        return f"({self.getRepresentation()})"

class SortHistory:
    items: list[Swap]
    deleted: list[Swap]

    def __init__(self, items: list[Swap] = [], deleted: list[Swap] = []) -> None:
        self.items = items
        self.deleted = deleted

    def getHistory(self, index: int) -> Swap | None:
        if (index >= len(self.items)):
            return None
        else:
            return self.items[index]
        
    def getHistoryTop(self) -> Swap | None:
        return self.getHistory(len(self.items) - 1)

    def addHistory(self, swap: Swap):
        self.items.append(swap)

    def undoHistory(self):
        if (len(self.items) > 0):
            self.items.pop()

    def historySize(self) -> int:
        return len(self.items)
    
    def deletedSize(self) -> int:
        return len(self.deleted)

    def deleteItem(self, toDelete: str):
        remainders: list[Swap] = []
        deleted: list[Swap] = []
        for item in self.items:
            if (item.itemA.getIdentifier() == toDelete or item.itemB.getIdentifier() == toDelete):
                deleted.append(item)
            else:
                remainders.append(item)
        self.items = remainders
        self.deleted = self.deleted + deleted

    def undeleteItem(self, toUndelete: str):
        stayDeleted: list[Swap] = []
        bringBack: list[Swap] = []
        for deletedItem in self.deleted:
            if (deletedItem.itemA.getIdentifier() == toUndelete or deletedItem.itemB.getIdentifier() == toUndelete):
                stayDeleted.append(deletedItem)
            else:
                bringBack.append(deletedItem)
        self.deleted = stayDeleted
        self.items = self.items + bringBack

    def getRepresentation(self) -> tuple[str, str]:
        history = ""
        for i, swap in enumerate(self.items):
            history += swap.getRepresentation()
            if (i < len(self.items) - 1):
                history += "|"

        deleted = ""
        for i, swap in enumerate(self.deleted):
            deleted += swap.getRepresentation()
            if (i < len(self.deleted) - 1):
                deleted += "|"
        
        return (history, deleted)
    
    def fromRepresentation(history: str, deleted: str):
        historyList: list[Swap] = []
        if (len(history) > 0):
            swaps: list[str] = history.split("|")
            for swap in swaps:
                historyList.append(Swap.fromRepresentation(swap))

        deletedList: list[Swap] = []
        if (len(deleted) > 0):
            swaps: list[str] = deleted.split("|")
            for swap in swaps:
                deletedList.append(Swap.fromRepresentation(swap))
        
        return SortHistory(historyList, deletedList)

class DoneForNow(Exception):
    swap: Swap

    def __init__(self, swap: Swap, *args: object) -> None:
        super().__init__(*args)
        self.swap = swap

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

    def doSort(self, latestChoice: Swap | None = None) -> Swap | None:
        raise NotImplementedError()
    
    def undo(self) -> Swap | None:
        self.history.undoHistory()
        return self.doSort()
    
    def deleteItem(self, toDelete: str) -> Swap | None:
        self.itemArray = [ item for item in self.itemArray if (not item.getIdentifier() == toDelete) ]
        self.history.deleteItem(toDelete)
        return self.doSort()
    
    def undeleteItem(self, toUndelete: str) -> Swap | None:
        self.itemArray = self.itemArray.append(SortableItem(toUndelete))
        self.history.undeleteItem(toUndelete)
        return self.doSort()

    def compare(self, itemA: SortableItem, itemB: SortableItem) -> bool:
        choice = None
        print(f"Current history: {self.history.items}")
        for i in self.history.items:
            if (
                (i.itemA.getIdentifier() == itemA.getIdentifier() and i.itemB.getIdentifier() == itemB.getIdentifier()) or
                (i.itemB.getIdentifier() == itemA.getIdentifier() and i.itemA.getIdentifier() == itemB.getIdentifier())):
                choice = i
                break

        if (not choice == None):
            return choice.choice
        else:
            comparisonRequest = Swap(itemA, itemB)
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
