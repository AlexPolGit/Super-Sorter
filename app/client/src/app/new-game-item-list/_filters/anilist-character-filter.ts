import { Pipe } from '@angular/core';
import { AnilistCharacterSortable } from 'src/app/_objects/sortables/anilist-character';
import { UserPreferenceService } from 'src/app/_services/user-preferences-service';
import { FilterSettings, ItemListFilter } from './item-list-filter';
import { SortableObjectChoice } from '../item-list.component';

export interface AnilistCharacterFilterSettings extends FilterSettings {
    gender: {
        male: boolean,
        female: boolean,
        other: boolean,
        none: boolean
    };
    age: {
        min?: number,
        max?: number
    };
    favourites: {
        min?: number,
        max?: number
    };
}

@Pipe({
    name: 'anilistCharacterFilter',
    pure: false
})
export class AnilistCharacterFilter extends ItemListFilter {

    constructor(public userPreferenceService: UserPreferenceService) {
        super();
    }

    override transform(characters: SortableObjectChoice<AnilistCharacterSortable>[], filter: AnilistCharacterFilterSettings) {
        if (!characters || !filter) {
            return characters;
        }

        let chars = characters.filter((item: SortableObjectChoice<AnilistCharacterSortable>) => {
            let character: AnilistCharacterSortable = item.item;
        
            if (character.gender === "Male") {
                if (!filter.gender.male) {
                    return false;
                }
            }
            else if (character.gender === "Female") {
                if (!filter.gender.female) {
                    return false;
                }
            }
            else if (character.gender !== null) {
                if (!filter.gender.other) {
                    return false;
                }
            }
            else if (character.gender === null) {
                if (!filter.gender.none) {
                    return false;
                }
            }

            if (character.age) {
                let startingAge = NaN;
                let finalAge = NaN;

                if (character.age.includes("-")) {
                    let split = character.age.split("-");
                    startingAge = parseInt(split[0]);
                    finalAge = parseInt(split[1]);
                    if (Number.isNaN(finalAge)) {
                        finalAge = Number.MAX_SAFE_INTEGER;
                    }
                }
                else if (character.age.toLocaleLowerCase() === "unknown") {
                    startingAge = 0;
                    finalAge = Number.MAX_SAFE_INTEGER;
                }
                else if (character.age.endsWith("s")) {
                    startingAge = parseInt(character.age.replace("s", ""));
                    finalAge = startingAge + 9;
                }
                else if (character.age.endsWith("+")) {   
                    startingAge = parseInt(character.age.replace("+", ""));
                    finalAge = Number.MAX_SAFE_INTEGER;
                }
                else if (character.age.startsWith("~")) {
                    startingAge = parseInt(character.age.replace("~", "")) - 1;
                    finalAge = startingAge + 2;
                }
                else {
                    startingAge = parseInt(character.age);
                    finalAge = startingAge;
                }

                let min = filter.age.min ? filter.age.min : 0;
                let max = filter.age.max ? filter.age.max : Number.MAX_SAFE_INTEGER;

                if (finalAge < min || startingAge > max) {
                    return false;
                }
            }
            else if (filter.age.min || filter.age.max) {
                return false;
            }

            if (character.favourites) {
                if (filter.favourites.min && character.favourites < filter.favourites.min) {
                    return false;
                }

                if (filter.favourites.max && character.favourites > filter.favourites.max) {
                    return false;
                }
            }
            else if (filter.favourites.min || filter.favourites.max) {
                return false;
            }

            return true;
        });

        return chars.sort(
            (itemA: SortableObjectChoice<AnilistCharacterSortable>, itemB: SortableObjectChoice<AnilistCharacterSortable>) => {
                return itemA.item.getDisplayName(this.userPreferenceService.getAnilistLanguage())
                    .localeCompare(itemB.item.getDisplayName(this.userPreferenceService.getAnilistLanguage()));
            }
        );
    }
}