import random
from objects.sortable_item import SortableItem
from objects.sorts.merge import MergeSorter
from objects.sorts.sorter import Pair, SortHistory

class Session:
    id: str
    name: str
    type: str
    initialList: list[SortableItem]
    history: SortHistory
    seed: int

    def __init__(self, name: str, type: str, initialList: list[SortableItem], seed: int = None) -> None:
        self.name = name
        self.type = type
        self.initialList = initialList
        self.history = SortHistory()
        self.seed = seed if seed else random.randint(0, 1000000000)

    def runInitial(self) -> Pair | list[SortableItem]:
        return self.__doSort()

    def runIteration(self, choice: bool) -> Pair | list[SortableItem]:
        self.history.add(choice)
        return self.__doSort()

    def undo(self) -> Pair | list[SortableItem]:
        self.history.undo()
        return self.__doSort()

    def __doSort(self) -> Pair | list[SortableItem]:
        print(self.history)
        sorter = MergeSorter(self.initialList, self.history, self.seed)
        sessionResult = sorter.doSort()
        return sessionResult
