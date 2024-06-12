import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { BaseLoader } from '../_util/game-loaders/base-loader';
import { InterfaceError } from '../_objects/custom-error';

@Component({
    selector: 'new-game-type-component',
    template: ``
})
export abstract class NewGameTypeComponent<Loader extends BaseLoader> {
    /**
     * Data loader that will be used to load sortable items.
     */
    @Input() dataLoader: Loader | null = null;
    
    /**
     * Emitter for giving the parent component our loaded data.
     */
    @Output() chooseData = new EventEmitter<SortableObject[]>();

    /**
     * Emitter for letting the parent component know we started loading data.
     */
    @Output() loadingData = new EventEmitter<string>();

    currentTab: number = 0;
    loadingDone: boolean = true;

    startLoadingData(event: any) {
        this.loadingData.emit(event);
    }

    setupCurrentList(songs: SortableObject[]) {
        if (this.dataLoader) {
            this.loadingDone = false;
            this.dataLoader.addSortablesFromListOfStrings(songs as SortableObject[]).then(() => {
                this.chooseData.emit(songs);
                this.loadingDone = true;
            });
        }
        else {
            throw new InterfaceError("Data loader not found.", "No Data Loader");
        }
    }
}
