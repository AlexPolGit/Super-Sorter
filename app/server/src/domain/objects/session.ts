import { SortableItemTypes, ComparisonRequestDto, FullSessionDto, MinSessionDto } from "@sorter/api";
import { SessionData } from "../../database/session-database.js";
import { BaseException } from "../exceptions/base.js";
import { getSortingAlgorithm } from "../sort-manager.js";
import { IterationResult, Sorter } from "../sorters/sorter.js";
import { Comparison, ComparisonRequest } from "./comparison.js";
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
        this.type = type as SortableItemTypes;
        this.algorithm = algorithm;
        this.seed = seed;

        this.items = this.__parseItems(JSON.parse(items));
        this.deleted_items = this.__parseItems(JSON.parse(deleted_items));
        this.history = this.__parseComparisons(JSON.parse(history));
        this.deleted_history = this.__parseComparisons(JSON.parse(deleted_history));

        this.sorter = getSortingAlgorithm(this.algorithm, this.history, this.deleted_history, this.seed);
    }

    getFullData(): FullSessionDto {
        const iterationResult = this.sorter.doSort(this.items, null);
        return this.fullState(iterationResult);
    }

    runIteration(userChoice: Comparison | null = null): MinSessionDto {
        const iterationResult = this.sorter.doSort(this.items, userChoice);
        return this.minState(iterationResult);
    }

    undo(toUndo: Comparison): FullSessionDto {
        const undoResult = this.sorter.undo(toUndo, this.items);
        return this.fullState(undoResult);
    }

    restart(): FullSessionDto {
        this.items = this.items.concat(this.deleted_items);
        this.deleted_items = [];
        this.history = [];
        this.deleted_history = [];
        const restartResult = this.sorter.restart(this.items);
        return this.fullState(restartResult);
    }

    delete(toDelete: string): FullSessionDto {
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
        const deleteResult = this.sorter.deleteItem(this.items, toDelete);
        return this.fullState(deleteResult);
    }

    undoDelete(toUndelete: string): FullSessionDto {
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
        const undeleteResult = this.sorter.undeleteItem(this.items, toUndelete);
        return this.fullState(undeleteResult);
    }
    
    static fromDatabase(row: SessionData): Session {
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

    private getCurrentChoiceDto(currentResult: IterationResult): string[] | ComparisonRequestDto {
        if (currentResult instanceof ComparisonRequest) {
            return {
                itemA: currentResult.itemA.getIdentifier(),
                itemB: currentResult.itemB.getIdentifier()
            };
        }
        else {
            return currentResult.map((item: SortableItem) => item.getIdentifier());
        }
    }

    getCurrentState() {
        return {
            id: this.id,
            items: JSON.stringify(this.items.map(item => item.getIdentifier())),
            deleted_items: JSON.stringify(this.deleted_items.map(item => item.getIdentifier())),
            history: JSON.stringify(this.history.map(item => item.toString())),
            deleted_history: JSON.stringify(this.deleted_history.map(item => item.toString()))
        };
    }

    private minState(currentResult: IterationResult): MinSessionDto {
        const choiceOrResult = this.getCurrentChoiceDto(currentResult);

        let sessionData: MinSessionDto = {
            sessionId: this.id,
            progress: this.sorter.getCurrentProgress()
        };

        if ('itemA' in choiceOrResult && 'itemB' in choiceOrResult) {
            sessionData.choice = choiceOrResult;
        }
        else {
            sessionData.result = choiceOrResult;
        }

        return sessionData;
    }

    private fullState(currentResult: IterationResult): FullSessionDto {
        let minSessionData = this.minState(currentResult);
 
        let sessionData: FullSessionDto = {
            sessionId: this.id,
            owner: this.owner,
            name: this.name,
            type: this.type,
            items: this.items.map(item => item.getIdentifier()),
            deleted_items: this.deleted_items.map(item => item.getIdentifier()),
            history: this.history.map(item => item.toString()),
            deleted_history: this.deleted_history.map(item => item.toString()),
            algorithm: this.algorithm,
            seed: this.seed,
            totalEstimate: this.sorter.getTotalEstimate(),
            progress: minSessionData.progress
        };

        if ('choice' in minSessionData) {
            sessionData.choice = minSessionData.choice;
        }
        else {
            sessionData.result = minSessionData.result;
        }

        return sessionData;
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
