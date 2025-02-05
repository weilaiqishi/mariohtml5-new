/**
 * Common types used across the Enjine game engine
 */

export interface Point {
    x: number;
    y: number;
}

export interface Size {
    width: number;
    height: number;
}

export interface Rectangle extends Point, Size {}

export interface Camera {
    X: number;
    Y: number;
}

export type GameContext = CanvasRenderingContext2D;
