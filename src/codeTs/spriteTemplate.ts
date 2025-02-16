/**
 * Creates a specific type of sprite based on the information given.
 * Code by Rob Kleffner, 2011
 */

import { Enemy } from "./enemy";
import { FlowerEnemy } from "./flowerEnemy";
import { Mario } from "./setup";

export class SpriteTemplate {
    Type: number;
    Winged: boolean;
    LastVisibleTick: number;
    IsDead: boolean;
    Sprite: Enemy | FlowerEnemy | null;

    constructor(type: number, winged: boolean) {
        this.Type = type;
        this.Winged = winged;
        this.LastVisibleTick = -1;
        this.IsDead = false;
        this.Sprite = null;
    }

    Spawn(world, x: number, y: number, dir: number): void {
        if (this.IsDead) {
            return;
        }

        if (this.Type === Mario.Enemy.Flower) {
            this.Sprite = new FlowerEnemy(world, x * 16 + 15, y * 16 + 24);
        } else {
            this.Sprite = new Enemy(world, x * 16 + 8, y * 16 + 15, dir, this.Type, this.Winged);
        }
        this.Sprite.SpriteTemplate = this;
        world.AddSprite(this.Sprite);
    }
}
