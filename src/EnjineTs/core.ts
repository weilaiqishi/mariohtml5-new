/**
 * Core module that exports all Enjine components
 * Using ES6 modules system
 */

// Types
export * from "./types";

// Core components
import { Application } from "./application";
import { GameCanvas } from "./gameCanvas";
import { GameTimer } from "./gameTimer";
import { KeyboardInput, Keys } from "./keyboardInput";
import { Resources } from "./resources";
import { Drawable } from "./drawable";
import { DrawableManager } from "./drawableManager";
import { Sprite } from "./sprite";
import { FrameSprite } from "./frameSprite";
import { AnimatedSprite, AnimationSequence } from "./animatedSprite";
import { SpriteFont } from "./spriteFont";
import { Camera } from "./camera";
import { Collideable, IPositionable } from "./collideable";
import { GameState, GameStateContext } from "./state";

/**
 * Main Enjine game engine class that contains all components
 */
export const Enjine = {
    // Core Components
    Application: Application,
    GameCanvas: GameCanvas,
    GameTimer: GameTimer,
    KeyboardInput: KeyboardInput,
    Keys: Keys,
    Resources: Resources,

    // Drawing System
    Drawable: Drawable,
    DrawableManager: DrawableManager,
    Sprite: Sprite,
    FrameSprite: FrameSprite,
    AnimatedSprite: AnimatedSprite,
    AnimationSequence: AnimationSequence,
    SpriteFont: SpriteFont,

    // Game Mechanics
    Camera: Camera,
    Collideable: Collideable,
    GameState: GameState,
    GameStateContext: GameStateContext,
};

window.Enjine = Enjine;

// Re-export types for TypeScript support
export type { IPositionable };
