/**
 * Input handling system for the game
 */

class InputManager {
    constructor(camera, renderer) {
        this.camera = camera;
        this.renderer = renderer;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.keys = {};
        this.mouseButtons = {
            left: false,
            middle: false,
            right: false
        };
        this.mousePosition = { x: 0, y: 0 };
        this.targetPosition = null;
        
        // Touch state
        this.touchStartDistance = 0;
        this.lastTapTime = 0;
        this.lastTapPosition = { x: 0, y: 0 };
        
        // Continuous trigger state
        this.continuousTriggers = {};
        this.longPressTimers = {};
        this.longPressActive = {};
        
        // Get input configuration
        this.inputConfig = window.configLoader?.getConfig('inputConfig') || {
            longPressDelay: 300, // ms before long press is activated
            longPressInterval: 200, // ms between continuous triggers
            doubleTapDelay: 300, // ms between taps to count as double tap
            tapRadius: 10 // pixels radius to consider as same tap location
        };
        
        // Initialize event listeners
        this.initEventListeners();
        
        Logger.log('Input manager initialized');
    }
    
    initEventListeners() {
        // Keyboard events - only keyboard controls are enabled
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
        
        // Mouse and touch events are disabled as per requirements
        // We still prevent context menu on right-click for better experience
        const canvas = this.renderer.domElement;
        canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        
        Logger.log('Input system initialized with keyboard-only controls');
    }
    
    handleKeyDown(event) {
        const key = event.key.toLowerCase();
        this.keys[key] = true;
        
        // Get controls configuration
        const controlsConfig = window.ControlsConfig || {};
        const keyboardControls = controlsConfig.keyboard || {};
        
        // Handle WASD movement
        // Movement is handled in the update loop using this.keys
        
        // Handle jump/fly key (f)
        if (key === 'f' && window.game && window.game.hero) {
            if (!window.game.hero.isJumping) {
                window.game.hero.jump();
            }
            window.game.hero.startHoldJump();
        }
        
        // Handle ability keys (h, j, k, l)
        if (key === 'h') {
            // H is both basic attack and ability 1
            this.handleBasicAttack();
            this.handleAbilityKeyPress('1');
        } else if (key === 'j') {
            this.handleAbilityKeyPress('2');
        } else if (key === 'k') {
            this.handleAbilityKeyPress('3');
        } else if (key === 'l') {
            this.handleAbilityKeyPress('4');
        }
        
        // Emit key press event
        Events.emit('keyPressed', { key: key });
    }
    
    handleBasicAttack() {
        if (!window.game || !window.game.hero) return;
        
        // Find nearest enemy
        const nearestEnemy = this.findNearestEnemy();
        if (nearestEnemy) {
            // Attack the enemy
            window.game.hero.attack(nearestEnemy);
            Logger.log(`Basic attack used on ${nearestEnemy.name}`);
        } else {
            Logger.log('No enemies in range for basic attack');
        }
    }
    
    findNearestEnemy() {
        if (!window.game || !window.game.hero || !window.game.combatSystem) {
            return null;
        }
        
        const hero = window.game.hero;
        const enemies = window.game.combatSystem.enemies;
        
        if (enemies.length === 0) {
            return null;
        }
        
        // Find the nearest enemy
        let nearestEnemy = null;
        let nearestDistance = Infinity;
        
        for (const enemy of enemies) {
            const distance = hero.position.distanceTo(enemy.position);
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestEnemy = enemy;
            }
        }
        
        // Check if within attack range (default range: 3 units)
        const attackRange = hero.stats.attackRange || 3;
        if (nearestDistance <= attackRange) {
            return nearestEnemy;
        }
        
        return null;
    }
    
    handleAbilityKeyPress(key) {
        // If hero exists, try to use the corresponding ability
        if (window.game && window.game.hero && window.game.hero.abilities[key]) {
            const ability = window.game.hero.abilities[key];
            
            // Check if ability is on cooldown
            if (!ability.isOnCooldown) {
                // Use the ability
                window.game.hero.useAbility(key);
                
                // Log ability use
                Logger.log(`Used ability ${key}: ${ability.name}`);
            } else {
                // Notify player that ability is on cooldown
                Logger.log(`Ability ${ability.name} is on cooldown`);
            }
        }
    }
    
    handleKeyUp(event) {
        const key = event.key.toLowerCase();
        this.keys[key] = false;
        
        // Handle jump key release (f)
        if (key === 'f' && window.game && window.game.hero) {
            window.game.hero.stopHoldJump();
        }
        
        // Emit key release event
        Events.emit('keyReleased', { key: key });
    }
    
    // Start a continuous trigger for a given input
    startContinuousTrigger(inputType, inputId, callback) {
        const triggerKey = `${inputType}_${inputId}`;
        
        // Clear any existing timers for this input
        this.clearContinuousTrigger(inputType, inputId);
        
        // Execute the callback immediately
        callback();
        
        // Set a timer for the long press delay
        this.longPressTimers[triggerKey] = setTimeout(() => {
            // Mark as long press active
            this.longPressActive[triggerKey] = true;
            
            // Start continuous triggering
            this.continuousTriggers[triggerKey] = setInterval(() => {
                callback();
            }, this.inputConfig.longPressInterval);
            
            Logger.log(`Continuous trigger started for ${triggerKey}`);
        }, this.inputConfig.longPressDelay);
    }
    
    // Clear a continuous trigger
    clearContinuousTrigger(inputType, inputId) {
        const triggerKey = `${inputType}_${inputId}`;
        
        // Clear the long press timer
        if (this.longPressTimers[triggerKey]) {
            clearTimeout(this.longPressTimers[triggerKey]);
            delete this.longPressTimers[triggerKey];
        }
        
        // Clear the continuous trigger interval
        if (this.continuousTriggers[triggerKey]) {
            clearInterval(this.continuousTriggers[triggerKey]);
            delete this.continuousTriggers[triggerKey];
        }
        
        // Reset long press active state
        if (this.longPressActive[triggerKey]) {
            delete this.longPressActive[triggerKey];
        }
    }
    
    // Check if a continuous trigger is active
    isContinuousTriggerActive(inputType, inputId) {
        const triggerKey = `${inputType}_${inputId}`;
        return !!this.longPressActive[triggerKey];
    }
    
    handleMouseDown(event) {
        event.preventDefault();
        
        // Update mouse button states
        switch (event.button) {
            case 0: // Left button
                this.mouseButtons.left = true;
                
                // Start continuous trigger for left click
                this.startContinuousTrigger('mouse', 'left', () => {
                    this.handleAbilityClick(event); // Left click for targeted abilities
                    
                    // If hero is flying, maintain height
                    if (window.game && window.game.hero && window.game.hero.isFlying) {
                        window.game.hero.maintainFlightHeight();
                    }
                    
                    // If hero is jumping, continue to hold jump
                    if (window.game && window.game.hero && window.game.hero.isJumping) {
                        window.game.hero.holdJump();
                    }
                });
                break;
                
            case 1: // Middle button
                this.mouseButtons.middle = true;
                break;
                
            case 2: // Right button
                this.mouseButtons.right = true;
                
                // Start continuous trigger for right click
                this.startContinuousTrigger('mouse', 'right', () => {
                    this.handleGroundClick(event); // Right click to move (Dota 1 style)
                });
                break;
        }
        
        // Emit mouse down event
        Events.emit('mouseDown', { 
            button: event.button,
            position: this.mousePosition,
            continuous: false
        });
    }
    
    handleMouseUp(event) {
        event.preventDefault();
        
        // Update mouse button states
        switch (event.button) {
            case 0: // Left button
                this.mouseButtons.left = false;
                // Stop auto-attack when left mouse button is released
                this.stopAutoAttack();
                break;
            case 1: // Middle button
                this.mouseButtons.middle = false;
                break;
            case 2: // Right button
                this.mouseButtons.right = false;
                break;
        }
        
        // Emit mouse up event
        Events.emit('mouseUp', { 
            button: event.button,
            position: this.mousePosition
        });
    }
    
    handleMouseMove(event) {
        event.preventDefault();
        
        // Update mouse position
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mousePosition.x = event.clientX - rect.left;
        this.mousePosition.y = event.clientY - rect.top;
        
        // Update normalized mouse coordinates for raycaster
        this.mouse.x = (this.mousePosition.x / this.renderer.domElement.clientWidth) * 2 - 1;
        this.mouse.y = -(this.mousePosition.y / this.renderer.domElement.clientHeight) * 2 + 1;
        
        // Emit mouse move event
        Events.emit('mouseMove', { position: this.mousePosition });
        
        // Handle flight camera control when flying
        if (window.game && window.game.hero && window.game.hero.isFlying) {
            // Get flight configuration
            const flightConfig = window.configLoader?.getConfig('flightConfig') || {
                mouseLookSensitivity: 0.5
            };
            
            // Check if mouse look is enabled
            if (flightConfig.mouseLookSensitivity > 0) {
                // Calculate camera look direction based on mouse position
                const centerX = this.renderer.domElement.clientWidth / 2;
                const centerY = this.renderer.domElement.clientHeight / 2;
                
                // Calculate offset from center
                const offsetX = (this.mousePosition.x - centerX) / centerX;
                const offsetY = (this.mousePosition.y - centerY) / centerY;
                
                // Emit flight look event
                Events.emit('flightLook', { 
                    offsetX: offsetX * flightConfig.mouseLookSensitivity,
                    offsetY: offsetY * flightConfig.mouseLookSensitivity
                });
                
                // Handle flight height change with mouse buttons
                if (this.mouseButtons.left) {
                    // Left mouse button - fly higher
                    window.game.hero.flyHigher();
                } else if (this.mouseButtons.right) {
                    // Right mouse button - fly lower
                    window.game.hero.flyLower();
                }
            }
        }
        
        // Handle camera rotation if middle mouse button is pressed
        if (this.mouseButtons.middle) {
            this.handleCameraRotation(event);
        }
    }
    
    handleMouseWheel(event) {
        event.preventDefault();
        
        // Determine zoom direction
        const zoomDirection = Math.sign(event.deltaY);
        
        // Emit zoom event
        Events.emit('zoom', { direction: zoomDirection });
    }
    
    handleTouchStart(event) {
        event.preventDefault();
        
        if (event.touches.length === 1) {
            // Single touch - treat as left mouse button
            this.mouseButtons.left = true;
            
            const touch = event.touches[0];
            const rect = this.renderer.domElement.getBoundingClientRect();
            this.mousePosition.x = touch.clientX - rect.left;
            this.mousePosition.y = touch.clientY - rect.top;
            
            // Update normalized mouse coordinates for raycaster
            this.mouse.x = (this.mousePosition.x / this.renderer.domElement.clientWidth) * 2 - 1;
            this.mouse.y = -(this.mousePosition.y / this.renderer.domElement.clientHeight) * 2 + 1;
            
            this.handleGroundClick({ clientX: touch.clientX, clientY: touch.clientY });
            
            // Emit touch start event
            Events.emit('touchStart', { position: this.mousePosition });
        } else if (event.touches.length === 2) {
            // Two finger touch - for pinch zoom or rotation
            this.touchStartDistance = this.getTouchDistance(event.touches);
            
            // Emit multi-touch start event
            Events.emit('multiTouchStart', { 
                touches: Array.from(event.touches).map(t => ({ x: t.clientX, y: t.clientY }))
            });
        }
    }
    
    handleTouchEnd(event) {
        event.preventDefault();
        
        // Reset touch states
        this.mouseButtons.left = false;
        
        // Stop auto-attack when touch ends
        this.stopAutoAttack();
        
        // Emit touch end event
        Events.emit('touchEnd', {});
    }
    
    handleTouchMove(event) {
        event.preventDefault();
        
        if (event.touches.length === 1) {
            // Single touch movement
            const touch = event.touches[0];
            const rect = this.renderer.domElement.getBoundingClientRect();
            this.mousePosition.x = touch.clientX - rect.left;
            this.mousePosition.y = touch.clientY - rect.top;
            
            // Update normalized mouse coordinates for raycaster
            this.mouse.x = (this.mousePosition.x / this.renderer.domElement.clientWidth) * 2 - 1;
            this.mouse.y = -(this.mousePosition.y / this.renderer.domElement.clientHeight) * 2 + 1;
            
            // Emit touch move event
            Events.emit('touchMove', { position: this.mousePosition });
        } else if (event.touches.length === 2) {
            // Two finger touch movement - handle pinch zoom
            const currentDistance = this.getTouchDistance(event.touches);
            const deltaDistance = currentDistance - this.touchStartDistance;
            
            // Determine if zooming in or out
            const zoomDirection = Math.sign(deltaDistance);
            
            // Emit zoom event
            Events.emit('zoom', { direction: -zoomDirection });
            
            // Update touch start distance for next move
            this.touchStartDistance = currentDistance;
            
            // Emit multi-touch move event
            Events.emit('multiTouchMove', { 
                touches: Array.from(event.touches).map(t => ({ x: t.clientX, y: t.clientY }))
            });
        }
    }
    
    getTouchDistance(touches) {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    handleGroundClick(event) {
        // Cast a ray from the camera through the mouse position
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Find intersections with the ground plane
        const groundObjects = []; // This should be populated with ground objects from the scene
        
        // Check if hero is flying and maintain height if so
        if (window.game && window.game.hero && window.game.hero.isFlying) {
            window.game.hero.maintainFlightHeight();
        }
        
        // Emit ground click event with intersection point
        Events.emit('groundClick', { 
            position: this.mousePosition,
            raycaster: this.raycaster
        });
        
        // Create a move indicator at the clicked position
        this.createMoveIndicator();
    }
    
    createMoveIndicator() {
        // Get the intersection point with the ground
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Create a plane representing the ground
        const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const targetPosition = new THREE.Vector3();
        
        // Find the intersection point
        this.raycaster.ray.intersectPlane(groundPlane, targetPosition);
        
        if (targetPosition) {
            // Create the move indicator
            if (window.game && window.game.world) {
                window.game.world.createMoveIndicator(targetPosition);
            }
        }
    }
    
    handleAbilityClick(event) {
        // Cast a ray from the camera through the mouse position
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Check if we clicked on an enemy
        const enemy = this.checkForEnemyUnderCursor();
        
        if (enemy) {
            // If we clicked on an enemy, attack it
            if (window.game && window.game.hero) {
                window.game.hero.attack(enemy);
                
                // Start auto-attack if holding the button
                this.startAutoAttack(enemy);
            }
        } else {
            // Emit ability click event with intersection point
            Events.emit('abilityClick', { 
                position: this.mousePosition,
                raycaster: this.raycaster
            });
        }
    }
    
    // Check if there's an enemy under the cursor
    checkForEnemyUnderCursor() {
        if (!window.game || !window.game.enemies) {
            return null;
        }
        
        // Get all enemies in the scene
        const enemies = window.game.enemies;
        
        // Check for intersections with enemies
        for (const enemy of enemies) {
            if (!enemy.model) continue;
            
            // Create a bounding sphere for the enemy
            const boundingSphere = new THREE.Sphere(
                enemy.position.clone(),
                enemy.radius || 1.0
            );
            
            // Check if the ray intersects the bounding sphere
            if (this.raycaster.ray.intersectsSphere(boundingSphere)) {
                return enemy;
            }
        }
        
        return null;
    }
    
    // Start auto-attack on an enemy
    startAutoAttack(enemy) {
        // Clear any existing auto-attack interval
        this.stopAutoAttack();
        
        // Set up auto-attack interval
        this.autoAttackInterval = setInterval(() => {
            // Check if we're still holding the mouse button
            if (!this.mouseButtons.left) {
                this.stopAutoAttack();
                return;
            }
            
            // Check if the enemy is still valid
            if (!enemy || !enemy.isAlive) {
                this.stopAutoAttack();
                return;
            }
            
            // Attack the enemy
            if (window.game && window.game.hero) {
                window.game.hero.attack(enemy);
            }
        }, 1000 / (window.game?.hero?.stats?.attackSpeed || 1));
    }
    
    // Stop auto-attack
    stopAutoAttack() {
        if (this.autoAttackInterval) {
            clearInterval(this.autoAttackInterval);
            this.autoAttackInterval = null;
        }
    }
    
    handleCameraRotation(event) {
        // Calculate movement delta
        const movementX = event.movementX || 0;
        
        // Emit camera rotation event
        Events.emit('cameraRotate', { deltaX: movementX });
    }
    
    isKeyPressed(key) {
        return this.keys[key.toLowerCase()] === true;
    }
    
    isMouseButtonPressed(button) {
        switch (button) {
            case 'left':
                return this.mouseButtons.left;
            case 'middle':
                return this.mouseButtons.middle;
            case 'right':
                return this.mouseButtons.right;
            default:
                return false;
        }
    }
    
    getMousePosition() {
        return { ...this.mousePosition };
    }
    
    getNormalizedMousePosition() {
        return { x: this.mouse.x, y: this.mouse.y };
    }
    
    getRaycaster() {
        // Update raycaster with current mouse position
        this.raycaster.setFromCamera(this.mouse, this.camera);
        return this.raycaster;
    }
    
    update() {
        // Handle WASD movement
        const moveDirection = new THREE.Vector3(0, 0, 0);
        
        if (this.isKeyPressed('w')) moveDirection.z -= 1;
        if (this.isKeyPressed('s')) moveDirection.z += 1;
        if (this.isKeyPressed('a')) moveDirection.x -= 1;
        if (this.isKeyPressed('d')) moveDirection.x += 1;
        
        // Check if any movement keys are pressed
        if (moveDirection.x !== 0 || moveDirection.z !== 0) {
            // Normalize the direction vector
            moveDirection.normalize();
            
            // Emit movement event
            Events.emit('movement', { direction: moveDirection });
        } else {
            // No movement keys are pressed, emit stop movement event
            Events.emit('stopMovement');
        }
        
        // Handle ability key presses (number keys 1-6)
        // These are the keys that are actually mapped to abilities in the hero class
        if (this.isKeyPressed('1')) Events.emit('abilityActivated', { ability: '1' });
        if (this.isKeyPressed('2')) Events.emit('abilityActivated', { ability: '2' });
        if (this.isKeyPressed('3')) Events.emit('abilityActivated', { ability: '3' });
        if (this.isKeyPressed('4')) Events.emit('abilityActivated', { ability: '4' });
        if (this.isKeyPressed('5')) Events.emit('abilityActivated', { ability: '5' });
        if (this.isKeyPressed('6')) Events.emit('abilityActivated', { ability: '6' });
    }
}