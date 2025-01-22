/**
    Class to represent an uninterrupted set of frames to animate.
*/

interface ISequence {
  StartRow: number;
  StartColumn: number;
  EndRow: number;
  EndColumn: number;
  SingleFrame: boolean;
}

interface ISprite {
  X: number;
  Y: number;
  Image: HTMLImageElement | null;
  Draw(context: CanvasRenderingContext2D, camera: Camera): void;
}

interface IDrawable {
  ZOrder: number;
  Draw(context: CanvasRenderingContext2D, camera?: Camera): void;
}

interface IUpdateable {
  Update(delta: number): void;
}

interface IResources {
  Images: { [key: string]: HTMLImageElement };
  Sounds: { [key: string]: { index: number; sound: HTMLAudioElement[] } };
  Destroy(): IResources;
  AddImage(name: string, src: string): IResources;
  AddImages(array: Array<{ name: string; src: string }>): IResources;
  ClearImages(): IResources;
  RemoveImage(name: string): IResources;
  AddSound(name: string, src: string, maxChannels?: number): IResources;
  ClearSounds(): IResources;
  RemoveSound(name: string): IResources;
  PlaySound(name: string, loop?: boolean): number;
  PauseChannel(name: string, index: number): IResources;
  PauseSound(name: string): IResources;
  ResetChannel(name: string, index: number): IResources;
  ResetSound(name: string): IResources;
  StopLoop(name: string, index: number): void;
  LoopCallback(this: HTMLAudioElement): void;
}

interface IKeys {
  A: number;
  B: number;
  C: number;
  D: number;
  E: number;
  F: number;
  G: number;
  H: number;
  I: number;
  J: number;
  K: number;
  L: number;
  M: number;
  N: number;
  O: number;
  P: number;
  Q: number;
  R: number;
  S: number;
  T: number;
  U: number;
  V: number;
  W: number;
  X: number;
  Y: number;
  Z: number;
  Left: number;
  Up: number;
  Right: number;
  Down: number;
}

class AnimationSequence implements ISequence {
  public StartRow: number;
  public StartColumn: number;
  public EndRow: number;
  public EndColumn: number;
  public SingleFrame: boolean;

  constructor(startRow: number, startColumn: number, endRow: number, endColumn: number) {
    this.StartRow = startRow;
    this.StartColumn = startColumn;
    this.EndRow = endRow;
    this.EndColumn = endColumn;
    this.SingleFrame = false;
    
    if (this.StartRow === this.EndRow && this.StartColumn === this.EndColumn) {
      this.SingleFrame = true;
    }
  }
}

/**
	Base class for all drawable objects, makes ordering automatic.
	Code by Rob Kleffner, 2011
*/
class Drawable implements IDrawable {
  public ZOrder: number;

  constructor() {
    this.ZOrder = 0;
  }

  public Draw(context: CanvasRenderingContext2D, camera?: Camera): void {}
}

/**
	Represents a simple static sprite.
	Code by Rob Kleffner, 2011
*/
class Sprite extends Drawable implements ISprite {
  public X: number;
  public Y: number;
  public Image: HTMLImageElement | null;

  constructor() {
    super();
    this.X = 0;
    this.Y = 0;
    this.Image = null;
  }

  public Draw(context: CanvasRenderingContext2D, camera: Camera): void {
    if (!this.Image) return;
    context.drawImage(this.Image, this.X - camera.X, this.Y - camera.Y);
  }
}

/**
	For sprites that are only a portion of an image.
	Code by Rob Kleffner, 2011
*/
class FrameSprite extends Sprite {
  public FrameX: number;
  public FrameY: number;
  public FrameWidth: number;
  public FrameHeight: number;

  constructor() {
    super();
    this.FrameX = 0;
    this.FrameY = 0;
    this.FrameWidth = 0;
    this.FrameHeight = 0;
  }

  public Draw(context: CanvasRenderingContext2D, camera: Camera): void {
    if (!this.Image) return;
    context.drawImage(
      this.Image,
      this.FrameX,
      this.FrameY,
      this.FrameWidth,
      this.FrameHeight,
      this.X - camera.X,
      this.Y - camera.Y,
      this.FrameWidth,
      this.FrameHeight
    );
  }
}

/**
Subclass that extends the regular sprite with animation capability.
Code by Rob Kleffner, 2011
*/
class AnimatedSprite extends FrameSprite implements IUpdateable {
  public LastElapsed: number;
  public FramesPerSecond: number;
  public CurrentSequence: ISequence | null;
  public Playing: boolean;
  public Looping: boolean;
  public Rows: number;
  public Columns: number;
  public Sequences: { [key: string]: ISequence };

  constructor() {
    super();
    this.LastElapsed = 0;
    this.FramesPerSecond = 1 / 20;
    this.CurrentSequence = null;
    this.Playing = false;
    this.Looping = false;
    this.Rows = 0;
    this.Columns = 0;
    this.Sequences = {};
  }

  public Update(delta: number): void {
    if (!this.CurrentSequence || this.CurrentSequence.SingleFrame) return;
    if (!this.Playing) return;

    this.LastElapsed -= delta;
    if (this.LastElapsed > 0) return;

    this.LastElapsed = this.FramesPerSecond;
    this.FrameX += this.FrameWidth;

    if (this.FrameX > (this.Image?.width || 0) - this.FrameWidth) {
      this.FrameX = 0;
      this.FrameY += this.FrameHeight;

      if (this.FrameY > (this.Image?.height || 0) - this.FrameHeight) {
        this.FrameY = 0;
      }
    }

    let seqEnd = false;
    if ((this.FrameX > (this.CurrentSequence.EndColumn * this.FrameWidth)) && 
        (this.FrameY === (this.CurrentSequence.EndRow * this.FrameHeight))) {
      seqEnd = true;
    } else if (this.FrameX === 0 && (this.FrameY > (this.CurrentSequence.EndRow * this.FrameHeight))) {
      seqEnd = true;
    }

    if (seqEnd) {
      if (this.Looping) {
        this.FrameX = this.CurrentSequence.StartColumn * this.FrameWidth;
        this.FrameY = this.CurrentSequence.StartRow * this.FrameHeight;
      } else {
        this.Playing = false;
      }
    }
  }

  public PlaySequence(seqName: string, loop: boolean): void {
    this.Playing = true;
    this.Looping = loop;
    this.CurrentSequence = this.Sequences[`seq_${seqName}`];
    if (!this.CurrentSequence) return;
    this.FrameX = this.CurrentSequence.StartColumn * this.FrameWidth;
    this.FrameY = this.CurrentSequence.StartRow * this.FrameHeight;
  }

  public StopLooping(): void {
    this.Looping = false;
  }

  public StopPlaying(): void {
    this.Playing = false;
  }

  public SetFrameWidth(width: number): void {
    this.FrameWidth = width;
    this.Rows = (this.Image?.width || 0) / this.FrameWidth;
  }

  public SetFrameHeight(height: number): void {
    this.FrameHeight = height;
    this.Columns = (this.Image?.height || 0) / this.FrameHeight;
  }

  public SetColumnCount(columnCount: number): void {
    this.FrameWidth = (this.Image?.width || 0) / columnCount;
    this.Columns = columnCount;
  }

  public SetRowCount(rowCount: number): void {
    this.FrameHeight = (this.Image?.height || 0) / rowCount;
    this.Rows = rowCount;
  }

  public AddExistingSequence(name: string, sequence: ISequence): void {
    this.Sequences[`seq_${name}`] = sequence;
  }

  public AddNewSequence(name: string, startRow: number, startColumn: number, endRow: number, endColumn: number): void {
    this.Sequences[`seq_${name}`] = new AnimationSequence(startRow, startColumn, endRow, endColumn);
  }

  public DeleteSequence(name: string): void {
    delete this.Sequences[`seq_${name}`];
  }

  public ClearSequences(): void {
    this.Sequences = {};
  }
}

/**
	Represents a camera used to offset drawing of sprites in the world.
	Code by Rob Kleffner, 2011
*/

class Camera {
  public X: number;
  public Y: number;

  constructor() {
    this.X = 0;
    this.Y = 0;
  }
}

/**
	Basic bounding box collision object.
	Code by Rob Kleffner, 2011
*/

class Collideable {
  public Base: ISprite;
  public X: number;
  public Y: number;
  public Width: number;
  public Height: number;
  public CollisionEvent: (other: Collideable) => void;

  constructor(obj: ISprite, width: number, height: number, collisionEvent?: (other: Collideable) => void) {
    this.Base = obj;
    this.X = obj.X;
    this.Y = obj.Y;
    this.Width = width;
    this.Height = height;
    this.CollisionEvent = collisionEvent || function() {};
  }

  public Update(): void {
    this.X = this.Base.X;
    this.Y = this.Base.Y;
  }

  public CheckCollision(other: Collideable): void {
    const left1 = this.X;
    const left2 = other.X;
    const right1 = this.X + this.Width;
    const right2 = other.X + other.Width;
    const top1 = this.Y;
    const top2 = other.Y;
    const bottom1 = this.Y + this.Height;
    const bottom2 = other.Y + other.Height;

    if (bottom1 < top2) return;
    if (top1 > bottom2) return;
    if (right1 < left2) return;
    if (left1 > right2) return;

    this.CollisionEvent(other);
    other.CollisionEvent(this);
  }
}

/**
	Class to help manage and draw a collection of sprites.
	Code by Rob Kleffner, 2011
*/

class DrawableManager {
  public Unsorted: boolean;
  public Objects: IDrawable[];

  constructor() {
    this.Unsorted = true;
    this.Objects = [];
  }

  public Add(object: IDrawable): void {
    this.Objects.push(object);
    this.Unsorted = true;
  }

  public AddRange(objects: IDrawable[]): void {
    this.Objects = this.Objects.concat(objects);
    this.Unsorted = true;
  }

  public Clear(): void {
    this.Objects = [];
  }

  public Contains(obj: IDrawable): boolean {
    return this.Objects.includes(obj);
  }

  public Remove(object: IDrawable): void {
    const index = this.Objects.indexOf(object);
    if (index > -1) {
      this.Objects.splice(index, 1);
    }
  }

  public RemoveAt(index: number): void {
    this.Objects.splice(index, 1);
  }

  public RemoveRange(index: number, length: number): void {
    this.Objects.splice(index, length);
  }

  public RemoveList(items: IDrawable[]): void {
    this.Objects = this.Objects.filter(obj => !items.includes(obj));
  }

  public Update(delta: number): void {
    this.Objects.forEach(obj => {
      if ((obj as unknown as IUpdateable).Update) {
        (obj as unknown as IUpdateable).Update(delta);
      }
    });
  }

  public Draw(context: CanvasRenderingContext2D, camera: Camera): void {
    if (this.Unsorted) {
      this.Objects.sort((x1, x2) => x1.ZOrder - x2.ZOrder);
      this.Unsorted = false;
    }

    this.Objects.forEach(obj => {
      if (obj.Draw) {
        obj.Draw(context, camera);
      }
    });
  }
}

/**
	Represents a simple static sprite.
	Code by Rob Kleffner, 2011
*/

const Resources: IResources = {
  Images: {},
  Sounds: {},

  Destroy(): IResources {
    this.Images = {};
    this.Sounds = {};
    return this;
  },

  //***********************/
  //Images
  AddImage(name: string, src: string): IResources {
    const tempImage = new Image();
    this.Images[name] = tempImage;
    tempImage.src = src;
    return this;
  },

  AddImages(array: Array<{ name: string; src: string }>): IResources {
    array.forEach(({ name, src }) => {
      const tempImage = new Image();
      this.Images[name] = tempImage;
      tempImage.src = src;
    });
    return this;
  },

  ClearImages(): IResources {
    this.Images = {};
    return this;
  },

  RemoveImage(name: string): IResources {
    delete this.Images[name];
    return this;
  },

  //***********************/
  //Sounds
  AddSound(name: string, src: string, maxChannels: number = 3): IResources {
    this.Sounds[name] = {
      index: 0,
      sound: Array.from({ length: maxChannels }, () => new Audio(src))
    };
    return this;
  },

  ClearSounds(): IResources {
    this.Sounds = {};
    return this;
  },

  RemoveSound(name: string): IResources {
    delete this.Sounds[name];
    return this;
  },

  PlaySound(name: string, loop?: boolean): number {
    const soundObj = this.Sounds[name];
    if (!soundObj) return 0;
    
    if (soundObj.index >= soundObj.sound.length) {
      soundObj.index = 0;
    }
    
    if (loop) {
      soundObj.sound[soundObj.index].addEventListener('ended', this.LoopCallback, false);
    }
    
    soundObj.sound[soundObj.index].play();
    return soundObj.index++;
  },

  PauseChannel(name: string, index: number): IResources {
    const soundObj = this.Sounds[name];
    if (soundObj?.sound[index] && !soundObj.sound[index].paused) {
      soundObj.sound[index].pause();
    }
    return this;
  },

  PauseSound(name: string): IResources {
    const soundObj = this.Sounds[name];
    if (soundObj) {
      soundObj.sound.forEach(audio => {
        if (!audio.paused) {
          audio.pause();
        }
      });
    }
    return this;
  },

  ResetChannel(name: string, index: number): IResources {
    const soundObj = this.Sounds[name];
    if (soundObj?.sound[index]) {
      soundObj.sound[index].currentTime = 0;
      this.StopLoop(name, index);
    }
    return this;
  },

  ResetSound(name: string): IResources {
    const soundObj = this.Sounds[name];
    if (soundObj) {
      soundObj.sound.forEach((audio, index) => {
        audio.currentTime = 0;
        this.StopLoop(name, index);
      });
    }
    return this;
  },

  StopLoop(name: string, index: number): void {
    const soundObj = this.Sounds[name];
    if (soundObj?.sound[index]) {
      soundObj.sound[index].removeEventListener('ended', this.LoopCallback, false);
    }
  },

  LoopCallback(this: HTMLAudioElement): void {
    this.currentTime = 0;
    this.play();
  }
};

/**
	Represents a sprite sheet for a font.
	Code by Rob Kleffner, 2011
*/

class SpriteFont {
  public Image: HTMLImageElement;
  public Letters: { [key: number]: { X: number; Y: number } };
  public LetterWidth: number;
  public LetterHeight: number;
  public Strings: Array<{ String: string; X: number; Y: number }>;

  constructor(
    strings: Array<{ String: string; X: number; Y: number }>,
    image: HTMLImageElement,
    letterWidth: number,
    letterHeight: number,
    letters: { [key: number]: { X: number; Y: number } }
  ) {
    this.Image = image;
    this.Letters = letters;
    this.LetterWidth = letterWidth;
    this.LetterHeight = letterHeight;
    this.Strings = strings;
  }

  public Draw(context: CanvasRenderingContext2D): void {
    this.Strings.forEach(string => {
      for (let i = 0; i < string.String.length; i++) {
        const code = string.String.charCodeAt(i);
        const letter = this.Letters[code];
        if (!letter) continue;
        
        context.drawImage(
          this.Image,
          letter.X,
          letter.Y,
          this.LetterWidth,
          this.LetterHeight,
          string.X + this.LetterWidth * (i + 1),
          string.Y,
          this.LetterWidth,
          this.LetterHeight
        );
      }
    });
  }
}

/**
	Simple State pattern implementation for game states.
	Code by Rob Kleffner, 2011
*/

class GameStateContext {
  public State: GameState | null;

  constructor(defaultState: GameState) {
    this.State = null;
    if (defaultState != null) {
      this.State = defaultState;
      this.State.Enter();
    }
  }

  ChangeState(newState: GameState): void {
    if (this.State != null) {
      this.State.Exit();
    }
    this.State = newState;
    this.State.Enter();
  }

  Update(delta: number): void {
    if (!this.State) return;
    this.State.CheckForChange(this);
    this.State.Update(delta);
  }

  Draw(delta): void {
    if (!this.State) return;
    this.State.Draw(delta);
  }
}

/**
 * Base game state class to at least ensure that all the functions exist.
 */
class GameState {
  constructor() {}

  Enter(): void {}
  Exit(): void {}
  Update(delta: number): void {}
  Draw(context: CanvasRenderingContext2D): void {}
  CheckForChange(context: GameStateContext): void {}
}

class GameCanvas {
  public Canvas: HTMLCanvasElement | null;
  public Context2D: CanvasRenderingContext2D | null;
  public BackBuffer: HTMLCanvasElement | null;
  public BackBufferContext2D: CanvasRenderingContext2D | null;

  constructor() {
    this.Canvas = null;
    this.Context2D = null;
    this.BackBuffer = null;
    this.BackBufferContext2D = null;
  }

  public Initialize(canvasId: string, resWidth: number, resHeight: number): void {
    this.Canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.Context2D = this.Canvas.getContext("2d");
    this.BackBuffer = document.createElement("canvas");
    this.BackBuffer.width = resWidth;
    this.BackBuffer.height = resHeight;
    this.BackBufferContext2D = this.BackBuffer.getContext("2d");
  }

  public BeginDraw(): void {
    if (!this.BackBuffer || !this.Canvas || !this.BackBufferContext2D || !this.Context2D) return;
    this.BackBufferContext2D.clearRect(0, 0, this.BackBuffer.width, this.BackBuffer.height);
    this.Context2D.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
  }

  public EndDraw(): void {
    if (!this.BackBuffer || !this.Canvas || !this.Context2D) return;
    this.Context2D.drawImage(this.BackBuffer, 0, 0, this.BackBuffer.width, this.BackBuffer.height, 0, 0, this.Canvas.width, this.Canvas.height);
  }
}

class GameTimer {
  public FramesPerSecond: number;
  public LastTime: number;
  public IntervalFunc: number | null;
  public UpdateObject: IUpdateable | null;

  constructor() {
    this.FramesPerSecond = 1000 / 30;
    this.LastTime = 0;
    this.IntervalFunc = null;
    this.UpdateObject = null;
  }

  public Start(): void {
    this.LastTime = Date.now();
    this.IntervalFunc = window.setInterval(() => this.Tick(), this.FramesPerSecond);
  }

  public Tick(): void {
    if (!this.UpdateObject) return;
    const newTime = Date.now();
    const delta = (newTime - this.LastTime) / 1000;
    this.LastTime = newTime;
    this.UpdateObject.Update(delta);
  }

  public Stop(): void {
    if (this.IntervalFunc !== null) {
      clearInterval(this.IntervalFunc);
    }
  }
}

class Application {
  public canvas: GameCanvas | null;
  public timer: GameTimer | null;
  public stateContext: GameStateContext | null;

  constructor() {
    this.canvas = null;
    this.timer = null;
    this.stateContext = null;
  }

  Update(delta: number): void {
    if (!this.stateContext || !this.canvas) return;
    this.stateContext.Update(delta);
    this.canvas.BeginDraw();
    this.stateContext.Draw(this.canvas.BackBufferContext2D);
    this.canvas.EndDraw();
  }

  Initialize(defaultState: GameState, resWidth: number, resHeight: number): void {
    this.canvas = new GameCanvas();
    this.timer = new GameTimer();
    this.canvas.Initialize('canvas', resWidth, resHeight);
    this.timer.UpdateObject = this;
    this.stateContext = new GameStateContext(defaultState);
    this.timer.Start();
  }
}

const KeyboardInput = {
  Pressed: [],

  Initialize(): void {
    document.onkeydown = (event: KeyboardEvent) => this.KeyDownEvent(event);
    document.onkeyup = (event: KeyboardEvent) => this.KeyUpEvent(event);
  },

  IsKeyDown(key: number): boolean {
    return !!this.Pressed[key];
  },

  KeyDownEvent(event: KeyboardEvent): void {
    this.Pressed[event.keyCode] = true;
    this.PreventScrolling(event);
  },

  KeyUpEvent(event: KeyboardEvent): void {
    this.Pressed[event.keyCode] = false;
    this.PreventScrolling(event);
  },

  PreventScrolling(event: KeyboardEvent): void {
    if (event.keyCode >= 37 && event.keyCode <= 40) {
      event.preventDefault();
    }
  }
};

export const Enjine = {
  AnimationSequence,
  AnimatedSprite,
  Camera,
  Collideable,
  Drawable,
  DrawableManager,
  FrameSprite,
  Resources,
  Sprite,
  SpriteFont,
  GameCanvas,
  GameTimer,
  Application,
  KeyboardInput
};
export default Enjine

export type {
  ISequence,
  ISprite,
  IDrawable,
  IUpdateable,
  IResources,
  IKeys
};
