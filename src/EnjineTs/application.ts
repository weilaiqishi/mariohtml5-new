import { GameCanvas } from './gameCanvas';
import { GameTimer } from './gameTimer';
import { KeyboardInput } from './keyboardInput';
import { GameStateContext, IGameState } from './state';

/**
 * Main application class that ties together all engine components
 */
export class Application {
    private canvas: GameCanvas | null = null;
    private timer: GameTimer | null = null;
    private stateContext: GameStateContext | null = null;

    update(delta: number): void {
        if (!this.stateContext || !this.canvas) {
            throw new Error('Application not initialized');
        }

        this.stateContext.update(delta);
        
        this.canvas.beginDraw();
        
        const context = this.canvas.BackBufferContext2D;
        if (!context) {
            throw new Error('Canvas context not available');
        }
        
        this.stateContext.draw(context);
        
        this.canvas.endDraw();
    }

    initialize(defaultState: IGameState, resWidth: number, resHeight: number): void {
        this.canvas = new GameCanvas();
        this.timer = new GameTimer();
        
        KeyboardInput.initialize();
        this.canvas.initialize("canvas", resWidth, resHeight);
        
        if (!this.timer) {
            throw new Error('Failed to create game timer');
        }
        
        this.timer.updateObject = this;
        this.stateContext = new GameStateContext(defaultState);
        
        this.timer.start();
    }
}
