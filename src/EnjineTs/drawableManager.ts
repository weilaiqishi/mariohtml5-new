import { GameContext, Camera } from "./types";
import { DrawableType } from "./drawable";

/**
 * Class to help manage and draw a collection of sprites.
 */
export class DrawableManager {
    public Unsorted: boolean = true;
    public Objects: DrawableType[] = [];

    /**
     * Add a single drawable object to the manager
     */
    Add(object: DrawableType): void {
        this.Objects.push(object);
        this.Unsorted = true;
    }

    /**
     * Add multiple drawable objects to the manager
     */
    AddRange(objects: DrawableType[]): void {
        this.Objects = this.Objects.concat(objects);
        this.Unsorted = true;
    }

    /**
     * Remove all objects from the manager
     */
    Clear(): void {
        this.Objects = [];
    }

    /**
     * Check if the manager contains a specific object
     */
    Contains(obj: DrawableType): boolean {
        return this.Objects.includes(obj);
    }

    /**
     * Remove a specific object from the manager
     */
    Remove(object: DrawableType): void {
        const index = this.Objects.indexOf(object);
        if (index !== -1) {
            this.Objects.splice(index, 1);
        }
    }

    /**
     * Remove an object at a specific index
     */
    RemoveAt(index: number): void {
        this.Objects.splice(index, 1);
    }

    /**
     * Remove a range of objects starting at index
     */
    RemoveRange(index: number, length: number): void {
        this.Objects.splice(index, length);
    }

    /**
     * Remove a list of objects from the manager
     */
    RemoveList(items: DrawableType[]): void {
        for (const item of items) {
            const index = this.Objects.indexOf(item);
            if (index !== -1) {
                this.Objects.splice(index, 1);
            }
        }
    }

    /**
     * Update all objects in the manager
     */
    Update(delta: number): void {
        for (const obj of this.Objects) {
            if ("Update" in obj && typeof (obj as any).Update === "function") {
                (obj as any).Update(delta);
            }
        }
    }

    /**
     * Draw all objects in the manager
     */
    Draw(context: GameContext, camera: Camera): void {
        if (this.Unsorted) {
            // Sort objects by their Z order
            this.Objects.sort((a, b) => a.ZOrder - b.ZOrder);
            this.Unsorted = false;
        }

        for (const obj of this.Objects) {
            obj.Draw(context, camera);
        }
    }
}
