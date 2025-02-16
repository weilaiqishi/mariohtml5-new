/**
 * Represents a playable level in the game.
 * Code by Rob Kleffner, 2011
 * Converted to ES6 class by Cascade, 2025
 */

export class Level {
    Width: number;
    Height: number;
    ExitX: number = 10;
    ExitY: number = 10;
    Map: number[][] = [];
    Data: number[][] = [];
    SpriteTemplates: any[][] = [];

    constructor(width: number, height: number) {
        this.Width = width;
        this.Height = height;

        // Initialize arrays
        for (let x = 0; x < this.Width; x++) {
            this.Map[x] = [];
            this.Data[x] = [];
            this.SpriteTemplates[x] = [];

            for (let y = 0; y < this.Height; y++) {
                this.Map[x][y] = 0;
                this.Data[x][y] = 0;
                this.SpriteTemplates[x][y] = null;
            }
        }
    }

    Update(): void {
        for (let x = 0; x < this.Width; x++) {
            for (let y = 0; y < this.Height; y++) {
                if (this.Data[x][y] > 0) {
                    this.Data[x][y]--;
                }
            }
        }
    }

    GetBlockCapped(x: number, y: number): number {
        if (x < 0) x = 0;
        if (y < 0) y = 0;
        if (x >= this.Width) x = this.Width - 1;
        if (y >= this.Height) y = this.Height - 1;
        return this.Map[x][y];
    }

    GetBlock(x: number, y: number): number {
        if (x < 0) x = 0;
        if (y < 0) y = 0;
        if (x >= this.Width) x = this.Width - 1;
        if (y >= this.Height) y = this.Height - 1;
        return this.Map[x][y];
    }

    SetBlock(x: number, y: number, block: number): void {
        if (x < 0) return;
        if (y < 0) return;
        if (x >= this.Width) return;
        if (y >= this.Height) return;
        this.Map[x][y] = block;
    }

    SetBlockData(x: number, y: number, data: number): void {
        if (x < 0) return;
        if (y < 0) return;
        if (x >= this.Width) return;
        if (y >= this.Height) return;
        this.Data[x][y] = data;
    }

    IsBlocking(x: number, y: number, xa: number, ya: number): boolean {
        const block = this.GetBlock(x, y);
        const blocking = (Level.Tile.Behaviors[block & 0xff] & Level.Tile.BlockAll) > 0;
        return blocking;
    }

    GetSpriteTemplate(x: number, y: number): any {
        if (x < 0) return null;
        if (y < 0) return null;
        if (x >= this.Width) return null;
        if (y >= this.Height) return null;
        return this.SpriteTemplates[x][y];
    }

    SetSpriteTemplate(x: number, y: number, template: any): void {
        if (x < 0) return;
        if (y < 0) return;
        if (x >= this.Width) return;
        if (y >= this.Height) return;
        this.SpriteTemplates[x][y] = template;
    }

    static Tile = {
        BlockUpper: 1 << 0,
        BlockAll: 1 << 1,
        BlockLower: 1 << 2,
        Special: 1 << 3,
        Bumpable: 1 << 4,
        Breakable: 1 << 5,
        PickUpable: 1 << 6,
        Animated: 1 << 7,
        Behaviors: [] as number[],

        LoadBehaviors(): void {
            const b: number[] = new Array(256).fill(0);

            // Initial values
            b[1] = 20;
            b[2] = 28;
            b[4] = 130;
            b[5] = 130;
            b[6] = 130;
            b[7] = 130;
            b[8] = 2;
            b[9] = 2;
            b[10] = 2;
            b[11] = 2;
            b[12] = 2;
            b[14] = 138;
            b[16] = 162;
            b[17] = 146;
            b[18] = 154;
            b[19] = 162;
            b[20] = 146;
            b[21] = 146;
            b[22] = 154;
            b[23] = 146;
            b[24] = 2;
            b[26] = 2;
            b[27] = 2;
            b[28] = 2;
            b[30] = 2;
            b[32] = 192;
            b[33] = 192;
            b[34] = 192;
            b[35] = 192;
            b[40] = 2;
            b[41] = 2;
            b[46] = 2;
            b[56] = 2;
            b[57] = 2;
            b[128] = 2;
            b[129] = 2;
            b[130] = 2;
            b[132] = 1;
            b[133] = 1;
            b[134] = 1;
            b[136] = 2;
            b[137] = 2;
            b[138] = 2;
            b[140] = 2;
            b[141] = 2;
            b[142] = 2;
            b[144] = 2;
            b[146] = 2;
            b[152] = 2;
            b[153] = 2;
            b[154] = 2;
            b[156] = 2;
            b[157] = 2;
            b[158] = 2;
            b[160] = 2;
            b[161] = 2;
            b[162] = 2;
            b[168] = 2;
            b[169] = 2;
            b[170] = 2;
            b[172] = 2;
            b[173] = 2;
            b[174] = 2;
            b[176] = 2;
            b[177] = 2;
            b[178] = 2;
            b[180] = 1;
            b[181] = 1;
            b[182] = 1;
            b[224] = 1;
            b[225] = 1;
            b[226] = 1;

            this.Behaviors = b;
        },
    };

    static LevelType = {
        Overground: 0,
        Underground: 1,
        Castle: 2,
    };

    static Odds = {
        Straight: 0,
        HillStraight: 1,
        Tubes: 2,
        Jump: 3,
        Cannons: 4,
    };
}
