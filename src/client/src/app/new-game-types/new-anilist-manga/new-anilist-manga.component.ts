import { Component } from '@angular/core';
import { AnilistFavouriteMangaLoader } from 'src/app/_util/game-loaders/anilist-favourite-manga-loader';
import { NewGameTypeComponent } from '../new-game-type.component';

@Component({
    selector: 'app-new-anilist-manga',
    templateUrl: './new-anilist-manga.component.html',
    styleUrl: './new-anilist-manga.component.scss'
})
export class NewAnilistMangaComponent extends NewGameTypeComponent<AnilistFavouriteMangaLoader> {
    textboxPlaceholder: string = $localize`:@@new-game-anilist-manga-textbox-placeholder:Enter manga IDs seperated by newlines.`;
    textboxLabel: string = $localize`:@@new-game-anilist-manga-textbox-label:Manga IDs`;
    textboxButtonName: string = $localize`:@@new-game-anilist-manga-textbox-button-name:Load Manga`;
}