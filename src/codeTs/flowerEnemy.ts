/**
 * Represents a flower enemy.
 * Code by Rob Kleffner, 2011
 */

import { Enjine } from "../EnjineTs/core";
import { Enemy } from "./enemy";
import { Mario } from "./setup";

export class FlowerEnemy extends Enemy {
    declare World: any;
    declare Type: number;
    declare Winged: boolean;
    declare NoFireballDeath: boolean;
    YStart: number;
    declare Ya: number;
    declare Layer: number;
    declare JumpTime: number;
    Tick: number;
    declare DeadTime: number;
    declare Xa: number;

    constructor(world: any, x: number, y: number) {
        super(world, x, y, 1, Mario.Enemy.Spiky, false);
        // this.Image = Enjine.Resources.Images["enemies"];
        // this.World = world;
        // this.X = x;
        // this.Y = y;
        // this.Facing = 1;
        // this.Type = Mario.Enemy.Spiky;
        // this.Winged = false;
        this.NoFireballDeath = false;
        this.XPic = 0;
        this.YPic = 6;
        this.YPicO = 24;
        this.Height = 12;
        this.Width = 2;
        this.YStart = y;
        this.Ya = -8;
        this.Y -= 1;
        this.Layer = 0;
        this.JumpTime = 0;
        this.Tick = 0;

        // Initialize movement
        for (let i = 0; i < 4; i++) {
            this.Move();
        }
    }

    Move(): void {
        if (this.DeadTime > 0) {
            this.DeadTime--;

            if (this.DeadTime === 0) {
                this.DeadTime = 1;
                for (let i = 0; i < 8; i++) {
                    this.World.AddSprite(new Mario.Sparkle(((this.X + Math.random() * 16 - 8) | 0) + 4, ((this.Y + Math.random() * 8) | 0) + 4, Math.random() * 2 - 1, Math.random() * -1, 0, 1, 5));
                }
                this.World.RemoveSprite(this);
            }

            this.X += this.Xa;
            this.Y += this.Ya;
            this.Ya *= 0.95;
            this.Ya += 1;

            return;
        }

        this.Tick++;

        if (this.Y >= this.YStart) {
            this.YStart = this.Y;
            const xd = Math.abs(Mario.MarioCharacter.X - this.X) | 0;
            this.JumpTime++;
            if (this.JumpTime > 40 && xd > 24) {
                this.Ya = -8;
            } else {
                this.Ya = 0;
            }
        } else {
            this.JumpTime = 0;
        }

        this.Y += this.Ya;
        this.Ya *= 0.9;
        this.Ya += 0.1;

        this.XPic = (((this.Tick / 2) | 0) & 1) * 2 + (((this.Tick / 6) | 0) & 1);
    }
}
