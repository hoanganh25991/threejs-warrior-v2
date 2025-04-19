/**
 * Combat system and related functionality
 */

class CombatSystem {
    constructor(scene) {
        this.scene = scene;
        this.projectiles = [];
        this.effects = [];
        this.enemies = [];
        
        // Bind event listeners
        this.bindEvents();
        
        Logger.log('Combat system initialized');
    }
    
    bindEvents() {
        // Listen for ability activation events
        Events.on('abilityActivated', this.handleAbilityActivated.bind(this));
        
        // Listen for damage events
        Events.on('damageTaken', this.handleDamageTaken.bind(this));
        
        // Listen for death events
        Events.on('heroDeath', this.handleHeroDeath.bind(this));
        Events.on('enemyDeath', this.handleEnemyDeath.bind(this));
    }
    
    handleAbilityActivated(data) {
        const { ability } = data;
        
        // Get the player hero
        const hero = window.game.hero;
        
        if (!hero) return;
        
        // Check if the ability exists for this hero
        if (!hero.abilities[ability]) {
            // This ability key is not mapped for this hero
            return;
        }
        
        // Check if hero has enough mana
        if (!hero.useMana(hero.abilities[ability].manaCost)) {
            console.log('Not enough mana!');
            return;
        }
        
        // Use the ability
        hero.abilities[ability].use();
    }
    
    handleDamageTaken(data) {
        const { target, amount, source } = data;
        
        // Create damage number effect
        this.createDamageNumber(target.position, amount);
        
        // Create hit effect
        this.createHitEffect(target.position);
    }
    
    handleHeroDeath(data) {
        const { hero } = data;
        
        // Create death effect
        this.createDeathEffect(hero.position);
        
        // Game over logic would go here
        console.log('Hero died!');
    }
    
    handleEnemyDeath(data) {
        const { enemy } = data;
        
        // Create death effect
        this.createDeathEffect(enemy.position);
        
        // Remove enemy from the scene and list
        this.removeEnemy(enemy);
        
        // Award experience and possibly loot
        if (window.game.hero) {
            // Award experience
            // window.game.hero.gainExperience(enemy.experienceValue);
            
            // Possibly drop loot
            this.dropLoot(enemy);
        }
    }
    
    createEnemy(type, position) {
        // Create a new enemy based on type
        const enemy = new Enemy(type, this.scene);
        enemy.position.copy(position);
        
        // Initialize the enemy
        enemy.init();
        
        // Add to enemies list
        this.enemies.push(enemy);
        
        return enemy;
    }
    
    removeEnemy(enemy) {
        // Remove from scene
        enemy.dispose();
        
        // Remove from enemies list
        const index = this.enemies.indexOf(enemy);
        if (index !== -1) {
            this.enemies.splice(index, 1);
        }
    }
    
    createProjectile(startPosition, targetPosition, type, speed, damage, owner) {
        // Create a projectile mesh based on type
        let geometry, material;
        
        // Ensure valid position values to prevent NaN errors
        const validStartPosition = new THREE.Vector3(
            isNaN(startPosition.x) ? 0 : startPosition.x,
            isNaN(startPosition.y) ? 0 : startPosition.y,
            isNaN(startPosition.z) ? 0 : startPosition.z
        );
        
        const validTargetPosition = new THREE.Vector3(
            isNaN(targetPosition.x) ? 0 : targetPosition.x,
            isNaN(targetPosition.y) ? 0 : targetPosition.y,
            isNaN(targetPosition.z) ? 0 : targetPosition.z
        );
        
        switch (type) {
            case 'fireball':
                geometry = new THREE.SphereGeometry(0.3, 8, 8);
                material = new THREE.MeshBasicMaterial({ color: 0xff4400 });
                break;
            case 'ice':
                geometry = new THREE.SphereGeometry(0.3, 8, 8);
                material = new THREE.MeshBasicMaterial({ color: 0x00ccff });
                break;
            case 'lightning':
                geometry = new THREE.SphereGeometry(0.3, 8, 8);
                material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
                break;
            case 'melee':
                geometry = new THREE.BoxGeometry(0.2, 0.2, 0.8);
                material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                break;
            default:
                geometry = new THREE.SphereGeometry(0.3, 8, 8);
                material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        }
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(validStartPosition);
        
        // Add to scene
        this.scene.add(mesh);
        
        // Calculate direction using valid positions
        const direction = new THREE.Vector3().subVectors(validTargetPosition, validStartPosition).normalize();
        
        // Ensure direction is valid (not NaN)
        if (isNaN(direction.x) || isNaN(direction.y) || isNaN(direction.z)) {
            // If direction calculation failed, use a default direction
            direction.set(1, 0, 0); // Default to positive X direction
            Logger.warn('Invalid projectile direction calculated, using default direction');
        }
        
        // Create projectile object
        const projectile = {
            mesh,
            direction,
            speed,
            damage,
            owner,
            type,
            distanceTraveled: 0,
            maxDistance: 50 // Maximum travel distance
        };
        
        // Add to projectiles list
        this.projectiles.push(projectile);
        
        return projectile;
    }
    
    createDamageNumber(position, amount) {
        // Ensure valid position values to prevent NaN errors
        if (!position || isNaN(position.x) || isNaN(position.y) || isNaN(position.z)) {
            Logger.warn('Invalid position for damage number, skipping');
            return;
        }
        
        // In a real implementation, this would create a 3D text or sprite
        // For now, we'll just log it
        console.log(`Damage: ${amount} at position ${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)}`);
    }
    
    createHitEffect(position) {
        // Ensure valid position values to prevent NaN errors
        if (!position || isNaN(position.x) || isNaN(position.y) || isNaN(position.z)) {
            Logger.warn('Invalid position for hit effect, skipping');
            return;
        }
        
        // Create a simple hit effect (particle burst)
        const particles = new THREE.Group();
        
        // Create several small particles
        for (let i = 0; i < 10; i++) {
            const geometry = new THREE.SphereGeometry(0.1, 4, 4);
            const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            const particle = new THREE.Mesh(geometry, material);
            
            // Random position offset
            particle.position.set(
                Math.random() * 0.5 - 0.25,
                Math.random() * 0.5 + 0.5,
                Math.random() * 0.5 - 0.25
            );
            
            // Random velocity
            particle.userData.velocity = new THREE.Vector3(
                Math.random() * 2 - 1,
                Math.random() * 2 + 1,
                Math.random() * 2 - 1
            );
            
            particles.add(particle);
        }
        
        // Position the particle group with valid position
        particles.position.copy(position);
        
        // Add to scene
        this.scene.add(particles);
        
        // Add to effects list
        this.effects.push({
            type: 'hit',
            mesh: particles,
            lifetime: 1, // Effect lasts for 1 second
            timeRemaining: 1
        });
    }
    
    createDeathEffect(position) {
        // Create a death effect (larger particle burst)
        const particles = new THREE.Group();
        
        // Ensure valid position values to prevent NaN errors
        const validPosition = new THREE.Vector3(
            isNaN(position.x) ? 0 : position.x,
            isNaN(position.y) ? 0 : position.y,
            isNaN(position.z) ? 0 : position.z
        );
        
        // Create several particles
        for (let i = 0; i < 20; i++) {
            const geometry = new THREE.SphereGeometry(0.15, 4, 4);
            const material = new THREE.MeshBasicMaterial({ color: 0x880000 });
            const particle = new THREE.Mesh(geometry, material);
            
            // Random position offset
            particle.position.set(
                Math.random() * 1 - 0.5,
                Math.random() * 1 + 0.5,
                Math.random() * 1 - 0.5
            );
            
            // Random velocity
            particle.userData.velocity = new THREE.Vector3(
                Math.random() * 3 - 1.5,
                Math.random() * 3 + 1.5,
                Math.random() * 3 - 1.5
            );
            
            particles.add(particle);
        }
        
        // Position the particle group with valid position
        particles.position.copy(validPosition);
        
        // Add to scene
        this.scene.add(particles);
        
        // Add to effects list
        this.effects.push({
            type: 'death',
            mesh: particles,
            lifetime: 2, // Effect lasts for 2 seconds
            timeRemaining: 2
        });
    }
    
    dropLoot(enemy) {
        // Determine if loot should be dropped
        const dropChance = 0.5; // 50% chance
        
        if (Math.random() > dropChance) {
            return; // No loot dropped
        }
        
        // Create a simple loot item
        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // Gold color
        const lootMesh = new THREE.Mesh(geometry, material);
        
        // Position slightly above ground at enemy position
        lootMesh.position.set(
            enemy.position.x,
            0.25, // Half height of the box
            enemy.position.z
        );
        
        // Add to scene
        this.scene.add(lootMesh);
        
        // Add to game's interactable objects
        if (window.game.interactableObjects) {
            window.game.interactableObjects.push({
                type: 'loot',
                mesh: lootMesh,
                position: lootMesh.position.clone(),
                interact: () => {
                    // Handle loot pickup
                    this.collectLoot(lootMesh);
                }
            });
        }
    }
    
    collectLoot(lootMesh) {
        // Remove from scene
        this.scene.remove(lootMesh);
        
        // Remove from interactable objects
        if (window.game.interactableObjects) {
            const index = window.game.interactableObjects.findIndex(obj => obj.mesh === lootMesh);
            if (index !== -1) {
                window.game.interactableObjects.splice(index, 1);
            }
        }
        
        // Add item to inventory (would be implemented in a real game)
        console.log('Loot collected!');
        
        // Dispose of resources
        lootMesh.geometry.dispose();
        lootMesh.material.dispose();
    }
    
    update(deltaTime) {
        // Update projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            
            // Move projectile
            const movement = projectile.direction.clone().multiplyScalar(projectile.speed * deltaTime);
            projectile.mesh.position.add(movement);
            
            // Update distance traveled
            projectile.distanceTraveled += movement.length();
            
            // Check if projectile has traveled its maximum distance
            if (projectile.distanceTraveled >= projectile.maxDistance) {
                // Remove projectile
                this.scene.remove(projectile.mesh);
                projectile.mesh.geometry.dispose();
                projectile.mesh.material.dispose();
                this.projectiles.splice(i, 1);
                continue;
            }
            
            // Check for collisions with enemies
            for (const enemy of this.enemies) {
                const distance = projectile.mesh.position.distanceTo(enemy.position);
                
                if (distance < 1) { // Simple collision radius
                    // Deal damage to enemy
                    enemy.takeDamage(projectile.damage, projectile.owner);
                    
                    // Remove projectile
                    this.scene.remove(projectile.mesh);
                    projectile.mesh.geometry.dispose();
                    projectile.mesh.material.dispose();
                    this.projectiles.splice(i, 1);
                    break;
                }
            }
            
            // Check for collision with hero (if projectile is from an enemy)
            if (projectile.owner !== window.game.hero && window.game.hero) {
                const distance = projectile.mesh.position.distanceTo(window.game.hero.position);
                
                if (distance < 1) { // Simple collision radius
                    // Deal damage to hero
                    window.game.hero.takeDamage(projectile.damage, projectile.owner);
                    
                    // Remove projectile
                    this.scene.remove(projectile.mesh);
                    projectile.mesh.geometry.dispose();
                    projectile.mesh.material.dispose();
                    this.projectiles.splice(i, 1);
                    break;
                }
            }
        }
        
        // Update effects
        for (let i = this.effects.length - 1; i >= 0; i--) {
            const effect = this.effects[i];
            
            // Update effect lifetime
            effect.timeRemaining -= deltaTime;
            
            // Check if effect has expired
            if (effect.timeRemaining <= 0) {
                // Remove effect
                this.scene.remove(effect.mesh);
                
                // Dispose of geometries and materials
                effect.mesh.traverse(child => {
                    if (child.geometry) child.geometry.dispose();
                    if (child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach(material => material.dispose());
                        } else {
                            child.material.dispose();
                        }
                    }
                });
                
                this.effects.splice(i, 1);
                continue;
            }
            
            // Update particle positions for particle effects
            if (effect.type === 'hit' || effect.type === 'death') {
                effect.mesh.children.forEach(particle => {
                    // Apply velocity
                    particle.position.add(particle.userData.velocity.clone().multiplyScalar(deltaTime));
                    
                    // Apply gravity
                    particle.userData.velocity.y -= 9.8 * deltaTime;
                    
                    // Fade out (scale down)
                    const scale = particle.scale.x - deltaTime;
                    if (scale > 0) {
                        particle.scale.set(scale, scale, scale);
                    }
                });
            }
        }
        
        // Update enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            this.enemies[i].update(deltaTime);
        }
    }
    
    dispose() {
        // Clean up all projectiles
        for (const projectile of this.projectiles) {
            this.scene.remove(projectile.mesh);
            projectile.mesh.geometry.dispose();
            projectile.mesh.material.dispose();
        }
        this.projectiles = [];
        
        // Clean up all effects
        for (const effect of this.effects) {
            this.scene.remove(effect.mesh);
            effect.mesh.traverse(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(material => material.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
        }
        this.effects = [];
        
        // Clean up all enemies
        for (const enemy of this.enemies) {
            enemy.dispose();
        }
        this.enemies = [];
        
        Logger.log('Combat system disposed');
    }
}

// Basic Enemy class
class Enemy {
    constructor(type, scene) {
        this.type = type;
        this.scene = scene;
        
        // Stats based on enemy type
        this.setupStats();
        
        // Position and movement
        this.position = new THREE.Vector3(0, 0, 0);
        this.rotation = new THREE.Euler(0, 0, 0);
        this.targetPosition = null;
        this.isMoving = false;
        this.moveDirection = new THREE.Vector3();
        
        // Combat state
        this.isAttacking = false;
        this.currentTarget = null;
        this.attackCooldown = 0;
        this.isAlive = true;
        
        // Model
        this.model = null;
        
        // Collision radius for targeting
        this.radius = 1.0;
        
        // Health bar
        this.healthBar = null;
        this.healthBarBackground = null;
        
        Logger.log(`Enemy of type ${type} created`);
    }
    
    setupStats() {
        // Default stats
        this.stats = {
            health: 50,
            maxHealth: 50,
            damage: 5,
            movementSpeed: 3,
            attackSpeed: 1,
            attackRange: 1.5,
            detectionRange: 10,
            experienceValue: 10
        };
        
        // Adjust stats based on enemy type
        switch (this.type) {
            case 'goblin':
                this.name = 'Goblin';
                this.stats.health = 30;
                this.stats.maxHealth = 30;
                this.stats.damage = 3;
                this.stats.movementSpeed = 4;
                this.stats.attackSpeed = 1.2;
                break;
            case 'troll':
                this.name = 'Troll';
                this.stats.health = 80;
                this.stats.maxHealth = 80;
                this.stats.damage = 8;
                this.stats.movementSpeed = 2.5;
                this.stats.attackSpeed = 0.8;
                break;
            case 'skeleton':
                this.name = 'Skeleton';
                this.stats.health = 40;
                this.stats.maxHealth = 40;
                this.stats.damage = 6;
                this.stats.movementSpeed = 3.5;
                this.stats.attackSpeed = 1;
                break;
            default:
                this.name = 'Unknown Enemy';
        }
    }
    
    init() {
        // Create a simple enemy model (a colored box)
        const geometry = new THREE.BoxGeometry(1, 2, 1);
        let material;
        
        switch (this.type) {
            case 'goblin':
                material = new THREE.MeshLambertMaterial({ color: 0x00cc00 }); // Green
                break;
            case 'troll':
                material = new THREE.MeshLambertMaterial({ color: 0xcc00cc }); // Purple
                break;
            case 'skeleton':
                material = new THREE.MeshLambertMaterial({ color: 0xcccccc }); // Light gray
                break;
            default:
                material = new THREE.MeshLambertMaterial({ color: 0xcc0000 }); // Red
        }
        
        this.model = new THREE.Mesh(geometry, material);
        this.model.position.set(this.position.x, 1, this.position.z); // Position slightly above ground
        this.model.castShadow = true;
        this.model.receiveShadow = true;
        
        // Add to scene
        this.scene.add(this.model);
        
        // Create health bar
        this.createHealthBar();
        
        return this;
    }
    
    createHealthBar() {
        // Get the height of the enemy model
        const modelHeight = 2; // Height of the box geometry
        
        // Create background for health bar
        const backgroundGeometry = new THREE.PlaneGeometry(1, 0.1);
        const backgroundMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide
        });
        this.healthBarBackground = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
        
        // Position above enemy
        this.healthBarBackground.position.copy(this.position);
        this.healthBarBackground.position.y = modelHeight + 0.2; // Above the enemy
        
        // Make it face the camera
        this.healthBarBackground.rotation.x = Math.PI / 2;
        
        // Create the actual health bar
        const healthBarGeometry = new THREE.PlaneGeometry(1, 0.1);
        const healthBarMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });
        this.healthBar = new THREE.Mesh(healthBarGeometry, healthBarMaterial);
        
        // Position at the same place as background
        this.healthBar.position.copy(this.healthBarBackground.position);
        this.healthBar.rotation.copy(this.healthBarBackground.rotation);
        
        // Add to scene
        this.scene.add(this.healthBarBackground);
        this.scene.add(this.healthBar);
        
        // Update health bar to show current health
        this.updateHealthBar();
    }
    
    updateHealthBar() {
        if (!this.healthBar) return;
        
        // Calculate health percentage
        const healthPercent = this.stats.health / this.stats.maxHealth;
        
        // Scale the health bar width based on health percentage
        this.healthBar.scale.x = Math.max(0.01, healthPercent); // Minimum scale to avoid disappearing
        
        // Adjust position to align left side
        const offset = (1 - healthPercent) * 0.5;
        this.healthBar.position.x = this.healthBarBackground.position.x - offset;
        
        // Change color based on health percentage
        if (healthPercent > 0.6) {
            this.healthBar.material.color.setHex(0x00ff00); // Green
        } else if (healthPercent > 0.3) {
            this.healthBar.material.color.setHex(0xffff00); // Yellow
        } else {
            this.healthBar.material.color.setHex(0xff0000); // Red
        }
    }
    
    moveTo(targetPosition) {
        this.targetPosition = targetPosition.clone();
        this.isMoving = true;
        
        // Calculate direction to target
        this.moveDirection.subVectors(this.targetPosition, this.position).normalize();
        
        // Set rotation to face movement direction
        const angle = Math.atan2(this.moveDirection.x, this.moveDirection.z);
        this.rotation.y = angle;
        this.model.rotation.y = angle;
    }
    
    stopMovement() {
        this.isMoving = false;
        this.targetPosition = null;
    }
    
    attack(target) {
        if (!target) return;
        
        this.currentTarget = target;
        this.isAttacking = true;
        
        // Face the target
        const direction = new THREE.Vector3().subVectors(target.position, this.position).normalize();
        const angle = Math.atan2(direction.x, direction.z);
        this.rotation.y = angle;
        this.model.rotation.y = angle;
        
        // Deal damage to target
        target.takeDamage(this.stats.damage, this);
        
        // Set attack cooldown
        this.attackCooldown = 1 / this.stats.attackSpeed;
    }
    
    takeDamage(amount, source) {
        // Reduce health by damage amount
        this.stats.health = Math.max(0, this.stats.health - amount);
        
        // Update health bar
        this.updateHealthBar();
        
        // Show damage number
        this.showDamageNumber(amount);
        
        // Check if dead
        if (this.stats.health <= 0) {
            this.die();
        } else {
            // If not dead and not already targeting something, target the source
            if (!this.currentTarget && source) {
                this.currentTarget = source;
            }
        }
        
        // Emit damage taken event
        Events.emit('damageTaken', {
            target: this,
            amount: amount,
            source: source,
            remainingHealth: this.stats.health
        });
    }
    
    showDamageNumber(amount) {
        // Create a canvas for the damage number
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 64;
        canvas.height = 32;
        
        // Draw text
        context.fillStyle = 'red';
        context.font = 'bold 24px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(amount.toString(), canvas.width / 2, canvas.height / 2);
        
        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);
        
        // Create sprite material
        const material = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true
        });
        
        // Create sprite
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(0.5, 0.25, 1);
        
        // Position above enemy
        sprite.position.copy(this.position);
        sprite.position.y += 2.5; // Above the health bar
        
        // Add to scene
        this.scene.add(sprite);
        
        // Animate the damage number
        const startTime = Date.now();
        const duration = 1000; // 1 second
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                // Move upward and fade out
                sprite.position.y += 0.01;
                sprite.material.opacity = 1 - progress;
                
                requestAnimationFrame(animate);
            } else {
                // Remove when animation is complete
                this.scene.remove(sprite);
                sprite.material.map.dispose();
                sprite.material.dispose();
            }
        };
        
        animate();
    }
    
    die() {
        // Mark as not alive
        this.isAlive = false;
        
        // Play death animation if available
        if (this.model) {
            // Fade out the model
            const fadeOut = setInterval(() => {
                if (this.model.material.opacity <= 0.1) {
                    clearInterval(fadeOut);
                    // Remove from scene after fade out
                    this.dispose();
                } else {
                    this.model.material.opacity -= 0.1;
                }
            }, 100);
            
            // Make material transparent for fade effect
            this.model.material.transparent = true;
        }
        
        // Emit death event
        Events.emit('enemyDeath', { enemy: this });
        
        // Award experience to the hero if they killed this enemy
        if (window.game && window.game.hero) {
            window.game.hero.gainExperience(this.stats.experienceValue);
            
            // Show message
            if (window.game.uiManager) {
                window.game.uiManager.showMessage(`Defeated ${this.name}! +${this.stats.experienceValue} XP`);
            }
        }
    }
    
    dispose() {
        // Remove from scene
        if (this.model) {
            this.scene.remove(this.model);
        }
        
        // Remove health bar
        if (this.healthBar) {
            this.scene.remove(this.healthBar);
        }
        
        if (this.healthBarBackground) {
            this.scene.remove(this.healthBarBackground);
        }
        
        // Remove from enemies list
        if (window.game && window.game.combatSystem) {
            const index = window.game.combatSystem.enemies.indexOf(this);
            if (index !== -1) {
                window.game.combatSystem.enemies.splice(index, 1);
            }
        }
    }
    
    update(deltaTime) {
        // Skip update if not alive
        if (!this.isAlive) return;
        
        // If we have a target, check if it's in range
        if (this.currentTarget) {
            const distanceToTarget = this.position.distanceTo(this.currentTarget.position);
            
            if (distanceToTarget <= this.stats.attackRange) {
                // In attack range, stop moving and attack
                this.stopMovement();
                
                // Attack if cooldown is ready
                if (this.attackCooldown <= 0) {
                    this.attack(this.currentTarget);
                }
            } else if (distanceToTarget <= this.stats.detectionRange) {
                // Target in detection range but not attack range, move towards it
                this.moveTo(this.currentTarget.position);
            } else {
                // Target out of detection range, stop targeting
                this.currentTarget = null;
            }
        } else {
            // No target, check if hero is in detection range
            if (window.game && window.game.hero) {
                const distanceToHero = this.position.distanceTo(window.game.hero.position);
                
                if (distanceToHero <= this.stats.detectionRange) {
                    // Hero in detection range, target them
                    this.currentTarget = window.game.hero;
                }
            }
        }
        
        // Update position if moving
        if (this.isMoving) {
            // Calculate movement distance this frame
            const moveDistance = this.stats.movementSpeed * deltaTime;
            
            if (this.targetPosition) {
                // Calculate distance to target
                const distanceToTarget = this.position.distanceTo(this.targetPosition);
                
                if (distanceToTarget <= moveDistance) {
                    // Reached target position
                    this.position.copy(this.targetPosition);
                    this.stopMovement();
                } else {
                    // Move towards target
                    const movement = this.moveDirection.clone().multiplyScalar(moveDistance);
                    this.position.add(movement);
                }
            }
            
            // Update model position
            this.model.position.x = this.position.x;
            this.model.position.z = this.position.z;
            
            // Update health bar position
            if (this.healthBar && this.healthBarBackground) {
                this.healthBarBackground.position.x = this.position.x;
                this.healthBarBackground.position.z = this.position.z;
                this.healthBar.position.x = this.healthBarBackground.position.x - (1 - this.healthBar.scale.x) * 0.5;
                this.healthBar.position.z = this.position.z;
            }
        }
        
        // Update attack cooldown
        if (this.attackCooldown > 0) {
            this.attackCooldown -= deltaTime;
        }
    }
    
    dispose() {
        // Remove from scene
        if (this.model) {
            this.scene.remove(this.model);
            
            // Dispose of geometries and materials
            if (this.model.geometry) this.model.geometry.dispose();
            if (this.model.material) {
                if (Array.isArray(this.model.material)) {
                    this.model.material.forEach(material => material.dispose());
                } else {
                    this.model.material.dispose();
                }
            }
        }
        
        // Remove health bar
        if (this.healthBar) {
            this.scene.remove(this.healthBar);
            if (this.healthBar.geometry) this.healthBar.geometry.dispose();
            if (this.healthBar.material) this.healthBar.material.dispose();
        }
        
        // Remove health bar background
        if (this.healthBarBackground) {
            this.scene.remove(this.healthBarBackground);
            if (this.healthBarBackground.geometry) this.healthBarBackground.geometry.dispose();
            if (this.healthBarBackground.material) this.healthBarBackground.material.dispose();
        }
    }
}