import { Component, EventEmitter, Output } from '@angular/core';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { GameDataService } from '../_services/game-data-service';

@Component({
    selector: 'new-game-type-component',
    template: ``
})
export abstract class NewGameTypeComponent {
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

    constructor(public gameDataService: GameDataService) {}

    startLoadingData(event: any) {
        this.loadingData.emit(event);
    }

    setupCurrentList(songs: SortableObject[]) {
        this.chooseData.emit(songs);
    }
}
