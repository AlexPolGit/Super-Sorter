import { SortableItemDto, SortableItemTypes } from "@sorter/api/src/objects/sortable";
import { SortableObjectData } from "@sorter/api/src/objects/sortables/sortable";

export abstract class SortableObject {
    abstract type: SortableItemTypes;
    id: string;
    imageUrl: string;

    constructor(dto: SortableItemDto<SortableObjectData>) {
        this.id = dto.id;
        this.imageUrl = dto.data.imageUrl;
    }

    getRepresentor(): string {
        return this.id;
    }

    getDisplayName(language?: string): string {
        return this.id;
    }

    getDetailedDisplayName(language?: string): string {
        return this.getDisplayName(language);
    }

    getLink(): string | null {
        return null;
    }

    export(language?: string): string {
        return this.getDisplayName(language);
    }

    getAudio(): string | null {
        return null;
    }

    nameContainsSubstring(substring: string, language?: string): boolean {
        return this.getDisplayName(language).toLocaleUpperCase().includes(substring.toLocaleUpperCase());
    }
}
