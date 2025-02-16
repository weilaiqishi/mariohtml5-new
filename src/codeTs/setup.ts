/**
 * Global Mario namespace.
 * Code by Rob Kleffner, 2011
 * Converted to TypeScript by ChatGPT, 2025
 * Updated to ES6 class by Cascade, 2025
 */

import { SpriteCuts } from "./spriteCuts";
import { Level } from "./level";
import { BackgroundGenerator } from "./backgroundGenerator";
import { BackgroundRenderer } from "./backgroundRenderer";
import { ImprovedNoise } from "./improvedNoise";
import { NotchSprite } from "./notchSprite";
import { Character } from "./character";
import { LevelRenderer } from "./levelRenderer";
import { LevelGenerator } from "./levelGenerator";
import { SpriteTemplate } from "./spriteTemplate";
import { Enemy } from "./enemy";
import { Fireball } from "./fireball";
import { Sparkle } from "./sparkle";
import { CoinAnim } from "./coinAnim";
import { Mushroom } from "./mushroom";
import { Particle } from "./particle";
import { FireFlower } from "./fireFlower";
import { BulletBill } from "./bulletBill";
import { FlowerEnemy } from "./flowerEnemy";
import { Shell } from "./shell";
import { TitleState } from "./titleState";
import { LoadingState } from "./loadingState";
import { LoseState } from "./loseState";
import { WinState } from "./winState";
import { MapState } from "./mapState";
import { LevelState } from "./levelState";

export var Mario = {
    SpriteCuts: SpriteCuts,
    Level: Level,
    BackgroundGenerator: BackgroundGenerator,
    BackgroundRenderer: BackgroundRenderer,
    ImprovedNoise: ImprovedNoise,
    NotchSprite: NotchSprite,
    Character: Character,
    LevelRenderer: LevelRenderer,
    LevelGenerator: LevelGenerator,
    SpriteTemplate: SpriteTemplate,
    Enemy: Enemy,
    Fireball: Fireball,
    Sparkle: Sparkle,
    CoinAnim: CoinAnim,
    Mushroom: Mushroom,
    Particle: Particle,
    FireFlower: FireFlower,
    BulletBill: BulletBill,
    FlowerEnemy: FlowerEnemy,
    Shell: Shell,
    TitleState: TitleState,
    LoadingState: LoadingState,
    LoseState: LoseState,
    WinState: WinState,
    MapState: MapState,
    LevelState: LevelState,

    MarioCharacter: null as Character,
    GlobalMapState: null as MapState,

    LevelType: Level.LevelType,
    Odds: Level.Odds,
    Level1Type: 0,

    Tile: Level.Tile,

    MapTile: {
        Grass: 0,
        Water: 1,
        Level: 2,
        Road: 3,
        Decoration: 4,
    },

    midiFiles: {
        title: "midi/title.mid",
        map: "midi/map.mid",
        background: "midi/background.mid",
        overground: "midi/overground.mid",
        underground: "midi/underground.mid",
        castle: "midi/castle.mid",
    },

    PlayMusic(name: string): void {
        if (name in this.midiFiles) {
            // Currently we stop all playing tracks when playing a new one
            // MIDIjs can't play multiple at one time
            //MIDIjs.stop();
            //MIDIjs.play(this.midiFiles[name]);
        } else {
            console.error("Cannot play music track " + name + " as i have no data for it.");
        }
    },

    PlayTitleMusic(): void {
        this.PlayMusic("title");
    },

    PlayMapMusic(): void {
        this.PlayMusic("map");
    },

    PlayOvergroundMusic(): void {
        this.PlayMusic("background");
    },

    PlayUndergroundMusic(): void {
        this.PlayMusic("underground");
    },

    PlayCastleMusic(): void {
        this.PlayMusic("castle");
    },

    StopMusic(): void {
        //MIDIjs.stop();
    }
};

// Create global Mario object for backwards compatibility
declare global {
    interface Window {
        Mario: typeof Mario;
    }
}

window.Mario = Mario;
