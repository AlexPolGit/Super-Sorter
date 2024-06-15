export interface BasicExportObject {
    type: string;
    items: string[];
    algorithm: string;
    seed: number;
}

export interface FullExportObject extends BasicExportObject {
    history: string[];
    deleted: string[];
    deletedHistory: string[];
}
