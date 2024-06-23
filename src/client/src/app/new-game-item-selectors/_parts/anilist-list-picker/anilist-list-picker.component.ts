import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { GameDataService } from 'src/app/_services/game-data-service';
import { DataLoaderComponent } from '../data-loader-component';
import { AnilistLoader, UserMediaStatus } from 'src/app/_util/game-loaders/anilist-loader';
import { CommonModule } from '@angular/common';

interface Status {
    status: UserMediaStatus,
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
        MatCheckboxModule
    ],
    templateUrl: './anilist-list-picker.component.html',
    styleUrl: './anilist-list-picker.component.scss'
})
export class AnilistListPickerComponent extends DataLoaderComponent<AnilistLoader> {

    override dataLoader: AnilistLoader | null = null;

    username: string = "";
    getAnime: boolean = true;
    getManga: boolean = true;
    statusOptions: Status[] = [
        {
            status: UserMediaStatus.CURRENT,
            displayName: $localize`:@@anilist-media-picker-status-current:Current`,
            selected: true
        },
        {
            status: UserMediaStatus.REPEATING,
            displayName: $localize`:@@anilist-media-picker-status-repeating:Repeating`,
            selected: true
        },
        {
            status: UserMediaStatus.COMPLETED,
            displayName: $localize`:@@anilist-media-picker-status-completed:Completed`,
            selected: true
        },
        {
            status: UserMediaStatus.PAUSED,
            displayName: $localize`:@@anilist-media-picker-status-paused:Paused`,
            selected: false
        },
        {
            status: UserMediaStatus.DROPPED,
            displayName: $localize`:@@anilist-media-picker-status-dropped:Dropped`,
            selected: false
        },
        {
            status: UserMediaStatus.PLANNING,
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
                return UserMediaStatus[value.status];
            });

            this.loadingDone = false;
            this.loadingData.emit($localize`:@@loading-text-anilist-list-picker:Loading ${this.username}:username:'s list.`);
            this.dataLoader.getUserList(this.username, statuses, this.getAnime, this.getManga, [], 1).then(
                (items: SortableObject[]) => {
                    this.chooseData.emit(items);
                },
                (error) => {
                    this.chooseData.emit([]);
                    throw error;
                },
            );
        }
    }
}
