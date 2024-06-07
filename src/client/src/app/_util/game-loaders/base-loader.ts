import { SortableObject } from "src/app/_objects/sortables/sortable";

export abstract class BaseLoader {
    static identifier: string = "generic";
    
    constructor() {}

    abstract addSortablesFromListOfStrings(list: SortableObject[]) : Promise<any>;
    abstract getSortablesFromListOfStrings(list: string[]) : Promise<SortableObject[]>;
}
