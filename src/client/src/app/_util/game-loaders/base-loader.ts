import { SortableObject } from "src/app/_objects/sortables/sortable";

export abstract class BaseLoader {
    static identifier: string = "generic";
    
    constructor() {}

    abstract setupGame(startingData: NonNullable<any>): Promise<SortableObject[]>;
    abstract addSortablesFromListOfStrings(list: SortableObject[]) : Promise<void>;
    abstract getSortablesFromListOfStrings(list: string[]) : Promise<SortableObject[]>;
}
