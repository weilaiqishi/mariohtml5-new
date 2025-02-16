/**
 * Represents a simple little coin animation when popping out of the box.
 * Code by Rob Kleffner, 2011
 */

import { Enjine } from "../EnjineTs/core";
import { NotchSprite } from "./notchSprite";
import { Mario } from "./setup";

export class CoinAnim extends NotchSprite {
    World: any;
    Life: number;
    declare PicWidth: number;
    declare PicHeight: number;
    declare Xa: number;
    declare Ya: number;
    declare XPic: number;
    declare YPic: number;

    constructor(world: any, x: number, y: number) {
        super(Enjine.Resources.Images["map"]);
        this.World = world;
        this.Life = 10;
        // this.Image = Enjine.Resources.Images["map"];
        this.PicWidth = this.PicHeight = 16;
        this.X = x * 16;
        this.Y = y * 16 - 16;
        this.Xa = 0;
        this.Ya = -6;
        this.XPic = 0;
        this.YPic = 2;
    }

    Move(): void {
        if (this.Life-- < 0) {
            this.World.RemoveSprite(this);
            for (let x = 0; x < 2; x++) {
                for (let y = 0; y < 2; y++) {
                    this.World.AddSprite(new Mario.Sparkle(this.World, (this.X + x * 8 + Math.random() * 8) | 0, (this.Y + y * 8 + Math.random() * 8) | 0, 0, 0, 0, 2, 5));
                }
            }
        }

        this.XPic = this.Life & 3;
        this.X += this.Xa;
        this.Y += this.Ya;
        this.Ya += 1;
    }
}
