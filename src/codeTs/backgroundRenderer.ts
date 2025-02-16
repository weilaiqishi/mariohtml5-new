/**
 * Renders a background portion of the level.
 * Code by Rob Kleffner, 2011
 * Converted to ES6 class by Cascade, 2025
 */

import { Level } from "./level";
import { SpriteCuts } from "./spriteCuts";
import { Enjine } from "../EnjineTs/core";
import { Drawable } from "../EnjineTs/drawable";

export class BackgroundRenderer extends Drawable {
    Level: Level;
    Width: number;
    Distance: number;
    TilesY: number;
    Background: any[][];

    constructor(level: Level, width: number, height: number, distance: number) {
        super();
        this.Level = level;
        this.Width = width;
        this.Distance = distance;
        this.TilesY = ((height / 32) | 0) + 1;

        this.Background = SpriteCuts.GetBackgroundSheet();
    }

    Draw(context: CanvasRenderingContext2D, camera: { X: number }): void {
        const xCam = camera.X / this.Distance;

        //the OR truncates the decimal, quicker than Math.floor
        const xTileStart = (xCam / 32) | 0;
        //the +1 makes sure the right edge tiles get drawn
        const xTileEnd = ((xCam + this.Width) / 32) | 0;

        for (let x = xTileStart; x <= xTileEnd; x++) {
            for (let y = 0; y < this.TilesY; y++) {
                const b = this.Level.GetBlock(x, y) & 0xff;
                const frame = this.Background[b % 8][(b / 8) | 0];

                //bitshifting by five is the same as multiplying by 32
                context.drawImage(Enjine.Resources.Images["background"], frame.X, frame.Y, frame.Width, frame.Height, ((x << 5) - xCam) | 0, (y << 5) | 0, frame.Width, frame.Height);
            }
        }
    }
}
