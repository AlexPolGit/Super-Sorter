import { Component, EventEmitter, Output } from '@angular/core';
import { GameDataService } from 'src/app/_services/game-data-service';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { AnilistLoader } from 'src/app/_util/game-loaders/anilist-loader';
import { AnilistFavouriteCharacterLoader } from 'src/app/_util/game-loaders/anilist-favourite-character-loader';

@Component({
    selector: 'app-new-anilist-character',
    templateUrl: './new-anilist-character.component.html',
    styleUrl: './new-anilist-character.component.scss'
})
export class NewAnilistCharacterComponent {
    anilistFavouriteCharacterLoader: string = AnilistFavouriteCharacterLoader.identifier;
    textboxPlaceholder: string = $localize`:@@new-game-anilist-char-textbox-placeholder:Enter character IDs seperated by newlines.`;
    textboxLabel: string = $localize`:@@new-game-anilist-char-textbox-label:Chatacter IDs`;
    textboxButtonName: string = $localize`:@@new-game-anilist-char-textbox-button-name:Load Characters`;

    dataLoader: AnilistLoader;
    currentTab: number = 0;
    
    @Output() chooseData = new EventEmitter<SortableObject[]>();

    constructor(private gameDataService: GameDataService) {
        this.dataLoader = this.gameDataService.getDataLoader(this.anilistFavouriteCharacterLoader) as AnilistLoader;
    }

    setupCurrentCharList(characters: SortableObject[]) {
        this.dataLoader.addSortablesFromListOfStrings(characters as SortableObject[]).then(() => {
            this.chooseData.emit(characters);
        });
    }
}
