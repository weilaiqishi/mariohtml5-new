/**
 * Core module that exports all Enjine components
 * Using ES6 modules system
 */

// Types
export * from './types';

// Core components
import { Application } from './application';
import { GameCanvas } from './gameCanvas';
import { GameTimer, IUpdateable } from './gameTimer';
import { KeyboardInput, Keys } from './keyboardInput';
import { Resources } from './resources';
import { Drawable } from './drawable';
import { DrawableManager } from './drawableManager';
import { Sprite } from './sprite';
import { FrameSprite } from './frameSprite';
import { AnimatedSprite, AnimationSequence } from './animatedSprite';
import { SpriteFont } from './spriteFont';
import { Camera } from './camera';
import { Collideable, IPositionable } from './collideable';
import { GameState, GameStateContext, IGameState } from './state';

/**
 * Main Enjine game engine class that contains all components
 */
export class Enjine {
    // Core Components
    static readonly Application = Application;
    static readonly GameCanvas = GameCanvas;
    static readonly GameTimer = GameTimer;
    static readonly KeyboardInput = KeyboardInput;
    static readonly Keys = Keys;
    static readonly Resources = Resources;

    // Drawing System
    static readonly Drawable = Drawable;
    static readonly DrawableManager = DrawableManager;
    static readonly Sprite = Sprite;
    static readonly FrameSprite = FrameSprite;
    static readonly AnimatedSprite = AnimatedSprite;
    static readonly AnimationSequence = AnimationSequence;
    static readonly SpriteFont = SpriteFont;

    // Game Mechanics
    static readonly Camera = Camera;
    static readonly Collideable = Collideable;
    static readonly GameState = GameState;
    static readonly GameStateContext = GameStateContext;

    // Prevent instantiation
    private constructor() {}

    /**
     * Initialize the game engine
     */
    static initialize(): void {
        // Initialize keyboard input
        this.KeyboardInput.initialize();
        // Initialize resources
        this.Resources.clearImages();
        this.Resources.clearSounds();
    }

    /**
     * Create a new game instance
     */
    static createGame(canvasId: string, width: number, height: number, defaultState?: IGameState): Application {
        const game = new this.Application();
        game.initialize(defaultState || new this.GameState(), width, height);
        return game;
    }
}

// Re-export types for TypeScript support
export type {
    IUpdateable,
    IPositionable,
    IGameState
};
