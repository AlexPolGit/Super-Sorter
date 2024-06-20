import { Pipe } from '@angular/core';
import { AnilistCharacterSortable } from 'src/app/_objects/sortables/anilist-character';
import { KeyValue } from '@angular/common';
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
export class AnilistCharacterFilter extends ItemListFilter<AnilistCharacterSortable> {

    constructor(public userPreferenceService: UserPreferenceService) {
        super();
    }

    override transform(characters: KeyValue<string, SortableObjectChoice<AnilistCharacterSortable>>[], filter: AnilistCharacterFilterSettings) {
        if (!characters || !filter) {
            return characters;
        }

        let chars = characters.filter((item: KeyValue<string, SortableObjectChoice<AnilistCharacterSortable>>) => {
            let character: AnilistCharacterSortable = item.value.item;
        
            if (character.gender === "Male") {
                if (!filter.gender.male) {
                    return this.filterOut(item.value);
                }
            }
            else if (character.gender === "Female") {
                if (!filter.gender.female) {
                    return this.filterOut(item.value);
                }
            }
            else if (character.gender !== null) {
                if (!filter.gender.other) {
                    return this.filterOut(item.value);
                }
            }
            else if (character.gender === null) {
                if (!filter.gender.none) {
                    return this.filterOut(item.value);
                }
            }

            if (character.age) {
                if (character.age.includes("-")) {
                    let split = character.age.split("-");
                    let startingAge = parseInt(split[0]);
                    let finalAge = parseInt(split[1]);

                    if (filter.age.min && startingAge < filter.age.min) {
                        return this.filterOut(item.value);
                    }

                    if (filter.age.max && finalAge > filter.age.max) {
                        return this.filterOut(item.value);
                    }

                    if (filter.age.max && Number.isNaN(finalAge)) {
                        return this.filterOut(item.value);
                    }
                }
                else {
                    let age = parseInt(character.age);

                    if (filter.age.min && age < filter.age.min) {
                        return this.filterOut(item.value);
                    }

                    if (filter.age.max && age > filter.age.max) {
                        return this.filterOut(item.value);
                    }

                    if (filter.age.max && Number.isNaN(age)) {
                        return this.filterOut(item.value);
                    }
                }
            }
            else if ((filter.age.min || filter.age.max) && (character.age === null || Number.isNaN(parseInt(character.age)))) {
                return this.filterOut(item.value);
            }

            if (character.favourites) {
                if (filter.favourites.min && character.favourites < filter.favourites.min) {
                    return this.filterOut(item.value);
                }

                if (filter.favourites.max && character.favourites > filter.favourites.max) {
                    return this.filterOut(item.value);
                }
            }
            else if (filter.favourites.min || filter.favourites.max) {
                return this.filterOut(item.value);
            }

            return this.keepItem(item.value);
        });

        return chars.sort(
            (itemA: KeyValue<string, SortableObjectChoice<AnilistCharacterSortable>>, itemB: KeyValue<string, SortableObjectChoice<AnilistCharacterSortable>>) => {
                return itemA.value.item.getDisplayName(this.userPreferenceService.getAnilistLanguage())
                    .localeCompare(itemB.value.item.getDisplayName(this.userPreferenceService.getAnilistLanguage()));
            }
        );
    }
}