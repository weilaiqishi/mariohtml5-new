import { GameContext, Camera } from "./types";
import { Drawable } from "./drawable";

/**
 * Interface for font string data
 */
interface FontString {
    String: string;
    X: number;
    Y: number;
}

/**
 * Interface for letter position in the sprite sheet
 */
interface LetterPosition {
    X: number;
    Y: number;
}

/**
 * Represents a sprite sheet for a font.
 */
export class SpriteFont extends Drawable {
    Image: HTMLImageElement;
    Letters: { [key: number]: LetterPosition };
    LetterWidth: number;
    LetterHeight: number;
    Strings: FontString[];

    constructor(strings: FontString[], image: HTMLImageElement, letterWidth: number, letterHeight: number, letters: { [key: number]: LetterPosition }) {
        super();
        this.Image = image;
        this.Letters = letters;
        this.LetterWidth = letterWidth;
        this.LetterHeight = letterHeight;
        this.Strings = strings;
    }

    override Draw(context: GameContext, camera: Camera): void {
        for (const string of this.Strings) {
            for (let i = 0; i < string.String.length; i++) {
                const code = string.String.charCodeAt(i);
                context.drawImage(this.Image, this.Letters[code].X, this.Letters[code].Y, this.LetterWidth, this.LetterHeight, string.X + this.LetterWidth * (i + 1), string.Y, this.LetterWidth, this.LetterHeight);
            }
        }
    }
}
