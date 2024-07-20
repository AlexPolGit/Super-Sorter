/**
 * Get a SplitMix32 RNG.
 * See {@link https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript}.
 */
export function getRNG(seed: number) {
    const splitmix32 = (a: number) => {
        return function() {
            a |= 0;
            a = a + 0x9e3779b9 | 0;
            let t = a ^ a >>> 16;
            t = Math.imul(t, 0x21f0aaad);
            t = t ^ t >>> 15;
            t = Math.imul(t, 0x735a2d97);
            return ((t = t ^ t >>> 15) >>> 0) / 4294967296;
        }
    }

    return splitmix32(seed);
}

/**
 * Shuffles aray using Durstenfeld shuffle.
 * See {@link https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm}.
 */
export function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * Splits an array into sub-arrays of fixed size.
 */
export function splitArrayIntoBatches<T>(items: T[], batchSize: number = 50): T[][] {
    let batches: T[][] = [];
    for (let i = 0; i < items.length; i += batchSize) {
        batches.push(items.slice(i, i + batchSize));
    }
    return batches;
}

/**
 * Get current date in YYYY-MM-DD format.
 */
export function getCurrentDate(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
}

/**
 * Format a number of seconds as minutes (MM:SS).
 */
export function secondsToMinutes(seconds: number): string {
    const minutesString = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secondsString = (seconds % 60).toString().padStart(2, '0');
    return `${minutesString}:${secondsString}`;
}
