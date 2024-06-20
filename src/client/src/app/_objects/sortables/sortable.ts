export class SortableObject {
    id: string;
    imageUrl: string;

    constructor(id?: string, imageUrl?: string) {
        this.id = id ? `${id}` : "";
        this.imageUrl = imageUrl ? imageUrl : "";
    }

    getRepresentor(): string {
        return this.id;
    }

    getDisplayName(language?: string): string {
        return this.id;
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
}
