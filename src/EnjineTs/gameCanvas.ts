/**
 * Base class to represent a double buffered canvas object.
 */
export class GameCanvas {
    Canvas: HTMLCanvasElement | null = null;
    Context2D: CanvasRenderingContext2D | null = null;
    BackBuffer: HTMLCanvasElement | null = null;
    BackBufferContext2D: CanvasRenderingContext2D | null = null;

    Initialize(canvasId: string, resWidth: number, resHeight: number): void {
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!canvas) {
            throw new Error(`Canvas element with id '${canvasId}' not found`);
        }

        const context = canvas.getContext("2d");
        if (!context) {
            throw new Error("Failed to get 2D context from canvas");
        }

        this.Canvas = canvas;
        this.Context2D = context;

        this.BackBuffer = document.createElement("canvas");
        this.BackBuffer.width = resWidth;
        this.BackBuffer.height = resHeight;

        const backBufferContext = this.BackBuffer.getContext("2d");
        if (!backBufferContext) {
            throw new Error("Failed to get 2D context from back buffer");
        }

        this.BackBufferContext2D = backBufferContext;
    }

    BeginDraw(): void {
        if (!this.BackBufferContext2D || !this.Context2D || !this.BackBuffer || !this.Canvas) {
            throw new Error("Canvas not initialized");
        }

        this.BackBufferContext2D.clearRect(0, 0, this.BackBuffer.width, this.BackBuffer.height);
        this.Context2D.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
    }

    EndDraw(): void {
        if (!this.Context2D || !this.BackBuffer || !this.Canvas) {
            throw new Error("Canvas not initialized");
        }

        this.Context2D.drawImage(this.BackBuffer, 0, 0, this.BackBuffer.width, this.BackBuffer.height, 0, 0, this.Canvas.width, this.Canvas.height);
    }
}
