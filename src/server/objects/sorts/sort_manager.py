from objects.exceptions.base import BaseSorterException
from objects.sortable_item import SortableItem
from objects.sorts.sorter import Comparison, Sorter
from objects.sorts.merge import MergeSorter

class AlgorithmNotFoundException(BaseSorterException):
    errorCode = 404
    def __init__(self, name: str) -> None:
        super().__init__(f"Sorting algorithm not found: {name}.")

def getSortingAlgorithm(
        name: str,
        array: list[SortableItem],
        history: list[Comparison],
        deleted: list[Comparison],
        seed: int
    ) -> Sorter:

    if (name == MergeSorter.SORT_NAME):
        return MergeSorter(array, history, deleted, seed)
    else:
        raise AlgorithmNotFoundException(name)
