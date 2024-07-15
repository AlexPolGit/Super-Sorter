import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { GameDataService } from 'src/app/_services/game-data-service';
import { SpotfiyPlaylistSongLoader } from 'src/app/_util/data-loaders/spotify-playlist-song-loader';
import { DataLoaderComponent } from '../data-loader-component';
import { CustomError, UserError } from 'src/app/_objects/custom-error';

type ValidLoaders = SpotfiyPlaylistSongLoader;

/**
 * Regex for base-62 IDs that spotfiy uses for its playlists.
 * Includes an optional slash at the start and question mark at the end just in case user has copied the whole URL.
 */
export const URL_BASE_62_REGEX = new RegExp("(\/|^)[0-9A-Za-z_-]{22}($|\\?)");

@Component({
    selector: 'app-spotify-playlist-picker',
    standalone: true,
    imports: [
        CommonModule,
        MatInputModule,
        MatButtonModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule
    ],
    templateUrl: './spotify-playlist-picker.component.html',
    styleUrl: './spotify-playlist-picker.component.scss'
})
export class SpotifyPlaylistPickerComponent extends DataLoaderComponent<ValidLoaders> {

    /**
     * Form control for the playlist ID/URL text box.
     */
    playlistIdFormControl = new FormControl('', [ Validators.required, this.validateInput ]);

    constructor(override gameDataService: GameDataService) {
        super(gameDataService)
    }

    /**
     * Load Spotify playlist songs from inputted playlist ID or URL.
     */
    loadFromPlaylistId() {
        if (this.dataLoader && this.playlistIdFormControl.valid) {
            // We have validated that the input is correct.
            // Take the first match of the regex as the input value.
            let playlistId = ((this.playlistIdFormControl.value as string).match(URL_BASE_62_REGEX) as string[])[0];

            // If it had a slash before the first number (ex: in URLs) then remove it.
            playlistId = playlistId.charAt(0) === "/" ? playlistId.substring(1) : playlistId;

            // If it had a question mark at then end (ex: in URLs) then remove it.
            playlistId = playlistId.charAt(playlistId.length - 1) === "?" ? playlistId.substring(0, playlistId.length - 1) : playlistId;

            // Get song list from this playlist and send data to parent component.
            this.loadingDone = false;
            this.loadingData.emit($localize`:@@loading-text-spotify-playlist-picker:Loading playlist: ${playlistId}:playlist-id:`);
            this.dataLoader.getSortables(playlistId).then(
                (items: SortableObject[]) => {
                    this.chooseData.emit(items);
                },
                (error: CustomError) => {
                    this.chooseData.emit([]);
                    if (error.status === 404) {
                        throw new UserError(
                            $localize`:@@spotify-error-missing-playlist-desc:This Spotify playlist does not exist.`,
                            $localize`:@@spotify-error-missing-playlist-title:Missing Spotify Playlist`,
                            404
                        );
                    }
                    else {
                        throw error;
                    }
                }
            );
        }
    }

    /**
     * Validator function for playlist IDs and URLs containing playlist IDs.
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
