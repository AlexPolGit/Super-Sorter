import { Component } from '@angular/core';
import { NewGameTypeComponent } from '../new-game-type.component';
import { AnilistStaffFaveListLoader } from 'src/app/_util/data-loaders/anilist-staff-fave-list-loader';
import { AnilistStaffIdLoader } from 'src/app/_util/data-loaders/anilist-staff-id-loader';

@Component({
    selector: 'app-new-anilist-staff',
    templateUrl: './new-anilist-staff.component.html',
    styleUrl: './new-anilist-staff.component.scss'
})
export class NewAnilistStaffComponent extends NewGameTypeComponent {
    textboxPlaceholder: string = $localize`:@@new-game-anilist-staff-textbox-placeholder:Enter staff IDs seperated by newlines.`;
    textboxLabel: string = $localize`:@@new-game-anilist-staff-textbox-label:Staff IDs`;
    textboxButtonName: string = $localize`:@@new-game-anilist-staff-textbox-button-name:Load Staff`;

    anilistStaffFaveListLoader = this.gameDataService.getDataLoader(AnilistStaffFaveListLoader.identifier) as AnilistStaffFaveListLoader;
    anilistStaffIdLoader = this.gameDataService.getDataLoader(AnilistStaffIdLoader.identifier) as AnilistStaffIdLoader;
}