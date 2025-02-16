import { FrameSprite } from "./frameSprite";

/**
 * Class to represent an uninterrupted set of frames to animate.
 */
export class AnimationSequence {
    singleFrame: boolean;
    StartRow: number;
    StartColumn: number;
    EndRow: number;
    EndColumn: number;
    SingleFrame: boolean;

    constructor(startRow: number, startColumn: number, endRow: number, endColumn: number) {
        this.StartRow = startRow;
        this.StartColumn = startColumn;
        this.EndRow = endRow;
        this.EndColumn = endColumn;
        
        //sometimes in an animated sprite, we want it to behave like a regular sprite (static)
        //this variable will keep it from wasting time updating animation when the sequence
        //is only a single frame long, for things like standing or pausing action
        this.SingleFrame = false;
        
        if ((this.StartRow == this.EndRow) && (this.StartColumn == this.EndColumn)) {
            this.SingleFrame = true;
        }
    }
}

/**
 * Subclass that extends the regular sprite with animation capability.
 */
export class AnimatedSprite extends FrameSprite {
    LastElapsed: number = 0;
    FramesPerSecond: number = 1 / 20;
    CurrentSequence: AnimationSequence | null = null;
    Playing: boolean = false;
    Looping: boolean = false;
    Rows: number = 0;
    Columns: number = 0;
    Sequences: { [key: string]: AnimationSequence } = {};

    Update(delta: number): void {
        if (this.CurrentSequence.SingleFrame) {
            return;
        }
        if (!this.Playing) {
            return;
        }
    
        this.LastElapsed -= delta;
        
        if (this.LastElapsed > 0) {
            return;
        }
        
        this.LastElapsed = this.FramesPerSecond;
        this.FrameX += this.FrameWidth;
        
        //increment the frame
        if (this.FrameX > (this.Image.width - this.FrameWidth)) {
            this.FrameX = 0;
            this.FrameY += this.FrameHeight;
            
            if (this.FrameY > (this.Image.height - this.FrameHeight)) {
                this.FrameY = 0;
            }
        }
        
        //check if it's at the end of the animation sequence
        var seqEnd = false;
        if ((this.FrameX > (this.CurrentSequence.EndColumn * this.FrameWidth)) && (this.FrameY == (this.CurrentSequence.EndRow * this.FrameHeight))) {
            seqEnd = true;
        } else if (this.FrameX == 0 && (this.FrameY > (this.CurrentSequence.EndRow * this.FrameHeight))) {
            seqEnd = true;
        }
        
        //go back to the beginning if looping, otherwise stop playing
        if (seqEnd) {
            if (this.Looping) {
                this.FrameX = this.CurrentSequence.StartColumn * this.FrameWidth;
                this.FrameY = this.CurrentSequence.StartRow * this.FrameHeight;
            } else {
                this.Playing = false;
            }
        }
    }

    PlaySequence(seqName: string, loop: boolean = false): void {
        this.Playing = true;
        this.Looping = loop;
        this.CurrentSequence = this.Sequences["seq_" + seqName];
        this.FrameX = this.CurrentSequence.StartColumn * this.FrameWidth;
        this.FrameY = this.CurrentSequence.StartRow * this.FrameHeight;
    }

    StopLooping(): void {
        this.Looping = false;
    }

    StopPlaying(): void {
        this.Playing = false;
    }

    SetFrameWidth(width: number): void {
        this.FrameWidth = width;
        this.Rows = this.Image.width / this.FrameWidth;
    }

    SetFrameHeight(height: number): void {
        this.FrameHeight = height;
        this.Columns = this.Image.height / this.FrameHeight;
    }

    SetColumnCount(columnCount: number): void {
        this.FrameWidth = this.Image.width / columnCount;
        this.Columns = columnCount;
    }

    SetRowCount(rowCount: number): void {
        this.FrameHeight = this.Image.height / rowCount;
        this.Rows = rowCount;
    }

    AddExistingSequence(name: string, sequence: AnimationSequence): void {
        this.Sequences["seq_" + name] = sequence;
    }

    AddNewSequence(name: string, startRow: number, startColumn: number, endRow: number, endColumn: number): void {
        this.Sequences["seq_" + name] = new AnimationSequence(startRow, startColumn, endRow, endColumn);
    }

    DeleteSequence(name: string): void {
        if (this.Sequences["seq_" + name]  != null) {
            delete this.Sequences["seq_" + name];
        }
    }

    ClearSequences(): void {
        this.Sequences = {};
    }
}
