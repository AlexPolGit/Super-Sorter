import { Component, EventEmitter, Output } from '@angular/core';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { GameDataService } from 'src/app/_services/game-data-service';
import { AnilistFavouriteAnimeLoader } from 'src/app/_util/game-loaders/anilist-favourite-anime-loader';
import { AnilistLoader } from 'src/app/_util/game-loaders/anilist-loader';

@Component({
    selector: 'app-new-anilist-anime',
    templateUrl: './new-anilist-anime.component.html',
    styleUrl: './new-anilist-anime.component.scss'
})
export class NewAnilistAnimeComponent {
    anilistFavouriteAnimeLoader: string = AnilistFavouriteAnimeLoader.identifier;
    textboxPlaceholder: string = $localize`:@@new-game-anilist-anime-textbox-placeholder:Enter anime IDs seperated by newlines.`;
    textboxLabel: string = $localize`:@@new-game-anilist-anime-textbox-label:Anime IDs`;
    textboxButtonName: string = $localize`:@@new-game-anilist-anime-textbox-button-name:Load Anime`;

    dataLoader: AnilistLoader;
    currentTab: number = 0;
    
    @Output() chooseData = new EventEmitter<SortableObject[]>();

    constructor(private gameDataService: GameDataService) {
        this.dataLoader = this.gameDataService.getDataLoader(this.anilistFavouriteAnimeLoader) as AnilistLoader;
    }

    setupCurrentAnimeList(anime: SortableObject[]) {
        this.dataLoader.addSortablesFromListOfStrings(anime as SortableObject[]).then(() => {
            this.chooseData.emit(anime);
        });
    }
}
