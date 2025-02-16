/**
 * Helper to cut up the sprites.
 * Code by Rob Kleffner, 2011
 * Converted to ES6 class by Cascade, 2025
 */

import { Enjine } from "../EnjineTs/core";

export class SpriteCuts {
    /*********************
     * Font related
     ********************/
    static CreateBlackFont() {
        return new Enjine.SpriteFont([], Enjine.Resources.Images["font"], 8, 8, SpriteCuts.GetCharArray(0));
    }

    static CreateRedFont() {
        return new Enjine.SpriteFont([], Enjine.Resources.Images["font"], 8, 8, SpriteCuts.GetCharArray(8));
    }

    static CreateGreenFont() {
        return new Enjine.SpriteFont([], Enjine.Resources.Images["font"], 8, 8, SpriteCuts.GetCharArray(16));
    }

    static CreateBlueFont() {
        return new Enjine.SpriteFont([], Enjine.Resources.Images["font"], 8, 8, SpriteCuts.GetCharArray(24));
    }

    static CreateYellowFont() {
        return new Enjine.SpriteFont([], Enjine.Resources.Images["font"], 8, 8, SpriteCuts.GetCharArray(32));
    }

    static CreatePinkFont() {
        return new Enjine.SpriteFont([], Enjine.Resources.Images["font"], 8, 8, SpriteCuts.GetCharArray(40));
    }

    static CreateCyanFont() {
        return new Enjine.SpriteFont([], Enjine.Resources.Images["font"], 8, 8, SpriteCuts.GetCharArray(48));
    }

    static CreateWhiteFont() {
        return new Enjine.SpriteFont([], Enjine.Resources.Images["font"], 8, 8, SpriteCuts.GetCharArray(56));
    }

    static GetCharArray(y: number) {
        const letters = [];
        for (let i = 32; i < 127; i++) {
            letters[i] = { X: (i - 32) * 8, Y: y };
        }
        return letters;
    }

    /*********************
     * Spritesheet related
     ********************/
    static GetBackgroundSheet() {
        const sheet = [];
        const width = Enjine.Resources.Images["background"].width / 32;
        const height = Enjine.Resources.Images["background"].height / 32;

        for (let x = 0; x < width; x++) {
            sheet[x] = [];

            for (let y = 0; y < height; y++) {
                sheet[x][y] = { X: x * 32, Y: y * 32, Width: 32, Height: 32 };
            }
        }
        return sheet;
    }

    static GetLevelSheet() {
        const sheet = [];
        const width = Enjine.Resources.Images["map"].width / 16;
        const height = Enjine.Resources.Images["map"].height / 16;

        for (let x = 0; x < width; x++) {
            sheet[x] = [];

            for (let y = 0; y < height; y++) {
                sheet[x][y] = { X: x * 16, Y: y * 16, Width: 16, Height: 16 };
            }
        }
        return sheet;
    }
}
