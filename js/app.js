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

// Entities
app.scripts.add('hero', '/js/entities/hero.js');
app.scripts.add('axe', '/js/entities/heroes/axe.js');
app.scripts.add('crystalMaiden', '/js/entities/heroes/crystal-maiden.js');
app.scripts.add('lich', '/js/entities/heroes/lich.js');
app.scripts.add('stormSpirit', '/js/entities/heroes/storm-spirit.js');

// UI
app.scripts.add('heroSelection', '/js/ui/hero-selection.js');

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
hero.script.create('axe'); // This will also create the 'hero' script

app.root.addChild(hero);

// Character controller script
const CharacterController = pc.createScript('characterController');

CharacterController.attributes.add('speed', { type: 'number', default: 5 });
CharacterController.attributes.add('jumpForce', { type: 'number', default: 400 });

// initialize code called once per entity
CharacterController.prototype.initialize = function() {
    this.force = new pc.Vec3();
    
    // Check if mouse is available before adding listeners
    if (app.mouse) {
        // Listen for mouse events
        app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
        
        // Lock the mouse pointer when the canvas is clicked
        app.mouse.on("mousedown", function () {
            app.mouse.enablePointerLock();
        }, this);
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
    
    // Get attribute system for movement speed
    this.attributeSystem = this.entity.script.attributeSystem;
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
    
    // Movement based on WASD keys - only if keyboard is available
    if (app.keyboard) {
        if (app.keyboard.isPressed(pc.KEY_W)) {
            this.force.z -= movementSpeed;
        }
        if (app.keyboard.isPressed(pc.KEY_S)) {
            this.force.z += movementSpeed;
        }
        if (app.keyboard.isPressed(pc.KEY_A)) {
            this.force.x -= movementSpeed;
        }
        if (app.keyboard.isPressed(pc.KEY_D)) {
            this.force.x += movementSpeed;
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
    
    // Update camera position to follow character
    const idealOffset = this.targetCameraOffset.clone();
    idealOffset.transformQuat(this.entity.getRotation());
    const idealPosition = this.entity.getPosition().clone().add(idealOffset);
    
    camera.setPosition(idealPosition);
    
    // Make camera look at character
    this.cameraLookAt.copy(this.entity.getPosition());
    this.cameraLookAt.y += 1; // Look at character's head level
    camera.lookAt(this.cameraLookAt);
};

CharacterController.prototype.onMouseMove = function(event) {
    // Only rotate character if pointer is locked and pc.Mouse is available
    if (pc.Mouse && pc.Mouse.isPointerLocked()) {
        // Rotate character based on mouse movement
        this.entity.rotate(0, event.dx * 0.2, 0);
    }
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