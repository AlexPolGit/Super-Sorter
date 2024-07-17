import Rand from "rand-seed";
import { InternalServerException } from "../exceptions/base.js";
import { SortableItem } from "../objects/sortable.js";
import { Comparison, ComparisonRequest } from "../objects/comparison.js";
import { SortHistory } from "../objects/sort-history.js";
import { AlgorithmTypes } from "@sorter/api/src/objects/session.js";
import { getRNG } from "../../util/logic.js";

export type IterationResult = SortableItem[] | ComparisonRequest;

export class DoneForNow extends Error {
    comparisonRequest: ComparisonRequest;

    constructor(comparisonRequest: ComparisonRequest) {
        super();
        this.comparisonRequest = comparisonRequest;
    }
}

export abstract class Sorter {
    static SORT_NAME: AlgorithmTypes;
    history: SortHistory;
    compareTracker: number = -1;
    random: () => number;

    constructor(history: Comparison[] = [], deleted: Comparison[] = [], seed: number = 0) {
        this.history = new SortHistory(history, deleted);
        this.random = getRNG(seed);
    }

    abstract doSort(itemArray: SortableItem[], latestChoice: Comparison | null): IterationResult;

    undo(toUndo: Comparison, itemArray: SortableItem[]): IterationResult {
        this.history.undoHistory(toUndo);
        return this.doSort(itemArray, null);
    }

    restart(itemArray: SortableItem[]): IterationResult {
        this.history = new SortHistory([], []);
        return this.doSort(itemArray, null);
    }

    deleteItem(itemArray: SortableItem[], toDelete: string): IterationResult {
        this.history.deleteHistory(toDelete);
        return this.doSort(itemArray, null)
    }
        
    undeleteItem(itemArray: SortableItem[], toUndelete: string): IterationResult {
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

    abstract getTotalEstimate(): number;
    abstract getCurrentProgress(): number;
}
