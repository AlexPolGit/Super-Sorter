
import { ComparisonRequestDto, UserChoice } from "@sorter/api";
import { BaseException } from "../exceptions/base.js";
import { SortableItem } from "./sortable.js";

export class InvalidComparisonException extends BaseException {
    constructor(comparsion: ComparisonRequest | Comparison) {
        super("INTERNAL_SERVER_ERROR", `Invalid comparison: ${comparsion}`);
    }
}

export class ComparisonRequest {
    itemA: SortableItem;
    itemB: SortableItem;

    constructor(itemA: SortableItem, itemB: SortableItem) {
        this.itemA = itemA;
        this.itemB = itemB;
        
        if (this.itemA.getIdentifier() === this.itemB.getIdentifier()) {
            throw new InvalidComparisonException(this);
        }
    }

    toString(): string {
        return `${this.itemA.getIdentifier()},${this.itemB.getIdentifier()}`;
    }

    toDto(): ComparisonRequestDto {
        return {
            itemA: this.itemA.getIdentifier(),
            itemB: this.itemA.getIdentifier()
        }
    }

    static fromString(stringRep: string): ComparisonRequest {
        let parts = stringRep.split(",");
        return new ComparisonRequest(new SortableItem(parts[0]), new SortableItem(parts[1]));
    }
}

export class Comparison extends ComparisonRequest {
    choice: SortableItem;

    constructor(itemA: SortableItem, itemB: SortableItem, choice: SortableItem) {
        super(itemA, itemB);
        this.choice = choice;
        
        if ((this.choice.getIdentifier() !== this.itemA.getIdentifier()) && (this.choice.getIdentifier() !== this.itemB.getIdentifier())) {
            throw new InvalidComparisonException(this);
        }
    }

    override toString(): string {
        return `${this.itemA.getIdentifier()},${this.itemB.getIdentifier()},${this.choice.getIdentifier()}`;
    }

    static override fromString(stringRep: string): Comparison {
        let parts = stringRep.split(",");
        return new Comparison(new SortableItem(parts[0]), new SortableItem(parts[1]), new SortableItem(parts[2]));
    }

    static fromUserChoice(choice: UserChoice | null): Comparison | null {
        if (choice) {
            return new Comparison(new SortableItem(choice.itemA), new SortableItem(choice.itemB), new SortableItem(choice.choice));
        }
        else {
            return null;
        }
    }
}
