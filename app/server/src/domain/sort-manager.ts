import { AlgorithmTypes } from "@sorter/api";
import { BaseException } from "./exceptions/base.js"
import { Comparison } from "./objects/comparison.js";
import { MergeSorter } from "./sorters/merge.js";
import { QueueMergeSorter } from "./sorters/queue-merge.js";

class AlgorithmNotFoundException extends BaseException {
    constructor(sortType: AlgorithmTypes) {
        super("NOT_FOUND", `Sorting algorithm not found: "${sortType}".`);
    }
}

export function getSortingAlgorithm(name: string, history: Comparison[], deleted: Comparison[], seed: number) {
    const sortType: AlgorithmTypes = name as AlgorithmTypes;
    if (sortType === AlgorithmTypes.QUEUE_MERGE) {
        return new QueueMergeSorter(history, deleted, seed);
    }
    else if (sortType === AlgorithmTypes.MERGE) {
        return new MergeSorter(history, deleted, seed);
    }
    else {
        throw new AlgorithmNotFoundException(sortType);
    }
}
