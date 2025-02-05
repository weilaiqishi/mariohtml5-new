/**
 * Resource manager for images and sounds
 */

interface ImageResource {
    name: string;
    src: string;
}

interface SoundChannel extends HTMLAudioElement {
    index?: number;
}

interface SoundCollection {
    [key: string]: SoundChannel[];
    index?: number;
}

export class Resources {
    private static images: { [key: string]: HTMLImageElement } = {};
    private static sounds: SoundCollection = {};

    static destroy(): void {
        this.images = {};
        this.sounds = {};
    }

    // Image Management
    static addImage(name: string, src: string): void {
        const tempImage = new Image();
        this.images[name] = tempImage;
        tempImage.src = src;
    }

    static addImages(array: ImageResource[]): void {
        array.forEach(({name, src}) => {
            const tempImage = new Image();
            this.images[name] = tempImage;
            tempImage.src = src;
        });
    }

    static clearImages(): void {
        this.images = {};
    }

    static removeImage(name: string): void {
        delete this.images[name];
    }

    static getImage(name: string): HTMLImageElement | undefined {
        return this.images[name];
    }

    // Sound Management
    static addSound(name: string, src: string, maxChannels: number = 3): void {
        this.sounds[name] = [];
        this.sounds.index = 0;
        
        for (let i = 0; i < maxChannels; i++) {
            const audio = new Audio(src) as SoundChannel;
            audio.index = i;
            this.sounds[name][i] = audio;
        }
    }

    static clearSounds(): void {
        this.sounds = {};
    }

    static removeSound(name: string): void {
        delete this.sounds[name];
    }

    static playSound(name: string, loop: boolean = false): void {
        if (!this.sounds[name]) return;
        
        const soundArray = this.sounds[name];
        const soundChannel = soundArray[this.sounds.index || 0];
        
        if (soundChannel) {
            soundChannel.loop = loop;
            soundChannel.play();
            this.sounds.index = (this.sounds.index || 0 + 1) % soundArray.length;
        }
    }

    static pauseChannel(name: string, index: number): void {
        if (this.sounds[name] && this.sounds[name][index]) {
            this.sounds[name][index].pause();
        }
    }

    static pauseSound(name: string): void {
        if (!this.sounds[name]) return;
        
        const soundArray = this.sounds[name];
        soundArray.forEach(channel => channel.pause());
    }

    static resetChannel(name: string, index: number): void {
        if (this.sounds[name] && this.sounds[name][index]) {
            this.sounds[name][index].currentTime = 0;
        }
    }

    static resetSound(name: string): void {
        if (!this.sounds[name]) return;
        
        const soundArray = this.sounds[name];
        soundArray.forEach(channel => {
            channel.pause();
            channel.currentTime = 0;
        });
    }

    static stopLoop(name: string, index: number): void {
        if (this.sounds[name] && this.sounds[name][index]) {
            this.sounds[name][index].loop = false;
        }
    }
}
