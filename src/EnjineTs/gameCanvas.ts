/**
 * Base class to represent a double buffered canvas object.
 */
export class GameCanvas {
    private canvas: HTMLCanvasElement | null = null;
    private context2D: CanvasRenderingContext2D | null = null;
    private backBuffer: HTMLCanvasElement | null = null;
    private backBufferContext2D: CanvasRenderingContext2D | null = null;

    get Canvas(): HTMLCanvasElement | null {
        return this.canvas;
    }

    get Context2D(): CanvasRenderingContext2D | null {
        return this.context2D;
    }

    get BackBuffer(): HTMLCanvasElement | null {
        return this.backBuffer;
    }

    get BackBufferContext2D(): CanvasRenderingContext2D | null {
        return this.backBufferContext2D;
    }

    initialize(canvasId: string, resWidth: number, resHeight: number): void {
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!canvas) {
            throw new Error(`Canvas element with id '${canvasId}' not found`);
        }

        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error('Failed to get 2D context from canvas');
        }

        this.canvas = canvas;
        this.context2D = context;

        this.backBuffer = document.createElement('canvas');
        this.backBuffer.width = resWidth;
        this.backBuffer.height = resHeight;

        const backBufferContext = this.backBuffer.getContext('2d');
        if (!backBufferContext) {
            throw new Error('Failed to get 2D context from back buffer');
        }

        this.backBufferContext2D = backBufferContext;
    }

    beginDraw(): void {
        if (!this.backBufferContext2D || !this.context2D || !this.backBuffer || !this.canvas) {
            throw new Error('Canvas not initialized');
        }

        this.backBufferContext2D.clearRect(0, 0, this.backBuffer.width, this.backBuffer.height);
        this.context2D.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    endDraw(): void {
        if (!this.context2D || !this.backBuffer || !this.canvas) {
            throw new Error('Canvas not initialized');
        }

        this.context2D.drawImage(
            this.backBuffer,
            0, 0, this.backBuffer.width, this.backBuffer.height,
            0, 0, this.canvas.width, this.canvas.height
        );
    }
}
