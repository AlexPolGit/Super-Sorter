import random
from objects.sortable_item import SortableItem

class Pair:
    itemA: SortableItem
    itemB: SortableItem

    def __init__(self, itemA: SortableItem, itemB: SortableItem) -> None:
        self.itemA = itemA
        self.itemB = itemB

class SortHistory:
    items: list[bool]

    def __init__(self, items: list[bool] = []) -> None:
        self.items = items

    def get(self, index: int) -> bool | None:
        if (index >= len(self.items)):
            return None
        else:
            return self.items[index]

    def add(self, choice: bool):
        self.items.append(choice)

    def undo(self):
        if (len(self.items) > 0):
            self.items.pop()

    def asIntegers(self) -> list[int]:
        out = []
        for i in self.items:
            if (i): out.append(1)
            else: out.append(0)
        return out

class DoneForNow(Exception):
    itemA: SortableItem
    itemB: SortableItem

    def __init__(self, itemA: SortableItem, itemB: SortableItem, *args: object) -> None:
        super().__init__(*args)
        self.itemA = itemA
        self.itemB = itemB

class FinishEarly(Exception):
    item_array: list[SortableItem]

    def __init__(self, item_array: list[SortableItem], *args: object) -> None:
        super().__init__(*args)
        self.item_array = item_array

class Sorter:
    item_array: list[SortableItem]
    history: SortHistory
    compareTracker: int = -1
    random: any

    def __init__(self, array: list[SortableItem], history: SortHistory, seed: int = 10) -> None:
        self.item_array = array
        self.history = history
        self.random = random.Random()
        self.random.seed(seed)

    def doSort(self) -> Pair | list[SortableItem]:
        raise NotImplementedError()

    def compare(self, itemA: SortableItem, itemB: SortableItem) -> bool:
        self.compareTracker += 1

        historicalChoice = self.history.get(self.compareTracker)
        if (historicalChoice != None):
            return historicalChoice
        else:
            raise DoneForNow(itemA, itemB)

    def getList(self) -> list[SortableItem]:
        return self.item_array

    def json(self) -> str:
        json_rep = "["
        for i, item in enumerate(self.item_array):
            json_rep += item.json() + ("," if i < len(self.item_array) - 1 else "")
        json_rep += "]"
        return json_rep
