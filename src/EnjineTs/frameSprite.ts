import { GameContext, Camera } from "./types";
import { Sprite } from "./sprite";

/**
 * For sprites that are only a portion of an image.
 */
export class FrameSprite extends Sprite {
    FrameX: number = 0;
    FrameY: number = 0;
    FrameWidth: number = 0;
    FrameHeight: number = 0;

    override Draw(context: GameContext, camera: Camera): void {
        if (!this.Image) {
            return;
        }
        context.drawImage(this.Image, this.FrameX, this.FrameY, this.FrameWidth, this.FrameHeight, this.X - camera.X, this.Y - camera.Y, this.FrameWidth, this.FrameHeight);
    }
}
