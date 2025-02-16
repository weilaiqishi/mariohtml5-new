import { GameContext, Camera } from "./types";
import { Drawable } from "./drawable";

/**
 * Represents a simple static sprite.
 */
export class Sprite extends Drawable {
    X: number = 0;
    Y: number = 0;
    Image: HTMLImageElement | null = null;

    Draw(context: GameContext, camera: Camera): void {
        if (this.Image) {
            context.drawImage(this.Image, this.X - camera.X, this.Y - camera.Y);
        }
    }
}
