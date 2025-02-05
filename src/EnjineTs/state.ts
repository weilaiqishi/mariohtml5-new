import { GameContext } from './types';

/**
 * Base game state interface that all game states must implement
 */
export interface IGameState {
    enter(): void;
    exit(): void;
    update(delta: number): void;
    draw(context: GameContext): void;
    checkForChange(context: GameStateContext): void;
}

/**
 * Base game state class that provides empty implementations of all required methods
 */
export abstract class GameState implements IGameState {
    enter(): void {}
    exit(): void {}
    update(delta: number): void {}
    draw(context: GameContext): void {}
    checkForChange(context: GameStateContext): void {}
}

/**
 * Game state context that manages the current state and state transitions
 */
export class GameStateContext {
    private currentState: IGameState | null = null;

    constructor(defaultState?: IGameState) {
        if (defaultState) {
            this.currentState = defaultState;
            this.currentState.enter();
        }
    }

    get state(): IGameState | null {
        return this.currentState;
    }

    changeState(newState: IGameState): void {
        if (this.currentState) {
            this.currentState.exit();
        }
        this.currentState = newState;
        this.currentState.enter();
    }

    update(delta: number): void {
        if (!this.currentState) {
            throw new Error('No current state to update');
        }
        this.currentState.checkForChange(this);
        this.currentState.update(delta);
    }

    draw(context: GameContext): void {
        if (!this.currentState) {
            throw new Error('No current state to draw');
        }
        this.currentState.draw(context);
    }
}
