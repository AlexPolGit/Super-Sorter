import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { GameDataService } from 'src/app/_services/game-data-service';
import { DataLoaderComponent } from '../data-loader-component';
import { CommonModule } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';
import { SteamUserGameLoader } from 'src/app/_data-loaders/steam-user-game-loader';

type ValidLoaders = SteamUserGameLoader;

export const STEAM_USER_URL_REGEX = new RegExp("(id|profiles)\/[^\/]*(\/|$)");
export const IS_URL_REGEX = new RegExp("(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})");

export function validateInput(value: string): boolean {
    const isUrl = value.match(IS_URL_REGEX);
    if (isUrl && isUrl.length > 0) {
        const user = value.match(STEAM_USER_URL_REGEX);
        if (user && user.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return true;
    }
}

export function extractSteamUser(input: string): string {
    const isUrl = input.match(IS_URL_REGEX);
    if (isUrl && isUrl.length > 0) {
        let user = (input.match(STEAM_USER_URL_REGEX) as string[])[0];

        user = user.startsWith("id/") ? user.substring(3) : user;
        user = user.startsWith("profiles/") ? user.substring(3) : user;
        user = user.endsWith("/")? user.substring(0, user.length - 1) : user;
    
        return user;
    }
    else {
        return input;
    }
}

@Component({
    selector: 'app-steam-library-picker',
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
    templateUrl: './steam-library-picker.component.html',
    styleUrl: './steam-library-picker.component.scss'
})
export class SteamLibraryPickerComponent extends DataLoaderComponent<ValidLoaders> {

    userFormControl = new FormControl('', [ Validators.required, this.validateInput ]);

    constructor(override gameDataService: GameDataService) {
        super(gameDataService);
    }

    loadFromLibrary() {
        if (this.dataLoader && this.userFormControl.valid) {
            const steamUser = extractSteamUser(this.userFormControl.value as string);

            this.loadingDone = false;
            this.loadingData.emit($localize`:@@loading-text-steam-library-picker:Loading ${steamUser}:steamUser:'s list.`);
            this.dataLoader.getSortables(steamUser).then(
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

    validateInput(ctrl: AbstractControl): ValidationErrors | null {
        if (validateInput(ctrl.value as string)) {
            return null;
        }
        else {
            return {
                invalid: true
            }
        }
    }
}
