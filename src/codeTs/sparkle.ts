import { Enjine } from "../EnjineTs/core";
import { NotchSprite } from "./notchSprite";
import { Mario } from "./setup";

/**
 * Represents a little sparkle object in the game.
 * Code by Rob Kleffner, 2011
 */

export class Sparkle extends NotchSprite {
    World: any;
    declare X: number;
    declare Y: number;
    declare Xa: number;
    declare Ya: number;
    declare XPic: number;
    declare YPic: number;
    Life: number;
    XPicStart: number;
    declare XPicO: number;
    declare YPicO: number;
    declare PicWidth: number;
    declare PicHeight: number;
    declare Image: any;

    constructor(world: any, x: number, y: number, xa: number, ya: number) {
        super(Enjine.Resources.Images["particles"]);
        this.World = world;
        this.X = x;
        this.Y = y;
        this.Xa = xa;
        this.Ya = ya;
        this.XPic = (Math.random() * 2) | 0;
        this.YPic = 0;

        this.Life = 10 + ((Math.random() * 5) | 0);
        this.XPicStart = this.XPic;
        this.XPicO = 4;
        this.YPicO = 4;

        this.PicWidth = 8;
        this.PicHeight = 8;
        // this.Image = Enjine.Resources.Images["particles"];
    }

    Move(): void {
        if (this.Life > 10) {
            this.XPic = 7;
        } else {
            this.XPic = (this.XPicStart + (10 - this.Life) * 0.4) | 0;
        }

        if (this.Life-- < 0) {
            this.World.RemoveSprite(this);
        }

        this.X += this.Xa;
        this.Y += this.Ya;
    }
}
