/**
 * Hero class and related functionality
 */

// Base Hero class
class Hero {
    constructor(name, type, scene) {
        this.name = name;
        this.type = type;
        this.scene = scene;
        
        // Stats
        this.stats = {
            health: 100,
            maxHealth: 100,
            mana: 100,
            maxMana: 100,
            strength: 10,
            agility: 10,
            intelligence: 10,
            movementSpeed: 5,
            attackSpeed: 1,
            attackDamage: 10
        };
        
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
        
        // Abilities
        this.abilities = {
            q: null,
            w: null,
            e: null,
            r: null
        };
        
        // Model and animation
        this.model = null;
        this.mixer = null;
        this.animations = {};
        this.currentAnimation = null;
        
        Logger.log(`Hero ${name} created`);
    }
    
    // Initialize the hero with a model
    async init() {
        // Create a placeholder model (a colored box)
        const geometry = new THREE.BoxGeometry(1, 2, 1);
        const material = new THREE.MeshLambertMaterial({ color: this.getHeroColor() });
        this.model = new THREE.Mesh(geometry, material);
        this.model.position.set(0, 1, 0); // Position slightly above ground
        this.model.castShadow = true;
        this.model.receiveShadow = true;
        
        // Add to scene
        this.scene.add(this.model);
        
        // Set up abilities based on hero type
        this.setupAbilities();
        
        Logger.log(`Hero ${this.name} initialized`);
        
        return this;
    }
    
    // Get a color based on hero type
    getHeroColor() {
        switch (this.type) {
            case 'axe':
                return 0xcc0000; // Red
            case 'crystal-maiden':
                return 0x00ccff; // Light blue
            case 'lich':
                return 0x0000cc; // Dark blue
            case 'storm-spirit':
                return 0x00cc00; // Green
            default:
                return 0xcccccc; // Gray
        }
    }
    
    // Set up hero-specific abilities
    setupAbilities() {
        switch (this.type) {
            case 'axe':
                this.abilities.q = new Ability('Berserker\'s Call', 'q', 10, 8, this.berserkersCall.bind(this));
                this.abilities.w = new Ability('Battle Hunger', 'w', 15, 5, this.battleHunger.bind(this));
                this.abilities.e = new Ability('Counter Helix', 'e', 0, 0, this.counterHelix.bind(this), true); // Passive
                this.abilities.r = new Ability('Culling Blade', 'r', 25, 10, this.cullingBlade.bind(this));
                break;
            case 'crystal-maiden':
                this.abilities.q = new Ability('Crystal Nova', 'q', 15, 5, this.crystalNova.bind(this));
                this.abilities.w = new Ability('Frostbite', 'w', 20, 6, this.frostbite.bind(this));
                this.abilities.e = new Ability('Arcane Aura', 'e', 0, 0, this.arcaneAura.bind(this), true); // Passive
                this.abilities.r = new Ability('Freezing Field', 'r', 30, 12, this.freezingField.bind(this));
                break;
            case 'lich':
                this.abilities.q = new Ability('Frost Nova', 'q', 15, 5, this.frostNova.bind(this));
                this.abilities.w = new Ability('Frost Armor', 'w', 10, 8, this.frostArmor.bind(this));
                this.abilities.e = new Ability('Dark Ritual', 'e', 5, 4, this.darkRitual.bind(this));
                this.abilities.r = new Ability('Chain Frost', 'r', 30, 12, this.chainFrost.bind(this));
                break;
            case 'storm-spirit':
                this.abilities.q = new Ability('Static Remnant', 'q', 10, 4, this.staticRemnant.bind(this));
                this.abilities.w = new Ability('Electric Vortex', 'w', 20, 6, this.electricVortex.bind(this));
                this.abilities.e = new Ability('Overload', 'e', 0, 0, this.overload.bind(this), true); // Passive
                this.abilities.r = new Ability('Ball Lightning', 'r', 15, 3, this.ballLightning.bind(this));
                break;
            default:
                // Generic abilities if hero type is not recognized
                this.abilities.q = new Ability('Ability 1', 'q', 10, 5, () => console.log('Ability 1 activated'));
                this.abilities.w = new Ability('Ability 2', 'w', 15, 8, () => console.log('Ability 2 activated'));
                this.abilities.e = new Ability('Ability 3', 'e', 20, 10, () => console.log('Ability 3 activated'));
                this.abilities.r = new Ability('Ultimate', 'r', 30, 15, () => console.log('Ultimate activated'));
        }
        
        Logger.log(`Abilities set up for ${this.name}`);
    }
    
    // Movement methods
    moveTo(targetPosition) {
        this.targetPosition = targetPosition.clone();
        this.isMoving = true;
        
        // Calculate direction to target
        this.moveDirection.subVectors(this.targetPosition, this.position).normalize();
        
        // Set rotation to face movement direction
        const angle = Math.atan2(this.moveDirection.x, this.moveDirection.z);
        this.rotation.y = angle;
        this.model.rotation.y = angle;
        
        // Play movement animation if available
        this.playAnimation('walk');
        
        Logger.log(`Hero ${this.name} moving to ${targetPosition.x.toFixed(2)}, ${targetPosition.z.toFixed(2)}`);
    }
    
    moveInDirection(direction) {
        // Normalize direction
        const normalizedDirection = direction.clone().normalize();
        
        // Set movement direction
        this.moveDirection.copy(normalizedDirection);
        this.isMoving = true;
        
        // Set rotation to face movement direction
        const angle = Math.atan2(this.moveDirection.x, this.moveDirection.z);
        this.rotation.y = angle;
        this.model.rotation.y = angle;
        
        // Clear target position when using directional movement
        this.targetPosition = null;
        
        // Play movement animation if available
        this.playAnimation('walk');
    }
    
    stopMovement() {
        this.isMoving = false;
        this.targetPosition = null;
        
        // Play idle animation if available
        this.playAnimation('idle');
        
        Logger.log(`Hero ${this.name} stopped moving`);
    }
    
    // Combat methods
    attack(target) {
        if (!target) return;
        
        this.currentTarget = target;
        this.isAttacking = true;
        
        // Face the target
        const direction = new THREE.Vector3().subVectors(target.position, this.position).normalize();
        const angle = Math.atan2(direction.x, direction.z);
        this.rotation.y = angle;
        this.model.rotation.y = angle;
        
        // Play attack animation if available
        this.playAnimation('attack');
        
        // Calculate damage
        const damage = this.calculateDamage();
        
        // Apply damage to target
        target.takeDamage(damage, this);
        
        // Set attack cooldown
        this.attackCooldown = 1 / this.stats.attackSpeed;
        
        Logger.log(`Hero ${this.name} attacked ${target.name} for ${damage} damage`);
    }
    
    calculateDamage() {
        // Basic damage calculation
        const baseDamage = this.stats.attackDamage;
        const randomFactor = 0.8 + Math.random() * 0.4; // Random factor between 0.8 and 1.2
        return Math.floor(baseDamage * randomFactor);
    }
    
    takeDamage(amount, source) {
        // Reduce health by damage amount
        this.stats.health = Math.max(0, this.stats.health - amount);
        
        // Check if dead
        if (this.stats.health <= 0) {
            this.die();
        }
        
        // Emit damage taken event
        Events.emit('damageTaken', {
            target: this,
            amount: amount,
            source: source,
            remainingHealth: this.stats.health
        });
        
        Logger.log(`Hero ${this.name} took ${amount} damage from ${source ? source.name : 'unknown'}`);
    }
    
    die() {
        // Play death animation if available
        this.playAnimation('death');
        
        // Emit death event
        Events.emit('heroDeath', { hero: this });
        
        Logger.log(`Hero ${this.name} died`);
    }
    
    heal(amount) {
        // Increase health by heal amount, up to max health
        this.stats.health = Math.min(this.stats.maxHealth, this.stats.health + amount);
        
        // Emit heal event
        Events.emit('heroHealed', {
            hero: this,
            amount: amount,
            currentHealth: this.stats.health
        });
        
        Logger.log(`Hero ${this.name} healed for ${amount} health`);
    }
    
    useMana(amount) {
        if (this.stats.mana < amount) {
            return false; // Not enough mana
        }
        
        this.stats.mana -= amount;
        
        // Emit mana used event
        Events.emit('manaUsed', {
            hero: this,
            amount: amount,
            remainingMana: this.stats.mana
        });
        
        return true;
    }
    
    restoreMana(amount) {
        // Increase mana by restore amount, up to max mana
        this.stats.mana = Math.min(this.stats.maxMana, this.stats.mana + amount);
        
        // Emit mana restored event
        Events.emit('manaRestored', {
            hero: this,
            amount: amount,
            currentMana: this.stats.mana
        });
    }
    
    // Animation methods
    playAnimation(name) {
        if (!this.animations[name]) {
            // If we don't have the requested animation, do nothing
            return;
        }
        
        if (this.currentAnimation === name) {
            // Already playing this animation
            return;
        }
        
        // Stop current animation if any
        if (this.currentAnimation && this.animations[this.currentAnimation]) {
            this.animations[this.currentAnimation].stop();
        }
        
        // Play new animation
        this.animations[name].play();
        this.currentAnimation = name;
    }
    
    // Ability methods for Axe
    berserkersCall() {
        Logger.log(`${this.name} used Berserker's Call`);
        // Implementation would taunt nearby enemies and increase armor
    }
    
    battleHunger() {
        Logger.log(`${this.name} used Battle Hunger`);
        // Implementation would apply a DoT to target
    }
    
    counterHelix() {
        Logger.log(`${this.name} triggered Counter Helix`);
        // Implementation would deal damage to nearby enemies when attacked
    }
    
    cullingBlade() {
        Logger.log(`${this.name} used Culling Blade`);
        // Implementation would execute low health targets
    }
    
    // Ability methods for Crystal Maiden
    crystalNova() {
        Logger.log(`${this.name} used Crystal Nova`);
        // Implementation would deal AoE damage and slow
    }
    
    frostbite() {
        Logger.log(`${this.name} used Frostbite`);
        // Implementation would root a target and deal damage over time
    }
    
    arcaneAura() {
        Logger.log(`${this.name} passive Arcane Aura active`);
        // Implementation would provide mana regeneration
    }
    
    freezingField() {
        Logger.log(`${this.name} used Freezing Field`);
        // Implementation would channel an AoE damage ability
    }
    
    // Ability methods for Lich
    frostNova() {
        Logger.log(`${this.name} used Frost Nova`);
        // Implementation would deal AoE damage and slow
    }
    
    frostArmor() {
        Logger.log(`${this.name} used Frost Armor`);
        // Implementation would increase armor and slow attackers
    }
    
    darkRitual() {
        Logger.log(`${this.name} used Dark Ritual`);
        // Implementation would sacrifice a unit to gain mana
    }
    
    chainFrost() {
        Logger.log(`${this.name} used Chain Frost`);
        // Implementation would fire a bouncing projectile
    }
    
    // Ability methods for Storm Spirit
    staticRemnant() {
        Logger.log(`${this.name} used Static Remnant`);
        // Implementation would create an explosive clone
    }
    
    electricVortex() {
        Logger.log(`${this.name} used Electric Vortex`);
        // Implementation would pull enemies toward Storm Spirit
    }
    
    overload() {
        Logger.log(`${this.name} triggered Overload`);
        // Implementation would add bonus damage and slow after ability use
    }
    
    ballLightning() {
        Logger.log(`${this.name} used Ball Lightning`);
        // Implementation would allow rapid movement across the map
    }
    
    // Update method called every frame
    update(deltaTime) {
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
            } else {
                // Move in the current direction
                const movement = this.moveDirection.clone().multiplyScalar(moveDistance);
                this.position.add(movement);
            }
            
            // Update model position
            this.model.position.x = this.position.x;
            this.model.position.z = this.position.z;
        }
        
        // Update attack cooldown
        if (this.attackCooldown > 0) {
            this.attackCooldown -= deltaTime;
            
            if (this.attackCooldown <= 0 && this.isAttacking && this.currentTarget) {
                // Ready to attack again
                this.attack(this.currentTarget);
            }
        }
        
        // Update animation mixer if available
        if (this.mixer) {
            this.mixer.update(deltaTime);
        }
        
        // Update abilities cooldowns
        for (const key in this.abilities) {
            if (this.abilities[key]) {
                this.abilities[key].update(deltaTime);
            }
        }
    }
    
    // Clean up resources when hero is removed
    dispose() {
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
        
        // Clean up animations
        this.animations = {};
        this.currentAnimation = null;
        
        Logger.log(`Hero ${this.name} disposed`);
    }
}

// Ability class
class Ability {
    constructor(name, key, manaCost, cooldown, effect, isPassive = false) {
        this.name = name;
        this.key = key;
        this.manaCost = manaCost;
        this.cooldownMax = cooldown;
        this.cooldown = 0;
        this.effect = effect;
        this.isPassive = isPassive;
        this.level = 1;
        this.maxLevel = 4;
    }
    
    use(target) {
        if (this.isPassive) {
            console.log(`${this.name} is a passive ability`);
            return false;
        }
        
        if (this.cooldown > 0) {
            console.log(`${this.name} is on cooldown: ${this.cooldown.toFixed(1)}s remaining`);
            return false;
        }
        
        // Execute ability effect
        const success = this.effect(target);
        
        if (success !== false) {
            // Set cooldown
            this.cooldown = this.cooldownMax;
            
            // Emit ability used event
            Events.emit('abilityUsed', {
                ability: this,
                target: target
            });
            
            return true;
        }
        
        return false;
    }
    
    levelUp() {
        if (this.level < this.maxLevel) {
            this.level++;
            
            // Emit ability level up event
            Events.emit('abilityLevelUp', {
                ability: this,
                level: this.level
            });
            
            return true;
        }
        
        return false;
    }
    
    update(deltaTime) {
        if (this.cooldown > 0) {
            this.cooldown = Math.max(0, this.cooldown - deltaTime);
            
            // Emit cooldown update event
            if (this.cooldown === 0) {
                Events.emit('abilityCooldownComplete', {
                    ability: this
                });
            }
        }
    }
    
    getCooldownPercent() {
        if (this.cooldownMax === 0) return 0;
        return this.cooldown / this.cooldownMax;
    }
}

// Hero Factory to create different hero types
class HeroFactory {
    static createHero(type, scene) {
        switch (type) {
            case 'axe':
                return new Hero('Axe', type, scene);
            case 'crystal-maiden':
                return new Hero('Crystal Maiden', type, scene);
            case 'lich':
                return new Hero('Lich', type, scene);
            case 'storm-spirit':
                return new Hero('Storm Spirit', type, scene);
            default:
                console.error(`Unknown hero type: ${type}`);
                return null;
        }
    }
}