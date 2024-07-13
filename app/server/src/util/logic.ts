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
