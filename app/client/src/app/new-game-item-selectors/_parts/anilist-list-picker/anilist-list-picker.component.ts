import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { GameDataService } from 'src/app/_services/game-data-service';
import { DataLoaderComponent } from '../data-loader-component';
import { CommonModule } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';
import { AnilistMediaUserListLoader } from 'src/app/_data-loaders/anilist-media-user-list-loader';

type ValidLoaders = AnilistMediaUserListLoader;

interface Status {
    status: string,
    displayName: string,
    selected: boolean
}

@Component({
    selector: 'app-anilist-list-picker',
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
    templateUrl: './anilist-list-picker.component.html',
    styleUrl: './anilist-list-picker.component.scss'
})
export class AnilistListPickerComponent extends DataLoaderComponent<ValidLoaders> {
    
    username: string = "";
    getAnime: boolean = true;
    getManga: boolean = true;
    tagPercentMinimum: number = 60;
    statusOptions: Status[] = [
        {
            status: "CURRENT",
            displayName: $localize`:@@anilist-media-picker-status-current:Current`,
            selected: true
        },
        {
            status: "REPEATING",
            displayName: $localize`:@@anilist-media-picker-status-repeating:Repeating`,
            selected: true
        },
        {
            status: "COMPLETED",
            displayName: $localize`:@@anilist-media-picker-status-completed:Completed`,
            selected: true
        },
        {
            status: "PAUSED",
            displayName: $localize`:@@anilist-media-picker-status-paused:Paused`,
            selected: false
        },
        {
            status: "DROPPED",
            displayName: $localize`:@@anilist-media-picker-status-dropped:Dropped`,
            selected: false
        },
        {
            status: "PLANNING",
            displayName: $localize`:@@anilist-media-picker-status-planning:Planning`,
            selected: false
        }
    ];

    constructor(override gameDataService: GameDataService) {
        super(gameDataService);
    }

    allowedToLoadData() {
        return this.username.length > 0 &&
            this.loadingDone &&
            (this.getAnime || this.getManga) &&
            (
                this.statusOptions[0].selected ||
                this.statusOptions[1].selected ||
                this.statusOptions[2].selected ||
                this.statusOptions[3].selected ||
                this.statusOptions[4].selected ||
                this.statusOptions[5].selected
            );
    }

    loadFromList() {
        if (this.dataLoader) {

            let statuses = this.statusOptions.filter((value: Status) => {
                return value.selected;
            }).map((value: Status) => {
                return value.status;
            });

            this.loadingDone = false;
            this.loadingData.emit($localize`:@@loading-text-anilist-list-picker:Loading ${this.username}:username:'s list.`);
            this.dataLoader.getSortables({
                userName: this.username,
                statuses: statuses,
                anime: this.getAnime,
                manga: this.getManga,
                tagPercentMinimum: this.tagPercentMinimum
            }).then(
                (items: SortableObject[]) => {
                    this.emitItems(items);
                },
                (error) => {
                    this.emitItems([]);
                    throw error;
                },
            );
        }
    }
}
