/**
 * Utility functions for the game
 */

// Logger utility to log messages and also update the progress.log file
class Logger {
    static log(message) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${message}`;
        console.log(logMessage);
        
        // Append to progress.log
        this.appendToLog(logMessage);
    }
    
    static warn(message) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] WARNING: ${message}`;
        console.warn(logMessage);
        
        // Append to progress.log
        this.appendToLog(logMessage);
    }
    
    static error(message, error) {
        const timestamp = new Date().toISOString();
        let logMessage = `[${timestamp}] ERROR: ${message}`;
        
        // Format the error object properly
        if (error) {
            if (error instanceof Error) {
                logMessage += ` ${error.message || error}`;
            } else if (typeof error === 'object') {
                try {
                    // Try to stringify the object
                    const errorStr = JSON.stringify(error);
                    logMessage += ` ${errorStr}`;
                } catch (e) {
                    // If stringification fails, use a simpler approach
                    if (error.toString && error.toString() !== '[object Object]') {
                        logMessage += ` ${error.toString()}`;
                    } else {
                        // For objects that don't stringify well, extract properties
                        const props = [];
                        for (const key in error) {
                            if (Object.prototype.hasOwnProperty.call(error, key)) {
                                props.push(`${key}=${error[key]}`);
                            }
                        }
                        logMessage += ` {${props.join(', ')}}`;
                    }
                }
            } else {
                logMessage += ` ${error}`;
            }
        }
        
        console.error(logMessage);
        
        // Append to progress.log
        this.appendToLog(logMessage);
    }
    
    static appendToLog(message) {
        // In a real implementation, this would use a server-side API to write to the file
        // For now, we'll just log to console with a note
        console.info('Would append to progress.log:', message);
        
        // In a real implementation with server access, we would do something like:
        // fetch('/api/log', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ message })
        // });
    }
}

// Asset loader with progress tracking
class AssetLoader {
    constructor(onProgress, onComplete) {
        this.totalAssets = 0;
        this.loadedAssets = 0;
        this.assets = {
            fonts: {}  // Store fonts separately
        };
        this.onProgress = onProgress || (() => {});
        this.onComplete = onComplete || (() => {});
    }
    
    loadTexture(name, path) {
        this.totalAssets++;
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(
            path,
            (texture) => {
                this.assets[name] = texture;
                this.assetLoaded();
            },
            (xhr) => {
                // Progress callback if needed
            },
            (error) => {
                console.error(`Error loading texture ${name}:`, error);
                this.assetLoaded();
            }
        );
    }
    
    loadModel(name, path) {
        this.totalAssets++;
        const loader = new THREE.GLTFLoader();
        loader.load(
            path,
            (gltf) => {
                this.assets[name] = gltf;
                this.assetLoaded();
            },
            (xhr) => {
                // Progress callback if needed
            },
            (error) => {
                console.error(`Error loading model ${name}:`, error);
                this.assetLoaded();
            }
        );
    }
    
    loadSound(name, path) {
        this.totalAssets++;
        const audio = new Audio();
        audio.src = path;
        audio.addEventListener('canplaythrough', () => {
            this.assets[name] = audio;
            this.assetLoaded();
        }, { once: true });
        audio.addEventListener('error', () => {
            console.error(`Error loading sound ${name}`);
            this.assetLoaded();
        }, { once: true });
    }
    
    loadFont(name, path) {
        this.totalAssets++;
        const fontLoader = new THREE.FontLoader();
        fontLoader.load(
            path,
            (font) => {
                this.assets.fonts[name] = font;
                this.assetLoaded();
            },
            (xhr) => {
                // Progress callback if needed
            },
            (error) => {
                console.error(`Error loading font ${name}:`, error);
                // Create a fallback font
                this.assets.fonts[name] = null;
                this.assetLoaded();
            }
        );
    }
    
    assetLoaded() {
        this.loadedAssets++;
        const progress = this.loadedAssets / this.totalAssets;
        this.onProgress(progress);
        
        if (this.loadedAssets === this.totalAssets) {
            this.onComplete(this.assets);
        }
    }
    
    getAsset(name) {
        return this.assets[name];
    }
}

// Math utilities
const MathUtils = {
    degToRad: (degrees) => {
        return degrees * (Math.PI / 180);
    },
    
    radToDeg: (radians) => {
        return radians * (180 / Math.PI);
    },
    
    clamp: (value, min, max) => {
        return Math.min(Math.max(value, min), max);
    },
    
    lerp: (start, end, t) => {
        return start * (1 - t) + end * t;
    },
    
    randomInt: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    randomFloat: (min, max) => {
        return Math.random() * (max - min) + min;
    },
    
    distance: (x1, y1, x2, y2) => {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    },
    
    // Get a point on a grid from a world position
    worldToGrid: (x, z, gridSize) => {
        return {
            x: Math.floor(x / gridSize),
            z: Math.floor(z / gridSize)
        };
    },
    
    // Get a world position from a grid point
    gridToWorld: (gridX, gridZ, gridSize) => {
        return {
            x: gridX * gridSize + gridSize / 2,
            z: gridZ * gridSize + gridSize / 2
        };
    }
};

// Event system for game-wide communication
class EventSystem {
    constructor() {
        this.events = {};
    }
    
    on(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }
    
    off(eventName, callback) {
        if (!this.events[eventName]) return;
        
        if (callback) {
            this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
        } else {
            delete this.events[eventName];
        }
    }
    
    emit(eventName, data) {
        if (!this.events[eventName]) return;
        
        this.events[eventName].forEach(callback => {
            callback(data);
        });
    }
}

// Create a global event system instance
const Events = new EventSystem();
