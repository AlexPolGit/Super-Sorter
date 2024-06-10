import { Component, EventEmitter, Output } from '@angular/core';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { GameDataService } from 'src/app/_services/game-data-service';
import { AnilistFavouriteMangaLoader } from 'src/app/_util/game-loaders/anilist-favourite-manga-loader';
import { AnilistLoader } from 'src/app/_util/game-loaders/anilist-loader';

@Component({
    selector: 'app-new-anilist-manga',
    templateUrl: './new-anilist-manga.component.html',
    styleUrl: './new-anilist-manga.component.scss'
})
export class NewAnilistMangaComponent {
    anilistFavouriteMangaLoader: string = AnilistFavouriteMangaLoader.identifier;
    textboxPlaceholder: string = $localize`:@@new-game-anilist-manga-textbox-placeholder:Enter manga IDs seperated by newlines.`;
    textboxLabel: string = $localize`:@@new-game-anilist-manga-textbox-label:Manga IDs`;
    textboxButtonName: string = $localize`:@@new-game-anilist-manga-textbox-button-name:Load Manga`;

    dataLoader: AnilistLoader;
    currentTab: number = 0;
    
    @Output() chooseData = new EventEmitter<SortableObject[]>();

    constructor(private gameDataService: GameDataService) {
        this.dataLoader = this.gameDataService.getDataLoader(this.anilistFavouriteMangaLoader) as AnilistLoader;
    }

    setupCurrentMangaList(manga: SortableObject[]) {
        this.dataLoader.addSortablesFromListOfStrings(manga as SortableObject[]).then(() => {
            this.chooseData.emit(manga);
        });
    }
}
