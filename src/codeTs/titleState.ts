/**
 * Displays the title screen and menu.
 * Code by Rob Kleffner, 2011
 */

import { Enjine } from "../EnjineTs/core";
import { GameState } from "../EnjineTs/state";
import { Mario } from "./setup";

export class TitleState extends GameState {
    drawManager: any;
    camera: any;
    logoY: number;
    bounce: number;
    font: any;
    title: any;
    logo: any;

    constructor() {
        super();
        this.drawManager = null;
        this.camera = null;
        this.logoY = null;
        this.bounce = null;
        this.font = null;
    }

    Enter(): void {
        this.drawManager = new Enjine.DrawableManager();
        this.camera = new Enjine.Camera();

        const bgGenerator = new Mario.BackgroundGenerator(2048, 15, true, Mario.LevelType.Overground);
        const bgLayer0 = new Mario.BackgroundRenderer(bgGenerator.CreateLevel(), 320, 240, 2);
        bgGenerator.SetValues(2048, 15, false, Mario.LevelType.Overground);
        const bgLayer1 = new Mario.BackgroundRenderer(bgGenerator.CreateLevel(), 320, 240, 1);

        this.title = new Enjine.Sprite();
        this.title.Image = Enjine.Resources.Images["title"];
        this.title.X = 0;
        this.title.Y = 120;

        this.logo = new Enjine.Sprite();
        this.logo.Image = Enjine.Resources.Images["logo"];
        this.logo.X = 0;
        this.logo.Y = 0;

        this.font = Mario.SpriteCuts.CreateRedFont();
        this.font.Strings[0] = { String: "Press S to Start", X: 96, Y: 120 };

        this.logoY = 20;

        this.drawManager.Add(bgLayer0);
        this.drawManager.Add(bgLayer1);

        this.bounce = 0;

        Mario.GlobalMapState = new Mario.MapState();
        // Set up the global main character variable
        Mario.MarioCharacter = new Mario.Character();
        Mario.MarioCharacter.Image = Enjine.Resources.Images["smallMario"];

        Mario.PlayTitleMusic();
    }

    Exit(): void {
        Mario.StopMusic();

        this.drawManager.Clear();
        delete this.drawManager;
        delete this.camera;
        delete this.font;
    }

    Update(delta: number): void {
        this.bounce += delta * 2;
        this.logoY = 20 + Math.sin(this.bounce) * 10;

        this.camera.X += delta * 25;

        this.drawManager.Update(delta);
    }

    Draw(context: CanvasRenderingContext2D): void {
        this.drawManager.Draw(context, this.camera);

        context.drawImage(Enjine.Resources.Images["title"], 0, 120);
        context.drawImage(Enjine.Resources.Images["logo"], 0, this.logoY);

        this.font.Draw(context, this.Camera);
    }

    CheckForChange(context: any): void {
        if (Enjine.KeyboardInput.IsKeyDown(Enjine.Keys.S)) {
            context.ChangeState(Mario.GlobalMapState);
        }
    }
}
