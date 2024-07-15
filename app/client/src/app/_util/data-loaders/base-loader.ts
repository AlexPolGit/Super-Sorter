import { SortableObject } from "src/app/_objects/sortables/sortable";
import { WebService } from "src/app/_services/web-service";

export abstract class BaseLoader<Type extends SortableObject> {
    static identifier: string = "generic";

    protected dataLoader = this.webService.server.sortable.dataLoaders;
    protected itemLoader = this.webService.server.sortable.sessionItems;
    
    constructor(protected webService: WebService) {}
    
    abstract getSortables(query: any): Promise<Type[]>;
}
