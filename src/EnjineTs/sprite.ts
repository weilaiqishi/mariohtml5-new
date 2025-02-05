import { GameContext, Camera } from './types';
import { Drawable } from './drawable';

/**
 * Represents a simple static sprite.
 */
export class Sprite extends Drawable {
    protected x: number = 0;
    protected y: number = 0;
    protected image: HTMLImageElement | null = null;

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

    get Image(): HTMLImageElement | null {
        return this.image;
    }

    set Image(value: HTMLImageElement | null) {
        this.image = value;
    }

    draw(context: GameContext, camera: Camera): void {
        if (this.image) {
            context.drawImage(this.image, this.x - camera.X, this.y - camera.Y);
        }
    }
}
