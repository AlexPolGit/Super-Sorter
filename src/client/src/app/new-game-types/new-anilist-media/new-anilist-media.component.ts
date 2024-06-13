import { Component } from '@angular/core';
import { AnilistMediaLoader } from 'src/app/_util/game-loaders/anilist-media-loader';
import { NewGameTypeComponent } from '../new-game-type.component';

@Component({
    selector: 'app-new-anilist-media',
    templateUrl: './new-anilist-media.component.html',
    styleUrl: './new-anilist-media.component.scss'
})
export class NewAnilistMediaComponent extends NewGameTypeComponent<AnilistMediaLoader> {
    textboxPlaceholder: string = $localize`:@@new-game-anilist-media-textbox-placeholder:Enter anime IDs seperated by newlines.`;
    textboxLabel: string = $localize`:@@new-game-anilist-media-textbox-label:Media IDs`;
    textboxButtonName: string = $localize`:@@new-game-anilist-media-textbox-button-name:Load Media`;
}
