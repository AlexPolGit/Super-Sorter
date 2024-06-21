import { Component } from '@angular/core';
import { AnilistStaffLoader } from 'src/app/_util/game-loaders/anilist-staff-loader';
import { NewGameTypeComponent } from '../new-game-type.component';

@Component({
    selector: 'app-new-anilist-staff',
    templateUrl: './new-anilist-staff.component.html',
    styleUrl: './new-anilist-staff.component.scss'
})
export class NewAnilistStaffComponent extends NewGameTypeComponent<AnilistStaffLoader> {
    textboxPlaceholder: string = $localize`:@@new-game-anilist-staff-textbox-placeholder:Enter staff IDs seperated by newlines.`;
    textboxLabel: string = $localize`:@@new-game-anilist-staff-textbox-label:Staff IDs`;
    textboxButtonName: string = $localize`:@@new-game-anilist-staff-textbox-button-name:Load Staff`;
}