import { AlgorithmTypes } from "@sorter/api";
import { Comparison } from "../objects/comparison.js";
import { SortableItem } from "../objects/sortable.js";
import { DoneForNow, Sorter } from "./sorter.js";

export class MergeSorter extends Sorter {
    static override SORT_NAME = AlgorithmTypes.MERGE;
    __array: SortableItem[] = [];
    __progress: number = 0;
    __totalEstimate: number = 0;

    override doSort(itemArray: SortableItem[], latestChoice: Comparison | null = null) {
        this.__array = itemArray.slice();
        this.calculateTotalEstimate();

        if (latestChoice) {
            this.history.addHistory(latestChoice);
        }

        try {
            console.log();
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
        if (begin >= end) {
            return;
        }

        const mid = Math.floor(begin + (end - begin) / 2);
        this.__mergeSort(begin, mid);
        this.__mergeSort(mid + 1, end);
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

    // For merge sort, f(n) = n*log(n)-(n-1)
    private calculateTotalEstimate() {
        let totalItems = this.__array.length;
        let approxTotal = Math.round((totalItems * Math.log2(totalItems)) - (totalItems - 1));
        this.__totalEstimate = approxTotal;
    }

    override getCurrentProgress() {
        return this.__progress;
    }

    override getTotalEstimate() {
        return this.__totalEstimate;
    }
}
