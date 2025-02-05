import { GameContext, Camera } from './types';
import { Sprite } from './sprite';

/**
 * For sprites that are only a portion of an image.
 */
export class FrameSprite extends Sprite {
    protected frameX: number = 0;
    protected frameY: number = 0;
    protected frameWidth: number = 0;
    protected frameHeight: number = 0;

    get FrameX(): number {
        return this.frameX;
    }

    set FrameX(value: number) {
        this.frameX = value;
    }

    get FrameY(): number {
        return this.frameY;
    }

    set FrameY(value: number) {
        this.frameY = value;
    }

    get FrameWidth(): number {
        return this.frameWidth;
    }

    set FrameWidth(value: number) {
        this.frameWidth = value;
    }

    get FrameHeight(): number {
        return this.frameHeight;
    }

    set FrameHeight(value: number) {
        this.frameHeight = value;
    }

    override draw(context: GameContext, camera: Camera): void {
        if (!this.image) {
            return;
        }
        
        context.drawImage(
            this.image,
            this.frameX,
            this.frameY,
            this.frameWidth,
            this.frameHeight,
            this.x - camera.X,
            this.y - camera.Y,
            this.frameWidth,
            this.frameHeight
        );
    }
}
