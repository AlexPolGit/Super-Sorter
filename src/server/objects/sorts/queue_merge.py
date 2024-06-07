import math
from objects.sortable_item import SortableItem
from objects.sorts.sorter import ComparisonRequest, DoneForNow, Comparison, Sorter

# From: https://medium.com/@giridhar.reddy012/merge-sort-queue-merging-28b401e1eb95
class QueueMergeSorter(Sorter):
    SORT_NAME = "queue-merge"
    __array: list[SortableItem]
    
    def doSort(self, itemArray: list[SortableItem], latestChoice: Comparison | None = None) -> ComparisonRequest | list[SortableItem]:
        self.__array = itemArray.copy()
        if (latestChoice):
            self.history.addHistory(latestChoice)

        try:
            self.__divide(0, len(self.__array) - 1)
            return self.__array
        except DoneForNow as done:
            # print(f"Need user input: {done.comparisonRequest}")
            return done.comparisonRequest

    def __merge(self, left: int, mid: int, right: int):
        head  = 0
        tail = 0
        queue = [SortableItem("")] * (right - left + 1)
        i = left
        k = i
        j = mid + 1

        queue[tail] = self.__array[i]
        i += 1
        tail += 1

        while (i <= mid and j <= right):
            queue[tail] = self.__array[i]
            i += 1
            tail += 1

            if (self.compare(queue[head], self.__array[j])):
                self.__array[k] = self.__array[j]
                j += 1
                k += 1
            else:
                self.__array[k] = queue[head]
                head += 1
                k += 1
        
        while (head < tail and j <= right):
            if (self.compare(queue[head], self.__array[j])):
                self.__array[k] = self.__array[j]
                k += 1
                j += 1
            else:
                self.__array[k] = queue[head]
                k += 1
                head += 1

        while (i <= mid):
            queue[tail] = self.__array[i]
            tail += 1
            i += 1

            self.__array[k] = queue[head]
            k += 1
            head += 1
        
        while (j <= right):
            queue[tail] = self.__array[j]
            tail += 1
            j += 1

            self.__array[k] = queue[head]
            k += 1
            head += 1
        
        while (head < tail):
            self.__array[k] = queue[head]
            k += 1
            head += 1

    def __divide(self, left: int, right: int):
        if (left < right):
            mid = left + (right - left) // 2
            self.__divide(left, mid)
            self.__divide(mid + 1, right)
            self.__merge(left, mid, right)

    # For merge sort, f(n) = n*log(n)-(n-1)
    def getTotalEstimate(self, itemArray: list[SortableItem]) -> int:
        totalItems = len(itemArray)
        approxTotal = round((totalItems * math.log2(totalItems)) - (totalItems - 1))
        return approxTotal
