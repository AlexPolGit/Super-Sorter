import { Component, EventEmitter, Output } from '@angular/core';
import { GenericItem } from 'src/app/_objects/server/generic';
import { GenericSortable } from 'src/app/_objects/sortables/generic-item';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { GameDataService } from 'src/app/_services/game-data-service';
import { BaseLoader } from 'src/app/_util/game-loaders/base-loader';
import { GenericItemLoader } from 'src/app/_util/game-loaders/generic-item-loader';

@Component({
    selector: 'app-new-generic-item',
    templateUrl: './new-generic-item.component.html',
    styleUrl: './new-generic-item.component.scss'
})
export class NewGenericItemComponent {
    genericItemLoader: string = GenericItemLoader.identifier;

    dataLoader: BaseLoader;
    currentTab: number = 0;
    
    @Output() chooseData = new EventEmitter<SortableObject[]>();

    constructor(private gameDataService: GameDataService) {
        this.dataLoader = this.gameDataService.getDataLoader(GenericItemLoader.identifier) as BaseLoader;
    }

    setupCurrentItemList(genericItems: SortableObject[]) {
        this.dataLoader.addSortablesFromListOfStrings(genericItems as SortableObject[]).then((items: GenericItem[]) => {
            let gameItems: GenericSortable[] = items.map((item: GenericItem) => {
                return new GenericSortable(item.id, item.image, item.name, item.metadata);
            });
            this.chooseData.emit(gameItems);
        });
    }
}
