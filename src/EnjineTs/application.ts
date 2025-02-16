import { Enjine } from "./core";
import { GameCanvas } from "./gameCanvas";
import { GameTimer } from "./gameTimer";
import { GameStateContext } from "./state";

/**
 * Main application class that ties together all engine components
 */
export class Application {
    canvas: GameCanvas | null = null;
    timer: GameTimer | null = null;
    stateContext: GameStateContext | null = null;

    Update(delta: number): void {
        this.stateContext.Update(delta);

        this.canvas.BeginDraw();

        this.stateContext.Draw(this.canvas.BackBufferContext2D);

        this.canvas.EndDraw();
    }

    Initialize(defaultState, resWidth: number, resHeight: number): void {
        this.canvas = new Enjine.GameCanvas();
        this.timer = new Enjine.GameTimer();
        Enjine.KeyboardInput.Initialize();
        this.canvas.Initialize("canvas", resWidth, resHeight);
        this.timer.UpdateObject = this;

        this.stateContext = new Enjine.GameStateContext(defaultState);

        this.timer.Start();
    }
}
