/**
 * Audio Manager for handling game sounds
 */

class AudioManager {
    constructor() {
        // Store all loaded sounds
        this.sounds = {};
        
        // Store currently playing sounds
        this.activeSounds = {};
        
        // Store looping sounds
        this.loopingSounds = {};
        
        // Store ambient sounds specifically
        this.ambientSounds = {};
        
        // Master volume control (0.0 to 1.0)
        this.masterVolume = 0.5;
        
        // Volume controls for different sound categories
        this.volumeControls = {
            sfx: 0.8,      // Sound effects
            music: 0.6,    // Background music
            ambient: 0.4,  // Ambient sounds
            ui: 0.7,       // UI sounds
            voice: 0.9     // Voice/dialogue
        };
        
        // Flag to mute all sounds
        this.muted = false;
        
        Logger.log('Audio Manager initialized');
    }
    
    /**
     * Load a sound file
     * @param {string} id - Unique identifier for the sound
     * @param {string} path - Path to the sound file
     * @param {string} category - Sound category (sfx, music, ambient, ui, voice)
     * @returns {Promise} - Promise that resolves when the sound is loaded
     */
    loadSound(id, path, category = 'sfx') {
        return new Promise((resolve, reject) => {
            try {
                const audio = new Audio();
                audio.src = path;
                
                // Store metadata with the audio element
                const soundData = {
                    audio: audio,
                    category: category,
                    loaded: false,
                    path: path
                };
                
                // Set up event listeners
                audio.addEventListener('canplaythrough', () => {
                    soundData.loaded = true;
                    Logger.log(`Sound loaded: ${id}`);
                    resolve(soundData);
                }, { once: true });
                
                audio.addEventListener('error', (error) => {
                    Logger.error(`Error loading sound ${id} from ${path}:`, error);
                    reject(error);
                }, { once: true });
                
                // Store in sounds collection
                this.sounds[id] = soundData;
                
                // Start loading
                audio.load();
            } catch (error) {
                Logger.error(`Failed to create audio element for ${id}:`, error);
                reject(error);
            }
        });
    }
    
    /**
     * Play a sound
     * @param {string} id - ID of the sound to play
     * @param {number} volume - Volume override (0.0 to 1.0)
     * @param {boolean} loop - Whether to loop the sound
     * @returns {string} - Instance ID for the playing sound, or null if failed
     */
    playSound(id, volume = null, loop = false) {
        // Check if sound exists and is loaded
        const soundData = this.sounds[id];
        if (!soundData || !soundData.loaded) {
            Logger.warn(`Attempted to play sound ${id} which is not loaded`);
            return null;
        }
        
        // Don't play if muted
        if (this.muted) {
            return null;
        }
        
        try {
            // Create a new instance of the audio for overlapping sounds
            const audioInstance = new Audio(soundData.path);
            
            // Set volume based on category and master volume
            const categoryVolume = this.volumeControls[soundData.category] || 1.0;
            const finalVolume = (volume !== null ? volume : 1.0) * categoryVolume * this.masterVolume;
            audioInstance.volume = Math.max(0, Math.min(1, finalVolume));
            
            // Set loop property
            audioInstance.loop = loop;
            
            // Generate a unique instance ID
            const instanceId = `${id}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
            
            // Store the instance
            this.activeSounds[instanceId] = {
                audio: audioInstance,
                id: id,
                category: soundData.category
            };
            
            // If looping, also store in looping sounds
            if (loop) {
                this.loopingSounds[instanceId] = this.activeSounds[instanceId];
            }
            
            // Set up ended event to clean up
            audioInstance.addEventListener('ended', () => {
                this.cleanupSound(instanceId);
            }, { once: true });
            
            // Play the sound
            audioInstance.play().catch(error => {
                Logger.warn(`Failed to play sound ${id}:`, error);
                this.cleanupSound(instanceId);
                return null;
            });
            
            return instanceId;
        } catch (error) {
            Logger.error(`Error playing sound ${id}:`, error);
            return null;
        }
    }
    
    /**
     * Stop a specific sound instance
     * @param {string} instanceId - Instance ID returned from playSound
     */
    stopSound(instanceId) {
        const instance = this.activeSounds[instanceId];
        if (instance) {
            try {
                instance.audio.pause();
                instance.audio.currentTime = 0;
                this.cleanupSound(instanceId);
            } catch (error) {
                Logger.error(`Error stopping sound ${instanceId}:`, error);
            }
        }
    }
    
    /**
     * Stop all sounds in a category
     * @param {string} category - Category to stop (sfx, music, ambient, ui, voice)
     */
    stopCategory(category) {
        Object.keys(this.activeSounds).forEach(instanceId => {
            const instance = this.activeSounds[instanceId];
            if (instance && instance.category === category) {
                this.stopSound(instanceId);
            }
        });
    }
    
    /**
     * Stop all sounds
     */
    stopAllSounds() {
        Object.keys(this.activeSounds).forEach(instanceId => {
            this.stopSound(instanceId);
        });
    }
    
    /**
     * Clean up a sound instance
     * @param {string} instanceId - Instance ID to clean up
     */
    cleanupSound(instanceId) {
        if (this.activeSounds[instanceId]) {
            delete this.activeSounds[instanceId];
        }
        
        if (this.loopingSounds[instanceId]) {
            delete this.loopingSounds[instanceId];
        }
        
        if (this.ambientSounds[instanceId]) {
            delete this.ambientSounds[instanceId];
        }
    }
    
    /**
     * Set master volume
     * @param {number} volume - Volume level (0.0 to 1.0)
     */
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        this.updateAllVolumes();
    }
    
    /**
     * Set volume for a category
     * @param {string} category - Category to adjust (sfx, music, ambient, ui, voice)
     * @param {number} volume - Volume level (0.0 to 1.0)
     */
    setCategoryVolume(category, volume) {
        if (this.volumeControls.hasOwnProperty(category)) {
            this.volumeControls[category] = Math.max(0, Math.min(1, volume));
            this.updateCategoryVolume(category);
        }
    }
    
    /**
     * Update volumes for all active sounds
     */
    updateAllVolumes() {
        Object.keys(this.activeSounds).forEach(instanceId => {
            const instance = this.activeSounds[instanceId];
            const categoryVolume = this.volumeControls[instance.category] || 1.0;
            instance.audio.volume = categoryVolume * this.masterVolume;
        });
    }
    
    /**
     * Update volumes for a specific category
     * @param {string} category - Category to update
     */
    updateCategoryVolume(category) {
        Object.keys(this.activeSounds).forEach(instanceId => {
            const instance = this.activeSounds[instanceId];
            if (instance.category === category) {
                instance.audio.volume = this.volumeControls[category] * this.masterVolume;
            }
        });
    }
    
    /**
     * Mute or unmute all sounds
     * @param {boolean} muted - Whether to mute (true) or unmute (false)
     */
    setMuted(muted) {
        this.muted = muted;
        
        if (muted) {
            // Store current volumes and set to 0
            Object.keys(this.activeSounds).forEach(instanceId => {
                const instance = this.activeSounds[instanceId];
                instance.previousVolume = instance.audio.volume;
                instance.audio.volume = 0;
            });
        } else {
            // Restore previous volumes
            Object.keys(this.activeSounds).forEach(instanceId => {
                const instance = this.activeSounds[instanceId];
                if (instance.previousVolume !== undefined) {
                    instance.audio.volume = instance.previousVolume;
                    delete instance.previousVolume;
                }
            });
        }
    }
    
    /**
     * Play an ambient sound
     * @param {string} id - ID of the sound to play
     * @param {number} volume - Volume override (0.0 to 1.0)
     * @param {boolean} loop - Whether to loop the sound (default true for ambient sounds)
     * @returns {string} - Instance ID for the playing sound, or null if failed
     */
    playAmbientSound(id, volume = null, loop = true) {
        // Use the existing playSound method with ambient category
        const instanceId = this.playSound(id, volume, loop);
        
        // If successful, store in ambient sounds collection
        if (instanceId) {
            this.ambientSounds[instanceId] = this.activeSounds[instanceId];
            Logger.log(`Ambient sound started: ${id}`);
        }
        
        return instanceId;
    }
    
    /**
     * Stop all ambient sounds
     */
    stopAllAmbientSounds() {
        Object.keys(this.ambientSounds).forEach(instanceId => {
            this.stopSound(instanceId);
        });
        
        // Clear the ambient sounds collection
        this.ambientSounds = {};
        Logger.log('All ambient sounds stopped');
    }
    
    /**
     * Preload common game sounds
     */
    preloadCommonSounds() {
        // Jump sounds
        this.loadSound('jump', 'assets/sounds/jump.mp3', 'sfx');
        this.loadSound('land', 'assets/sounds/land.mp3', 'sfx');
        
        // Flight sounds
        this.loadSound('takeoff', 'assets/sounds/takeoff.mp3', 'sfx');
        this.loadSound('landing', 'assets/sounds/landing.mp3', 'sfx');
        this.loadSound('flightLoop', 'assets/sounds/flight_loop.mp3', 'ambient');
        
        // UI sounds
        this.loadSound('click', 'assets/sounds/click.mp3', 'ui');
        this.loadSound('hover', 'assets/sounds/hover.mp3', 'ui');
        this.loadSound('error', 'assets/sounds/error.mp3', 'ui');
        
        // Combat sounds
        this.loadSound('hit', 'assets/sounds/hit.mp3', 'sfx');
        this.loadSound('spell', 'assets/sounds/spell.mp3', 'sfx');
        
        // Ambient sounds
        this.loadSound('wind', 'assets/sounds/wind.mp3', 'ambient');
        this.loadSound('birds', 'assets/sounds/birds.mp3', 'ambient');
        
        Logger.log('Common sounds preloaded');
    }
}

// Export the AudioManager class
window.AudioManager = AudioManager;