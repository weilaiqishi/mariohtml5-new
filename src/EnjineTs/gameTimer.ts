/**
 * Interface for objects that can be updated by the game timer
 */
export interface IUpdateable {
    update(delta: number): void;
}

/**
 * Represents a basic game timer that manages the game loop
 */
export class GameTimer {
    private readonly framesPerSecond: number = 1000 / 30;
    private lastTime: number = 0;
    private intervalId: number | null = null;
    private _updateObject: IUpdateable | null = null;

    get updateObject(): IUpdateable | null {
        return this._updateObject;
    }

    set updateObject(value: IUpdateable | null) {
        this._updateObject = value;
    }

    start(): void {
        this.lastTime = Date.now();
        this.intervalId = window.setInterval(() => this.tick(), this.framesPerSecond);
    }

    private tick(): void {
        if (this._updateObject) {
            const newTime = Date.now();
            const delta = (newTime - this.lastTime) / 1000;
            this.lastTime = newTime;

            this._updateObject.update(delta);
        }
    }

    stop(): void {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}
