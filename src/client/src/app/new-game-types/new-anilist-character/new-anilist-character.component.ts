import { Component, EventEmitter, Output } from '@angular/core';
import { GameDataService } from 'src/app/_services/game-data-service';
import { AnilistFavouriteCharacterLoader } from 'src/app/_util/game-loaders/anilist-favourite-character-loader';
import { SortableObject } from 'src/app/_objects/sortables/sortable';

@Component({
    selector: 'app-new-anilist-character',
    templateUrl: './new-anilist-character.component.html',
    styleUrl: './new-anilist-character.component.scss'
})
export class NewAnilistCharacterComponent {

    dataLoader: AnilistFavouriteCharacterLoader;

    username: string = "";
    favesMin: number = 0;
    favesMax: number = 50000;
    ageMin: number = 0;
    ageMax: number = 999;
    genderMale: boolean = true;
    genderFemale: boolean = true;
    genderOther: boolean = true;

    characterTextbox: string = "";

    currentTab: number = 0;
    
    @Output() chooseData = new EventEmitter<SortableObject[]>();

    constructor(private gameDataService: GameDataService) {
        this.dataLoader = this.gameDataService.getDataLoader(AnilistFavouriteCharacterLoader.identifier) as AnilistFavouriteCharacterLoader;
    }

    setupCurrentCharList(characters: SortableObject[]) {
        this.chooseData.emit(characters);
    }

    loadFromUsername() {
        this.dataLoader.getFavoriteList([], this.username, 0).then((characters: SortableObject[]) => {
            this.setupCurrentCharList(characters);
        });
    }

    async loadFromTextbox() {
        let characters: SortableObject[] = [];
        let lines = this.characterTextbox.split(/\r?\n/);
        for(let i = 0; i < lines.length; i++) {
            characters.push(await this.dataLoader.getCharacter(lines[i]));
        }
        this.chooseData.emit(characters);
    }

    async fileDataLoaded(event: any) {
        let characters: SortableObject[] = [];
        for(let i = 0; i < event.length; i++) {
            characters.push(await this.dataLoader.getCharacter(event[i]));
        }
        this.chooseData.emit(characters);
    }

    sliderValue(value: number): string {
        if (value >= 1000) {
            return Math.round(value / 1000) + 'k';
        }
      
        return `${value}`;
    }
}
