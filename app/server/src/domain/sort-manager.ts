import { BaseException } from "./exceptions/base.js"
import { Comparison } from "./objects/comparison.js";
import { MergeSorter } from "./sorters/merge.js";
import { QueueMergeSorter } from "./sorters/queue-merge.js";

class AlgorithmNotFoundException extends BaseException {
    constructor(name: string) {
        super("NOT_FOUND", `Sorting algorithm not found: "${name}".`);
    }
}

export function getSortingAlgorithm(name: string, history: Comparison[], deleted: Comparison[], seed: number) {
    if (name === QueueMergeSorter.SORT_NAME) {
        return new QueueMergeSorter(history, deleted, seed);
    }
    else if (name === MergeSorter.SORT_NAME) {
        return new MergeSorter(history, deleted, seed);
    }
    else {
        throw new AlgorithmNotFoundException(name);
    }
}
