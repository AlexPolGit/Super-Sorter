from business_logic.objects.exceptions.base import BaseSorterException
from business_logic.objects.sorters.sorter import Comparison, Sorter
from business_logic.objects.sorters.merge import MergeSorter
from business_logic.objects.sorters.queue_merge import QueueMergeSorter

class AlgorithmNotFoundException(BaseSorterException):
    errorCode = 404
    def __init__(self, name: str) -> None:
        super().__init__(f"Sorting algorithm not found: {name}.")

def getSortingAlgorithm(
        name: str,
        history: list[Comparison],
        deleted: list[Comparison],
        seed: int
    ) -> Sorter:

    if (name == MergeSorter.SORT_NAME):
        return MergeSorter(history, deleted, seed)
    elif (name == QueueMergeSorter.SORT_NAME):
        return QueueMergeSorter(history, deleted, seed)
    else:
        raise AlgorithmNotFoundException(name)
