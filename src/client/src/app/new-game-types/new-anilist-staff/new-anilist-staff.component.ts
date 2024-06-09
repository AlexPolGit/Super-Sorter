import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { GameDataService } from 'src/app/_services/game-data-service';
import { AnilistFavouriteStaffLoader } from 'src/app/_util/game-loaders/anilist-favourite-staff-loader';
import { AnilistLoader } from 'src/app/_util/game-loaders/anilist-loader';

@Component({
    selector: 'app-new-anilist-staff',
    templateUrl: './new-anilist-staff.component.html',
    styleUrl: './new-anilist-staff.component.scss'
})
export class NewAnilistStaffComponent {
    anilistFavouriteStaffLoader: string = AnilistFavouriteStaffLoader.identifier;
    textboxPlaceholder: string = $localize`:@@new-game-anilist-staff-textbox-placeholder:Enter staff IDs seperated by newlines.`;
    textboxLabel: string = $localize`:@@new-game-anilist-staff-textbox-label:Staff IDs`;
    textboxButtonName: string = $localize`:@@new-game-anilist-staff-textbox-button-name:Load Staff`;

    dataLoader: AnilistLoader;
    currentTab: number = 0;
    
    @Output() chooseData = new EventEmitter<SortableObject[]>();

    constructor(private gameDataService: GameDataService) {
        this.dataLoader = this.gameDataService.getDataLoader(AnilistFavouriteStaffLoader.identifier) as AnilistLoader;
    }

    setupCurrentStaffList(staff: SortableObject[]) {
        this.dataLoader.addSortablesFromListOfStrings(staff as SortableObject[]).then(() => {
            this.chooseData.emit(staff);
        });
    }
}
