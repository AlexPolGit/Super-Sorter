import { Comparison } from "../objects/comparison.js";
import { SortableItem } from "../objects/sortable.js";
import { DoneForNow, Sorter } from "./sorter.js";

export class MergeSorter extends Sorter {
    static override SORT_NAME = "merge";
    __array: SortableItem[] = [];
    __progress: number = 0;

    override doSort(itemArray: SortableItem[], latestChoice: Comparison | null = null) {
        this.__array = JSON.parse(JSON.stringify(itemArray));

        if (latestChoice) {
            this.history.addHistory(latestChoice);
        }

        try {
            this.__mergeSort(0, this.__array.length - 1);
            return this.__array;
        }
        catch (e: any) {
            if (e instanceof DoneForNow) {
                return e.comparisonRequest;
            }
            else {
                throw e;
            }
        }
    }

    private __mergeSort(begin: number, end: number) {
        if (begin > end) {
            return;
        }

        let side = Math.round(this.random.next());

        const mid = begin + (end - begin) / 2;
        this.__mergeSort(side === 0 ? begin : mid + 1, side === 0 ? mid: end);
        this.__mergeSort(side === 1 ? begin : mid + 1, side === 1 ? mid: end);
        this.__merge(begin, mid, end);
    }

    private __merge(left: number, mid: number, right: number) {
        const subArrayOne = mid - left + 1;
        const subArrayTwo = right - mid;

        let leftArray: SortableItem[] = [];
        let rightArray: SortableItem[] = [];

        for (let i = 0; i < subArrayOne; i++) {
            leftArray[i] = this.__array[left + i];
        }

        for (let j = 0; j < subArrayOne; j++) {
            rightArray[j] = this.__array[mid + 1 + j];
        }

        let indexOfSubArrayOne = 0
        let indexOfSubArrayTwo = 0
        let indexOfMergedArray = left

        while (indexOfSubArrayOne < subArrayOne && indexOfSubArrayTwo < subArrayTwo) {
            let compare = this.compare(rightArray[indexOfSubArrayTwo], leftArray[indexOfSubArrayOne]);

            if (compare) {
                this.__array[indexOfMergedArray] = leftArray[indexOfSubArrayOne];
                indexOfSubArrayOne += 1;
            }
            else {
                this.__array[indexOfMergedArray] = rightArray[indexOfSubArrayTwo];
                indexOfSubArrayTwo += 1;
            }
            indexOfMergedArray += 1;
            this.__progress += 1;
        }
        
        while (indexOfSubArrayOne < subArrayOne) {
            this.__array[indexOfMergedArray] = leftArray[indexOfSubArrayOne];
            indexOfSubArrayOne += 1;
            indexOfMergedArray += 1;
            this.__progress += 1;
        }

        while (indexOfSubArrayTwo < subArrayTwo) {
            this.__array[indexOfMergedArray] = rightArray[indexOfSubArrayTwo];
            indexOfSubArrayTwo += 1;
            indexOfMergedArray += 1;
            this.__progress += 1;
        }
    }

    override getCurrentProgress() {
        return this.__progress;
    }

    // For merge sort, f(n) = n*log(n)-(n-1)
    override getTotalEstimate(itemArray: SortableItem[]) {
        let totalItems = itemArray.length;
        let approxTotal = Math.round((totalItems * Math.log2(totalItems)) - (totalItems - 1));
        return approxTotal;
    }
}
