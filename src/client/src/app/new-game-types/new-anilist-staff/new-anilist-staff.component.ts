import { Component } from '@angular/core';
import { AnilistFavouriteStaffLoader } from 'src/app/_util/game-loaders/anilist-favourite-staff-loader';
import { NewGameTypeComponent } from '../new-game-type.component';

@Component({
    selector: 'app-new-anilist-staff',
    templateUrl: './new-anilist-staff.component.html',
    styleUrl: './new-anilist-staff.component.scss'
})
export class NewAnilistStaffComponent extends NewGameTypeComponent<AnilistFavouriteStaffLoader> {
    textboxPlaceholder: string = $localize`:@@new-game-anilist-staff-textbox-placeholder:Enter staff IDs seperated by newlines.`;
    textboxLabel: string = $localize`:@@new-game-anilist-staff-textbox-label:Staff IDs`;
    textboxButtonName: string = $localize`:@@new-game-anilist-staff-textbox-button-name:Load Staff`;
}