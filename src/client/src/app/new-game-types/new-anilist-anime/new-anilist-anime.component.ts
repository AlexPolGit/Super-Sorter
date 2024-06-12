import { Component } from '@angular/core';
import { AnilistFavouriteAnimeLoader } from 'src/app/_util/game-loaders/anilist-favourite-anime-loader';
import { NewGameTypeComponent } from '../new-game-type.component';

@Component({
    selector: 'app-new-anilist-anime',
    templateUrl: './new-anilist-anime.component.html',
    styleUrl: './new-anilist-anime.component.scss'
})
export class NewAnilistAnimeComponent extends NewGameTypeComponent<AnilistFavouriteAnimeLoader> {
    textboxPlaceholder: string = $localize`:@@new-game-anilist-anime-textbox-placeholder:Enter anime IDs seperated by newlines.`;
    textboxLabel: string = $localize`:@@new-game-anilist-anime-textbox-label:Anime IDs`;
    textboxButtonName: string = $localize`:@@new-game-anilist-anime-textbox-button-name:Load Anime`;
}