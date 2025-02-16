import { GameContext, Camera } from "./types";

/**
 * Base class for all drawable objects, makes ordering automatic.
 */
export abstract class Drawable {
    public ZOrder: number = 0;

    abstract Draw(context: GameContext, camera?: Camera): void;
}

export type DrawableType = any;
