// Initialize PlayCanvas application
const canvas = document.getElementById('application-canvas');
const app = new pc.Application(canvas);

// Fill the available space at full resolution
app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
app.setCanvasResolution(pc.RESOLUTION_AUTO);

// Ensure canvas is resized when window changes size
window.addEventListener('resize', () => app.resizeCanvas());

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

// Create character entity
const character = new pc.Entity('character');
character.addComponent('render', {
    type: 'box',
    material: new pc.StandardMaterial()
});
character.render.material.diffuse = new pc.Color(0, 0.58, 0.86);
character.render.material.update();
character.setLocalScale(1, 2, 1);
character.setPosition(0, 1, 0);

// Add physics to character
character.addComponent('collision', {
    type: 'capsule',
    radius: 0.5,
    height: 2
});
character.addComponent('rigidbody', {
    type: 'dynamic',
    mass: 50,
    linearDamping: 0.9,
    angularDamping: 0.9,
    linearFactor: new pc.Vec3(1, 1, 1),
    angularFactor: new pc.Vec3(0, 1, 0)
});

app.root.addChild(character);

// Character controller script
const CharacterController = pc.createScript('characterController');

CharacterController.attributes.add('speed', { type: 'number', default: 5 });
CharacterController.attributes.add('jumpForce', { type: 'number', default: 400 });

// initialize code called once per entity
CharacterController.prototype.initialize = function() {
    this.force = new pc.Vec3();
    
    // Listen for mouse events
    app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
    
    // Listen for keyboard events
    app.keyboard.on(pc.EVENT_KEYDOWN, this.onKeyDown, this);
    
    // Camera setup
    this.cameraOffset = new pc.Vec3(0, 5, 10);
    this.targetCameraOffset = new pc.Vec3(0, 5, 10);
    this.cameraLookAt = new pc.Vec3();
    
    // Lock the mouse pointer when the canvas is clicked
    app.mouse.on("mousedown", function () {
        app.mouse.enablePointerLock();
    }, this);
};

// update code called every frame
CharacterController.prototype.update = function(dt) {
    const rigidbody = this.entity.rigidbody;
    
    // Reset forces
    this.force.set(0, 0, 0);
    
    // Movement based on WASD keys
    if (app.keyboard.isPressed(pc.KEY_W)) {
        this.force.z -= this.speed;
    }
    if (app.keyboard.isPressed(pc.KEY_S)) {
        this.force.z += this.speed;
    }
    if (app.keyboard.isPressed(pc.KEY_A)) {
        this.force.x -= this.speed;
    }
    if (app.keyboard.isPressed(pc.KEY_D)) {
        this.force.x += this.speed;
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
    // Only rotate character if pointer is locked
    if (pc.Mouse.isPointerLocked()) {
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
};

// Add the character controller script to the character
character.addComponent('script');
character.script.create('characterController');

// Add a magic skill system
const MagicSystem = pc.createScript('magicSystem');

MagicSystem.attributes.add('castingTime', { type: 'number', default: 0.5 });

MagicSystem.prototype.initialize = function() {
    this.isCasting = false;
    this.castTimer = 0;
    
    // Listen for mouse clicks to cast spells
    app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
};

MagicSystem.prototype.update = function(dt) {
    if (this.isCasting) {
        this.castTimer += dt;
        
        if (this.castTimer >= this.castingTime) {
            this.castSpell();
            this.isCasting = false;
            this.castTimer = 0;
        }
    }
};

MagicSystem.prototype.onMouseDown = function(event) {
    // Right mouse button to cast spell
    if (event.button === pc.MOUSEBUTTON_RIGHT) {
        this.startCasting();
    }
};

MagicSystem.prototype.startCasting = function() {
    this.isCasting = true;
    this.castTimer = 0;
    
    // Visual feedback for casting could be added here
    console.log("Started casting spell...");
};

MagicSystem.prototype.castSpell = function() {
    // Create a magic projectile
    const projectile = new pc.Entity("magicProjectile");
    projectile.addComponent('render', {
        type: 'sphere',
        material: new pc.StandardMaterial()
    });
    
    // Set projectile appearance
    projectile.render.material.emissive = new pc.Color(0.3, 0, 0.8);
    projectile.render.material.update();
    projectile.setLocalScale(0.5, 0.5, 0.5);
    
    // Position the projectile in front of the character
    const spawnPoint = this.entity.getPosition().clone();
    spawnPoint.y += 1; // Spawn at character's "hand" level
    
    const forward = this.entity.forward.clone().scale(-2);
    spawnPoint.add(forward);
    
    projectile.setPosition(spawnPoint);
    
    // Add physics to the projectile
    projectile.addComponent('collision', {
        type: 'sphere',
        radius: 0.5
    });
    
    projectile.addComponent('rigidbody', {
        type: 'dynamic',
        mass: 1,
        linearDamping: 0,
        angularDamping: 0
    });
    
    // Add the projectile to the scene
    app.root.addChild(projectile);
    
    // Apply force to the projectile in the direction the character is facing
    const force = this.entity.forward.clone().scale(-1000);
    projectile.rigidbody.applyImpulse(force);
    
    // Destroy the projectile after 3 seconds
    setTimeout(function() {
        projectile.destroy();
    }, 3000);
    
    console.log("Spell cast!");
};

// Add the magic system script to the character
character.script.create('magicSystem');

// Start the application
app.start();