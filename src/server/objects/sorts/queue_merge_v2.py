import math
from collections import deque
from objects.sortable_item import SortableItem
from objects.sorts.sorter import ComparisonRequest, DoneForNow, Comparison, Sorter

class QueueMergeSorter(Sorter):
    SORT_NAME = "queue_merge"
    __array: list[SortableItem]
    __queue: deque
    __progress: int = 0

    def doSort(self, itemArray: list[SortableItem], latestChoice: Comparison | None = None) -> ComparisonRequest | list[SortableItem]:
        self.__array = itemArray.copy()
        self.__queue = deque([deque(item) for item in self.__array])
        if (latestChoice):
            self.history.addHistory(latestChoice)

        try:
            self.__array = self.__queueMergeSort(self.__queue)
            return self.__array
        except DoneForNow as done:
            # print(f"Need user input: {done.comparisonRequest}")
            return done.comparisonRequest

    def __queueMergeSort(self, queue: deque) -> deque:
        if len(q) > 1:
            return __queueMergeSort(q[2:] + [__merge_queues(q[0], q[1])])
        else:
            return q

    def __merge_queues(self, q1: deque, q2: deque) -> deque:
        res = deque()
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
        self.__progress += len(q1)+len(q2)-1
        return res

    def getCurrentProgress(self):
        # TODO
        return self.__progress

    # For merge sort, f(n) = n*log(n)-(n-1)
    def getTotalEstimate(self, itemArray: list[SortableItem]) -> int:
        totalItems = len(itemArray)
        approxTotal = round((totalItems * math.log2(totalItems)) - (totalItems - 1))
        return approxTotal
