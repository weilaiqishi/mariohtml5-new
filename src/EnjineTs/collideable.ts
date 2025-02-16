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
    private Base: IPositionable;
    private X: number;
    private Y: number;
    private Width: number;
    private Height: number;
    private CollisionEvent: CollisionEventHandler;

    constructor(obj: IPositionable, width: number, height: number, collisionEvent?: CollisionEventHandler) {
        this.Base = obj;
        this.X = obj.X;
        this.Y = obj.Y;
        this.Width = width;
        this.Height = height;
        this.CollisionEvent = collisionEvent || (() => {});
    }

    Update(): void {
        this.X = this.Base.X;
        this.Y = this.Base.Y;
    }

    CheckCollision(other: Collideable): void {
        const left1 = this.X;
        const left2 = other.X;
        const right1 = this.X + this.Width;
        const right2 = other.X + other.Width;
        const top1 = this.Y;
        const top2 = other.Y;
        const bottom1 = this.Y + this.Height;
        const bottom2 = other.Y + other.Height;

        // No collision cases
        if (bottom1 < top2) return;
        if (top1 > bottom2) return;
        if (right1 < left2) return;
        if (left1 > right2) return;

        // Collision detected, fire the events!
        this.CollisionEvent(other);
        other.CollisionEvent(this);
    }
}
