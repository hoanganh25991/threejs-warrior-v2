/**
 * Configuration loader for the game
 * Loads and manages configuration files from the config directory
 */

class ConfigLoader {
    constructor() {
        this.configs = {};
        this.loaded = false;
        
        Logger.log('Config loader initialized');
    }
    
    /**
     * Load all configuration files
     * @returns {Promise} Promise that resolves when all configs are loaded
     */
    async loadAllConfigs() {
        try {
            // Load movement configs
            await this.loadConfig('movement/jump', 'jumpConfig');
            await this.loadConfig('movement/flight', 'flightConfig');
            
            // Load hero configs
            await this.loadConfig('hero/heroes', 'heroesConfig');
            
            // Load UI configs
            await this.loadConfig('ui/controls', 'controlsConfig');
            
            this.loaded = true;
            Logger.log('All configuration files loaded successfully');
            return true;
        } catch (error) {
            Logger.error('Error loading configuration files:', error);
            return false;
        }
    }
    
    /**
     * Load a specific configuration file
     * @param {string} path - Path to the config file relative to the config directory
     * @param {string} configName - Name to store the config under
     * @returns {Promise} Promise that resolves when the config is loaded
     */
    async loadConfig(path, configName) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            // Use relative path instead of absolute path
            script.src = `config/${path}.js`;
            script.onload = () => {
                // Get the config from the global scope based on the filename
                const configVarName = path.split('/').pop().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                const configObject = window[configVarName.charAt(0).toUpperCase() + configVarName.slice(1) + 'Config'];
                
                if (configObject) {
                    this.configs[configName] = configObject;
                    Logger.log(`Loaded config: ${configName}`);
                    resolve(configObject);
                } else {
                    reject(new Error(`Config not found in global scope: ${configVarName}Config`));
                }
            };
            script.onerror = (error) => {
                Logger.error(`Failed to load config: ${path}`, error);
                reject(error);
            };
            document.head.appendChild(script);
        });
    }
    
    /**
     * Get a configuration by name
     * @param {string} configName - Name of the configuration to get
     * @returns {Object} The configuration object
     */
    getConfig(configName) {
        if (!this.loaded) {
            Logger.warn('Attempting to access config before loading is complete');
        }
        
        return this.configs[configName] || null;
    }
    
    /**
     * Get a specific value from a configuration
     * @param {string} configName - Name of the configuration
     * @param {string} path - Dot-notation path to the value (e.g., 'heroes.axe.color')
     * @param {*} defaultValue - Default value to return if the path doesn't exist
     * @returns {*} The configuration value or default value
     */
    getValue(configName, path, defaultValue = null) {
        const config = this.getConfig(configName);
        if (!config) return defaultValue;
        
        const parts = path.split('.');
        let current = config;
        
        for (const part of parts) {
            if (current === undefined || current === null || typeof current !== 'object') {
                return defaultValue;
            }
            current = current[part];
        }
        
        return current !== undefined ? current : defaultValue;
    }
}

// Create a global instance of the config loader
window.configLoader = new ConfigLoader();