/**
 * Main game class
 */

class Game {
    constructor() {
        // Three.js components
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = null;
        
        // Game components
        this.world = null;
        this.hero = null;
        this.inputManager = null;
        this.uiManager = null;
        this.combatSystem = null;
        this.audio = null; // Audio manager
        
        // Game state
        this.isRunning = false;
        this.isPaused = false;
        this.selectedHeroType = null;
        
        // Interactable objects
        this.interactableObjects = [];
        
        // Asset management
        this.assets = null;
        this.assetLoader = null;
        
        // Initialize the game
        this.init();
        
        // Make game instance globally accessible
        window.game = this;
    }
    
    async init() {
        Logger.log('Initializing game');
        
        // Create UI manager
        this.uiManager = new UIManager();
        
        // Show loading screen
        this.uiManager.showLoadingScreen();
        
        // Load configurations
        await this.loadConfigurations();
        
        // Initialize Three.js
        this.initThreeJS();
        
        // Initialize audio manager
        this.initAudio();
        
        // Load assets
        await this.loadAssets();
        
        // Create input manager
        this.inputManager = new InputManager(this.camera, this.renderer);
        
        // Create world
        this.world = new World(this.scene);
        this.world.init();
        
        // Create combat system
        this.combatSystem = new CombatSystem(this.scene);
        
        // Bind event listeners
        this.bindEvents();
        
        // Show hero selection screen
        this.uiManager.hideLoadingScreen();
        this.uiManager.showHeroSelection();
        
        // Start render loop
        this.animate();
        
        Logger.log('Game initialized');
    }
    
    /**
     * Initialize audio system
     */
    initAudio() {
        // Create audio manager
        this.audio = new AudioManager();
        
        // Set default volumes
        this.audio.setMasterVolume(0.5);
        
        // Preload common sounds
        this.audio.preloadCommonSounds();
        
        Logger.log('Audio system initialized');
    }
    
    /**
     * Load game configurations
     */
    async loadConfigurations() {
        Logger.log('Loading game configurations');
        
        try {
            // Load all configurations
            await window.configLoader.loadAllConfigs();
            
            // Log successful loading
            Logger.log('Game configurations loaded successfully');
            return true;
        } catch (error) {
            Logger.error('Failed to load game configurations:', error);
            
            // Show error message to user
            if (this.uiManager) {
                this.uiManager.showMessage('Failed to load game configurations. Some features may not work correctly.', 5000);
            }
            
            return false;
        }
    }
    
    async loadAssets() {
        return new Promise((resolve) => {
            // Create asset loader
            this.assetLoader = new AssetLoader(
                // Progress callback
                (progress) => {
                    this.uiManager.updateLoadingProgress(progress);
                },
                // Complete callback
                (assets) => {
                    this.assets = assets;
                    Logger.log('Assets loaded');
                    resolve();
                }
            );
            
            // Load default font
            this.assetLoader.loadFont('default', 'assets/fonts/helvetiker_regular.typeface.json');
            
            // Add more assets here as needed
        });
    }
    
    initThreeJS() {
        // Create scene
        this.scene = new THREE.Scene();
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            60, // Field of view
            window.innerWidth / window.innerHeight, // Aspect ratio
            0.1, // Near clipping plane
            1000 // Far clipping plane
        );
        
        // Set initial camera position (isometric view)
        this.camera.position.set(10, 10, 10);
        this.camera.lookAt(0, 0, 0);
        
        // Add followJump method to camera
        this.camera.followJump = (hero, offsetFactor) => {
            // Store the current camera position relative to the hero
            const offset = new THREE.Vector3().subVectors(this.camera.position, hero.position);
            
            // Get jump configuration
            const jumpConfig = window.configLoader?.getConfig('jumpConfig') || {
                maxJumpHeight: 15,
                cameraJumpOffset: 0.7,
                cameraTiltFactor: 0.3, // How much to tilt the camera (0-1)
                cameraBackOffset: 0.8, // How much to move camera back as height increases (increased for better view)
                cameraFovIncrease: 15, // How much to increase field of view at max height (increased for wider view)
                cameraSkyViewFactor: 0.6, // How much to adjust camera to see more sky (0-1) (increased for better sky view)
                cameraGroundViewEnhancement: 0.5, // How much to enhance ground visibility at height
                cameraAlwaysCenterPlayer: true // Always keep player at center of screen
            };
            
            // Calculate normalized height (0-1 range)
            const normalizedHeight = Math.min(1, hero.jumpHeight / jumpConfig.maxJumpHeight);
            
            // Adjust camera height based on hero's jump height and offset factor
            const heightAdjustment = hero.jumpHeight * offsetFactor;
            offset.y += heightAdjustment;
            
            // Enhanced camera positioning for better view at height
            if (normalizedHeight > 0.1) {
                // Calculate how much to move back based on height - more aggressive scaling for better view
                const backFactor = normalizedHeight * jumpConfig.cameraBackOffset;
                
                // Get camera direction vector (normalized)
                const direction = new THREE.Vector3().subVectors(hero.position, this.camera.position).normalize();
                
                // Move camera back in the opposite direction with enhanced scaling
                offset.addScaledVector(direction, -backFactor * 15); // Increased multiplier for more dramatic effect
                
                // Add slight lateral movement for a more dynamic view as height increases
                const lateralOffset = Math.sin(hero.jumpHeight * 0.1) * normalizedHeight * 2;
                offset.x += lateralOffset;
                
                // Log significant camera adjustments
                if (hero.jumpHeight > 5 && Math.floor(hero.jumpHeight) % 2 === 0) {
                    Logger.log(`Enhanced camera view for height: ${hero.jumpHeight.toFixed(1)}`);
                }
            }
            
            // Calculate tilt based on height relative to max jump height
            let tiltFactor = 0;
            if (hero.jumpHeight > 0) {
                // Enhanced tilt calculation for better ground visibility at height
                tiltFactor = normalizedHeight * (jumpConfig.cameraTiltFactor || 0.3);
                
                // Add ground view enhancement - look more downward as height increases to see more ground
                const groundViewEnhancement = normalizedHeight * jumpConfig.cameraGroundViewEnhancement;
                tiltFactor += groundViewEnhancement;
                
                // Adjust field of view based on height to see more of the area
                const baseFOV = 60; // Default FOV
                const maxFOVIncrease = jumpConfig.cameraFovIncrease || 15;
                const newFOV = baseFOV + (normalizedHeight * maxFOVIncrease);
                
                // Only update if FOV has changed significantly to avoid constant updates
                if (Math.abs(this.camera.fov - newFOV) > 0.5) {
                    this.camera.fov = newFOV;
                    this.camera.updateProjectionMatrix();
                    Logger.log(`Enhanced camera FOV adjusted to: ${newFOV.toFixed(1)}`);
                }
            }
            
            // Always center the player in the screen
            if (jumpConfig.cameraAlwaysCenterPlayer) {
                // Reset the camera position to be centered on the hero
                this.camera.position.copy(hero.position).add(offset);
            } else {
                // Update camera position with standard offset
                this.camera.position.copy(hero.position).add(offset);
            }
            
            // Create a look target that's adjusted based on height
            // Enhanced to provide better view of both ground and sky
            const skyViewAdjustment = normalizedHeight * (jumpConfig.cameraSkyViewFactor || 0.6);
            const lookTarget = new THREE.Vector3(
                hero.position.x, // Always look at player's x position
                // Enhanced formula for better view:
                // When low, look down more; when high, look more toward horizon and see more sky
                hero.position.y - (hero.jumpHeight * tiltFactor) + (skyViewAdjustment * hero.jumpHeight),
                hero.position.z // Always look at player's z position
            );
            
            // Look at the adjusted target
            this.camera.lookAt(lookTarget);
            
            // Enhanced camera roll effect based on height
            if (jumpConfig.cameraRollEnabled && hero.jumpHeight > 2) { // Lower threshold for earlier effect
                // More dynamic roll effect that increases with height
                const rollAmount = Math.sin(hero.jumpHeight * 0.15) * 0.03 * normalizedHeight;
                this.camera.rotation.z = rollAmount;
            } else {
                this.camera.rotation.z = 0;
            }
        };
        
        // Make camera globally accessible for other components
        window.camera = this.camera;
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: document.getElementById('game-canvas'),
            antialias: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Create clock for timing
        this.clock = new THREE.Clock();
        
        // Handle window resize
        window.addEventListener('resize', this.handleResize.bind(this));
        
        Logger.log('Three.js initialized');
    }
    
    bindEvents() {
        // Listen for hero selection
        Events.on('heroSelected', this.handleHeroSelected.bind(this));
        
        // Listen for ground clicks (for movement)
        Events.on('groundClick', this.handleGroundClick.bind(this));
        
        // Listen for ability clicks
        Events.on('abilityClick', this.handleAbilityClick.bind(this));
        
        // Listen for camera rotation
        Events.on('cameraRotate', this.handleCameraRotate.bind(this));
        
        // Listen for zoom
        Events.on('zoom', this.handleZoom.bind(this));
        
        // Listen for movement from keyboard
        Events.on('movement', this.handleMovement.bind(this));
        
        // Listen for ability activation
        Events.on('abilityActivated', this.handleAbilityActivated.bind(this));
        
        // Listen for hero death
        Events.on('heroDeath', this.handleHeroDeath.bind(this));
        
        Logger.log('Events bound');
    }
    
    handleResize() {
        // Update camera aspect ratio
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        
        // Update renderer size
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    async handleHeroSelected(data) {
        const { heroType } = data;
        
        Logger.log(`Hero selected: ${heroType}`);
        
        // Store selected hero type
        this.selectedHeroType = heroType;
        
        // Create hero
        this.hero = HeroFactory.createHero(heroType, this.scene);
        await this.hero.init();
        
        // Position hero at center of world
        this.hero.position.set(0, 0, 0);
        this.hero.model.position.set(0, 1, 0);
        
        // Update camera to follow hero
        this.updateCameraPosition();
        
        // Show game UI
        this.uiManager.showGameUI();
        
        // Update UI with hero info
        this.uiManager.updateHealthBar();
        this.uiManager.updateManaBar();
        this.uiManager.updateAbilityIcons(this.hero);
        
        // Start the game
        this.isRunning = true;
        
        // Create some test enemies
        this.createTestEnemies();
        
        // Show welcome message
        this.uiManager.showMessage(`You have chosen ${this.hero.name}. Good luck on your journey!`);
        
        // Log progress
        Logger.log(`Game started with hero: ${this.hero.name}`);
    }
    
    handleGroundClick(data) {
        if (!this.isRunning || !this.hero) return;
        
        const { raycaster } = data;
        
        // Raycast to find intersection with ground
        const intersectionPoint = this.world.raycastGround(raycaster);
        
        if (intersectionPoint) {
            // Move hero to clicked position
            this.hero.moveTo(intersectionPoint);
        }
    }
    
    handleAbilityClick(data) {
        if (!this.isRunning || !this.hero) return;
        
        const { raycaster } = data;
        
        // Raycast to find intersection with ground or enemies
        const groundIntersection = this.world.raycastGround(raycaster);
        
        if (groundIntersection) {
            // Use targeted ability at this position
            // This would be implemented based on the currently selected ability
            console.log('Ability targeted at:', groundIntersection);
        }
    }
    
    handleCameraRotate(data) {
        if (!this.camera) return;
        
        const { deltaX } = data;
        
        // Rotate camera around hero
        if (this.hero) {
            // Calculate current camera position relative to hero
            const offset = new THREE.Vector3().subVectors(this.camera.position, this.hero.position);
            
            // Rotate offset around Y axis
            const rotationSpeed = 0.01;
            const angle = deltaX * rotationSpeed;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            
            const newX = offset.x * cos - offset.z * sin;
            const newZ = offset.x * sin + offset.z * cos;
            
            offset.x = newX;
            offset.z = newZ;
            
            // Update camera position
            this.camera.position.copy(this.hero.position).add(offset);
            
            // Look at hero
            this.camera.lookAt(this.hero.position);
        }
    }
    
    handleZoom(data) {
        if (!this.camera || !this.hero) return;
        
        const { direction } = data;
        
        // Calculate current distance from camera to hero
        const offset = new THREE.Vector3().subVectors(this.camera.position, this.hero.position);
        const currentDistance = offset.length();
        
        // Calculate new distance
        const zoomSpeed = 1;
        const newDistance = Math.max(5, Math.min(20, currentDistance + direction * zoomSpeed));
        
        // Scale offset to new distance
        offset.normalize().multiplyScalar(newDistance);
        
        // Update camera position
        this.camera.position.copy(this.hero.position).add(offset);
    }
    
    handleMovement(data) {
        if (!this.isRunning || !this.hero) return;
        
        const { direction } = data;
        
        // Convert direction from camera space to world space
        const cameraDirection = new THREE.Vector3(0, 0, -1);
        cameraDirection.applyQuaternion(this.camera.quaternion);
        cameraDirection.y = 0;
        cameraDirection.normalize();
        
        const cameraRight = new THREE.Vector3(1, 0, 0);
        cameraRight.applyQuaternion(this.camera.quaternion);
        cameraRight.y = 0;
        cameraRight.normalize();
        
        const worldDirection = new THREE.Vector3();
        worldDirection.addScaledVector(cameraDirection, -direction.z);
        worldDirection.addScaledVector(cameraRight, direction.x);
        worldDirection.normalize();
        
        // Move hero in the calculated direction
        this.hero.moveInDirection(worldDirection);
    }
    
    handleAbilityActivated(data) {
        if (!this.isRunning || !this.hero) return;
        
        const { ability } = data;
        
        // Use the ability if it exists
        if (this.hero.abilities[ability]) {
            this.hero.abilities[ability].use();
        }
    }
    
    handleHeroDeath(data) {
        // Show game over screen
        this.uiManager.showGameOver();
        
        // Pause the game
        this.isPaused = true;
    }
    
    updateCameraPosition() {
        if (!this.hero) return;
        
        // Position camera in isometric view relative to hero
        const offset = new THREE.Vector3(10, 10, 10);
        this.camera.position.copy(this.hero.position).add(offset);
        this.camera.lookAt(this.hero.position);
    }
    
    createTestEnemies() {
        // Create a few test enemies
        const enemyTypes = ['goblin', 'troll', 'skeleton'];
        
        for (let i = 0; i < 5; i++) {
            const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
            const position = new THREE.Vector3(
                Math.random() * 20 - 10,
                0,
                Math.random() * 20 - 10
            );
            
            // Ensure enemy is not too close to hero
            if (position.distanceTo(this.hero.position) < 5) {
                position.multiplyScalar(2); // Move further away
            }
            
            this.combatSystem.createEnemy(type, position);
        }
    }
    
    update(deltaTime) {
        if (!this.isRunning || this.isPaused) return;
        
        // Update input
        if (this.inputManager) {
            this.inputManager.update();
        }
        
        // Update hero
        if (this.hero) {
            this.hero.update(deltaTime);
        }
        
        // Update world
        if (this.world) {
            this.world.update(deltaTime);
        }
        
        // Update combat system
        if (this.combatSystem) {
            this.combatSystem.update(deltaTime);
        }
        
        // Update skill UI manager
        if (window.skillUIManager) {
            window.skillUIManager.update(deltaTime);
        }
        
        // Update camera to follow hero
        if (this.hero && !this.inputManager.isMouseButtonPressed('middle')) {
            this.updateCameraPosition();
        }
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        // Calculate delta time
        const deltaTime = this.clock.getDelta();
        
        // Update game state
        this.update(deltaTime);
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
    
    continueGame() {
        // Resume the game
        this.isPaused = false;
        
        // This would be where you'd load the next level or continue the story
        console.log('Continuing game...');
    }
    
    dispose() {
        // Clean up resources
        
        // Dispose of hero
        if (this.hero) {
            this.hero.dispose();
        }
        
        // Dispose of world
        if (this.world) {
            this.world.dispose();
        }
        
        // Dispose of combat system
        if (this.combatSystem) {
            this.combatSystem.dispose();
        }
        
        // Remove event listeners
        window.removeEventListener('resize', this.handleResize);
        
        // Clear global references
        window.game = null;
        window.camera = null;
        
        Logger.log('Game disposed');
    }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create game instance
    const game = new Game();
    
    // Log initial progress
    Logger.log('Game loaded and ready to start');
});