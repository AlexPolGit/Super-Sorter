import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { GameDataService } from 'src/app/_services/game-data-service';
import { SpotfiyPlaylistSongLoader } from '../../../_data-loaders/spotify-playlist-song-loader';
import { SpotfiyAlbumSongLoader } from '../../../_data-loaders/spotify-album-song-loader';
import { DataLoaderComponent } from '../data-loader-component';

type ValidLoaders = SpotfiyPlaylistSongLoader | SpotfiyAlbumSongLoader;

/**
 * Regex for base-62 IDs that spotfiy uses for its IDs.
 * Includes an optional slash at the start and question mark at the end just in case user has copied the whole URL.
 */
export const URL_BASE_62_REGEX = new RegExp("(\/|^)[0-9A-Za-z_-]{22}($|\\?)");

@Component({
    selector: 'app-spotify-playlist-or-album-picker',
    standalone: true,
    imports: [
        CommonModule,
        MatInputModule,
        MatButtonModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule
    ],
    templateUrl: './spotify-playlist-or-album-picker.component.html',
    styleUrl: './spotify-playlist-or-album-picker.component.scss'
})
export class SpotifyPlaylistOrAlbumPickerComponent extends DataLoaderComponent<ValidLoaders> {

    @Input() idLabel: string = "";

    /**
     * Form control for the ID/URL text box.
     */
    idFormControl = new FormControl('', [ Validators.required, this.validateInput ]);

    constructor(override gameDataService: GameDataService) {
        super(gameDataService)
    }

    /**
     * Load Spotify playlist/album songs from inputted ID or URL.
     */
    loadFromId() {
        if (this.dataLoader && this.idFormControl.valid) {
            // We have validated that the input is correct.
            // Take the first match of the regex as the input value.
            let id = ((this.idFormControl.value as string).match(URL_BASE_62_REGEX) as string[])[0];

            // If it had a slash before the first number (ex: in URLs) then remove it.
            id = id.charAt(0) === "/" ? id.substring(1) : id;

            // If it had a question mark at then end (ex: in URLs) then remove it.
            id = id.charAt(id.length - 1) === "?" ? id.substring(0, id.length - 1) : id;

            // Get song list from this playlist/album and send data to parent component.
            this.loadingDone = false;
            this.loadingData.emit($localize`:@@loading-text-spotify-playlist-or-album-picker:Loading Spotify ID: ${id}:id:`);
            this.dataLoader.getSortables(id).then(
                (items: SortableObject[]) => {
                    this.emitItems(items);
                },
                (error) => {
                    this.emitItems([]);
                    throw error;
                }
            );
        }
    }

    /**
     * Validator function for playlist/album IDs and URLs containing playlist/album IDs.
     *
     * @param ctrl - The control containing the value of the text box.
     * @returns Validation error "invalid" if input doesn't match the regex. Null is everything is OK.
     */
    validateInput(ctrl: AbstractControl): ValidationErrors | null {
        const val = ctrl.value as string;
        let match = val.match(URL_BASE_62_REGEX);
        if (match && match.length > 0) {;
            return null;
        }
        else {
            return {
                invalid: true
            }
        }
    }
}
