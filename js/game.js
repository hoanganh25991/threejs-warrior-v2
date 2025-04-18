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
        
        // Game state
        this.isRunning = false;
        this.isPaused = false;
        this.selectedHeroType = null;
        
        // Interactable objects
        this.interactableObjects = [];
        
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
        
        // Initialize Three.js
        this.initThreeJS();
        
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
        
        // Play notification sound
        notifyTaskComplete();
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
        
        // Use the ability
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