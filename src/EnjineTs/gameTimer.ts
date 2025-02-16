/**
 * Represents a basic game timer that manages the game loop
 */
export class GameTimer {
    FramesPerSecond: number = 1000 / 30;
    LastTime: number = 0;
    IntervalFunc: number | null = null;
    UpdateObject = null;

    Start(): void {
        this.LastTime = Date.now();
        this.IntervalFunc = window.setInterval(() => this.Tick(), this.FramesPerSecond);
    }

    Tick(): void {
        if (this.UpdateObject) {
            const newTime = Date.now();
            const delta = (newTime - this.LastTime) / 1000;
            this.LastTime = newTime;

            this.UpdateObject.Update(delta);
        }
    }

    Stop(): void {
        if (this.IntervalFunc !== null) {
            clearInterval(this.IntervalFunc);
            this.IntervalFunc = null;
        }
    }
}
