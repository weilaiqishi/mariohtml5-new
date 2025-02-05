/**
 * Represents a camera used to offset drawing of sprites in the world.
 */
export class Camera {
    private x: number = 0;
    private y: number = 0;

    get X(): number {
        return this.x;
    }

    set X(value: number) {
        this.x = value;
    }

    get Y(): number {
        return this.y;
    }

    set Y(value: number) {
        this.y = value;
    }
}
