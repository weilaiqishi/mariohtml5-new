/**
 * Generates the backgrounds for a level.
 * Code by Rob Kleffner, 2011
 * Converted to ES6 class by Cascade, 2025
 */

import { Level } from "./level";

export class BackgroundGenerator {
    Width: number;
    Height: number;
    Distant: boolean;
    Type: number;

    constructor(width: number, height: number, distant: boolean, type: number) {
        this.Width = width;
        this.Height = height;
        this.Distant = distant;
        this.Type = type;
    }

    SetValues(width: number, height: number, distant: boolean, type: number): void {
        this.Width = width;
        this.Height = height;
        this.Distant = distant;
        this.Type = type;
    }

    CreateLevel(): Level {
        const level = new Level(this.Width, this.Height);
        switch (this.Type) {
            case Level.LevelType.Overground:
                this.GenerateOverground(level);
                break;
            case Level.LevelType.Underground:
                this.GenerateUnderground(level);
                break;
            case Level.LevelType.Castle:
                this.GenerateCastle(level);
                break;
        }
        return level;
    }

    private GenerateOverground(level: Level): void {
        const range = this.Distant ? 4 : 6;
        const offs = this.Distant ? 2 : 1;
        let oh = Math.floor(Math.random() * range) + offs;
        let h = Math.floor(Math.random() * range) + offs;

        let h0 = 0,
            h1 = 0,
            s = 2;
        for (let x = 0; x < this.Width; x++) {
            oh = h;
            while (oh === h) {
                h = Math.floor(Math.random() * range) + offs;
            }

            for (let y = 0; y < this.Height; y++) {
                h0 = oh < h ? oh : h;
                h1 = oh < h ? h : oh;
                s = 2;
                if (y < h0) {
                    if (this.Distant) {
                        s = 2;
                        if (y < 2) {
                            s = y;
                        }
                        level.SetBlock(x, y, 4 + s * 8);
                    } else {
                        level.SetBlock(x, y, 5);
                    }
                } else if (y === h0) {
                    s = h0 === h ? 0 : 1;
                    s += this.Distant ? 2 : 0;
                    level.SetBlock(x, y, s);
                } else if (y === h1) {
                    s = h0 === h ? 0 : 1;
                    s += this.Distant ? 2 : 0;
                    level.SetBlock(x, y, s + 16);
                } else {
                    s = y > h1 ? 1 : 0;
                    if (h0 === oh) {
                        s = 1 - s;
                    }
                    s += this.Distant ? 2 : 0;
                    level.SetBlock(x, y, s + 8);
                }
            }
        }
    }

    private GenerateUnderground(level: Level): void {
        if (this.Distant) {
            let tt = 0;
            for (let x = 0; x < this.Width; x++) {
                if (Math.random() < 0.75) {
                    tt = 1 - tt;
                }

                for (let y = 0; y < this.Height; y++) {
                    let t = tt;
                    let yy = y - 2;

                    if (yy < 0 || yy > 4) {
                        yy = 2;
                        t = 0;
                    }
                    level.SetBlock(x, y, 4 + t + (3 + yy) * 8);
                }
            }
        } else {
            for (let x = 0; x < this.Width; x++) {
                for (let y = 0; y < this.Height; y++) {
                    let t = x % 2;
                    let yy = y - 1;
                    if (yy < 0 || yy > 7) {
                        yy = 7;
                        t = 0;
                    }
                    if (t === 0 && yy > 1 && yy < 5) {
                        t = -1;
                        yy = 0;
                    }

                    level.SetBlock(x, y, 6 + t + yy * 8);
                }
            }
        }
    }

    private GenerateCastle(level: Level): void {
        if (this.Distant) {
            for (let x = 0; x < this.Width; x++) {
                for (let y = 0; y < this.Height; y++) {
                    let t = x % 2;
                    let yy = y - 1;

                    if (yy > 2 && yy < 5) {
                        yy = 2;
                    } else if (yy >= 5) {
                        yy -= 2;
                    }

                    if (yy < 0) {
                        t = 0;
                        yy = 5;
                    } else if (yy > 4) {
                        t = 1;
                        yy = 5;
                    } else if (t < 1 && yy === 3) {
                        t = 0;
                        yy = 3;
                    } else if (t < 1 && yy > 0 && yy < 3) {
                        t = 0;
                        yy = 2;
                    }

                    level.SetBlock(x, y, 1 + t + (yy + 4) * 8);
                }
            }
        } else {
            for (let x = 0; x < this.Width; x++) {
                for (let y = 0; y < this.Height; y++) {
                    let t = x % 3;
                    let yy = y - 1;

                    if (yy > 2 && yy < 5) {
                        yy = 2;
                    } else if (yy >= 5) {
                        yy -= 2;
                    }

                    if (yy < 0) {
                        t = 1;
                        yy = 5;
                    } else if (yy > 4) {
                        t = 2;
                        yy = 5;
                    } else if (t < 2 && yy === 4) {
                        t = 2;
                        yy = 4;
                    } else if (t < 2 && yy > 0 && yy < 4) {
                        t = 4;
                        yy = -3;
                    }

                    level.SetBlock(x, y, 1 + t + (yy + 3) * 8);
                }
            }
        }
    }
}
