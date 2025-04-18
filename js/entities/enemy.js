/**
 * Enemy Entity
 * 
 * Base class for all enemy entities in the game.
 * Handles health, damage, and basic AI behavior.
 */

const Enemy = pc.createScript('enemy');

// Enemy properties
Enemy.attributes.add('enemyName', { type: 'string', default: 'Unknown Enemy' });
Enemy.attributes.add('enemyType', { 
    type: 'string', 
    default: 'normal',
    enum: [
        { 'Normal': 'normal' },
        { 'Elite': 'elite' },
        { 'Boss': 'boss' }
    ]
});
Enemy.attributes.add('level', { type: 'number', default: 1 });
Enemy.attributes.add('maxHealth', { type: 'number', default: 100 });
Enemy.attributes.add('physicalDamage', { type: 'number', default: 10 });
Enemy.attributes.add('magicalDamage', { type: 'number', default: 5 });
Enemy.attributes.add('attackRange', { type: 'number', default: 2 });
Enemy.attributes.add('aggroRange', { type: 'number', default: 10 });
Enemy.attributes.add('attackSpeed', { type: 'number', default: 1 });
Enemy.attributes.add('movementSpeed', { type: 'number', default: 3 });
Enemy.attributes.add('experienceValue', { type: 'number', default: 50 });

// Initialize the enemy
Enemy.prototype.initialize = function() {
    // Set up health
    this.currentHealth = this.maxHealth;
    
    // Set up state
    this.state = 'idle'; // idle, aggro, attacking, dead
    this.target = null;
    this.attackTimer = 0;
    
    // Set up visual indicator for selection
    this.createSelectionIndicator();
    
    // Set up health bar
    this.createHealthBar();
    
    console.log(`Enemy initialized: ${this.enemyName} (Level ${this.level} ${this.enemyType})`);
};

Enemy.prototype.update = function(dt) {
    // Skip update if dead
    if (this.state === 'dead') return;
    
    // Find player if we don't have a target
    if (!this.target) {
        this.findPlayer();
    }
    
    // Update based on current state
    switch(this.state) {
        case 'idle':
            this.updateIdle(dt);
            break;
        case 'aggro':
            this.updateAggro(dt);
            break;
        case 'attacking':
            this.updateAttacking(dt);
            break;
    }
    
    // Update health bar position
    this.updateHealthBar();
};

/**
 * Create a visual indicator for when the enemy is selected
 */
Enemy.prototype.createSelectionIndicator = function() {
    this.selectionIndicator = new pc.Entity("selectionIndicator");
    this.selectionIndicator.addComponent('render', {
        type: 'cylinder',
        material: new pc.StandardMaterial()
    });
    
    // Set the indicator appearance
    this.selectionIndicator.setLocalScale(1.5, 0.1, 1.5);
    this.selectionIndicator.render.material.diffuse = new pc.Color(1, 0, 0);
    this.selectionIndicator.render.material.emissive = new pc.Color(0.5, 0, 0);
    this.selectionIndicator.render.material.update();
    
    // Add to enemy but disable initially
    this.entity.addChild(this.selectionIndicator);
    this.selectionIndicator.setLocalPosition(0, -0.9, 0); // Position at feet
    this.selectionIndicator.enabled = false;
};

/**
 * Create a health bar for the enemy
 */
Enemy.prototype.createHealthBar = function() {
    // Create a container for the health bar
    this.healthBarContainer = new pc.Entity("healthBarContainer");
    
    // Create the background bar
    this.healthBarBg = new pc.Entity("healthBarBg");
    this.healthBarBg.addComponent('render', {
        type: 'box',
        material: new pc.StandardMaterial()
    });
    this.healthBarBg.setLocalScale(1, 0.1, 0.1);
    this.healthBarBg.render.material.diffuse = new pc.Color(0.2, 0.2, 0.2);
    this.healthBarBg.render.material.update();
    
    // Create the foreground bar (actual health)
    this.healthBarFg = new pc.Entity("healthBarFg");
    this.healthBarFg.addComponent('render', {
        type: 'box',
        material: new pc.StandardMaterial()
    });
    this.healthBarFg.setLocalScale(1, 0.1, 0.1);
    this.healthBarFg.render.material.diffuse = new pc.Color(1, 0, 0);
    this.healthBarFg.render.material.emissive = new pc.Color(0.5, 0, 0);
    this.healthBarFg.render.material.update();
    
    // Add to container
    this.healthBarContainer.addChild(this.healthBarBg);
    this.healthBarContainer.addChild(this.healthBarFg);
    
    // Add container to enemy
    this.entity.addChild(this.healthBarContainer);
    
    // Position above enemy
    this.healthBarContainer.setLocalPosition(0, 2, 0);
    
    // Make health bar face the camera
    this.healthBarContainer.setLocalEulerAngles(0, 0, 0);
    
    // Update health bar to reflect current health
    this.updateHealthBar();
};

/**
 * Update the health bar to reflect current health
 */
Enemy.prototype.updateHealthBar = function() {
    // Calculate health percentage
    const healthPercent = this.currentHealth / this.maxHealth;
    
    // Update the foreground bar scale
    this.healthBarFg.setLocalScale(healthPercent, 0.1, 0.1);
    
    // Update position to center the bar
    this.healthBarFg.setLocalPosition((healthPercent - 1) / 2, 0, 0);
    
    // Make health bar face the camera
    const camera = this.app.root.findByName('camera');
    if (camera) {
        const cameraPos = camera.getPosition();
        const enemyPos = this.entity.getPosition();
        const direction = new pc.Vec3();
        direction.sub2(cameraPos, enemyPos);
        direction.y = 0; // Keep rotation only around Y axis
        
        if (direction.length() > 0.001) {
            const angle = Math.atan2(direction.x, direction.z) * (180 / Math.PI);
            this.healthBarContainer.setLocalEulerAngles(0, angle, 0);
        }
    }
};

/**
 * Find the player entity
 */
Enemy.prototype.findPlayer = function() {
    const player = this.app.root.findByName('hero');
    if (player) {
        const distance = this.entity.getPosition().distance(player.getPosition());
        
        // Check if player is within aggro range
        if (distance <= this.aggroRange) {
            this.target = player;
            this.state = 'aggro';
            console.log(`${this.enemyName} spotted the player!`);
        }
    }
};

/**
 * Update logic for idle state
 */
Enemy.prototype.updateIdle = function(dt) {
    // In idle state, we just look for the player
    // This is handled in the findPlayer method called in update
};

/**
 * Update logic for aggro state
 */
Enemy.prototype.updateAggro = function(dt) {
    if (!this.target) {
        this.state = 'idle';
        return;
    }
    
    // Get positions
    const enemyPos = this.entity.getPosition();
    const targetPos = this.target.getPosition();
    
    // Calculate distance to target
    const distance = enemyPos.distance(targetPos);
    
    // If within attack range, switch to attacking
    if (distance <= this.attackRange) {
        this.state = 'attacking';
        this.attackTimer = 0; // Ready to attack immediately
        return;
    }
    
    // Move towards target
    const direction = new pc.Vec3();
    direction.sub2(targetPos, enemyPos);
    direction.y = 0; // Keep movement on the horizontal plane
    direction.normalize();
    
    // Apply movement
    const moveAmount = this.movementSpeed * dt;
    this.entity.translate(
        direction.x * moveAmount,
        0,
        direction.z * moveAmount
    );
    
    // Rotate to face target
    if (direction.length() > 0.001) {
        const targetAngle = Math.atan2(direction.x, direction.z) * (180 / Math.PI);
        const currentRotation = this.entity.getEulerAngles();
        const rotationSpeed = 5 * dt; // Adjust as needed
        
        // Smoothly rotate towards the target angle
        const newRotation = pc.math.lerpAngle(currentRotation.y, targetAngle, rotationSpeed);
        this.entity.setEulerAngles(0, newRotation, 0);
    }
};

/**
 * Update logic for attacking state
 */
Enemy.prototype.updateAttacking = function(dt) {
    if (!this.target) {
        this.state = 'idle';
        return;
    }
    
    // Get positions
    const enemyPos = this.entity.getPosition();
    const targetPos = this.target.getPosition();
    
    // Calculate distance to target
    const distance = enemyPos.distance(targetPos);
    
    // If outside attack range, switch back to aggro
    if (distance > this.attackRange) {
        this.state = 'aggro';
        return;
    }
    
    // Face the target
    const direction = new pc.Vec3();
    direction.sub2(targetPos, enemyPos);
    direction.y = 0;
    
    if (direction.length() > 0.001) {
        const targetAngle = Math.atan2(direction.x, direction.z) * (180 / Math.PI);
        this.entity.setEulerAngles(0, targetAngle, 0);
    }
    
    // Attack on timer
    this.attackTimer -= dt;
    if (this.attackTimer <= 0) {
        this.attackTarget();
        this.attackTimer = 1 / this.attackSpeed; // Reset timer based on attack speed
    }
};

/**
 * Attack the current target
 */
Enemy.prototype.attackTarget = function() {
    if (!this.target || !this.target.script || !this.target.script.hero) return;
    
    console.log(`${this.enemyName} attacks the player!`);
    
    // Apply damage to the target
    const damage = this.physicalDamage;
    this.target.script.hero.takeDamage(damage, 'physical');
    
    // In a real implementation, we would:
    // 1. Play attack animation
    // 2. Create visual and sound effects
    // 3. Apply any special attack effects
};

/**
 * Take damage from a source
 * @param {number} amount - Amount of damage
 * @param {string} type - Damage type ('physical', 'magical', 'pure')
 * @returns {number} - Actual damage taken after mitigation
 */
Enemy.prototype.takeDamage = function(amount, type = 'physical') {
    // Skip if already dead
    if (this.state === 'dead') return 0;
    
    let actualDamage = amount;
    
    // Apply damage mitigation based on type (placeholder)
    if (type === 'physical') {
        // Physical damage reduction could be implemented here
    } else if (type === 'magical') {
        // Magical damage reduction could be implemented here
    }
    
    // Apply damage
    this.currentHealth -= actualDamage;
    
    // Update health bar
    this.updateHealthBar();
    
    console.log(`${this.enemyName} took ${actualDamage} ${type} damage. Health: ${this.currentHealth}/${this.maxHealth}`);
    
    // Check if defeated
    if (this.currentHealth <= 0) {
        this.currentHealth = 0;
        this.onDefeat();
    } else {
        // If we weren't already targeting the attacker, do so now
        if (this.state === 'idle') {
            this.state = 'aggro';
        }
    }
    
    return actualDamage;
};

/**
 * Called when enemy is defeated
 */
Enemy.prototype.onDefeat = function() {
    console.log(`${this.enemyName} has been defeated!`);
    
    // Change state to dead
    this.state = 'dead';
    
    // Award experience to the player
    const player = this.app.root.findByName('hero');
    if (player && player.script.experienceSystem) {
        player.script.experienceSystem.addExperience(
            this.experienceValue,
            'enemyDefeat'
        );
    }
    
    // In a real implementation, we would:
    // 1. Play death animation
    // 2. Create death effects
    // 3. Drop loot
    // 4. Remove the entity after a delay
    
    // For now, just disable the entity after a short delay
    setTimeout(() => {
        this.entity.enabled = false;
    }, 2000);
};

/**
 * Set the enemy as selected or deselected
 * @param {boolean} selected - Whether the enemy is selected
 */
Enemy.prototype.setSelected = function(selected) {
    if (this.selectionIndicator) {
        this.selectionIndicator.enabled = selected;
    }
};