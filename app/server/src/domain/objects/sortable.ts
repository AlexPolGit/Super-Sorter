export class SortableItem {
    id: string;

    constructor(id: string) {
        this.id = id;
    }

    getIdentifier() {
        return this.id;
    }
}
