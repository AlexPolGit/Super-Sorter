import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { GameDataService } from 'src/app/_services/game-data-service';
import { DataLoaderComponent } from '../data-loader-component';
import { AnilistLoader } from 'src/app/_util/game-loaders/anilist-loader';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-anilist-favourites-picker',
    standalone: true,
    imports: [
        CommonModule,
        MatInputModule,
        MatButtonModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatSliderModule
    ],
    templateUrl: './anilist-favourites-picker.component.html',
    styleUrl: './anilist-favourites-picker.component.scss'
})
export class AnilistFavouritesPickerComponent extends DataLoaderComponent<AnilistLoader> {

    override dataLoader: AnilistLoader | null = null;

    username: string = "";
    getAnime: boolean = true;
    getManga: boolean = true;

    constructor(override gameDataService: GameDataService) {
        super(gameDataService);
    }

    allowedToLoadData() {
        return this.username.length > 0 &&
            this.loadingDone &&
            (this.getAnime || this.getManga);
    }

    loadFromFavourites() {
        if (this.dataLoader) {
            this.loadingDone = false;
            this.loadingData.emit($localize`:@@loading-text-anilist-fave-picker:Loading ${this.username}:username:'s favourites.`);
            this.dataLoader.getFavoriteList(this.username, [], 1).then((characters: SortableObject[]) => {
                this.chooseData.emit(characters);
            });
        }
    }
}
