import { GameContext, Camera, Point } from './types';
import { Drawable } from './drawable';

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
    private image: HTMLImageElement;
    private letters: { [key: number]: LetterPosition };
    private letterWidth: number;
    private letterHeight: number;
    private strings: FontString[];

    constructor(
        strings: FontString[],
        image: HTMLImageElement,
        letterWidth: number,
        letterHeight: number,
        letters: { [key: number]: LetterPosition }
    ) {
        super();
        this.strings = strings;
        this.image = image;
        this.letterWidth = letterWidth;
        this.letterHeight = letterHeight;
        this.letters = letters;
    }

    get Strings(): FontString[] {
        return this.strings;
    }

    set Strings(value: FontString[]) {
        this.strings = value;
    }

    get Image(): HTMLImageElement {
        return this.image;
    }

    set Image(value: HTMLImageElement) {
        this.image = value;
    }

    get Letters(): { [key: number]: LetterPosition } {
        return this.letters;
    }

    get LetterWidth(): number {
        return this.letterWidth;
    }

    get LetterHeight(): number {
        return this.letterHeight;
    }

    override draw(context: GameContext, camera: Camera): void {
        for (const string of this.strings) {
            for (let i = 0; i < string.String.length; i++) {
                const code = string.String.charCodeAt(i);
                const letter = this.letters[code];
                
                if (letter) {
                    context.drawImage(
                        this.image,
                        letter.X,
                        letter.Y,
                        this.letterWidth,
                        this.letterHeight,
                        string.X + this.letterWidth * (i + 1),
                        string.Y,
                        this.letterWidth,
                        this.letterHeight
                    );
                }
            }
        }
    }
}
