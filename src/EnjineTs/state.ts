import { GameContext } from "./types";

/**
 * Base game state interface that all game states must implement
 */
export interface IGameState {
    Enter(): void;
    Exit(): void;
    Update(delta: number): void;
    Draw(context: GameContext): void;
    CheckForChange(context: GameStateContext): void;
}

/**
 * Base game state class that provides empty implementations of all required methods
 */
export abstract class GameState implements IGameState {
    Enter(): void {}
    Exit(): void {}
    Update(delta: number): void {}
    Draw(context: GameContext): void {}
    CheckForChange(context: GameStateContext): void {}
}

/**
 * Game state context that manages the current state and state transitions
 */
export class GameStateContext {
    State: any = null;

    constructor(defaultState?: any) {
        if (defaultState) {
            this.State = defaultState;
            this.State.Enter();
        }
    }

    ChangeState(newState: IGameState): void {
        if (this.State) {
            this.State.Exit();
        }
        this.State = newState;
        this.State.Enter();
    }

    Update(delta: number): void {
        if (!this.State) {
            throw new Error("No current state to update");
        }
        this.State.CheckForChange(this);
        this.State.Update(delta);
    }

    Draw(context: GameContext): void {
        if (!this.State) {
            throw new Error("No current state to draw");
        }
        this.State.Draw(context);
    }
}
