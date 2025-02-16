/**
 * Noise function to generate the world maps.
 * Code by Rob Kleffner, 2011
 * Converted to ES6 class by Cascade, 2025
 */

export class ImprovedNoise {
    private P: number[] = [];

    constructor(seed: number) {
        this.Shuffle(seed);
    }

    private Shuffle(seed: number): void {
        const permutation: number[] = [];

        for (let i = 0; i < 256; i++) {
            permutation[i] = i;
        }

        for (let i = 0; i < 256; i++) {
            const j = ((Math.random() * (256 - 1)) | 0) + i;
            const tmp = permutation[i];
            permutation[i] = permutation[j];
            permutation[j] = tmp;
            this.P[i + 256] = this.P[i] = permutation[i];
        }
    }

    PerlinNoise(x: number, y: number): number {
        let n = 0;

        for (let i = 0; i < 8; i++) {
            const stepSize = 64 / (1 << i);
            n += this.Noise(x / stepSize, y / stepSize, 128) / (1 << i);
        }

        return n;
    }

    private Noise(x: number, y: number, z: number): number {
        const nx = (x | 0) & 255;
        const ny = (y | 0) & 255;
        const nz = (z | 0) & 255;
        x -= x | 0;
        y -= y | 0;
        z -= z | 0;

        const u = this.Fade(x);
        const v = this.Fade(y);
        const w = this.Fade(z);
        const A = this.P[nx] + ny;
        const AA = this.P[A] + nz;
        const AB = this.P[A + 1] + nz;
        const B = this.P[nx + 1] + ny;
        const BA = this.P[B] + nz;
        const BB = this.P[B + 1] + nz;

        return this.Lerp(w, this.Lerp(v, this.Lerp(u, this.Grad(this.P[AA], x, y, z), this.Grad(this.P[BA], x - 1, y, z)), this.Lerp(u, this.Grad(this.P[AB], x, y - 1, z), this.Grad(this.P[BB], x - 1, y - 1, z))), this.Lerp(v, this.Lerp(u, this.Grad(this.P[AA + 1], x, y, z - 1), this.Grad(this.P[BA + 1], x - 1, y, z - 1)), this.Lerp(u, this.Grad(this.P[AB + 1], x, y - 1, z - 1), this.Grad(this.P[BB + 1], x - 1, y - 1, z - 1))));
    }

    private Fade(t: number): number {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    private Lerp(t: number, x: number, y: number): number {
        return x + t * (y - x);
    }

    private Grad(hash: number, x: number, y: number, z: number): number {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }
}
