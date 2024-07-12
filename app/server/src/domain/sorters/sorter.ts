import Rand from "rand-seed";
import { InternalServerException } from "../exceptions/base.js";
import { SortableItem } from "../objects/sortable.js";
import { Comparison, ComparisonRequest } from "../objects/comparison.js";
import { SortHistory } from "../objects/sort-history.js";

export class DoneForNow extends Error {
    comparisonRequest: ComparisonRequest;

    constructor(comparisonRequest: ComparisonRequest) {
        super();
        this.comparisonRequest = comparisonRequest;
    }
}

export abstract class Sorter {
    static SORT_NAME: string = "base";
    history: SortHistory;
    compareTracker: number = -1;
    random: Rand.default;

    constructor(history: Comparison[] = [], deleted: Comparison[] = [], seed: number = 0) {
        this.history = new SortHistory(history, deleted);
        this.random = new Rand.default(`${seed}`);
    }

    abstract doSort(itemArray: SortableItem[], latestChoice: Comparison | null): ComparisonRequest | SortableItem[];

    undo(toUndo: Comparison, itemArray: SortableItem[]): ComparisonRequest | SortableItem[] {
        this.history.undoHistory(toUndo);
        return this.doSort(itemArray, null);
    }

    restart(itemArray: SortableItem[]): ComparisonRequest | SortableItem[] {
        this.history = new SortHistory([], []);
        return this.doSort(itemArray, null);
    }

    deleteItem(itemArray: SortableItem[], toDelete: string): ComparisonRequest | SortableItem[] {
        this.history.deleteHistory(toDelete);
        return this.doSort(itemArray, null)
    }
        
    undeleteItem(itemArray: SortableItem[], toUndelete: string): ComparisonRequest | SortableItem[] {
        this.history.undeleteHistory(toUndelete);
        return this.doSort(itemArray, null)
    }

    compare(itemA: SortableItem, itemB: SortableItem): boolean {
        let choice = this.history.getHistory(itemA, itemB);

        if (choice) {
            if (choice.getIdentifier() === itemA.getIdentifier()) {
                return false;
            }
            else if (choice.getIdentifier() === itemB.getIdentifier()) {
                return true;
            }
            else {
                throw new InternalServerException("Invalid history check.");
            }
        }
        else {
            let comparisonRequest = new ComparisonRequest(itemA, itemB);
            throw new DoneForNow(comparisonRequest);
        }
    }

    abstract getTotalEstimate(itemArray: SortableItem[]): number;

    getCurrentProgress(): number {
        return 0;
    }
}
