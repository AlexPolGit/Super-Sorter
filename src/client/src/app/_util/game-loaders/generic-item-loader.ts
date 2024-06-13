import { WebService } from "src/app/_services/web-service";
import { GenericSortable } from "src/app/_objects/sortables/generic-item";
import { BaseLoader } from "./base-loader";
import { GenericItem } from "src/app/_objects/server/generic";
import { firstValueFrom } from "rxjs";

export class GenericItemLoader extends BaseLoader {
    static override identifier: string = "generic-items";

    constructor(public webService: WebService) {
        super();
    }

    async addSortablesFromListOfStrings(list: GenericSortable[]) {

        let itemsToAdd: GenericItem[] = [];
        list.forEach((item: GenericSortable) => {
            itemsToAdd.push({
                id: item.id,
                name: item.name,
                image: item.imageUrl,
                metadata: item.metadata
            });
        });

        let itemList = await firstValueFrom(this.webService.postRequest<GenericItem[]>(`generic/items`, {
            items: itemsToAdd
        }));

        let sortables: GenericSortable[] = [];
        itemList.forEach((item: GenericItem) => {
            sortables.push(new GenericSortable(item.id, item.image, item.name, item.metadata));
        });

        return sortables;
    }

    async getSortablesFromListOfStrings(list: string[]): Promise<GenericSortable[]> {

        let itemList = await firstValueFrom(this.webService.postRequest<GenericItem[]>(`generic/items/list`, {
            ids: list
        }));

        let sortables: GenericSortable[] = [];
        itemList.forEach((item: GenericItem) => {
            sortables.push(new GenericSortable(item.id, item.image, item.name, item.metadata));
        });

        return sortables;
    }
}
