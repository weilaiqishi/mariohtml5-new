/**
 * Represents a piece of a broken block.
 * Code by Rob Kleffner, 2011
 */

import { Enjine } from "../EnjineTs/core";
import { NotchSprite } from "./notchSprite";
import { Mario } from "./setup";

export class Particle extends NotchSprite {
    World: any;
    declare Xa: number;
    declare Ya: number;
    declare XPic: number;
    declare YPic: number;
    declare XPicO: number;
    declare YPicO: number;
    declare PicWidth: number;
    declare PicHeight: number;
    Life: number;
    declare Delta: number;

    constructor(world: any, x: number, y: number, xa: number, ya: number, xPic: number, yPic: number) {
        super(Enjine.Resources.Images["particles"]);
        this.World = world;
        this.X = x;
        this.Y = y;
        this.Xa = xa;
        this.Ya = ya;
        this.XPic = (Math.random() * 2) | 0;
        this.YPic = 0;
        this.XPicO = 4;
        this.YPicO = 4;

        this.PicWidth = 8;
        this.PicHeight = 8;
        this.Life = 10;

        // this.Image = Enjine.Resources.Images["particles"];
    }

    Move(): void {
        if (this.Life - this.Delta < 0) {
            this.World.RemoveSprite(this);
        }
        this.Life -= this.Delta;

        this.X += this.Xa;
        this.Y += this.Ya;
        this.Ya *= 0.95;
        this.Ya += 3;
    }
}
