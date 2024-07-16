import { Comparison } from "./comparison.js"
import { SortableItem } from "./sortable.js";

export class SortHistory {
    history: Comparison[];
    deleted: Comparison[];

    constructor(history: Comparison[], deleted: Comparison[]) {
        this.history = history;
        this.deleted = deleted;
    }

    findInHistory(itemA: SortableItem, itemB: SortableItem): number {
        for (let i = 0; i < this.history.length; i++) {
            const historicalComparison = this.history[i];
            if (
                historicalComparison.itemA.getIdentifier() == itemA.getIdentifier() &&
                historicalComparison.itemB.getIdentifier() == itemB.getIdentifier()
            ) {
                return i;
            }
            else if (
                historicalComparison.itemA.getIdentifier() == itemB.getIdentifier() &&
                historicalComparison.itemB.getIdentifier() == itemA.getIdentifier()
            ) {
                return i;
            }
        }

        return -1;
    }

    getHistory(itemA: SortableItem, itemB: SortableItem): SortableItem | null {
        let checkExists = this.findInHistory(itemA, itemB);
        return checkExists === -1 ? null : this.history[checkExists].choice;
    }

    addHistory(comparison: Comparison) {
        console.log(comparison);
        console.log(this.history);
        let checkExists = this.findInHistory(comparison.itemA, comparison.itemB);
        if (checkExists !== -1) {
            this.history.push(comparison);
        }
        else {
            console.warn(`Tried to add ${comparison} to history but it already existed.`);
        }
    }

    undoHistory(comparison: Comparison) {
        let checkExists = this.findInHistory(comparison.itemA, comparison.itemB);
        if (checkExists !== -1) {
            this.history.splice(checkExists, 1);
        }
        else {
            console.warn(`Tried to remove ${comparison} from history but it did not exist.`);
        }
    }

    deleteHistory(toDelete: string) {
        let remainders: Comparison[] = [];
        let deletedItems: Comparison[] = [];

        this.history.forEach(item => {
            if (item.itemA.getIdentifier() == toDelete || item.itemB.getIdentifier() == toDelete) {
                deletedItems.push(item);
            }
            else {
                remainders.push(item)
            }   
        });

        this.history = remainders;
        this.deleted = this.deleted.concat(deletedItems);
    }

    undeleteHistory(toUndelete: string) {
        let stayDeleted: Comparison[] = [];
        let bringBack: Comparison[] = [];

        this.deleted.forEach(deletedItem => {
            if (deletedItem.itemA.getIdentifier() == toUndelete || deletedItem.itemB.getIdentifier() == toUndelete) {
                bringBack.push(deletedItem);
            }
            else {
                stayDeleted.push(deletedItem)
            }   
        });

        this.deleted = stayDeleted;
        this.history = this.history.concat(bringBack);
    }
}
