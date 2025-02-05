import { GameContext, Camera } from './types';
import { Drawable } from './drawable';

/**
 * Class to help manage and draw a collection of sprites.
 */
export class DrawableManager {
    private unsorted: boolean = true;
    private objects: Drawable[] = [];

    /**
     * Add a single drawable object to the manager
     */
    add(object: Drawable): void {
        this.objects.push(object);
        this.unsorted = true;
    }

    /**
     * Add multiple drawable objects to the manager
     */
    addRange(objects: Drawable[]): void {
        this.objects = this.objects.concat(objects);
        this.unsorted = true;
    }

    /**
     * Remove all objects from the manager
     */
    clear(): void {
        this.objects = [];
    }

    /**
     * Check if the manager contains a specific object
     */
    contains(obj: Drawable): boolean {
        return this.objects.includes(obj);
    }

    /**
     * Remove a specific object from the manager
     */
    remove(object: Drawable): void {
        const index = this.objects.indexOf(object);
        if (index !== -1) {
            this.objects.splice(index, 1);
        }
    }

    /**
     * Remove an object at a specific index
     */
    removeAt(index: number): void {
        this.objects.splice(index, 1);
    }

    /**
     * Remove a range of objects starting at index
     */
    removeRange(index: number, length: number): void {
        this.objects.splice(index, length);
    }

    /**
     * Remove a list of objects from the manager
     */
    removeList(items: Drawable[]): void {
        for (const item of items) {
            const index = this.objects.indexOf(item);
            if (index !== -1) {
                this.objects.splice(index, 1);
            }
        }
    }

    /**
     * Update all objects in the manager
     */
    update(delta: number): void {
        for (const obj of this.objects) {
            if ('update' in obj && typeof (obj as any).update === 'function') {
                (obj as any).update(delta);
            }
        }
    }

    /**
     * Draw all objects in the manager
     */
    draw(context: GameContext, camera: Camera): void {
        if (this.unsorted) {
            // Sort objects by their Z order
            this.objects.sort((a, b) => a.ZOrder - b.ZOrder);
            this.unsorted = false;
        }

        for (const obj of this.objects) {
            obj.draw(context, camera);
        }
    }
}
