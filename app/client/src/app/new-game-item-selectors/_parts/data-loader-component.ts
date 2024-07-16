import { Component, EventEmitter, Input, Output } from "@angular/core";
import { SortableObject } from "src/app/_objects/sortables/sortable";
import { GameDataService } from "src/app/_services/game-data-service";
import { BaseLoader } from "src/app/_data-loaders/base-loader";

@Component({
    selector: 'data-loader-component',
    template: ``
})
export class DataLoaderComponent<Loader extends BaseLoader<SortableObject>> {
    /**
     * Data loader that will be used to load sortable items.
     */
    @Input() dataLoader: Loader | null = null;
    
    /**
     * Keep track if we are currently loading data.
     */
    @Input() loadingDone: boolean = true;

    /**
     * Show pre-filters for media type?
     * Default is false since most children components will not need this.
     */
    @Input() mediaTypeFilter: boolean = false;

    /**
     * Emitter for when the component has loaded data.
     */
    @Output() chooseData = new EventEmitter<SortableObject[]>();

    /**
     * Emitter for letting the parent component know we started loading data.
     */
    @Output() loadingData = new EventEmitter<string>();

    constructor(public gameDataService: GameDataService) {}

    /**
     * Emit loaded data to parent component.
     */
    emitItems(items: SortableObject[]) {
        this.chooseData.emit(items);
        this.loadingDone = true;
    }
}
