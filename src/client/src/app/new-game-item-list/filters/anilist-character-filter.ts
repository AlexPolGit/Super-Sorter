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
                if (character.age.includes("-")) {
                    let split = character.age.split("-");
                    let startingAge = parseInt(split[0]);
                    let finalAge = parseInt(split[1]);

                    if (filter.age.min && startingAge < filter.age.min) {
                        return false;
                    }

                    if (filter.age.max && finalAge > filter.age.max) {
                        return false;
                    }

                    if (filter.age.max && Number.isNaN(finalAge)) {
                        return false;
                    }
                }
                else {
                    let age = parseInt(character.age);

                    if (filter.age.min && age < filter.age.min) {
                        return false;
                    }

                    if (filter.age.max && age > filter.age.max) {
                        return false;
                    }

                    if (filter.age.max && Number.isNaN(age)) {
                        return false;
                    }
                }
            }
            else if ((filter.age.min || filter.age.max) && (character.age === null || Number.isNaN(parseInt(character.age)))) {
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