import { Enjine } from "../EnjineTs/core";
import { Drawable } from "../EnjineTs/drawable";

/**
 * Notch made his own sprite class for this game. Rather than hack around my own,
 * I directly ported his to JavaScript and used that where needed.
 * Code by Rob Kleffner, 2011
 * Converted to ES6 class by Cascade, 2025
 */

export class NotchSprite extends Drawable {
    XOld: number = 0;
    YOld: number = 0;
    X: number = 0;
    Y: number = 0;
    Xa: number = 0;
    Ya: number = 0;
    XPic: number = 0;
    YPic: number = 0;
    XPicO: number = 0;
    YPicO: number = 0;
    PicWidth: number = 32;
    PicHeight: number = 32;
    XFlip: boolean = false;
    YFlip: boolean = false;
    Visible: boolean = true;
    Image: HTMLImageElement;
    Delta: number = 0;
    SpriteTemplate: any = null;
    Layer: number = 1;

    constructor(image: HTMLImageElement) {
        super();
        this.Image = image;
    }

    Draw(context: CanvasRenderingContext2D, camera: any): void {
        if (!this.Visible) {
            return;
        }

        const xPixel = ((this.XOld + (this.X - this.XOld) * this.Delta) | 0) - this.XPicO;
        const yPixel = ((this.YOld + (this.Y - this.YOld) * this.Delta) | 0) - this.YPicO;

        context.save();
        context.scale(this.XFlip ? -1 : 1, this.YFlip ? -1 : 1);
        context.translate(this.XFlip ? -320 : 0, this.YFlip ? -240 : 0);
        context.drawImage(this.Image, this.XPic * this.PicWidth, this.YPic * this.PicHeight, this.PicWidth, this.PicHeight, this.XFlip ? 320 - xPixel - this.PicWidth : xPixel, this.YFlip ? 240 - yPixel - this.PicHeight : yPixel, this.PicWidth, this.PicHeight);
        context.restore();
    }

    Update(delta: number): void {
        this.XOld = this.X;
        this.YOld = this.Y;
        this.Move();
        this.Delta = delta;
    }

    UpdateNoMove(delta: number): void {
        this.XOld = this.X;
        this.YOld = this.Y;
        this.Delta = 0;
    }

    Move(): void {
        this.X += this.Xa;
        this.Y += this.Ya;
    }

    GetX(delta: number): number {
        return ((this.XOld + (this.X - this.XOld) * delta) | 0) - this.XPicO;
    }

    GetY(delta: number): number {
        return ((this.YOld + (this.Y - this.YOld) * delta) | 0) - this.YPicO;
    }

    CollideCheck(): void {}

    BumpCheck(xTile: number, yTile: number): void {}

    Release(mario: any): void {}

    ShellCollideCheck(shell: any): boolean {
        return false;
    }

    FireballCollideCheck(fireball: any): boolean {
        return false;
    }
}
