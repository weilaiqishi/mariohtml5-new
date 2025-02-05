import { GameContext, Camera } from './types';

/**
 * Base class for all drawable objects, makes ordering automatic.
 */
export abstract class Drawable {
    protected zOrder: number = 0;

    get ZOrder(): number {
        return this.zOrder;
    }

    set ZOrder(value: number) {
        this.zOrder = value;
    }

    abstract draw(context: GameContext, camera?: Camera): void;
}
