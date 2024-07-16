import { Component } from '@angular/core';
import { NewGameTypeComponent } from '../new-game-type.component';
import { AnilistCharacterFaveListLoader } from 'src/app/_data-loaders/anilist-character-fave-list-loader';
import { AnilistCharacterIdLoader } from 'src/app/_data-loaders/anilist-character-id-loader';

@Component({
    selector: 'app-new-anilist-character',
    templateUrl: './new-anilist-character.component.html',
    styleUrl: './new-anilist-character.component.scss'
})
export class NewAnilistCharacterComponent extends NewGameTypeComponent {
    textboxPlaceholder: string = $localize`:@@new-game-anilist-char-textbox-placeholder:Enter character IDs seperated by newlines.`;
    textboxLabel: string = $localize`:@@new-game-anilist-char-textbox-label:Chatacter IDs`;
    textboxButtonName: string = $localize`:@@new-game-anilist-char-textbox-button-name:Load Characters`;

    anilistCharacterFaveListLoader = this.gameDataService.getDataLoader(AnilistCharacterFaveListLoader.identifier) as AnilistCharacterFaveListLoader;
    anilistCharacterIdLoader = this.gameDataService.getDataLoader(AnilistCharacterIdLoader.identifier) as AnilistCharacterIdLoader;
}
