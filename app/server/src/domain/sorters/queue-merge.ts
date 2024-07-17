import { AlgorithmTypes } from "@sorter/api";
import { SortableItem } from "../objects/sortable.js";
import { Comparison } from "../objects/comparison.js";
import { DoneForNow, Sorter } from "./sorter.js";

class Deque<T> {
    private list: T[] = [];

    constructor(items?: T[]) {
        if (items) {
            this.list = items;
        }
    }

    asList(): T[] {
        return this.list;
    }

    length(): number {
        return this.list.length;
    }

    get(index: number): T {
        return this.list[index];
    }

    removeLeft(): T {
        return this.list.splice(0, 1)[0];
    }

    removeRight(): T {
        return this.list.splice(this.list.length - 1, 1)[0];
    }
    
    add(item: T) {
        this.list.push(item);
    }
    
    append(toAdd: Deque<T>) {
        toAdd.asList().forEach(item => {
            this.list.push(item);
        });
    }
}

export class QueueMergeSorter extends Sorter {
    static override SORT_NAME = AlgorithmTypes.QUEUE_MERGE;
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
            let result = this.__queueMergeSort(this.__array.map(item => {
                return new Deque([item]);
            }))[0];

            return result.asList();
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

    __queueMergeSort(queueList: Deque<SortableItem>[]): Deque<SortableItem>[] {
        if (queueList.length > 1) {
            return this.__queueMergeSort(queueList.slice(2).concat([ this.__merge_queues(queueList[0], queueList[1]) ]));
        }
        else {
            return queueList;
        }
    }

    __merge_queues(q1: Deque<SortableItem>, q2: Deque<SortableItem>): Deque<SortableItem> {
        let res = new Deque<SortableItem>();

        while (q1.length() + q2.length() > 0) {
            if (q1.length() === 0) {
                res.append(q2);
                break;
            }
            else if (q2.length() === 0) {
                res.append(q1);
                break;
            }

            let left = q1.get(0);
            let right = q2.get(0);
            let choice = this.compare(left, right);
            
            if (choice) {
                res.add(q2.removeLeft());
            }
            else {
                res.add(q1.removeLeft());
            }

            this.__progress += 1;
        }

        this.__progress += q1.length() + q2.length() - 1;
        return res;
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
