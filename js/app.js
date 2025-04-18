// Initialize PlayCanvas application
const canvas = document.getElementById('application-canvas');
const app = new pc.Application(canvas);

// Fill the available space at full resolution
app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
app.setCanvasResolution(pc.RESOLUTION_AUTO);

// Ensure canvas is resized when window changes size
window.addEventListener('resize', () => app.resizeCanvas());

// Load our custom scripts
// Systems
app.scripts.add('attributeSystem', '/js/systems/attribute-system.js');
app.scripts.add('abilitySystem', '/js/systems/ability-system.js');
app.scripts.add('experienceSystem', '/js/systems/experience-system.js');
app.scripts.add('talentSystem', '/js/systems/talent-system.js');
app.scripts.add('inventorySystem', '/js/systems/inventory-system.js');
app.scripts.add('enemySpawner', '/js/systems/enemy-spawner.js');

// Entities
app.scripts.add('hero', '/js/entities/hero.js');
app.scripts.add('enemy', '/js/entities/enemy.js');
app.scripts.add('axe', '/js/entities/heroes/axe.js');
app.scripts.add('crystalMaiden', '/js/entities/heroes/crystal-maiden.js');
app.scripts.add('lich', '/js/entities/heroes/lich.js');
app.scripts.add('stormSpirit', '/js/entities/heroes/storm-spirit.js');

// Talents
app.assets.add(new pc.Asset('axe-talents.js', 'script', { url: '/js/entities/heroes/talents/axe-talents.js' }));
app.assets.add(new pc.Asset('crystal-maiden-talents.js', 'script', { url: '/js/entities/heroes/talents/crystal-maiden-talents.js' }));
app.assets.add(new pc.Asset('lich-talents.js', 'script', { url: '/js/entities/heroes/talents/lich-talents.js' }));
app.assets.add(new pc.Asset('storm-spirit-talents.js', 'script', { url: '/js/entities/heroes/talents/storm-spirit-talents.js' }));

// UI
app.scripts.add('heroSelection', '/js/ui/hero-selection.js');
app.scripts.add('talentUI', '/js/ui/talent-ui.js');
app.scripts.add('inventoryUI', '/js/ui/inventory-ui.js');

// Create camera entity
const camera = new pc.Entity('camera');
camera.addComponent('camera', {
    clearColor: new pc.Color(0.1, 0.2, 0.3)
});
camera.addComponent('script');
app.root.addChild(camera);

// Position the camera
camera.setPosition(0, 10, 15);
camera.lookAt(0, 0, 0);

// Create directional light
const light = new pc.Entity('light');
light.addComponent('light', {
    type: 'directional',
    color: new pc.Color(1, 1, 1),
    castShadows: true,
    shadowBias: 0.2,
    normalOffsetBias: 0.05,
    shadowDistance: 50
});
app.root.addChild(light);
light.setEulerAngles(45, 30, 0);

// Create ground plane
const ground = new pc.Entity('ground');
ground.addComponent('render', {
    type: 'box',
    material: new pc.StandardMaterial()
});
ground.render.material.diffuse = new pc.Color(0.5, 0.5, 0.5);
ground.render.material.update();
ground.setLocalScale(50, 1, 50);
ground.setPosition(0, -0.5, 0);

// Add a rigid body and collision to the ground
ground.addComponent('collision', {
    type: 'box',
    halfExtents: new pc.Vec3(25, 0.5, 25)
});
ground.addComponent('rigidbody', {
    type: 'static',
    restitution: 0.5
});

app.root.addChild(ground);

// Create hero entity (using Axe as the initial hero)
const hero = new pc.Entity('hero');
hero.addComponent('render', {
    type: 'box',
    material: new pc.StandardMaterial()
});
hero.render.material.diffuse = new pc.Color(0.8, 0.2, 0.2); // Red for Axe
hero.render.material.update();
hero.setLocalScale(1.2, 2.2, 1.2);
hero.setPosition(0, 1, 0);

// Add physics to hero
hero.addComponent('collision', {
    type: 'capsule',
    radius: 0.5,
    height: 2
});
hero.addComponent('rigidbody', {
    type: 'dynamic',
    mass: 50,
    linearDamping: 0.9,
    angularDamping: 0.9,
    linearFactor: new pc.Vec3(1, 1, 1),
    angularFactor: new pc.Vec3(0, 1, 0)
});

// Add scripts to hero
hero.addComponent('script');
hero.script.create('attributeSystem');
hero.script.create('abilitySystem');
hero.script.create('experienceSystem');
hero.script.create('talentSystem');
hero.script.create('inventorySystem');
hero.script.create('axe'); // This will also create the 'hero' script

app.root.addChild(hero);

// Character controller script
const CharacterController = pc.createScript('characterController');

CharacterController.attributes.add('speed', { type: 'number', default: 5 });
CharacterController.attributes.add('jumpForce', { type: 'number', default: 400 });
CharacterController.attributes.add('rotationSpeed', { type: 'number', default: 2 });
CharacterController.attributes.add('cameraRotationSpeed', { type: 'number', default: 0.2 });
CharacterController.attributes.add('cameraZoomSpeed', { type: 'number', default: 0.2 });
CharacterController.attributes.add('cameraMinDistance', { type: 'number', default: 5 });
CharacterController.attributes.add('cameraMaxDistance', { type: 'number', default: 20 });

// initialize code called once per entity
CharacterController.prototype.initialize = function() {
    this.force = new pc.Vec3();
    
    // Movement target for point-and-click
    this.moveTarget = null;
    this.isMovingToTarget = false;
    this.targetReachedThreshold = 0.5;
    
    // Combat target
    this.combatTarget = null;
    this.isAutoAttacking = false;
    this.autoAttackTimer = 0;
    this.autoAttackCooldown = 1.0; // Base attack speed, will be modified by attributes
    
    // Check if mouse is available before adding listeners
    if (app.mouse) {
        // Listen for mouse events
        app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
        app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
        app.mouse.on(pc.EVENT_MOUSEWHEEL, this.onMouseWheel, this);
    } else {
        console.warn("Mouse input is not available");
    }
    
    // Check if keyboard is available before adding listeners
    if (app.keyboard) {
        // Listen for keyboard events
        app.keyboard.on(pc.EVENT_KEYDOWN, this.onKeyDown, this);
    } else {
        console.warn("Keyboard input is not available");
    }
    
    // Camera setup
    this.cameraOffset = new pc.Vec3(0, 5, 10);
    this.targetCameraOffset = new pc.Vec3(0, 5, 10);
    this.cameraLookAt = new pc.Vec3();
    this.cameraRotating = false;
    
    // Get attribute system for movement speed
    this.attributeSystem = this.entity.script.attributeSystem;
    
    // Create a visual indicator for movement target
    this.createMoveTargetIndicator();
    
    console.log("Character controller initialized with point-and-click movement");
};

// Create a visual indicator for the movement target
CharacterController.prototype.createMoveTargetIndicator = function() {
    this.targetIndicator = new pc.Entity("moveTargetIndicator");
    this.targetIndicator.addComponent('render', {
        type: 'cylinder',
        material: new pc.StandardMaterial()
    });
    
    // Set the indicator appearance
    this.targetIndicator.setLocalScale(0.5, 0.1, 0.5);
    this.targetIndicator.render.material.diffuse = new pc.Color(0, 1, 0);
    this.targetIndicator.render.material.emissive = new pc.Color(0, 0.5, 0);
    this.targetIndicator.render.material.update();
    
    // Add to scene but disable initially
    app.root.addChild(this.targetIndicator);
    this.targetIndicator.enabled = false;
};

// update code called every frame
CharacterController.prototype.update = function(dt) {
    const rigidbody = this.entity.rigidbody;
    
    // Reset forces
    this.force.set(0, 0, 0);
    
    // Get movement speed from attribute system if available
    let movementSpeed = this.speed;
    if (this.attributeSystem && this.attributeSystem.movementSpeed) {
        movementSpeed = this.attributeSystem.movementSpeed;
    }
    
    // Handle point-and-click movement
    if (this.isMovingToTarget && this.moveTarget) {
        const currentPos = this.entity.getPosition();
        const targetPos = this.moveTarget.clone();
        
        // Ignore Y axis for distance calculation (only care about horizontal distance)
        currentPos.y = 0;
        targetPos.y = 0;
        
        // Calculate distance to target
        const distanceToTarget = currentPos.distance(targetPos);
        
        if (distanceToTarget > this.targetReachedThreshold) {
            // Calculate direction to target
            const direction = new pc.Vec3();
            direction.sub2(this.moveTarget, this.entity.getPosition());
            direction.y = 0; // Keep movement on the horizontal plane
            direction.normalize();
            
            // Apply force in the target direction
            this.force.add(direction.scale(movementSpeed));
            
            // Rotate character to face movement direction
            if (direction.length() > 0.01) {
                const targetAngle = Math.atan2(direction.x, direction.z) * (180 / Math.PI);
                const currentRotation = this.entity.getEulerAngles();
                const rotationSpeed = this.rotationSpeed * dt * 60; // Adjust for framerate
                
                // Smoothly rotate towards the target angle
                const newRotation = pc.math.lerpAngle(currentRotation.y, targetAngle, rotationSpeed);
                this.entity.setEulerAngles(0, newRotation, 0);
            }
        } else {
            // Target reached
            this.isMovingToTarget = false;
            this.targetIndicator.enabled = false;
            
            // If we have a combat target, start auto-attacking
            if (this.combatTarget) {
                this.isAutoAttacking = true;
            }
        }
    }
    
    // Movement based on WASD keys - only if keyboard is available
    if (app.keyboard) {
        let keyboardMovement = false;
        
        if (app.keyboard.isPressed(pc.KEY_W)) {
            this.force.z -= movementSpeed;
            keyboardMovement = true;
        }
        if (app.keyboard.isPressed(pc.KEY_S)) {
            this.force.z += movementSpeed;
            keyboardMovement = true;
        }
        if (app.keyboard.isPressed(pc.KEY_A)) {
            this.force.x -= movementSpeed;
            keyboardMovement = true;
        }
        if (app.keyboard.isPressed(pc.KEY_D)) {
            this.force.x += movementSpeed;
            keyboardMovement = true;
        }
        
        // If using keyboard movement, cancel point-and-click movement
        if (keyboardMovement) {
            this.isMovingToTarget = false;
            this.targetIndicator.enabled = false;
        }
    }
    
    // Apply movement force
    if (this.force.length() > 0) {
        // Convert force direction from local space to world space
        const worldForce = this.entity.forward.clone().scale(-this.force.z).add(
            this.entity.right.clone().scale(this.force.x)
        );
        rigidbody.applyForce(worldForce);
    }
    
    // Handle auto-attacking
    if (this.isAutoAttacking && this.combatTarget) {
        this.autoAttackTimer -= dt;
        
        if (this.autoAttackTimer <= 0) {
            this.performAutoAttack();
            
            // Reset timer based on attack speed
            let attackSpeed = 1.0;
            if (this.attributeSystem && this.attributeSystem.attackSpeed) {
                attackSpeed = this.attributeSystem.attackSpeed;
            }
            this.autoAttackTimer = this.autoAttackCooldown / attackSpeed;
        }
    }
    
    // Update camera position to follow character
    this.updateCamera();
};

// Update camera position and rotation
CharacterController.prototype.updateCamera = function() {
    const entityPos = this.entity.getPosition();
    
    // Get entity rotation and calculate forward, right, and up vectors
    const entityRotation = this.entity.getRotation();
    const entityForward = new pc.Vec3(0, 0, -1);
    const entityRight = new pc.Vec3(1, 0, 0);
    const entityUp = new pc.Vec3(0, 1, 0);
    
    // Calculate camera position based on entity orientation
    const cameraPos = new pc.Vec3();
    
    // Move backward along entity's forward vector
    cameraPos.copy(entityPos);
    cameraPos.sub(entityForward.clone().scale(this.targetCameraOffset.z));
    
    // Move right along entity's right vector
    cameraPos.add(entityRight.clone().scale(this.targetCameraOffset.x));
    
    // Move up along entity's up vector
    cameraPos.add(entityUp.clone().scale(this.targetCameraOffset.y));
    
    // Set camera position
    camera.setPosition(cameraPos);
    
    // Make camera look at character
    this.cameraLookAt.copy(this.entity.getPosition());
    this.cameraLookAt.y += 1; // Look at character's head level
    camera.lookAt(this.cameraLookAt);
};

// Handle mouse movement
CharacterController.prototype.onMouseMove = function(event) {
    // Handle camera rotation when middle mouse button is pressed
    if (this.cameraRotating) {
        // Rotate the camera around the character
        const rotationAmount = event.dx * this.cameraRotationSpeed;
        
        // Update the camera offset based on rotation
        const currentX = this.targetCameraOffset.x;
        const currentZ = this.targetCameraOffset.z;
        
        // Apply rotation to the camera offset
        const angle = rotationAmount * (Math.PI / 180);
        this.targetCameraOffset.x = currentX * Math.cos(angle) - currentZ * Math.sin(angle);
        this.targetCameraOffset.z = currentX * Math.sin(angle) + currentZ * Math.cos(angle);
    }
};

// Handle mouse button press
CharacterController.prototype.onMouseDown = function(event) {
    // Middle mouse button for camera rotation
    if (event.button === pc.MOUSEBUTTON_MIDDLE) {
        this.cameraRotating = true;
        
        // Listen for mouse up event to stop rotation
        const mouseUpHandler = function(upEvent) {
            this.cameraRotating = false;
            app.mouse.off(pc.EVENT_MOUSEUP, mouseUpHandler);
        }.bind(this);
        
        app.mouse.on(pc.EVENT_MOUSEUP, mouseUpHandler);
        return;
    }
    
    // Left mouse button for movement or targeting
    if (event.button === pc.MOUSEBUTTON_LEFT) {
        // Cast a ray from the camera through the mouse position
        const ray = this.getCameraRay(event);
        
        // Check for enemy hit first (for targeting)
        const enemyHit = this.checkEnemyHit(ray);
        if (enemyHit) {
            // Set combat target and move to it
            this.setCombatTarget(enemyHit);
            return;
        }
        
        // Check for ground hit (for movement)
        const groundHit = this.checkGroundHit(ray);
        if (groundHit) {
            // Set movement target
            this.setMoveTarget(groundHit.point);
        }
    }
};

// Handle mouse wheel for camera zoom
CharacterController.prototype.onMouseWheel = function(event) {
    // Adjust camera distance based on wheel direction
    const zoomAmount = event.wheel * this.cameraZoomSpeed;
    
    // Update camera distance (z component of offset)
    this.targetCameraOffset.z += zoomAmount;
    
    // Clamp to min/max distance
    this.targetCameraOffset.z = pc.math.clamp(
        this.targetCameraOffset.z, 
        this.cameraMinDistance, 
        this.cameraMaxDistance
    );
};

// Get a ray from the camera through the mouse position
CharacterController.prototype.getCameraRay = function(event) {
    // Get the canvas coordinates of the mouse
    const canvasWidth = app.graphicsDevice.width;
    const canvasHeight = app.graphicsDevice.height;
    
    // Calculate the normalized device coordinates (-1 to 1)
    const x = (event.x / canvasWidth) * 2 - 1;
    const y = (event.y / canvasHeight) * -2 + 1;
    
    // Create a ray from the camera through this point
    const ray = camera.camera.screenToWorld(x, y, camera.camera.farClip);
    
    return ray;
};

// Check if the ray hits an enemy
CharacterController.prototype.checkEnemyHit = function(ray) {
    // This is a placeholder - in a real implementation, we would:
    // 1. Check for collision with enemy entities
    // 2. Return the closest enemy hit
    
    // For now, just return null (no enemy hit)
    return null;
};

// Check if the ray hits the ground
CharacterController.prototype.checkGroundHit = function(ray) {
    // Find the ground entity
    const ground = app.root.findByName('ground');
    if (!ground) return null;
    
    // Create a ray from the camera position in the direction of the ray
    const rayStart = ray.origin;
    const rayDir = ray.direction;
    
    // Simple plane intersection for the ground
    // Assuming the ground is at y=0 and is flat
    if (rayDir.y >= 0) return null; // Ray is pointing up, can't hit ground
    
    // Calculate intersection with y=0 plane
    const t = -rayStart.y / rayDir.y;
    const hitPoint = new pc.Vec3(
        rayStart.x + rayDir.x * t,
        0,
        rayStart.z + rayDir.z * t
    );
    
    // Check if the hit point is within the ground bounds
    const groundScale = ground.getLocalScale();
    const groundPos = ground.getPosition();
    
    if (hitPoint.x >= groundPos.x - groundScale.x/2 && 
        hitPoint.x <= groundPos.x + groundScale.x/2 &&
        hitPoint.z >= groundPos.z - groundScale.z/2 && 
        hitPoint.z <= groundPos.z + groundScale.z/2) {
        
        // Return hit information
        return {
            entity: ground,
            point: hitPoint
        };
    }
    
    return null;
};

// Set a movement target
CharacterController.prototype.setMoveTarget = function(position) {
    // Set the target position
    this.moveTarget = position.clone();
    
    // Adjust Y position to be slightly above ground
    this.moveTarget.y = 0.1;
    
    // Start moving to target
    this.isMovingToTarget = true;
    
    // Update target indicator
    this.targetIndicator.setPosition(this.moveTarget);
    this.targetIndicator.enabled = true;
    
    // Cancel auto-attacking when moving
    this.isAutoAttacking = false;
    
    console.log(`Moving to position: ${this.moveTarget.x.toFixed(2)}, ${this.moveTarget.z.toFixed(2)}`);
};

// Set a combat target
CharacterController.prototype.setCombatTarget = function(target) {
    this.combatTarget = target;
    
    // Move to the target
    const targetPos = target.getPosition();
    
    // Calculate a position within attack range
    const attackRange = 2.0; // Default attack range
    const direction = new pc.Vec3();
    direction.sub2(this.entity.getPosition(), targetPos);
    direction.y = 0;
    direction.normalize();
    
    // Set the move target to be at attack range from the enemy
    const movePos = new pc.Vec3();
    movePos.copy(targetPos);
    movePos.add(direction.scale(attackRange));
    
    this.setMoveTarget(movePos);
    
    console.log(`Targeting enemy: ${target.name}`);
};

// Perform an auto-attack
CharacterController.prototype.performAutoAttack = function() {
    if (!this.combatTarget) return;
    
    // Get hero and attribute system
    const hero = this.entity.script.hero;
    const attributeSystem = this.entity.script.attributeSystem;
    
    if (!hero || !attributeSystem) return;
    
    // Calculate damage based on attributes
    let damage = attributeSystem.physicalDamage;
    
    // Check for critical hit
    const critChance = attributeSystem.criticalChance / 100;
    const isCrit = Math.random() < critChance;
    
    if (isCrit) {
        damage *= 2;
        console.log(`Critical hit! Damage: ${damage.toFixed(0)}`);
    }
    
    console.log(`Auto-attack deals ${damage.toFixed(0)} damage`);
    
    // In a real implementation, we would apply damage to the target
    // For now, just log it
};

CharacterController.prototype.onKeyDown = function(event) {
    // Jump when spacebar is pressed
    if (event.key === pc.KEY_SPACE) {
        const rigidbody = this.entity.rigidbody;
        const pos = this.entity.getPosition();
        
        // Simple ground check - can be improved
        if (pos.y <= 1.1) {
            rigidbody.applyImpulse(0, this.jumpForce, 0);
        }
    }
    
    // Test key for gaining experience (for development purposes)
    if (event.key === pc.KEY_X) {
        if (this.entity.script.experienceSystem) {
            this.entity.script.experienceSystem.addExperience(500, 'enemyDefeat');
        }
    }
    
    // Test key for taking damage (for development purposes)
    if (event.key === pc.KEY_Z) {
        if (this.entity.script.hero) {
            this.entity.script.hero.takeDamage(20, 'physical');
        }
    }
    
    // Test key for healing (for development purposes)
    if (event.key === pc.KEY_H) {
        if (this.entity.script.hero) {
            this.entity.script.hero.heal(50);
        }
    }
    
    // Test key for adding items to inventory (for development purposes)
    if (event.key === pc.KEY_G) {
        if (this.entity.script.inventorySystem) {
            this.addTestItems();
        }
    }
    
    // Reset camera position with R key
    if (event.key === pc.KEY_R) {
        this.targetCameraOffset = new pc.Vec3(0, 5, 10);
    }
};

// Add test items to inventory
CharacterController.prototype.addTestItems = function() {
    const inventorySystem = this.entity.script.inventorySystem;
    if (!inventorySystem) return;
    
    // Create test items
    const testItems = [
        {
            id: 'health_potion',
            name: 'Health Potion',
            description: 'Restores 100 health points.',
            type: 'consumable',
            slot: null,
            stackable: true,
            count: 3,
            value: 50,
            effect: {
                type: 'heal',
                amount: 100
            }
        },
        {
            id: 'mana_potion',
            name: 'Mana Potion',
            description: 'Restores 75 mana points.',
            type: 'consumable',
            slot: null,
            stackable: true,
            count: 2,
            value: 40,
            effect: {
                type: 'mana',
                amount: 75
            }
        },
        {
            id: 'strength_sword',
            name: 'Sword of Strength',
            description: 'A powerful sword that increases strength.',
            type: 'weapon',
            slot: 'weapon',
            stackable: false,
            value: 500,
            attributes: {
                strength: 10,
                physicalDamage: 25
            }
        },
        {
            id: 'magic_staff',
            name: 'Staff of Arcane Power',
            description: 'A staff imbued with magical energy.',
            type: 'weapon',
            slot: 'weapon',
            stackable: false,
            value: 450,
            attributes: {
                intelligence: 15,
                magicalDamage: 30
            }
        },
        {
            id: 'leather_armor',
            name: 'Leather Armor',
            description: 'Light armor that provides basic protection.',
            type: 'armor',
            slot: 'chest',
            stackable: false,
            value: 300,
            attributes: {
                vitality: 5,
                agility: 3
            }
        },
        {
            id: 'magic_amulet',
            name: 'Amulet of Wisdom',
            description: 'An ancient amulet that enhances magical abilities.',
            type: 'accessory',
            slot: 'accessory1',
            stackable: false,
            value: 350,
            attributes: {
                intelligence: 8,
                spirit: 5
            }
        }
    ];
    
    // Add items to inventory
    for (const item of testItems) {
        inventorySystem.addItem(item);
    }
    
    // Add some gold
    inventorySystem.addGold(1000);
    
    console.log('Added test items to inventory');
};

// Add the character controller script to the hero
hero.script.create('characterController');

// Create a UI for displaying hero stats
const createStatsUI = function() {
    // Create a UI entity
    const ui = new pc.Entity('ui');
    ui.addComponent('element', {
        type: 'text',
        text: 'Loading hero stats...',
        fontAsset: null, // We'll use the default font
        fontSize: 16,
        color: new pc.Color(1, 1, 1),
        width: 400,
        height: 200,
        anchor: new pc.Vec4(0, 1, 0, 1), // Top left
        pivot: new pc.Vec2(0, 1),
        margin: new pc.Vec4(10, 10, 0, 0)
    });
    
    // Create a screen to hold the UI
    const screen = new pc.Entity('screen');
    screen.addComponent('screen', { resolution: new pc.Vec2(1280, 720), screenSpace: true });
    screen.addChild(ui);
    app.root.addChild(screen);
    
    // Update the UI with hero stats
    app.on('update', function() {
        if (hero.script.attributeSystem) {
            const attrs = hero.script.attributeSystem;
            const heroScript = hero.script.hero;
            const expSystem = hero.script.experienceSystem;
            
            let statsText = '';
            
            if (heroScript) {
                statsText += `Hero: ${heroScript.heroName}\n`;
            }
            
            if (expSystem) {
                statsText += `Level: ${expSystem.level}\n`;
                statsText += `XP: ${expSystem.experience}/${expSystem.experienceToNextLevel}\n`;
                statsText += `Ability Points: ${expSystem.abilityPoints}\n`;
                statsText += `Talent Points: ${expSystem.talentPoints}\n\n`;
            }
            
            statsText += `Health: ${Math.floor(attrs.currentHealth)}/${Math.floor(attrs.maxHealth)}\n`;
            statsText += `Mana: ${Math.floor(attrs.currentMana)}/${Math.floor(attrs.maxMana)}\n\n`;
            
            statsText += `STR: ${Math.floor(attrs.strength)}\n`;
            statsText += `AGI: ${Math.floor(attrs.agility)}\n`;
            statsText += `INT: ${Math.floor(attrs.intelligence)}\n`;
            statsText += `VIT: ${Math.floor(attrs.vitality)}\n`;
            statsText += `SPR: ${Math.floor(attrs.spirit)}\n\n`;
            
            statsText += `Physical Damage: ${Math.floor(attrs.physicalDamage)}\n`;
            statsText += `Magical Damage: ${Math.floor(attrs.magicalDamage)}\n`;
            statsText += `Movement Speed: ${attrs.movementSpeed.toFixed(1)}\n`;
            
            statsText += `\nControls:\n`;
            statsText += `WASD: Move\n`;
            statsText += `Space: Jump\n`;
            statsText += `Q/W/E/R: Abilities\n`;
            statsText += `TAB: Hero Selection\n`;
            statsText += `T: Talent Tree\n`;
            statsText += `I: Inventory\n`;
            statsText += `X: Gain XP (test)\n`;
            statsText += `Z: Take Damage (test)\n`;
            statsText += `H: Heal (test)\n`;
            
            ui.element.text = statsText;
        }
    });
};

// Create the UI
createStatsUI();

// Create hero selection UI
const heroSelectionUI = new pc.Entity('heroSelectionUI');
heroSelectionUI.addComponent('script');
heroSelectionUI.script.create('heroSelection');
app.root.addChild(heroSelectionUI);

// Create talent UI
const talentUI = new pc.Entity('talentUI');
talentUI.addComponent('script');
talentUI.script.create('talentUI');
app.root.addChild(talentUI);

// Create inventory UI
const inventoryUI = new pc.Entity('inventoryUI');
inventoryUI.addComponent('script');
inventoryUI.script.create('inventoryUI');
app.root.addChild(inventoryUI);

// Create enemy spawner
const enemySpawner = new pc.Entity('enemySpawner');
enemySpawner.addComponent('script');
enemySpawner.script.create('enemySpawner');
app.root.addChild(enemySpawner);

// Create a progress log file
const createProgressLog = function() {
    // Log initial implementation progress
    const progressLog = `
# Implementation Progress Log

## ${new Date().toISOString()}

### Initial Implementation
- Created attribute system based on the requirements in progression.md
- Implemented hero base class with attribute integration
- Added Axe as the first playable hero
- Implemented ability system framework
- Added experience and leveling system
- Updated main app to integrate all systems
- Added basic UI for displaying hero stats

### Next Steps
- Implement more heroes (Crystal Maiden, Lich, Storm Spirit)
- Create proper ability implementations
- Add talent system
- Implement inventory and item system
- Create proper game environments and enemies
- Add quest system

### Current Functionality
- Character movement with WASD
- Camera control with mouse
- Basic attribute system with derived statistics
- Experience gain and leveling (press X to test)
- Health and mana management (press Z to take damage, H to heal)
- Ability framework (press Q/W/E/R to use abilities)
`;

    return progressLog;
};

// Create a function to save the progress log
const saveProgressLog = function(content) {
    console.log("Progress log created:");
    console.log(content);
    
    // In a real implementation, this would save to a file
    // For now, we'll just log it to the console
    
    // Note: In a browser environment, we can't directly write to the file system
    // This would need to be handled by a server-side component
};

// Save the progress log
saveProgressLog(createProgressLog());

// Start the application
app.start();