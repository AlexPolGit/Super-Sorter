import { SortableItemDto, SortableItemTypes, SortableObjectData } from "@sorter/api";

export class SortableObject {
    type = "generic-items" as SortableItemTypes;
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

    getSubDisplayName(language?: string): string | null {
        return null;
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
