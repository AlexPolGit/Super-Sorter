import math
from collections import deque as Deque
from domain.objects.sortable_item import SortableItem
from domain.objects.sorters.sorter import ComparisonRequest, DoneForNow, Comparison, Sorter

class QueueMergeSorter(Sorter):
    SORT_NAME = "queue-merge"
    __array: list[SortableItem]
    __progress: int = 0

    def doSort(self, itemArray: list[SortableItem], latestChoice: Comparison | None = None) -> ComparisonRequest | list[SortableItem]:
        self.__array = itemArray.copy()
        if (latestChoice):
            self.history.addHistory(latestChoice)

        try:
            return list(self.__queueMergeSort([Deque([item]) for item in self.__array])[0])
        except DoneForNow as done:
            # print(f"Need user input: {done.comparisonRequest}")
            return done.comparisonRequest

    def __queueMergeSort(self, queue: list) -> list:
        if len(queue) > 1:
            return self.__queueMergeSort(queue[2:] + [self.__merge_queues(queue[0], queue[1])])
        else:
            return queue

    def __merge_queues(self, q1: Deque, q2: Deque) -> Deque:
        res = Deque()
        while len(q1) + len(q2) > 0:
            if len(q1) == 0:
                res.extend(q2)
                break
            elif len(q2) == 0:
                res.extend(q1)
                break
            left = q1[0]
            right = q2[0]
            choice = self.compare(left, right)
            if choice:
                res.append(q2.popleft())
            else:
                res.append(q1.popleft())
            self.__progress += 1
        self.__progress += len(q1) + len(q2) - 1
        return res

    def getCurrentProgress(self) -> int:
        return self.__progress

    # For merge sort, f(n) = n*log(n)-(n-1)
    def getTotalEstimate(self, itemArray: list[SortableItem]) -> int:
        totalItems = len(itemArray)
        approxTotal = round((totalItems * math.log2(totalItems)) - (totalItems - 1))
        return approxTotal
