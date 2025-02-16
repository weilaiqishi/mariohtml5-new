/**
 * Resource manager for images and sounds
 * Code by Rob Kleffner, 2011
 */

interface ImageResource {
    name: string;
    src: string;
}

interface SoundCollection {
    [key: string]: HTMLAudioElement[];
}

export class Resources {
    static Images: { [key: string]: HTMLImageElement } = {};
    static Sounds: SoundCollection = {};

    static Destroy(): Resources {
        this.Images = {};
        this.Sounds = {};
        return this;
    }

    // Image Management
    static AddImage(name: string, src: string): Resources {
        const tempImage = new Image();
        this.Images[name] = tempImage;
        tempImage.src = src;
        return this;
    }

    static AddImages(array: ImageResource[]): Resources {
        array.forEach(({ name, src }) => {
            const tempImage = new Image();
            this.Images[name] = tempImage;
            tempImage.src = src;
        });
        return this;
    }

    static ClearImages(): Resources {
        this.Images = {};
        return this;
    }

    static RemoveImage(name: string): Resources {
        delete this.Images[name];
        return this;
    }

    // Sound Management
    static AddSound(name: string, src: string, maxChannels: number = 3): Resources {
        this.Sounds[name] = [];
        this.Sounds[name].index = 0;
        if (!maxChannels) {
        	maxChannels = 3;
        }
        for (var i = 0; i < maxChannels; i++) {
        	this.Sounds[name][i] = new Audio(src);	
        }
        return this;
    }

    static ClearSounds(): Resources {
        this.Sounds = {};
        return this;
    }

    static RemoveSound(name: string): Resources {
        delete this.Sounds[name];
        return this;
    }

    static PlaySound(name: string, loop: boolean = false): number {
    	if (this.Sounds[name].index >= this.Sounds[name].length) {
    		this.Sounds[name].index = 0;	
    	}
    	if (loop) {
    		this.Sounds[name][this.Sounds[name].index].addEventListener("ended", this.LoopCallback, false);
    	}
    	this.Sounds[name][this.Sounds[name].index++].play();
    	return this.Sounds[name].index;
    }

    static PauseChannel(name: string, index: number): Resources {
    	if (!this.Sounds[name][index].paused) {
    		this.Sounds[name][index].pause();
    	}
    	return this;
    }

    static PauseSound(name: string): Resources {
    	for (var i = 0; i < this.Sounds[name].length; i++) {
    		if (!this.Sounds[name][i].paused) {
    			this.Sounds[name][i].pause();
    		}
    	}
    	return this;
    }

    static ResetChannel(name: string, index: number): Resources {
    	this.Sounds[name][index].currentTime = 0;
    	this.StopLoop(name, index);
    	return this;
    }

    static ResetSound(name: string): Resources {
    	for (var i = 0; i < this.Sounds[name].length; i++) {
    		this.Sounds[name].currentTime = 0;
    		this.StopLoop(name, i);
    	}
    	return this;
    }

    static StopLoop(name: string, index: number): void {
        if (this.Sounds[name] && this.Sounds[name][index]) {
            this.Sounds[name][index].removeEventListener("ended", this.LoopCallback, false);
        }
    }

    private static LoopCallback(this: HTMLAudioElement): void {
        this.currentTime = -1;
        this.play();
    }
}
