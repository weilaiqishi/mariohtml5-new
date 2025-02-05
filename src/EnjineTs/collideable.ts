/**
 * Interface for objects that can be positioned
 */
export interface IPositionable {
    X: number;
    Y: number;
}

/**
 * Type definition for collision event handler
 */
export type CollisionEventHandler = (other: Collideable) => void;

/**
 * Basic bounding box collision object.
 */
export class Collideable {
    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private base: IPositionable;
    private collisionEvent: CollisionEventHandler;

    constructor(
        obj: IPositionable,
        width: number,
        height: number,
        collisionEvent?: CollisionEventHandler
    ) {
        this.base = obj;
        this.x = obj.X;
        this.y = obj.Y;
        this.width = width;
        this.height = height;
        this.collisionEvent = collisionEvent || (() => {});
    }

    get X(): number {
        return this.x;
    }

    get Y(): number {
        return this.y;
    }

    get Width(): number {
        return this.width;
    }

    get Height(): number {
        return this.height;
    }

    update(): void {
        this.x = this.base.X;
        this.y = this.base.Y;
    }

    checkCollision(other: Collideable): void {
        const left1 = this.x;
        const left2 = other.X;
        const right1 = this.x + this.width;
        const right2 = other.X + other.Width;
        const top1 = this.y;
        const top2 = other.Y;
        const bottom1 = this.y + this.height;
        const bottom2 = other.Y + other.Height;

        // No collision cases
        if (bottom1 < top2) return;
        if (top1 > bottom2) return;
        if (right1 < left2) return;
        if (left1 > right2) return;

        // Collision detected, fire the events!
        this.collisionEvent(other);
        other.collisionEvent(this);
    }
}
