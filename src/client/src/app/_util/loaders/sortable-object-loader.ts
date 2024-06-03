import { SortableObject } from "src/app/_objects/sortables/sortable";

export abstract class SortableObjectLoader {
    inputData: any;
    abstract getObjects() : Promise<SortableObject[]>;
}
