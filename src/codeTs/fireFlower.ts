/**
 * Represents a fire powerup.
 * Code by Rob Kleffner, 2011
 */

import { Enjine } from "../EnjineTs/core";
import { NotchSprite } from "./notchSprite";
import { Mario } from "./setup";

export class FireFlower extends NotchSprite {
    Width: number;
    Height: number;
    World: any;
    declare XPicO: number;
    declare YPicO: number;
    declare XPic: number;
    declare YPic: number;
    Facing: number;
    declare PicWidth: number;
    declare PicHeight: number;
    Life: number;
    declare Layer: number;

    constructor(world: any, x: number, y: number) {
        super(Enjine.Resources.Images["items"]);
        this.Width = 4;
        this.Height = 12;
        this.World = world;
        this.X = x;
        this.Y = y;
        // this.Image = Enjine.Resources.Images["items"];
        this.XPicO = 8;
        this.YPicO = 15;
        this.XPic = 1;
        this.YPic = 0;
        this.Facing = 1;
        this.PicWidth = this.PicHeight = 16;
        this.Life = 0;
    }

    CollideCheck(): void {
        const xMarioD = Mario.MarioCharacter.X - this.X;
        const yMarioD = Mario.MarioCharacter.Y - this.Y;
        if (xMarioD > -16 && xMarioD < 16) {
            if (yMarioD > -this.Height && yMarioD < Mario.MarioCharacter.Height) {
                Mario.MarioCharacter.GetFlower();
                this.World.RemoveSprite(this);
            }
        }
    }

    Move(): void {
        if (this.Life < 9) {
            this.Layer = 0;
            this.Y--;
            this.Life++;
            return;
        }
    }
}
