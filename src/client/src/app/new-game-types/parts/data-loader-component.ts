import { Component, EventEmitter, Input, Output } from "@angular/core";
import { SortableObject } from "src/app/_objects/sortables/sortable";
import { GameDataService } from "src/app/_services/game-data-service";
import { BaseLoader } from "src/app/_util/game-loaders/base-loader";

@Component({
    selector: 'data-loader-component',
    template: ``
})
export class DataLoaderComponent<Loader extends BaseLoader> {
    /**
     * Data loader that will be used to load sortable items.
     */
    @Input() dataLoader: Loader | null = null;
    
    /**
     * Keep track if we are currently loading data.
     */
    @Input() loadingDone: boolean = true;

    /**
     * Emitter for when the component has loaded data.
     */
    @Output() chooseData = new EventEmitter<SortableObject[]>();

    /**
     * Emitter for letting the parent component know we started loading data.
     */
    @Output() loadingData = new EventEmitter<string>();

    constructor(public gameDataService: GameDataService) {}
}