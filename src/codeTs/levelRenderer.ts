/**
 * Renders a playable level.
 * Code by Rob Kleffner, 2011
 * Converted to ES6 class by Cascade, 2025
 */

import { SpriteCuts } from "./spriteCuts";
import { Level } from "./level";
import { Mario } from "./setup";
import { Enjine } from "../EnjineTs/core";
import { Drawable } from "../EnjineTs/drawable";

export class LevelRenderer extends Drawable {
    Width: number;
    Height: number;
    Level: Level;
    TilesY: number;
    Delta: number;
    Tick: number;
    Bounce: number;
    AnimTime: number;
    Background: any;

    constructor(level: Level, width: number, height: number) {
        super();
        this.Width = width;
        this.Height = height;
        this.Level = level;
        this.TilesY = ((height / 16) | 0) + 1;
        this.Delta = 0;
        this.Tick = 0;
        this.Bounce = 0;
        this.AnimTime = 0;

        this.Background = Mario.SpriteCuts.GetLevelSheet();
    }

    Update(delta: number) {
        this.AnimTime += delta;
        this.Tick = this.AnimTime | 0;
        this.Bounce += delta * 30;
        this.Delta = delta;
    }

    Draw(context: CanvasRenderingContext2D, camera: { X: number; Y: number }) {
        this.DrawStatic(context, camera);
        this.DrawDynamic(context, camera);
    }

    DrawStatic(context: CanvasRenderingContext2D, camera: { X: number; Y: number }) {
        let x = 0,
            y = 0,
            b = 0,
            frame = null;
        const xTileStart = (camera.X / 16) | 0;
        const xTileEnd = ((camera.X + this.Width) / 16) | 0;

        for (x = xTileStart; x < xTileEnd + 1; x++) {
            for (y = 0; y < this.TilesY; y++) {
                b = this.Level.GetBlock(x, y) & 0xff;
                if ((Mario.Tile.Behaviors[b] & Mario.Tile.Animated) === 0) {
                    frame = this.Background[b % 16][(b / 16) | 0];
                    context.drawImage(Enjine.Resources.Images["map"], frame.X, frame.Y, frame.Width, frame.Height, ((x << 4) - camera.X) | 0, (y << 4) | 0, frame.Width, frame.Height);
                }
            }
        }
    }

    DrawDynamic(context: CanvasRenderingContext2D, camera: { X: number; Y: number }) {
        let x = 0,
            y = 0,
            b = 0,
            animTime = 0,
            yo = 0,
            frame = null;
        for (x = (camera.X / 16) | 0; (x <= (camera.X + this.Width) / 16) | 0; x++) {
            for (y = (camera.Y / 16) | 0; (y <= (camera.Y + this.Height) / 16) | 0; y++) {
                b = this.Level.GetBlock(x, y);

                if ((Mario.Tile.Behaviors[b & 0xff] & Mario.Tile.Animated) > 0) {
                    animTime = ((this.Bounce / 3) | 0) % 4;
                    if ((((b % 16) / 4) | 0) === 0 && ((b / 16) | 0) === 1) {
                        animTime = ((this.Bounce / 2 + (x + y) / 8) | 0) % 20;
                        if (animTime > 3) {
                            animTime = 0;
                        }
                    }
                    if ((((b % 16) / 4) | 0) === 3 && ((b / 16) | 0) === 0) {
                        animTime = 2;
                    }
                    yo = 0;
                    if (x >= 0 && y >= 0 && x < this.Level.Width && y < this.Level.Height) {
                        yo = this.Level.Data[x][y];
                    }
                    if (yo > 0) {
                        yo = (Math.sin(((yo - this.Delta) / 4) * Math.PI) * 8) | 0;
                    }
                    frame = this.Background[(((b % 16) / 4) | 0) * 4 + animTime][(b / 16) | 0];
                    context.drawImage(Enjine.Resources.Images["map"], frame.X, frame.Y, frame.Width, frame.Height, (x << 4) - camera.X, (y << 4) - camera.Y - yo, frame.Width, frame.Height);
                }
            }
        }
    }

    DrawExit0(context: CanvasRenderingContext2D, camera: { X: number; Y: number }, bar: boolean) {
        let y = 0,
            yh = 0,
            frame = null;
        for (y = this.Level.ExitY - 8; y < this.Level.ExitY; y++) {
            frame = this.Background[12][y === this.Level.ExitY - 8 ? 4 : 5];
            context.drawImage(Enjine.Resources.Images["map"], frame.X, frame.Y, frame.Width, frame.Height, (this.Level.ExitX << 4) - camera.X - 16, (y << 4) - camera.Y, frame.Width, frame.Height);
        }

        if (bar) {
            yh = this.Level.ExitY * 16 - 3 * 16 - Math.sin(this.AnimTime) * 3 * 16 - 8;
            frame = this.Background[12][3];
            context.drawImage(Enjine.Resources.Images["map"], frame.X, frame.Y, frame.Width, frame.Height, (this.Level.ExitX << 4) - camera.X - 16, yh - camera.Y, frame.Width, frame.Height);
            frame = this.Background[13][3];
            context.drawImage(Enjine.Resources.Images["map"], frame.X, frame.Y, frame.Width, frame.Height, (this.Level.ExitX << 4) - camera.X, yh - camera.Y, frame.Width, frame.Height);
        }
    }

    DrawExit1(context: CanvasRenderingContext2D, camera: { X: number; Y: number }) {
        let y = 0,
            frame = null;
        for (y = this.Level.ExitY - 8; y < this.Level.ExitY; y++) {
            frame = this.Background[13][y === this.Level.ExitY - 8 ? 4 : 5];
            context.drawImage(Enjine.Resources.Images["map"], frame.X, frame.Y, frame.Width, frame.Height, (this.Level.ExitX << 4) - camera.X + 16, (y << 4) - camera.Y, frame.Width, frame.Height);
        }
    }
}
