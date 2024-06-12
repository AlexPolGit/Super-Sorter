import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { GameDataService } from 'src/app/_services/game-data-service';
import { AnilistLoader } from 'src/app/_util/game-loaders/anilist-loader';
import { DataLoaderComponent } from '../data-loader-component';

@Component({
    selector: 'app-anilist-fave-picker',
    standalone: true,
    imports: [
        MatInputModule,
        MatButtonModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatSliderModule
    ],
    templateUrl: './anilist-fave-picker.component.html',
    styleUrl: './anilist-fave-picker.component.scss'
})
export class AnilistFavePickerComponent extends DataLoaderComponent<AnilistLoader> {

    override dataLoader: AnilistLoader | null = null;

    username: string = "";
    favesMin: number = 0;
    favesMax: number = 50000;
    ageMin: number = 0;
    ageMax: number = 999;
    genderMale: boolean = true;
    genderFemale: boolean = true;
    genderOther: boolean = true;

    constructor(override gameDataService: GameDataService) {
        super(gameDataService);
    }

    loadFromUsername() {
        if (this.dataLoader) {

            this.loadingDone = false;
            this.loadingData.emit($localize`:@@loading-text-anilist-fave-picker:Loading username: ${this.username}:username:`);
            this.dataLoader.getFavoriteList(this.username, [], 1).then((characters: SortableObject[]) => {
                this.chooseData.emit(characters);
            });
        }
    }

    sliderValue(value: number): string {
        if (value >= 1000) {
            return Math.round(value / 1000) + 'k';
        }
      
        return `${value}`;
    }
}
