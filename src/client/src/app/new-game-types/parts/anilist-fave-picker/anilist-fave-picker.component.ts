import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { GameDataService } from 'src/app/_services/game-data-service';
import { AnilistLoader } from 'src/app/_util/game-loaders/anilist-loader';

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
export class AnilistFavePickerComponent {

    @Input() loaderName: string = "default";
    @Output() chooseData = new EventEmitter<SortableObject[]>();

    dataLoader: AnilistLoader | null = null;

    username: string = "";
    favesMin: number = 0;
    favesMax: number = 50000;
    ageMin: number = 0;
    ageMax: number = 999;
    genderMale: boolean = true;
    genderFemale: boolean = true;
    genderOther: boolean = true;

    constructor(private gameDataService: GameDataService) {}

    ngOnInit() {
        this.dataLoader = this.gameDataService.getDataLoader(this.loaderName) as AnilistLoader;
    }

    loadFromUsername() {
        if (this.dataLoader) {
            this.dataLoader.getFavoriteList(this.username, [], 0).then((characters: SortableObject[]) => {
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
