/**
 * Keyboard key codes enum
 */
export enum Keys {
    A = 65,
    B = 66,
    C = 67,
    D = 68,
    E = 69,
    F = 70,
    G = 71,
    H = 72,
    I = 73,
    J = 74,
    K = 75,
    L = 76,
    M = 77,
    N = 78,
    O = 79,
    P = 80,
    Q = 81,
    R = 82,
    S = 83,
    T = 84,
    U = 85,
    V = 86,
    W = 87,
    X = 88,
    Y = 89,
    Z = 90,
    Left = 37,
    Up = 38,
    Right = 39,
    Down = 40,
}

/**
 * Class that helps to manage keyboard input.
 */
export class KeyboardInput {
    static Pressed: { [key: number]: boolean } = {};

    static Initialize(): void {
        document.onkeydown = (event: KeyboardEvent) => this.KeyDownEvent(event);
        document.onkeyup = (event: KeyboardEvent) => this.KeyUpEvent(event);
    }

    static IsKeyDown(key: Keys): boolean {
        return !!this.Pressed[key];
    }

    static KeyDownEvent(event: KeyboardEvent): void {
        this.Pressed[event.keyCode] = true;
        this.PreventScrolling(event);
    }

    static KeyUpEvent(event: KeyboardEvent): void {
        this.Pressed[event.keyCode] = false;
        this.PreventScrolling(event);
    }

    static PreventScrolling(event: KeyboardEvent): void {
        if ([Keys.Left, Keys.Right, Keys.Up, Keys.Down].includes(event.keyCode)) {
            event.preventDefault();
        }
    }
}
