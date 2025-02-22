/**
	State shown when the player loses!
	Code by Rob Kleffner, 2011
*/

import { AnimatedSprite } from "../EnjineTs/animatedSprite";
import { Camera, Enjine } from "../EnjineTs/core";
import { DrawableManager } from "../EnjineTs/drawableManager";
import { Mario } from "./setup";

export class LoseState {
    static instance = new LoseState();
    drawManager: DrawableManager | null;
    camera: Camera | null;
    gameOver: AnimatedSprite | null;
    font: any;
    wasKeyDown: boolean;

    constructor() {
        this.drawManager = null;
        this.camera = null;
        this.gameOver = null;
        this.font = null;
        this.wasKeyDown = false;
    }

    Enter(): void {
        this.drawManager = new Enjine.DrawableManager();
        this.camera = new Enjine.Camera();

        this.gameOver = new Enjine.AnimatedSprite();
        this.gameOver.Image = Enjine.Resources.Images["gameOverGhost"];
        this.gameOver.SetColumnCount(9);
        this.gameOver.SetRowCount(1);
        this.gameOver.AddNewSequence("turnLoop", 0, 0, 0, 8);
        this.gameOver.PlaySequence("turnLoop", true);
        this.gameOver.FramesPerSecond = 1 / 15;
        this.gameOver.X = 112;
        this.gameOver.Y = 68;

        this.font = Mario.SpriteCuts.CreateWhiteFont();
        this.font.Strings[0] = { String: "Game over!", X: 116, Y: 160 };

        this.drawManager.Add(this.font);
        this.drawManager.Add(this.gameOver);
    }

    Exit(): void {
        this.drawManager.Clear();
        delete this.drawManager;
        delete this.camera;
        delete this.gameOver;
        delete this.font;
    }

    Update(delta: number): void {
        this.drawManager.Update(delta);
        if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.S)) {
            this.wasKeyDown = true;
        }
    }

    Draw(context: CanvasRenderingContext2D): void {
        this.drawManager.Draw(context, this.camera);
    }

    CheckForChange(context: { ChangeState: (state: any) => void }): void {
        if (this.wasKeyDown && !Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.S)) {
            context.ChangeState(new Mario.TitleState());
        }
    }
}
