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
        
        // Initialize event listeners
        this.initEventListeners();
        
        Logger.log('Input manager initialized');
    }
    
    initEventListeners() {
        // Keyboard events
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
        
        // Mouse events
        const canvas = this.renderer.domElement;
        canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        canvas.addEventListener('wheel', this.handleMouseWheel.bind(this));
        
        // Prevent context menu on right-click
        canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Touch events for mobile
        canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
        canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
    }
    
    handleKeyDown(event) {
        const key = event.key.toLowerCase();
        this.keys[key] = true;
        
        // Handle number keys 1-6 for abilities
        if (key >= '1' && key <= '6') {
            this.handleAbilityKeyPress(key);
        }
        
        // Handle jump key (f)
        if (key === 'f' && window.game && window.game.hero) {
            if (!window.game.hero.isJumping) {
                window.game.hero.jump();
            }
            window.game.hero.startHoldJump();
        }
        
        // Emit key press event
        Events.emit('keyPressed', { key: key });
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
    
    handleMouseDown(event) {
        event.preventDefault();
        
        // Update mouse button states
        switch (event.button) {
            case 0: // Left button
                this.mouseButtons.left = true;
                this.handleAbilityClick(event); // Left click for targeted abilities
                break;
            case 1: // Middle button
                this.mouseButtons.middle = true;
                break;
            case 2: // Right button
                this.mouseButtons.right = true;
                this.handleGroundClick(event); // Right click to move (Dota 1 style)
                break;
        }
        
        // Emit mouse down event
        Events.emit('mouseDown', { 
            button: event.button,
            position: this.mousePosition
        });
    }
    
    handleMouseUp(event) {
        event.preventDefault();
        
        // Update mouse button states
        switch (event.button) {
            case 0: // Left button
                this.mouseButtons.left = false;
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
        
        // Emit ability click event with intersection point
        Events.emit('abilityClick', { 
            position: this.mousePosition,
            raycaster: this.raycaster
        });
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
        // Handle arrow key movement
        const moveDirection = new THREE.Vector3(0, 0, 0);
        
        if (this.isKeyPressed('arrowup')) moveDirection.z -= 1;
        if (this.isKeyPressed('arrowdown')) moveDirection.z += 1;
        if (this.isKeyPressed('arrowleft')) moveDirection.x -= 1;
        if (this.isKeyPressed('arrowright')) moveDirection.x += 1;
        
        // Only emit movement event if there's actual movement
        if (moveDirection.x !== 0 || moveDirection.z !== 0) {
            // Normalize the direction vector
            moveDirection.normalize();
            
            // Emit movement event
            Events.emit('movement', { direction: moveDirection });
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