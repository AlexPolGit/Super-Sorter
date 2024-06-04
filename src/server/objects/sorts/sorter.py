import random
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

class SortHistory:
    items: list[Swap]

    def __init__(self, items: list[Swap] = []) -> None:
        self.items = items

    def get(self, index: int) -> Swap | None:
        if (index >= len(self.items)):
            return None
        else:
            return self.items[index]
        
    def getTop(self) -> Swap | None:
        return self.get(len(self.items) - 1)

    def add(self, swap: Swap):
        self.items.append(swap)

    def undo(self):
        if (len(self.items) > 0):
            self.items.pop()

    def size(self) -> int:
        return len(self.items)

    def deleteItem(self, toDelete: str):
        self.items = [
            item for item in self.items if
            (
                not item.itemA.getIdentifier() == toDelete and
                not item.itemB.getIdentifier() == toDelete
            )
        ]

    def getRepresentation(self) -> str:
        out = ""
        for i, swap in enumerate(self.items):
            out += swap.getRepresentation()
            if (i < len(self.items) - 1):
                out += "|"
        return out
    
    def fromRepresentation(rep: str):
        if (len(rep) == 0):
            return SortHistory([])
        swaps: list[str] = rep.split("|")
        swapList: list[Swap] = []
        for swap in swaps:
            swapList.append(Swap.fromRepresentation(swap))
        return SortHistory(swapList)
    
    def __str__(self) -> str:
        return self.getRepresentation()
    
    def __repr__(self) -> str:
        return self.getRepresentation()

class DoneForNow(Exception):
    swap: Swap

    def __init__(self, swap: Swap, *args: object) -> None:
        super().__init__(*args)
        self.swap = swap

class Sorter:
    itemArray: list[SortableItem]
    history: SortHistory
    compareTracker: int = -1
    random: any

    def __init__(self, array: list[SortableItem], history: str = "", seed: int = 10) -> None:
        self.itemArray = array
        self.history = SortHistory.fromRepresentation(history)
        self.random = random.Random()
        self.random.seed(seed)

    def doSort(self, latestChoice: Swap | None = None) -> Swap | list[SortableItem]:
        raise NotImplementedError()
    
    def undo(self) -> Swap | list[SortableItem]:
        self.history.undo()
        return self.doSort()
    
    def deleteItem(self, toDelete: str) -> Swap | list[SortableItem]:
        self.itemArray = [ item for item in self.itemArray if (not item.getIdentifier() == toDelete) ]
        self.history.deleteItem(toDelete)
        return self.doSort()

    def compare(self, itemA: SortableItem, itemB: SortableItem) -> bool:
        choice = None
        for i in self.history.items:
            aInSwap = i.itemA.getIdentifier() == itemA.getIdentifier()
            bInSwap = i.itemB.getIdentifier() == itemB.getIdentifier()
            if (aInSwap and bInSwap):
                choice = i
                break

        if (not choice == None):
            return choice.choice
        else:
            raise DoneForNow(Swap(itemA, itemB))

    def getList(self) -> list[SortableItem]:
        return self.itemArray

    def getEstimate(self) -> int:
        raise NotImplementedError()
