import { SortableObject } from "src/app/_objects/sortables/sortable";

export abstract class SortableObjectLoader {
    abstract getObjects(inputData: any) : Promise<SortableObject[]>;
}
