import { SortableItemTypes } from "@sorter/api/src/objects/sortables.js";
import { SessionData } from "../../database/session-database.js";
import { BaseException } from "../exceptions/base.js";
import { getSortingAlgorithm } from "../sort-manager.js";
import { Sorter } from "../sorters/sorter.js";
import { Comparison } from "./comparison.js";
import { SortableItem } from "./sortable.js";

class ItemNotFoundException extends BaseException {
    constructor(id: string) {
        super("NOT_FOUND", `Item not found: ${id}.`);
    }
}

export class Session {
    id: string;
    owner: string;
    name: string;
    type: SortableItemTypes;
    algorithm: string;
    seed: number;

    items: SortableItem[];
    deleted_items: SortableItem[];
    history: Comparison[];
    deleted_history: Comparison[];
    
    sorter: Sorter;

    constructor(
        id: string,
        owner: string,
        name: string,
        type: string,
        items: string = "[]",
        deleted_items: string = "[]",
        history: string = "[]",
        deleted_history: string = "[]",
        algorithm: string = "queue-merge",
        seed: number = -1
    ) {
        this.id = id;
        this.owner = owner;
        this.name = name;
        this.type = SortableItemTypes[type as keyof typeof SortableItemTypes];
        this.algorithm = algorithm;
        this.seed = seed;

        this.items = this.__parseItems(JSON.parse(items));
        this.deleted_items = this.__parseItems(JSON.parse(deleted_items));
        this.history = this.__parseComparisons(JSON.parse(history));
        this.deleted_history = this.__parseComparisons(JSON.parse(deleted_history));

        this.sorter = getSortingAlgorithm(this.algorithm, this.history, this.deleted_history, this.seed);
    }

    runIteration(userChoice: Comparison | null = null) {
        return this.sorter.doSort(this.items, userChoice);
    }

    undo(toUndo: Comparison) {
        return this.sorter.undo(toUndo, this.items);
    }

    restart() {
        this.items = this.items.concat(this.deleted_items);
        this.deleted_items = [];
        return this.sorter.restart(this.items);
    }

    delete(toDelete: string) {
        let deleteIndex = -1;
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].getIdentifier() === toDelete) {
                deleteIndex = i;
                break;
            }
        }

        if (deleteIndex === -1) {
            throw new ItemNotFoundException(toDelete);
        }

        this.deleted_items.push(this.items.splice(deleteIndex, 1)[0]);
        return this.sorter.deleteItem(this.items, toDelete);
    }

    undoDelete(toUndelete: string) {
        let undeleteIndex = -1;
        for (let i = 0; i < this.deleted_items.length; i++) {
            if (this.deleted_items[i].getIdentifier() === toUndelete) {
                undeleteIndex = i;
                break;
            }
        }

        if (undeleteIndex === -1) {
            throw new ItemNotFoundException(toUndelete);
        }

        this.items.push(this.deleted_items.splice(undeleteIndex, 1)[0]);
        return this.sorter.undeleteItem(this.items, toUndelete);
    }
    
    static fromDatabase(row: SessionData) {
        return new Session(
            row.id,
            row.owner,
            row.name,
            row.type,
            row.items,
            row.deleted_items,
            row.history,
            row.deleted_history,
            row.algorithm,
            row.seed
        );
    }

    currentState() {
        return {
            id: this.id,
            items: JSON.stringify(this.items.map(item => item.getIdentifier())),
            deleted_items: JSON.stringify(this.deleted_items.map(item => item.getIdentifier())),
            history: JSON.stringify(this.history.map(item => item.toString())),
            deleted_history: JSON.stringify(this.deleted_history.map(item => item.toString()))
        };
    }

    fullState() {
        return {
            id: this.id,
            owner: this.owner,
            name: this.name,
            type: this.type,
            items: this.items.map(item => item.getIdentifier()),
            deleted_items: this.deleted_items.map(item => item.getIdentifier()),
            history: this.history.map(item => item.toString()),
            deleted_history: this.deleted_history.map(item => item.toString()),
            algorithm: this.algorithm,
            seed: this.seed
        };
    }

    private __parseItems(itemStrings: string[]): SortableItem[] {
        return itemStrings.map(item => {
            return new SortableItem(item);
        });
    }

    private __parseComparisons(itemStrings: string[]): Comparison[] {
        return itemStrings.map(item => {
            return Comparison.fromString(item);
        });
    }
}
