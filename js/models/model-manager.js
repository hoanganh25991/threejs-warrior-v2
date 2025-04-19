/**
 * Model Manager for handling hero models
 */

class ModelManager {
    constructor() {
        this.models = {};
        this.activeModel = null;
        this.activeModelType = null;
    }
    
    /**
     * Initialize the model manager
     * @param {THREE.Scene} scene - The Three.js scene
     */
    init(scene) {
        this.scene = scene;
        Logger.log('Model Manager initialized');
    }
    
    /**
     * Create a hero model based on type
     * @param {string} type - Hero type (e.g., 'axe', 'crystal-maiden')
     * @returns {Promise<THREE.Group>} - The created model
     */
    async createHeroModel(type) {
        if (this.models[type]) {
            return this.models[type].model;
        }
        
        let modelInstance = null;
        
        switch (type) {
            case 'axe':
                modelInstance = new AxeModel(this.scene);
                break;
            case 'crystal-maiden':
                modelInstance = new CrystalMaidenModel(this.scene);
                break;
            case 'lich':
                modelInstance = new LichModel(this.scene);
                break;
            case 'storm-spirit':
                modelInstance = new StormSpiritModel(this.scene);
                break;
            default:
                Logger.error(`Unknown hero type: ${type}`);
                return null;
        }
        
        if (modelInstance) {
            await modelInstance.create();
            this.models[type] = modelInstance;
            
            // Start with idle animation
            modelInstance.playAnimation('idle');
            
            Logger.log(`Created model for hero type: ${type}`);
            return modelInstance.model;
        }
        
        return null;
    }
    
    /**
     * Set the active model
     * @param {string} type - Hero type
     */
    setActiveModel(type) {
        this.activeModelType = type;
        this.activeModel = this.models[type];
        Logger.log(`Set active model to: ${type}`);
    }
    
    /**
     * Play an animation on the active model
     * @param {string} animationName - Name of the animation to play
     */
    playAnimation(animationName) {
        if (this.activeModel) {
            this.activeModel.playAnimation(animationName);
            Logger.log(`Playing animation: ${animationName} on ${this.activeModelType}`);
        }
    }
    
    /**
     * Update all models (for animation)
     */
    update() {
        for (const type in this.models) {
            if (this.models[type]) {
                this.models[type].update();
            }
        }
    }
    
    /**
     * Get a model by type
     * @param {string} type - Hero type
     * @returns {Object} - The model instance
     */
    getModel(type) {
        return this.models[type];
    }
    
    /**
     * Get the active model
     * @returns {Object} - The active model instance
     */
    getActiveModel() {
        return this.activeModel;
    }
}

// Export the model manager
window.ModelManager = ModelManager;