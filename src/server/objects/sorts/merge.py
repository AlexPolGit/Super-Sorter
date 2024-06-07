import math
from objects.sortable_item import SortableItem
from objects.sorts.sorter import ComparisonRequest, DoneForNow, Comparison, Sorter
        
class MergeSorter(Sorter):
    SORT_NAME = "merge"
    __array: list[SortableItem]
    
    def doSort(self, itemArray: list[SortableItem], latestChoice: Comparison | None = None) -> ComparisonRequest | list[SortableItem]:
        self.__array = itemArray.copy()
        if (latestChoice):
            self.history.addHistory(latestChoice)

        try:
            self.__mergeSort(0, len(self.__array) - 1)
            return self.__array
        except DoneForNow as done:
            # print(f"Need user input: {done.comparisonRequest}")
            return done.comparisonRequest

    def __merge(self, left: int, mid: int, right: int):
        subArrayOne = mid - left + 1
        subArrayTwo = right - mid

        leftArray = [SortableItem("")] * subArrayOne
        rightArray = [SortableItem("")] * subArrayTwo

        for i in range(subArrayOne):
            leftArray[i] = self.__array[left + i]
        for j in range(subArrayTwo):
            rightArray[j] = self.__array[mid + 1 + j]

        indexOfSubArrayOne = 0
        indexOfSubArrayTwo = 0
        indexOfMergedArray = left

        while indexOfSubArrayOne < subArrayOne and indexOfSubArrayTwo < subArrayTwo:
            compare = self.compare(rightArray[indexOfSubArrayTwo], leftArray[indexOfSubArrayOne])
            if (compare):
                self.__array[indexOfMergedArray] = leftArray[indexOfSubArrayOne]
                indexOfSubArrayOne += 1 
            else:
                self.__array[indexOfMergedArray] = rightArray[indexOfSubArrayTwo]
                indexOfSubArrayTwo += 1   
            indexOfMergedArray += 1

        while indexOfSubArrayOne < subArrayOne:
            self.__array[indexOfMergedArray] = leftArray[indexOfSubArrayOne]
            indexOfSubArrayOne += 1
            indexOfMergedArray += 1

        while indexOfSubArrayTwo < subArrayTwo:
            self.__array[indexOfMergedArray] = rightArray[indexOfSubArrayTwo]
            indexOfSubArrayTwo += 1
            indexOfMergedArray += 1

    def __mergeSort(self, begin: int, end: int):
        if begin >= end:
            return

        side = self.random.randint(0, 1)

        mid = begin + (end - begin) // 2
        self.__mergeSort(begin if side == 0 else mid + 1, mid if side == 0 else end)
        self.__mergeSort(begin if side == 1 else mid + 1, mid if side == 1 else end)
        self.__merge(begin, mid, end)

    # For merge sort, f(n) = n*log(n)-(n-1)
    def getTotalEstimate(self, itemArray: list[SortableItem]) -> int:
        totalItems = len(itemArray)
        approxTotal = round((totalItems * math.log2(totalItems)) - (totalItems - 1))
        return approxTotal
