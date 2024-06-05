export class SortableObject {
    id: string;
    imageUrl: string;

    constructor(id?: string, imageUrl?: string) {
        this.id = id ? id : "";
        this.imageUrl = imageUrl ? imageUrl : "";
    }

    getRepresentor(): string {
        return this.id;
    }

    getDisplayName(): string {
        return this.id;
    }

    getLink(): string | null {
        return null;
    }
}
