/**
	State that's shown when the player wins the game!
	Code by Rob Kleffner, 2011
*/

import { Enjine } from "../EnjineTs/core";
import { Mario } from "./setup";

export class WinState {
    waitTime
    drawManager
    camera
    font
    kissing
    wasKeyDown
    constructor() {
        this.waitTime = 2;
        this.drawManager = null;
        this.camera = null;
        this.font = null;
        this.kissing = null;
        this.wasKeyDown = false;
    }

    Enter() {
        this.drawManager = new Enjine.DrawableManager();
        this.camera = new Enjine.Camera();

        this.font = Mario.SpriteCuts.CreateBlackFont();
        this.font.Strings[0] = { String: "Thank you for saving me, Mario!", X: 36, Y: 160 };

        this.kissing = new Enjine.AnimatedSprite();
        this.kissing.Image = Enjine.Resources.Images["endScene"];
        this.kissing.X = 112;
        this.kissing.Y = 52;
        this.kissing.SetColumnCount(2);
        this.kissing.SetRowCount(1);
        this.kissing.AddNewSequence("loop", 0, 0, 0, 1);
        this.kissing.PlaySequence("loop", true);
        this.kissing.FramesPerSecond = 1 / 2;

        this.waitTime = 2;

        this.drawManager.Add(this.font);
        this.drawManager.Add(this.kissing);
    }

    Exit() {
        this.drawManager.Clear();
        delete this.drawManager;
        delete this.camera;
    }

    Update(delta) {
        this.drawManager.Update(delta);

        if (this.waitTime > 0) {
            this.waitTime -= delta;
        } else {
            if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.S)) {
                this.wasKeyDown = true;
            }
        }
    }

    Draw(context) {
        this.drawManager.Draw(context, this.camera);
    }

    CheckForChange(context) {
        if (this.waitTime <= 0) {
            if (this.wasKeyDown && !Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.S)) {
                context.ChangeState(new Mario.TitleState());
            }
        }
    }
}
