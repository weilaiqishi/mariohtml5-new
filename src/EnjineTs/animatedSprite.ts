import { FrameSprite } from './frameSprite';

/**
 * Class to represent an uninterrupted set of frames to animate.
 */
export class AnimationSequence {
    readonly singleFrame: boolean;

    constructor(
        public readonly startRow: number,
        public readonly startColumn: number,
        public readonly endRow: number,
        public readonly endColumn: number
    ) {
        this.singleFrame = (startRow === endRow) && (startColumn === endColumn);
    }
}

/**
 * Subclass that extends the regular sprite with animation capability.
 */
export class AnimatedSprite extends FrameSprite {
    private lastElapsed: number = 0;
    private framesPerSecond: number = 1 / 20;
    private currentSequence: AnimationSequence | null = null;
    private playing: boolean = false;
    private looping: boolean = false;
    private rows: number = 0;
    private columns: number = 0;
    private sequences: { [key: string]: AnimationSequence } = {};

    get CurrentSequence(): AnimationSequence | null {
        return this.currentSequence;
    }

    get Playing(): boolean {
        return this.playing;
    }

    get Looping(): boolean {
        return this.looping;
    }

    update(delta: number): void {
        if (!this.currentSequence || this.currentSequence.singleFrame || !this.playing) {
            return;
        }

        this.lastElapsed -= delta;

        if (this.lastElapsed <= 0) {
            this.lastElapsed = this.framesPerSecond;
            
            if (this.frameX === this.currentSequence.endColumn * this.frameWidth && 
                this.frameY === this.currentSequence.endRow * this.frameHeight) {
                if (this.looping) {
                    this.frameX = this.currentSequence.startColumn * this.frameWidth;
                    this.frameY = this.currentSequence.startRow * this.frameHeight;
                } else {
                    this.playing = false;
                }
            } else {
                if (this.frameX === (this.columns - 1) * this.frameWidth) {
                    this.frameX = 0;
                    this.frameY += this.frameHeight;
                } else {
                    this.frameX += this.frameWidth;
                }
            }
        }
    }

    playSequence(seqName: string, loop: boolean = false): void {
        this.currentSequence = this.sequences[seqName];
        this.playing = true;
        this.looping = loop;
        this.frameX = this.currentSequence.startColumn * this.frameWidth;
        this.frameY = this.currentSequence.startRow * this.frameHeight;
    }

    stopLooping(): void {
        this.looping = false;
    }

    stopPlaying(): void {
        this.playing = false;
    }

    setFrameWidth(width: number): void {
        this.frameWidth = width;
        this.frameX = 0;
    }

    setFrameHeight(height: number): void {
        this.frameHeight = height;
        this.frameY = 0;
    }

    setColumnCount(columnCount: number): void {
        this.columns = columnCount;
    }

    setRowCount(rowCount: number): void {
        this.rows = rowCount;
    }

    addExistingSequence(name: string, sequence: AnimationSequence): void {
        this.sequences[name] = sequence;
    }

    addNewSequence(name: string, startRow: number, startColumn: number, endRow: number, endColumn: number): void {
        this.sequences[name] = new AnimationSequence(startRow, startColumn, endRow, endColumn);
    }

    deleteSequence(name: string): void {
        if (this.sequences[name] === this.currentSequence) {
            this.currentSequence = null;
            this.playing = false;
        }
        delete this.sequences[name];
    }

    clearSequences(): void {
        this.sequences = {};
        this.currentSequence = null;
        this.playing = false;
    }
}
