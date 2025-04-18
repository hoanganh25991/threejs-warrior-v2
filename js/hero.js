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
            attackDamage: 10,
            attackRange: 3 // Default attack range
        };
        
        // Position and movement
        this.position = new THREE.Vector3(0, 0, 0);
        this.rotation = new THREE.Euler(0, 0, 0);
        this.targetPosition = null;
        this.isMoving = false;
        this.moveDirection = new THREE.Vector3();
        
        // Jump and flight properties
        this.isJumping = false;
        this.jumpHeight = 0;
        this.jumpVelocity = 0;
        this.jumpStartTime = 0;
        this.jumpCount = 0;
        this.maxJumpCount = window.configLoader?.getConfig('jumpConfig')?.maxJumpCount || 2; // Double jump by default
        this.isFlying = false;
        this.flightHeight = 0;
        this.flightTargetHeight = 0;
        
        // Long press tracking for flight
        this.longPressActive = false;
        this.longPressDirection = 0; // 1 for up, -1 for down
        this.longPressInterval = null;
        
        // Combat state
        this.isAttacking = false;
        this.currentTarget = null;
        this.attackCooldown = 0;
        
        // Abilities (6 abilities using only number keys 1-6)
        this.abilities = {
            '1': null, // Primary ability
            '2': null, // Secondary ability
            '3': null, // Third ability
            '4': null, // Ultimate ability
            '5': null, // Extra ability 1
            '6': null  // Extra ability 2
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
                // Dota 1 Axe abilities
                this.abilities['1'] = new Ability('Berserker\'s Call', '1', 10, 8, this.berserkersCall.bind(this));
                this.abilities['2'] = new Ability('Battle Hunger', '2', 15, 5, this.battleHunger.bind(this));
                this.abilities['3'] = new Ability('Counter Helix', '3', 0, 0, this.counterHelix.bind(this), true); // Passive
                this.abilities['4'] = new Ability('Culling Blade', '4', 25, 10, this.cullingBlade.bind(this));
                this.abilities['5'] = new Ability('War Cry', '5', 15, 12, this.warCry.bind(this));
                this.abilities['6'] = new Ability('Taunt', '6', 5, 5, this.taunt.bind(this));
                break;
                
            case 'crystal-maiden':
                // Dota 1 Crystal Maiden abilities
                this.abilities['1'] = new Ability('Crystal Nova', '1', 15, 5, this.crystalNova.bind(this));
                this.abilities['2'] = new Ability('Frostbite', '2', 20, 6, this.frostbite.bind(this));
                this.abilities['3'] = new Ability('Brilliance Aura', '3', 0, 0, this.arcaneAura.bind(this), true); // Passive
                this.abilities['4'] = new Ability('Freezing Field', '4', 30, 12, this.freezingField.bind(this));
                this.abilities['5'] = new Ability('Frost Armor', '5', 18, 10, this.frostShield.bind(this));
                this.abilities['6'] = new Ability('Cold Snap', '6', 22, 8, this.icePath.bind(this));
                break;
                
            case 'lich':
                // Dota 1 Lich abilities
                this.abilities['1'] = new Ability('Frost Nova', '1', 15, 5, this.frostNova.bind(this));
                this.abilities['2'] = new Ability('Frost Armor', '2', 10, 8, this.frostArmor.bind(this));
                this.abilities['3'] = new Ability('Dark Ritual', '3', 5, 4, this.darkRitual.bind(this));
                this.abilities['4'] = new Ability('Chain Frost', '4', 30, 12, this.chainFrost.bind(this));
                this.abilities['5'] = new Ability('Frost Blast', '5', 20, 10, this.iceBlast.bind(this));
                this.abilities['6'] = new Ability('Ice Barrier', '6', 15, 8, this.frostShield.bind(this));
                break;
                
            case 'storm-spirit':
                // Dota 1 Storm Spirit abilities
                this.abilities['1'] = new Ability('Static Remnant', '1', 10, 4, this.staticRemnant.bind(this));
                this.abilities['2'] = new Ability('Electric Vortex', '2', 20, 6, this.electricVortex.bind(this));
                this.abilities['3'] = new Ability('Overload', '3', 0, 0, this.overload.bind(this), true); // Passive
                this.abilities['4'] = new Ability('Ball Lightning', '4', 15, 3, this.ballLightning.bind(this));
                this.abilities['5'] = new Ability('Electric Surge', '5', 12, 5, this.lightningBolt.bind(this));
                this.abilities['6'] = new Ability('Storm Gust', '6', 25, 15, this.energyField.bind(this));
                break;
                
            default:
                // Generic abilities if hero type is not recognized
                this.abilities['1'] = new Ability('Ability 1', '1', 10, 5, () => console.log('Ability 1 activated'));
                this.abilities['2'] = new Ability('Ability 2', '2', 15, 8, () => console.log('Ability 2 activated'));
                this.abilities['3'] = new Ability('Ability 3', '3', 20, 10, () => console.log('Ability 3 activated'));
                this.abilities['4'] = new Ability('Ultimate', '4', 30, 15, () => console.log('Ultimate activated'));
                this.abilities['5'] = new Ability('Ability 5', '5', 20, 12, () => console.log('Ability 5 activated'));
                this.abilities['6'] = new Ability('Ability 6', '6', 25, 14, () => console.log('Ability 6 activated'));
        }
        
        Logger.log(`6 abilities set up for ${this.name} using number keys 1-6`);
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
        
        // Emit attack event for UI
        Events.emit('abilityUsed', {
            abilityId: 'basic-attack',
            cooldownTime: this.attackCooldown
        });
        
        // Create attack effect
        if (window.game && window.game.combatSystem) {
            // Create a simple projectile or effect for the attack
            const attackType = this.getAttackType();
            window.game.combatSystem.createProjectile(
                this.position.clone().add(new THREE.Vector3(0, 1, 0)), // Start slightly above hero
                target.position.clone().add(new THREE.Vector3(0, 1, 0)), // Target slightly above enemy
                attackType,
                15, // Speed
                damage,
                this
            );
        }
        
        Logger.log(`Hero ${this.name} attacked ${target.name} for ${damage} damage`);
    }
    
    // Get attack type based on hero type
    getAttackType() {
        switch (this.type) {
            case 'axe':
                return 'melee'; // Red projectile
            case 'crystal-maiden':
                return 'ice'; // Ice projectile
            case 'lich':
                return 'ice'; // Ice projectile
            case 'storm-spirit':
                return 'lightning'; // Lightning projectile
            default:
                return 'melee';
        }
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
        
        // Find all enemies within range
        const tauntRange = 5;
        const enemies = window.game.combatSystem.enemies.filter(enemy => 
            enemy.position.distanceTo(this.position) <= tauntRange
        );
        
        // Taunt them (make them target this hero)
        enemies.forEach(enemy => {
            enemy.currentTarget = this;
            enemy.moveTo(this.position);
        });
        
        // Visual effect
        this.createAOEEffect(this.position, tauntRange, 0xff0000, 1);
        
        // Increase armor temporarily
        const armorBonus = 10;
        this.stats.armor = (this.stats.armor || 0) + armorBonus;
        
        // Reset armor after duration
        setTimeout(() => {
            this.stats.armor = (this.stats.armor || 0) - armorBonus;
        }, 5000); // 5 seconds
        
        return true;
    }
    
    battleHunger() {
        Logger.log(`${this.name} used Battle Hunger`);
        // Implementation would apply a DoT to target
        
        // Find closest enemy
        const target = this.findClosestEnemy();
        if (!target) return false;
        
        // Apply damage over time effect
        const damagePerTick = 5;
        const duration = 10; // seconds
        const tickInterval = 1; // seconds
        
        // Visual effect - projectile to target
        window.game.combatSystem.createProjectile(
            this.position.clone().add(new THREE.Vector3(0, 1, 0)),
            target.position.clone().add(new THREE.Vector3(0, 1, 0)),
            'fire',
            10,
            damagePerTick,
            this
        );
        
        // Apply DoT effect
        const dotEffect = setInterval(() => {
            if (target.stats.health > 0) {
                target.takeDamage(damagePerTick, this);
            } else {
                clearInterval(dotEffect);
            }
        }, tickInterval * 1000);
        
        // Clear interval after duration
        setTimeout(() => {
            clearInterval(dotEffect);
        }, duration * 1000);
        
        return true;
    }
    
    counterHelix() {
        Logger.log(`${this.name} triggered Counter Helix`);
        // Implementation would deal damage to nearby enemies when attacked
        
        // Find all enemies within range
        const helixRange = 3;
        const enemies = window.game.combatSystem.enemies.filter(enemy => 
            enemy.position.distanceTo(this.position) <= helixRange
        );
        
        // Deal damage to each enemy
        const helixDamage = 15;
        enemies.forEach(enemy => {
            enemy.takeDamage(helixDamage, this);
        });
        
        // Visual effect
        this.createAOEEffect(this.position, helixRange, 0xff6600, 0.5);
        
        return true;
    }
    
    cullingBlade() {
        Logger.log(`${this.name} used Culling Blade`);
        // Implementation would execute low health targets
        
        // Find closest enemy
        const target = this.findClosestEnemy();
        if (!target) return false;
        
        // Check if target is below health threshold
        const executeThreshold = 30;
        const executeDamage = 250; // High damage to ensure kill
        const normalDamage = 50;
        
        // Visual effect - projectile to target
        window.game.combatSystem.createProjectile(
            this.position.clone().add(new THREE.Vector3(0, 1, 0)),
            target.position.clone().add(new THREE.Vector3(0, 1, 0)),
            'fire',
            15,
            target.stats.health <= executeThreshold ? executeDamage : normalDamage,
            this
        );
        
        // Apply damage
        if (target.stats.health <= executeThreshold) {
            // Execute
            target.takeDamage(executeDamage, this);
            Logger.log(`${this.name} executed ${target.name}!`);
            
            // Bonus effect on successful execute
            this.stats.movementSpeed += 2; // Temporary speed boost
            setTimeout(() => {
                this.stats.movementSpeed -= 2;
            }, 5000); // 5 seconds
        } else {
            // Normal damage
            target.takeDamage(normalDamage, this);
        }
        
        return true;
    }
    
    warCry() {
        Logger.log(`${this.name} used War Cry`);
        // Implementation would buff allies and self
        
        // Buff self
        const speedBonus = 2;
        const damageBonus = 10;
        
        this.stats.movementSpeed += speedBonus;
        this.stats.attackDamage += damageBonus;
        
        // Visual effect
        this.createAOEEffect(this.position, 3, 0xffff00, 1);
        
        // Reset buffs after duration
        setTimeout(() => {
            this.stats.movementSpeed -= speedBonus;
            this.stats.attackDamage -= damageBonus;
        }, 8000); // 8 seconds
        
        return true;
    }
    
    berserkersRage() {
        Logger.log(`${this.name} used Berserker's Rage`);
        // Implementation would increase attack speed but decrease defense
        
        // Apply buffs/debuffs
        const attackSpeedBonus = 0.5;
        const armorPenalty = 5;
        
        this.stats.attackSpeed += attackSpeedBonus;
        this.stats.armor = Math.max(0, (this.stats.armor || 0) - armorPenalty);
        
        // Visual effect - red glow
        const geometry = new THREE.SphereGeometry(1.5, 16, 16);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0xff0000,
            transparent: true,
            opacity: 0.5
        });
        const effect = new THREE.Mesh(geometry, material);
        effect.position.copy(this.position);
        effect.position.y = 1;
        this.scene.add(effect);
        
        // Reset after duration
        setTimeout(() => {
            this.stats.attackSpeed -= attackSpeedBonus;
            this.stats.armor = (this.stats.armor || 0) + armorPenalty;
            this.scene.remove(effect);
            effect.geometry.dispose();
            effect.material.dispose();
        }, 10000); // 10 seconds
        
        return true;
    }
    
    taunt() {
        Logger.log(`${this.name} used Taunt`);
        // Implementation would taunt nearby enemies and increase threat
        
        // Visual effect - character animation
        if (this.model && this.animations['attack']) {
            this.playAnimation('attack');
        }
        
        // Find all enemies within range
        const tauntRange = 8;
        const enemies = window.game.combatSystem.enemies.filter(enemy => 
            enemy.position.distanceTo(this.position) <= tauntRange
        );
        
        // Taunt them (make them target this hero)
        enemies.forEach(enemy => {
            enemy.currentTarget = this;
            enemy.moveTo(this.position);
        });
        
        // Visual effect
        const geometry = new THREE.RingGeometry(0.5, 1.5, 32);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0xff3300,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(geometry, material);
        ring.rotation.x = -Math.PI / 2; // Make it horizontal
        ring.position.copy(this.position);
        ring.position.y = 0.1; // Slightly above ground
        this.scene.add(ring);
        
        // Animate the ring expanding
        const duration = 1.5; // seconds
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            if (elapsed < duration) {
                const scale = 1 + (elapsed * 3);
                ring.scale.set(scale, scale, scale);
                ring.material.opacity = 0.7 - (elapsed * 0.5);
                requestAnimationFrame(animate);
            } else {
                this.scene.remove(ring);
                ring.geometry.dispose();
                ring.material.dispose();
            }
        };
        
        animate();
        
        // Increase threat level (for AI targeting)
        this.stats.threatLevel = (this.stats.threatLevel || 1) * 2;
        
        // Reset threat level after duration
        setTimeout(() => {
            this.stats.threatLevel = (this.stats.threatLevel || 2) / 2;
        }, 5000); // 5 seconds
        
        return true;
    }
    
    // Ability methods for Crystal Maiden
    crystalNova() {
        Logger.log(`${this.name} used Crystal Nova`);
        // Implementation would deal AoE damage and slow
        
        // Get target position (in front of hero)
        const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(this.model.quaternion);
        const targetPosition = this.position.clone().add(direction.multiplyScalar(5));
        
        // Find enemies in AoE
        const novaRange = 6;
        const enemies = window.game.combatSystem.enemies.filter(enemy => 
            enemy.position.distanceTo(targetPosition) <= novaRange
        );
        
        // Deal damage and apply slow
        const novaDamage = 20;
        enemies.forEach(enemy => {
            enemy.takeDamage(novaDamage, this);
            
            // Apply slow
            const originalSpeed = enemy.stats.movementSpeed;
            enemy.stats.movementSpeed *= 0.5; // 50% slow
            
            // Reset speed after duration
            setTimeout(() => {
                enemy.stats.movementSpeed = originalSpeed;
            }, 4000); // 4 seconds
        });
        
        // Visual effect
        this.createAOEEffect(targetPosition, novaRange, 0x00ffff, 1);
        
        return true;
    }
    
    frostbite() {
        Logger.log(`${this.name} used Frostbite`);
        // Implementation would root a target and deal damage over time
        
        // Find closest enemy
        const target = this.findClosestEnemy();
        if (!target) return false;
        
        // Apply root and DoT
        const rootDuration = 3; // seconds
        const damagePerTick = 8;
        const tickInterval = 0.5; // seconds
        
        // Root target (prevent movement)
        const originalSpeed = target.stats.movementSpeed;
        target.stats.movementSpeed = 0;
        target.stopMovement();
        
        // Visual effect - projectile to target
        window.game.combatSystem.createProjectile(
            this.position.clone().add(new THREE.Vector3(0, 1, 0)),
            target.position.clone().add(new THREE.Vector3(0, 1, 0)),
            'ice',
            10,
            damagePerTick,
            this
        );
        
        // Apply DoT effect
        const dotEffect = setInterval(() => {
            if (target.stats.health > 0) {
                target.takeDamage(damagePerTick, this);
            } else {
                clearInterval(dotEffect);
            }
        }, tickInterval * 1000);
        
        // Reset movement after duration
        setTimeout(() => {
            target.stats.movementSpeed = originalSpeed;
            clearInterval(dotEffect);
        }, rootDuration * 1000);
        
        return true;
    }
    
    arcaneAura() {
        Logger.log(`${this.name} passive Arcane Aura active`);
        // Implementation would provide mana regeneration
        
        // This is a passive ability that constantly regenerates mana
        const manaRegenAmount = 2;
        
        // Apply mana regeneration
        this.restoreMana(manaRegenAmount);
        
        return true;
    }
    
    freezingField() {
        Logger.log(`${this.name} used Freezing Field`);
        // Implementation would channel an AoE damage ability
        
        // Channel for duration
        const channelDuration = 5; // seconds
        const tickInterval = 0.5; // seconds
        const fieldRange = 8;
        const damagePerTick = 10;
        
        // Visual effect - continuous AoE
        const effect = this.createAOEEffect(this.position, fieldRange, 0x00ffff, channelDuration);
        
        // Apply damage ticks
        const damageEffect = setInterval(() => {
            // Find enemies in range
            const enemies = window.game.combatSystem.enemies.filter(enemy => 
                enemy.position.distanceTo(this.position) <= fieldRange
            );
            
            // Deal damage
            enemies.forEach(enemy => {
                enemy.takeDamage(damagePerTick, this);
            });
        }, tickInterval * 1000);
        
        // End channel after duration
        setTimeout(() => {
            clearInterval(damageEffect);
        }, channelDuration * 1000);
        
        return true;
    }
    
    frostShield() {
        Logger.log(`${this.name} used Frost Shield`);
        // Implementation would create a protective shield
        
        // Apply shield effect
        const shieldAmount = 30;
        const shieldDuration = 8; // seconds
        
        // Create temporary shield health
        this.stats.shield = (this.stats.shield || 0) + shieldAmount;
        
        // Visual effect
        const geometry = new THREE.SphereGeometry(1.5, 16, 16);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x00ffff,
            transparent: true,
            opacity: 0.5
        });
        const shield = new THREE.Mesh(geometry, material);
        shield.position.copy(this.position);
        shield.position.y = 1;
        this.scene.add(shield);
        
        // Remove shield after duration
        setTimeout(() => {
            this.stats.shield = Math.max(0, (this.stats.shield || 0) - shieldAmount);
            this.scene.remove(shield);
            shield.geometry.dispose();
            shield.material.dispose();
        }, shieldDuration * 1000);
        
        return true;
    }
    
    icePath() {
        Logger.log(`${this.name} used Ice Path`);
        // Implementation would create a line of ice that stuns enemies
        
        // Get direction
        const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(this.model.quaternion);
        const pathLength = 10;
        const pathEnd = this.position.clone().add(direction.multiplyScalar(pathLength));
        
        // Create visual effect - line from hero to end point
        const points = [];
        points.push(this.position.clone());
        points.push(pathEnd);
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 5 });
        const line = new THREE.Line(geometry, material);
        line.position.y = 0.1; // Slightly above ground
        this.scene.add(line);
        
        // Find enemies in path
        const pathWidth = 2;
        const enemies = window.game.combatSystem.enemies.filter(enemy => {
            // Calculate distance from enemy to line
            const heroToEnemy = new THREE.Vector3().subVectors(enemy.position, this.position);
            const projection = heroToEnemy.dot(direction) / direction.length();
            
            // Check if enemy is within path length
            if (projection < 0 || projection > pathLength) return false;
            
            // Calculate perpendicular distance to line
            const projectedPoint = this.position.clone().add(direction.clone().normalize().multiplyScalar(projection));
            const distance = enemy.position.distanceTo(projectedPoint);
            
            return distance <= pathWidth;
        });
        
        // Apply stun to enemies
        const stunDuration = 2; // seconds
        const stunDamage = 15;
        
        enemies.forEach(enemy => {
            // Deal damage
            enemy.takeDamage(stunDamage, this);
            
            // Apply stun
            const originalSpeed = enemy.stats.movementSpeed;
            enemy.stats.movementSpeed = 0;
            enemy.stopMovement();
            
            // Reset after duration
            setTimeout(() => {
                enemy.stats.movementSpeed = originalSpeed;
            }, stunDuration * 1000);
        });
        
        // Remove line after duration
        setTimeout(() => {
            this.scene.remove(line);
            line.geometry.dispose();
            line.material.dispose();
        }, 2000); // 2 seconds
        
        return true;
    }
    
    // Ability methods for Lich
    frostNova() {
        Logger.log(`${this.name} used Frost Nova`);
        // Implementation would deal AoE damage and slow
        
        // Get target position (in front of hero)
        const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(this.model.quaternion);
        const targetPosition = this.position.clone().add(direction.multiplyScalar(5));
        
        // Find enemies in AoE
        const novaRange = 5;
        const enemies = window.game.combatSystem.enemies.filter(enemy => 
            enemy.position.distanceTo(targetPosition) <= novaRange
        );
        
        // Deal damage and apply slow
        const novaDamage = 25;
        enemies.forEach(enemy => {
            enemy.takeDamage(novaDamage, this);
            
            // Apply slow
            const originalSpeed = enemy.stats.movementSpeed;
            enemy.stats.movementSpeed *= 0.6; // 40% slow
            
            // Reset speed after duration
            setTimeout(() => {
                enemy.stats.movementSpeed = originalSpeed;
            }, 3000); // 3 seconds
        });
        
        // Visual effect
        this.createAOEEffect(targetPosition, novaRange, 0x0000ff, 1);
        
        return true;
    }
    
    frostArmor() {
        Logger.log(`${this.name} used Frost Armor`);
        // Implementation would increase armor and slow attackers
        
        // Apply armor buff
        const armorBonus = 15;
        const duration = 10; // seconds
        
        this.stats.armor = (this.stats.armor || 0) + armorBonus;
        
        // Visual effect
        const geometry = new THREE.SphereGeometry(1.5, 16, 16);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x0088ff,
            transparent: true,
            opacity: 0.5
        });
        const effect = new THREE.Mesh(geometry, material);
        effect.position.copy(this.position);
        effect.position.y = 1;
        this.scene.add(effect);
        
        // Reset after duration
        setTimeout(() => {
            this.stats.armor = Math.max(0, (this.stats.armor || 0) - armorBonus);
            this.scene.remove(effect);
            effect.geometry.dispose();
            effect.material.dispose();
        }, duration * 1000);
        
        return true;
    }
    
    darkRitual() {
        Logger.log(`${this.name} used Dark Ritual`);
        // Implementation would sacrifice a unit to gain mana
        
        // Since we don't have allied units to sacrifice, just restore mana
        const manaRestored = 50;
        this.restoreMana(manaRestored);
        
        // Visual effect
        const geometry = new THREE.SphereGeometry(1, 16, 16);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x0000ff,
            transparent: true,
            opacity: 0.7
        });
        const effect = new THREE.Mesh(geometry, material);
        effect.position.copy(this.position);
        effect.position.y = 1;
        this.scene.add(effect);
        
        // Animation
        const duration = 1; // seconds
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            if (elapsed < duration) {
                effect.scale.set(1 + elapsed, 1 + elapsed, 1 + elapsed);
                effect.material.opacity = 0.7 - (elapsed * 0.7);
                requestAnimationFrame(animate);
            } else {
                this.scene.remove(effect);
                effect.geometry.dispose();
                effect.material.dispose();
            }
        };
        
        animate();
        
        return true;
    }
    
    chainFrost() {
        Logger.log(`${this.name} used Chain Frost`);
        // Implementation would fire a bouncing projectile
        
        // Find closest enemy
        const target = this.findClosestEnemy();
        if (!target) return false;
        
        // Chain frost parameters
        const damage = 40;
        const bounces = 4;
        const bounceRange = 8;
        
        // Function to create a bounce
        const createBounce = (from, to, bouncesLeft) => {
            // Create projectile
            const projectile = window.game.combatSystem.createProjectile(
                from.clone().add(new THREE.Vector3(0, 1, 0)),
                to.position.clone().add(new THREE.Vector3(0, 1, 0)),
                'ice',
                15,
                damage,
                this
            );
            
            // When projectile hits
            setTimeout(() => {
                // Deal damage
                to.takeDamage(damage, this);
                
                // Find next target if bounces remain
                if (bouncesLeft > 0) {
                    // Get all enemies in range except the current target
                    const nextTargets = window.game.combatSystem.enemies.filter(enemy => 
                        enemy !== to && 
                        enemy.stats.health > 0 && 
                        enemy.position.distanceTo(to.position) <= bounceRange
                    );
                    
                    // If there's a valid next target, bounce to it
                    if (nextTargets.length > 0) {
                        // Sort by distance and pick closest
                        nextTargets.sort((a, b) => 
                            a.position.distanceTo(to.position) - b.position.distanceTo(to.position)
                        );
                        
                        const nextTarget = nextTargets[0];
                        createBounce(to.position, nextTarget, bouncesLeft - 1);
                    }
                }
            }, 500); // Time for projectile to reach target
        };
        
        // Start the chain
        createBounce(this.position, target, bounces);
        
        return true;
    }
    
    iceBlast() {
        Logger.log(`${this.name} used Ice Blast`);
        // Implementation would fire a large ice projectile
        
        // Get target position (in front of hero)
        const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(this.model.quaternion);
        const targetPosition = this.position.clone().add(direction.multiplyScalar(10));
        
        // Create projectile
        const projectile = window.game.combatSystem.createProjectile(
            this.position.clone().add(new THREE.Vector3(0, 1, 0)),
            targetPosition.clone().add(new THREE.Vector3(0, 1, 0)),
            'ice',
            12,
            0, // No direct damage from projectile
            this
        );
        
        // When projectile reaches target position, explode
        setTimeout(() => {
            // Find enemies in blast radius
            const blastRadius = 7;
            const enemies = window.game.combatSystem.enemies.filter(enemy => 
                enemy.position.distanceTo(targetPosition) <= blastRadius
            );
            
            // Deal damage
            const blastDamage = 35;
            enemies.forEach(enemy => {
                enemy.takeDamage(blastDamage, this);
                
                // Apply slow
                const originalSpeed = enemy.stats.movementSpeed;
                enemy.stats.movementSpeed *= 0.5; // 50% slow
                
                // Reset speed after duration
                setTimeout(() => {
                    enemy.stats.movementSpeed = originalSpeed;
                }, 4000); // 4 seconds
            });
            
            // Visual effect
            this.createAOEEffect(targetPosition, blastRadius, 0x00ffff, 1);
        }, 800); // Time for projectile to reach target
        
        return true;
    }
    
    // Ability methods for Storm Spirit
    staticRemnant() {
        Logger.log(`${this.name} used Static Remnant`);
        // Implementation would create an explosive clone
        
        // Create remnant at current position
        const remnantDuration = 12; // seconds
        const remnantRadius = 3;
        const remnantDamage = 20;
        
        // Visual effect - create a clone
        const geometry = new THREE.SphereGeometry(0.8, 16, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const remnant = new THREE.Mesh(geometry, material);
        remnant.position.copy(this.position);
        remnant.position.y = 1;
        this.scene.add(remnant);
        
        // Check for enemies entering the remnant's radius
        const checkInterval = setInterval(() => {
            // Find enemies in range
            const enemies = window.game.combatSystem.enemies.filter(enemy => 
                enemy.position.distanceTo(remnant.position) <= remnantRadius && 
                enemy.stats.health > 0
            );
            
            if (enemies.length > 0) {
                // Explode the remnant
                enemies.forEach(enemy => {
                    enemy.takeDamage(remnantDamage, this);
                });
                
                // Visual effect
                this.createAOEEffect(remnant.position, remnantRadius, 0x00ff00, 0.5);
                
                // Remove remnant
                this.scene.remove(remnant);
                remnant.geometry.dispose();
                remnant.material.dispose();
                
                // Clear interval
                clearInterval(checkInterval);
            }
        }, 200); // Check every 200ms
        
        // Remove remnant after duration if not triggered
        setTimeout(() => {
            if (remnant.parent) {
                this.scene.remove(remnant);
                remnant.geometry.dispose();
                remnant.material.dispose();
                clearInterval(checkInterval);
            }
        }, remnantDuration * 1000);
        
        return true;
    }
    
    electricVortex() {
        Logger.log(`${this.name} used Electric Vortex`);
        // Implementation would pull enemies toward Storm Spirit
        
        // Find enemies in range
        const vortexRange = 8;
        const enemies = window.game.combatSystem.enemies.filter(enemy => 
            enemy.position.distanceTo(this.position) <= vortexRange
        );
        
        // Pull enemies toward hero
        const pullDuration = 2; // seconds
        const pullDamage = 15;
        
        enemies.forEach(enemy => {
            // Deal damage
            enemy.takeDamage(pullDamage, this);
            
            // Pull effect
            const startPosition = enemy.position.clone();
            const endPosition = this.position.clone().add(
                new THREE.Vector3().subVectors(enemy.position, this.position).normalize().multiplyScalar(2)
            );
            
            // Disable enemy movement during pull
            const originalSpeed = enemy.stats.movementSpeed;
            enemy.stats.movementSpeed = 0;
            enemy.stopMovement();
            
            // Animate pull
            const startTime = Date.now();
            
            const animatePull = () => {
                const elapsed = (Date.now() - startTime) / 1000;
                const progress = Math.min(elapsed / pullDuration, 1);
                
                // Interpolate position
                enemy.position.lerpVectors(startPosition, endPosition, progress);
                enemy.model.position.x = enemy.position.x;
                enemy.model.position.z = enemy.position.z;
                
                if (progress < 1) {
                    requestAnimationFrame(animatePull);
                } else {
                    // Restore movement
                    enemy.stats.movementSpeed = originalSpeed;
                }
            };
            
            animatePull();
        });
        
        // Visual effect
        this.createAOEEffect(this.position, vortexRange, 0x00ff00, 1);
        
        return true;
    }
    
    overload() {
        Logger.log(`${this.name} triggered Overload`);
        // Implementation would add bonus damage and slow after ability use
        
        // This is a passive that triggers after using other abilities
        // For simplicity, we'll just apply the effect directly
        
        // Apply bonus damage
        const damageBonus = 15;
        const duration = 5; // seconds
        
        this.stats.attackDamage += damageBonus;
        
        // Visual effect
        const geometry = new THREE.SphereGeometry(1.2, 16, 16);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x00ff00,
            transparent: true,
            opacity: 0.6
        });
        const effect = new THREE.Mesh(geometry, material);
        effect.position.copy(this.position);
        effect.position.y = 1;
        this.scene.add(effect);
        
        // Reset after duration
        setTimeout(() => {
            this.stats.attackDamage -= damageBonus;
            this.scene.remove(effect);
            effect.geometry.dispose();
            effect.material.dispose();
        }, duration * 1000);
        
        return true;
    }
    
    ballLightning() {
        Logger.log(`${this.name} used Ball Lightning`);
        // Implementation would allow rapid movement across the map
        
        // Get direction
        const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(this.model.quaternion);
        const distance = 15; // How far to travel
        const targetPosition = this.position.clone().add(direction.multiplyScalar(distance));
        
        // Check for valid position
        const validPosition = window.game.world.findValidPosition(targetPosition, 1);
        
        // Create trail effect
        const points = [];
        points.push(this.position.clone());
        points.push(validPosition);
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 3 });
        const trail = new THREE.Line(geometry, material);
        trail.position.y = 1; // At character height
        this.scene.add(trail);
        
        // Move hero to target position
        const startPosition = this.position.clone();
        const startTime = Date.now();
        const duration = 0.5; // seconds
        
        const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            const progress = Math.min(elapsed / duration, 1);
            
            // Interpolate position
            this.position.lerpVectors(startPosition, validPosition, progress);
            this.model.position.x = this.position.x;
            this.model.position.z = this.position.z;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Remove trail
                this.scene.remove(trail);
                trail.geometry.dispose();
                trail.material.dispose();
                
                // Damage enemies along the path
                const pathWidth = 2;
                const pathDamage = 25;
                
                window.game.combatSystem.enemies.forEach(enemy => {
                    // Calculate distance from enemy to line
                    const heroToEnemy = new THREE.Vector3().subVectors(enemy.position, startPosition);
                    const pathDirection = new THREE.Vector3().subVectors(validPosition, startPosition).normalize();
                    const projection = heroToEnemy.dot(pathDirection);
                    
                    // Check if enemy is within path length
                    if (projection < 0 || projection > distance) return;
                    
                    // Calculate perpendicular distance to line
                    const projectedPoint = startPosition.clone().add(pathDirection.clone().multiplyScalar(projection));
                    const perpDistance = enemy.position.distanceTo(projectedPoint);
                    
                    if (perpDistance <= pathWidth) {
                        enemy.takeDamage(pathDamage, this);
                    }
                });
                
                // Trigger Overload passive
                this.overload();
            }
        };
        
        animate();
        
        return true;
    }
    
    lightningBolt() {
        Logger.log(`${this.name} used Lightning Bolt`);
        // Implementation would fire a lightning bolt at a target
        
        // Find closest enemy
        const target = this.findClosestEnemy();
        if (!target) return false;
        
        // Create lightning bolt
        const boltDamage = 30;
        
        // Visual effect - projectile to target
        window.game.combatSystem.createProjectile(
            this.position.clone().add(new THREE.Vector3(0, 1, 0)),
            target.position.clone().add(new THREE.Vector3(0, 1, 0)),
            'lightning',
            20,
            boltDamage,
            this
        );
        
        // Apply mini-stun
        const stunDuration = 0.5; // seconds
        const originalSpeed = target.stats.movementSpeed;
        target.stats.movementSpeed = 0;
        target.stopMovement();
        
        // Reset after duration
        setTimeout(() => {
            target.stats.movementSpeed = originalSpeed;
        }, stunDuration * 1000);
        
        // Trigger Overload passive
        setTimeout(() => {
            this.overload();
        }, 100);
        
        return true;
    }
    
    energyField() {
        Logger.log(`${this.name} used Energy Field`);
        // Implementation would create an energy field that damages enemies
        
        // Create energy field
        const fieldRadius = 6;
        const fieldDuration = 6; // seconds
        const tickInterval = 0.5; // seconds
        const damagePerTick = 8;
        
        // Visual effect
        const geometry = new THREE.CircleGeometry(fieldRadius, 32);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x00ff00,
            transparent: true,
            opacity: 0.3
        });
        const field = new THREE.Mesh(geometry, material);
        field.rotation.x = -Math.PI / 2; // Make it horizontal
        field.position.copy(this.position);
        field.position.y = 0.1; // Slightly above ground
        this.scene.add(field);
        
        // Apply damage over time
        const damageInterval = setInterval(() => {
            // Find enemies in field
            const enemies = window.game.combatSystem.enemies.filter(enemy => 
                enemy.position.distanceTo(this.position) <= fieldRadius
            );
            
            // Deal damage
            enemies.forEach(enemy => {
                enemy.takeDamage(damagePerTick, this);
            });
            
            // Pulse effect
            const pulse = this.createAOEEffect(this.position, fieldRadius, 0x00ff00, 0.3);
        }, tickInterval * 1000);
        
        // Remove field after duration
        setTimeout(() => {
            clearInterval(damageInterval);
            this.scene.remove(field);
            field.geometry.dispose();
            field.material.dispose();
        }, fieldDuration * 1000);
        
        // Trigger Overload passive
        this.overload();
        
        return true;
    }
    
    // Helper method to find closest enemy
    findClosestEnemy() {
        if (!window.game || !window.game.combatSystem) return null;
        
        const enemies = window.game.combatSystem.enemies.filter(enemy => enemy.stats.health > 0);
        if (enemies.length === 0) return null;
        
        // Sort by distance
        enemies.sort((a, b) => 
            a.position.distanceTo(this.position) - b.position.distanceTo(this.position)
        );
        
        return enemies[0];
    }
    
    // Helper method to create AoE visual effect
    createAOEEffect(position, radius, color, duration) {
        const geometry = new THREE.CircleGeometry(radius, 32);
        const material = new THREE.MeshBasicMaterial({ 
            color: color,
            transparent: true,
            opacity: 0.5
        });
        const effect = new THREE.Mesh(geometry, material);
        effect.rotation.x = -Math.PI / 2; // Make it horizontal
        effect.position.copy(position);
        effect.position.y = 0.1; // Slightly above ground
        this.scene.add(effect);
        
        // Remove after duration
        setTimeout(() => {
            this.scene.remove(effect);
            effect.geometry.dispose();
            effect.material.dispose();
        }, duration * 1000);
        
        return effect;
    }
    
    // Use ability by number key (1-6)
    useAbility(key) {
        const ability = this.abilities[key];
        
        if (!ability) {
            Logger.log(`No ability assigned to key ${key}`);
            return false;
        }
        
        if (ability.isOnCooldown) {
            Logger.log(`${ability.name} is on cooldown`);
            return false;
        }
        
        // Check if enough mana
        if (this.stats.mana < ability.manaCost) {
            Logger.log(`Not enough mana to cast ${ability.name}`);
            return false;
        }
        
        // Use mana
        this.stats.mana -= ability.manaCost;
        
        // Emit mana used event
        Events.emit('manaUsed', { hero: this, amount: ability.manaCost });
        
        // Start cooldown
        ability.startCooldown();
        
        // Emit ability used event
        Events.emit('abilityUsed', { hero: this, ability });
        
        // Show skill name shout out
        this.showSkillShoutOut(ability.name);
        
        // Execute ability function
        return ability.use();
    }
    
    // Show a visual shout out when a skill is cast
    showSkillShoutOut(skillName) {
        try {
            // Check if font is available
            if (window.game && window.game.assets && window.game.assets.fonts && window.game.assets.fonts['default']) {
                // Create a 3D text above the hero
                const textGeometry = new THREE.TextGeometry(skillName, {
                    font: window.game.assets.fonts['default'],
                    size: 0.5,
                    height: 0.1,
                    curveSegments: 12,
                    bevelEnabled: false
                });
                
                // Center the text
                textGeometry.computeBoundingBox();
                const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
                textGeometry.translate(-textWidth / 2, 0, 0);
                
                // Create material and mesh
                const textMaterial = new THREE.MeshBasicMaterial({ 
                    color: this.getHeroColor(),
                    transparent: true
                });
                const textMesh = new THREE.Mesh(textGeometry, textMaterial);
                
                // Position above hero
                textMesh.position.copy(this.position);
                textMesh.position.y += 3; // Above the hero
                
                // Add to scene
                this.scene.add(textMesh);
                
                // Animate the text
                const startTime = Date.now();
                const duration = 1500; // 1.5 seconds
                
                const animate = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = elapsed / duration;
                    
                    if (progress < 1) {
                        // Move upward and fade out
                        textMesh.position.y += 0.01;
                        textMesh.material.opacity = 1 - progress;
                        
                        requestAnimationFrame(animate);
                    } else {
                        // Remove when animation is complete
                        this.scene.remove(textMesh);
                        textGeometry.dispose();
                        textMaterial.dispose();
                    }
                };
                
                animate();
            } else {
                // Fallback to 2D sprite text
                this.showSkillShoutOutSprite(skillName);
            }
        } catch (error) {
            console.error("Error creating 3D text:", error);
            // Fallback to 2D sprite text
            this.showSkillShoutOutSprite(skillName);
        }
        
        // Also show in UI for better visibility
        if (window.game && window.game.ui) {
            window.game.ui.showMessage(`${skillName}!`, 2000);
        }
    }
    
    // Fallback method using sprite instead of 3D text
    showSkillShoutOutSprite(skillName) {
        // Create a canvas for the text
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        
        // Draw background with hero color
        context.fillStyle = `#${this.getHeroColor().toString(16).padStart(6, '0')}`;
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw text
        context.fillStyle = 'white';
        context.font = 'bold 32px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(skillName, canvas.width / 2, canvas.height / 2);
        
        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);
        
        // Create sprite material
        const material = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true
        });
        
        // Create sprite
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(2, 0.5, 1);
        
        // Position above hero
        sprite.position.copy(this.position);
        sprite.position.y += 3; // Above the hero
        
        // Add to scene
        this.scene.add(sprite);
        
        // Animate the sprite
        const startTime = Date.now();
        const duration = 1500; // 1.5 seconds
        
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
    
    // Jump method
    jump() {
        // Get jump configuration
        const jumpConfig = window.configLoader?.getConfig('jumpConfig') || {
            initialVelocity: 10,
            gravity: 20,
            maxJumpCount: 2,
            multiJumpHeightIncrease: 1.5,
            maxJumpHeight: 15,
            jumpEffectColor: 0xffffff,
            doubleJumpEffectColor: 0x00ffff,
            cameraFollowJump: true,
            cameraJumpOffset: 0.7,
            flightJumpVelocity: 3,
            flightJumpGravity: 10,
            flightJumpHeightIncrease: 0.5
        };
        
        // If flying, perform a small flight jump
        if (this.isFlying) {
            // Small jump during flight
            this.flightJump();
            return;
        }
        
        // Check if we can jump (either on ground or have double jump available)
        if (!this.isJumping || (this.isJumping && this.jumpCount < jumpConfig.maxJumpCount)) {
            // If already jumping, this is a multi-jump
            if (this.isJumping) {
                this.jumpCount++;
                
                // Increase jump velocity for consecutive jumps
                const multiplier = Math.min(
                    jumpConfig.multiJumpHeightIncrease * this.jumpCount,
                    jumpConfig.maxJumpHeight / jumpConfig.initialVelocity
                );
                this.jumpVelocity = jumpConfig.initialVelocity * multiplier;
                
                // Show multi-jump effect with different color
                this.createJumpEffect(jumpConfig.doubleJumpEffectColor);
            } else {
                this.jumpCount = 1;
                this.jumpVelocity = jumpConfig.initialVelocity;
                
                // Show regular jump effect
                this.createJumpEffect(jumpConfig.jumpEffectColor);
            }
            
            // Set jump parameters
            this.isJumping = true;
            
            // Play jump animation if available
            this.playAnimation('jump');
            
            // Show message
            if (window.game && window.game.ui) {
                if (this.jumpCount > 1) {
                    window.game.ui.showMessage(`Jump #${this.jumpCount}!`);
                } else {
                    window.game.ui.showMessage("Jump!");
                }
            }
            
            // Notify camera to follow jump if configured
            if (jumpConfig.cameraFollowJump && window.game && window.game.camera) {
                window.game.camera.followJump(this, jumpConfig.cameraJumpOffset);
            }
            
            Logger.log(`Hero ${this.name} jumped (jump #${this.jumpCount}, velocity: ${this.jumpVelocity.toFixed(1)})`);
        }
    }
    
    // Flight jump - small jump while flying
    flightJump() {
        // Get jump configuration
        const jumpConfig = window.configLoader?.getConfig('jumpConfig') || {
            flightJumpVelocity: 3,
            flightJumpGravity: 10,
            flightJumpHeightIncrease: 0.5
        };
        
        // Create a small upward boost
        const startHeight = this.flightHeight;
        const startTime = performance.now();
        const jumpDuration = 500; // 0.5 seconds
        
        // Create jump effect
        this.createJumpEffect(0x66ccff);
        
        // Play jump animation if available
        this.playAnimation('jump');
        
        // Show message
        if (window.game && window.game.ui) {
            window.game.ui.showMessage("Boost!");
        }
        
        // Animate the flight jump
        const animate = (time) => {
            const elapsed = time - startTime;
            const progress = Math.min(1, elapsed / jumpDuration);
            
            if (progress < 1) {
                // Parabolic jump curve
                const jumpCurve = Math.sin(progress * Math.PI);
                const heightIncrease = jumpConfig.flightJumpHeightIncrease * jumpCurve;
                
                // Apply height increase
                this.flightTargetHeight = startHeight + heightIncrease;
                
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
        Logger.log(`Hero ${this.name} performed flight jump`);
    }
    
    // Create visual effect for jumping
    createJumpEffect(color) {
        // Create a ring effect at the hero's feet
        const geometry = new THREE.RingGeometry(0.5, 1, 32);
        const material = new THREE.MeshBasicMaterial({ 
            color: color,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
        });
        
        const ring = new THREE.Mesh(geometry, material);
        ring.rotation.x = Math.PI / 2; // Make it horizontal
        ring.position.copy(this.position);
        ring.position.y = 0.1; // Slightly above ground
        
        this.scene.add(ring);
        
        // Animate the ring expanding and fading
        const startTime = Date.now();
        const duration = 500; // 0.5 seconds
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                // Expand and fade
                ring.scale.set(1 + progress * 2, 1 + progress * 2, 1);
                ring.material.opacity = 0.7 * (1 - progress);
                
                requestAnimationFrame(animate);
            } else {
                // Remove when animation is complete
                this.scene.remove(ring);
                ring.geometry.dispose();
                ring.material.dispose();
            }
        };
        
        animate();
    }
    
    // Toggle flight mode
    toggleFlight() {
        // Get flight configuration
        const flightConfig = window.configLoader?.getConfig('flightConfig') || {
            initialHeight: 5,
            maxHeight: 20,
            minHeight: 1,
            heightChangeRate: {
                keyPress: 2,
                longPress: 1.5,
                mouseWheel: 1
            },
            cameraFollowFlight: true,
            cameraFlightOffset: 0.8,
            mouseLookSensitivity: 0.5,
            upwardEffectColor: 0x00ffff,
            downwardEffectColor: 0xff9900,
            wingEffectColor: 0x66ccff,
            showWings: true,
            wingSize: 2,
            wingFlapSpeed: 0.5
        };
        
        if (this.isFlying) {
            // Land
            this.isFlying = false;
            this.flightTargetHeight = 0;
            this.stopLongPress(); // Stop any ongoing long press
            
            // Play landing animation if available
            this.playAnimation('land');
            
            // Create landing effect
            this.createFlightEffect(flightConfig.downwardEffectColor, 'landing');
            
            // Show message
            if (window.game && window.game.ui) {
                window.game.ui.showMessage("Landing...");
            }
            
            // Play landing sound if configured
            if (flightConfig.landingSoundEffect) {
                const audio = new Audio(flightConfig.landingSoundEffect);
                audio.volume = 0.3;
                audio.play().catch(e => console.warn('Could not play landing sound:', e));
            }
            
            // Update UI button
            if (window.game && window.game.ui && window.game.ui.flyAbility) {
                window.game.ui.flyAbility.textContent = "FLY";
            }
            
            // Emit flight state changed event for UI
            Events.emit('flightStateChanged', { isFlying: false });
            
            Logger.log(`Hero ${this.name} stopped flying`);
        } else {
            // Take off
            this.isFlying = true;
            this.isJumping = false; // Cancel any jump in progress
            this.flightTargetHeight = flightConfig.initialHeight; // Target height for flight
            
            // Play flight animation if available
            this.playAnimation('fly');
            
            // Create takeoff effect
            this.createFlightEffect(flightConfig.upwardEffectColor, 'takeoff');
            
            // Show message
            if (window.game && window.game.ui) {
                window.game.ui.showMessage("Taking Flight!");
            }
            
            // Play takeoff sound if configured
            if (flightConfig.takeoffSoundEffect) {
                const audio = new Audio(flightConfig.takeoffSoundEffect);
                audio.volume = 0.3;
                audio.play().catch(e => console.warn('Could not play takeoff sound:', e));
            }
            
            // Update UI button
            if (window.game && window.game.ui && window.game.ui.flyAbility) {
                window.game.ui.flyAbility.textContent = "FLY DOWN";
            }
            
            // Emit flight state changed event for UI
            Events.emit('flightStateChanged', { isFlying: true });
            
            Logger.log(`Hero ${this.name} started flying at height ${this.flightTargetHeight}`);
        }
    }
    
    // Fly higher (increase flight height)
    flyHigher() {
        if (!this.isFlying) return;
        
        // Get flight configuration
        const flightConfig = window.configLoader?.getConfig('flightConfig') || {
            maxHeight: 20,
            heightChangeRate: { keyPress: 2 },
            upwardEffectColor: 0x00ffff
        };
        
        // Increase target height up to a maximum
        const prevHeight = this.flightTargetHeight;
        this.flightTargetHeight = Math.min(
            flightConfig.maxHeight, 
            this.flightTargetHeight + flightConfig.heightChangeRate.keyPress
        );
        
        // Only create effect if height actually changed
        if (this.flightTargetHeight > prevHeight) {
            // Create a boost effect
            this.createFlightEffect(flightConfig.upwardEffectColor, 'ascend');
            
            // Show message for significant height changes
            if (this.flightTargetHeight >= flightConfig.maxHeight && window.game && window.game.ui) {
                window.game.ui.showMessage("Maximum altitude reached!");
            }
            
            Logger.log(`Hero ${this.name} flying higher: ${this.flightTargetHeight.toFixed(1)}`);
        }
    }
    
    // Fly lower (decrease flight height)
    flyLower() {
        if (!this.isFlying) return;
        
        // Get flight configuration
        const flightConfig = window.configLoader?.getConfig('flightConfig') || {
            minHeight: 1,
            heightChangeRate: { keyPress: 2 },
            downwardEffectColor: 0xff9900
        };
        
        // Decrease target height down to a minimum
        const prevHeight = this.flightTargetHeight;
        this.flightTargetHeight = Math.max(
            flightConfig.minHeight, 
            this.flightTargetHeight - flightConfig.heightChangeRate.keyPress
        );
        
        // Only create effect if height actually changed
        if (this.flightTargetHeight < prevHeight) {
            // Create a descent effect
            this.createFlightEffect(flightConfig.downwardEffectColor, 'descend');
            
            // Show message when close to ground
            if (this.flightTargetHeight <= flightConfig.minHeight && window.game && window.game.ui) {
                window.game.ui.showMessage("Minimum altitude reached!");
                
                // Update UI button
                if (window.game && window.game.ui && window.game.ui.flyAbility) {
                    window.game.ui.flyAbility.textContent = "LAND";
                }
            }
            
            Logger.log(`Hero ${this.name} flying lower: ${this.flightTargetHeight.toFixed(1)}`);
        }
    }
    
    // Start long press for continuous height change
    startLongPress(direction) {
        // Stop any existing long press
        this.stopLongPress();
        
        // Set direction (1 for up, -1 for down)
        this.longPressActive = true;
        this.longPressDirection = direction;
        
        // Get flight configuration
        const flightConfig = window.configLoader?.getConfig('flightConfig') || {
            heightChangeRate: { longPress: 1.5 }
        };
        const controlsConfig = window.configLoader?.getConfig('controlsConfig') || {
            touch: { longPressInterval: 100 }
        };
        
        // Start interval for continuous height change
        this.longPressInterval = setInterval(() => {
            if (this.longPressDirection > 0) {
                // Fly higher
                const prevHeight = this.flightTargetHeight;
                this.flyHigher();
                
                // Create continuous effect at intervals
                if (Math.floor(prevHeight) !== Math.floor(this.flightTargetHeight)) {
                    this.createFlightEffect(flightConfig.upwardEffectColor, 'continuous-ascend', 0.5);
                }
            } else {
                // Fly lower
                const prevHeight = this.flightTargetHeight;
                this.flyLower();
                
                // Create continuous effect at intervals
                if (Math.floor(prevHeight) !== Math.floor(this.flightTargetHeight)) {
                    this.createFlightEffect(flightConfig.downwardEffectColor, 'continuous-descend', 0.5);
                }
            }
        }, controlsConfig.touch.longPressInterval);
        
        Logger.log(`Hero ${this.name} started long press flight adjustment, direction: ${this.longPressDirection > 0 ? 'up' : 'down'}`);
    }
    
    // Stop long press
    stopLongPress() {
        if (this.longPressInterval) {
            clearInterval(this.longPressInterval);
            this.longPressInterval = null;
        }
        this.longPressActive = false;
    }
    
    // Create visual effect for flight changes
    createFlightEffect(color, type = 'default', scale = 1.0) {
        // Different effect based on type
        switch (type) {
            case 'takeoff':
                // Create a burst effect for takeoff
                this.createBurstEffect(color, 2.0 * scale);
                break;
                
            case 'landing':
                // Create a ring effect for landing
                this.createRingEffect(color, 2.0 * scale);
                break;
                
            case 'ascend':
                // Create upward particles
                this.createDirectionalParticles(color, 1.0 * scale, 'up');
                break;
                
            case 'descend':
                // Create downward particles
                this.createDirectionalParticles(color, 1.0 * scale, 'down');
                break;
                
            case 'continuous-ascend':
            case 'continuous-descend':
                // Smaller effect for continuous changes
                this.createDirectionalParticles(color, 0.5 * scale, 
                    type === 'continuous-ascend' ? 'up' : 'down');
                break;
                
            default:
                // Default simple effect
                this.createBurstEffect(color, 1.0 * scale);
        }
    }
    
    // Create burst effect (radial particles)
    createBurstEffect(color, scale = 1.0) {
        const particleCount = Math.floor(20 * scale);
        const particleSize = 0.1 * scale;
        const particleLifetime = 1000 * scale; // ms
        const particleSpeed = 0.05 * scale;
        
        // Create particles
        for (let i = 0; i < particleCount; i++) {
            // Create particle geometry and material
            const geometry = new THREE.SphereGeometry(particleSize, 8, 8);
            const material = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.8
            });
            
            // Create particle mesh
            const particle = new THREE.Mesh(geometry, material);
            
            // Position at hero's position
            particle.position.copy(this.position);
            particle.position.y = this.model.position.y;
            
            // Add to scene
            this.scene.add(particle);
            
            // Calculate direction (radial)
            const angle = (i / particleCount) * Math.PI * 2;
            const dirX = Math.cos(angle);
            const dirZ = Math.sin(angle);
            
            // Animate particle
            const startTime = performance.now();
            
            const animate = (time) => {
                const elapsed = time - startTime;
                const progress = Math.min(1, elapsed / particleLifetime);
                
                if (progress < 1) {
                    // Move outward
                    particle.position.x += dirX * particleSpeed;
                    particle.position.z += dirZ * particleSpeed;
                    
                    // Move upward with curve
                    particle.position.y += 0.02 * Math.sin(progress * Math.PI);
                    
                    // Fade out
                    particle.material.opacity = 0.8 * (1 - progress);
                    
                    requestAnimationFrame(animate);
                } else {
                    // Remove particle
                    this.scene.remove(particle);
                    particle.geometry.dispose();
                    particle.material.dispose();
                }
            };
            
            requestAnimationFrame(animate);
        }
    }
    
    // Create ring effect
    createRingEffect(color, scale = 1.0) {
        const ringCount = Math.floor(3 * scale);
        const ringSpacing = 0.2 * scale;
        const ringLifetime = 1000 * scale; // ms
        const ringExpansionRate = 0.05 * scale;
        
        // Create multiple expanding rings
        for (let i = 0; i < ringCount; i++) {
            // Delay each ring
            setTimeout(() => {
                // Create ring geometry and material
                const geometry = new THREE.RingGeometry(0.5, 0.6, 32);
                const material = new THREE.MeshBasicMaterial({
                    color: color,
                    transparent: true,
                    opacity: 0.7,
                    side: THREE.DoubleSide
                });
                
                // Create ring mesh
                const ring = new THREE.Mesh(geometry, material);
                
                // Position at hero's feet
                ring.position.copy(this.position);
                ring.position.y = 0.1;
                
                // Rotate to be horizontal
                ring.rotation.x = Math.PI / 2;
                
                // Add to scene
                this.scene.add(ring);
                
                // Animate ring
                const startTime = performance.now();
                
                const animate = (time) => {
                    const elapsed = time - startTime;
                    const progress = Math.min(1, elapsed / ringLifetime);
                    
                    if (progress < 1) {
                        // Expand ring
                        ring.scale.set(
                            1 + progress * 5 * ringExpansionRate,
                            1 + progress * 5 * ringExpansionRate,
                            1
                        );
                        
                        // Fade out
                        ring.material.opacity = 0.7 * (1 - progress);
                        
                        requestAnimationFrame(animate);
                    } else {
                        // Remove ring
                        this.scene.remove(ring);
                        ring.geometry.dispose();
                        ring.material.dispose();
                    }
                };
                
                requestAnimationFrame(animate);
            }, i * 200); // Stagger the rings
        }
    }
    
    // Create directional particles (up/down)
    createDirectionalParticles(color, scale = 1.0, direction = 'up') {
        const particleCount = Math.floor(10 * scale);
        const particleSize = 0.08 * scale;
        const particleLifetime = 800 * scale; // ms
        const particleSpeed = direction === 'up' ? 0.03 * scale : -0.03 * scale;
        
        // Create particles
        for (let i = 0; i < particleCount; i++) {
            // Create particle geometry and material
            const geometry = new THREE.SphereGeometry(particleSize, 8, 8);
            const material = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.7
            });
            
            // Create particle mesh
            const particle = new THREE.Mesh(geometry, material);
            
            // Position around hero
            const angle = (i / particleCount) * Math.PI * 2;
            const radius = 0.5 * scale;
            particle.position.set(
                this.position.x + Math.cos(angle) * radius,
                this.model.position.y,
                this.position.z + Math.sin(angle) * radius
            );
            
            // Add to scene
            this.scene.add(particle);
            
            // Animate particle
            const startTime = performance.now();
            
            const animate = (time) => {
                const elapsed = time - startTime;
                const progress = Math.min(1, elapsed / particleLifetime);
                
                if (progress < 1) {
                    // Move in direction
                    particle.position.y += particleSpeed;
                    
                    // Slight outward movement
                    particle.position.x += Math.cos(angle) * 0.01;
                    particle.position.z += Math.sin(angle) * 0.01;
                    
                    // Fade out
                    particle.material.opacity = 0.7 * (1 - progress);
                    
                    requestAnimationFrame(animate);
                } else {
                    // Remove particle
                    this.scene.remove(particle);
                    particle.geometry.dispose();
                    particle.material.dispose();
                }
            };
            
            requestAnimationFrame(animate);
        }
    }
    
    // Create visual effect for takeoff
    createTakeoffEffect() {
        // Create a spiral effect around the hero
        const points = [];
        const numPoints = 100;
        const radius = 1;
        const height = 3;
        
        for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * Math.PI * 6; // 3 full rotations
            const x = Math.cos(angle) * radius * (1 - i/numPoints);
            const y = (i / numPoints) * height;
            const z = Math.sin(angle) * radius * (1 - i/numPoints);
            
            points.push(new THREE.Vector3(x, y, z));
        }
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.PointsMaterial({ 
            color: 0x00ffff,
            size: 0.1,
            transparent: true,
            opacity: 0.8
        });
        
        const particles = new THREE.Points(geometry, material);
        particles.position.copy(this.position);
        
        this.scene.add(particles);
        
        // Animate the particles
        const startTime = Date.now();
        const duration = 1000; // 1 second
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                // Rotate and fade
                particles.rotation.y += 0.05;
                particles.material.opacity = 0.8 * (1 - progress);
                
                requestAnimationFrame(animate);
            } else {
                // Remove when animation is complete
                this.scene.remove(particles);
                particles.geometry.dispose();
                particles.material.dispose();
            }
        };
        
        animate();
    }
    
    // Update method called every frame
    update(deltaTime) {
        // Update jumping and flying
        if (this.isJumping && !this.isFlying) {
            // Apply gravity to jump velocity
            this.jumpVelocity -= 20 * deltaTime; // Gravity
            
            // Update jump height
            this.jumpHeight += this.jumpVelocity * deltaTime;
            
            // Check if landed
            if (this.jumpHeight <= 0) {
                this.jumpHeight = 0;
                this.isJumping = false;
                this.jumpVelocity = 0;
                
                // Reset jump count when landing
                this.jumpCount = 0;
                
                // Play landing animation if available
                this.playAnimation('land');
                setTimeout(() => this.playAnimation('idle'), 300);
            }
            
            // Update model height
            if (this.model) {
                this.model.position.y = this.jumpHeight + this.model.geometry.parameters.height / 2;
            }
        }
        
        // Update flying height
        if (this.isFlying) {
            // Smoothly adjust height towards target
            const heightDiff = this.flightTargetHeight - this.flightHeight;
            this.flightHeight += heightDiff * 2 * deltaTime; // Smooth transition
            
            // Update model height
            if (this.model) {
                this.model.position.y = this.flightHeight + this.model.geometry.parameters.height / 2;
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
            } else {
                // Move in the current direction
                const movement = this.moveDirection.clone().multiplyScalar(moveDistance);
                this.position.add(movement);
            }
            
            // Update model position (x and z only, y is handled by jump/flight)
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
    
    // Fly higher (increase flight height)
    flyHigher() {
        if (!this.isFlying) return;
        
        // Increase target height up to a maximum
        const maxHeight = 20;
        this.flightTargetHeight = Math.min(maxHeight, this.flightTargetHeight + 2);
        
        // Create a small boost effect
        this.createFlightBoostEffect(0x00ffff);
        
        // Show message for significant height changes
        if (this.flightTargetHeight >= maxHeight && window.game && window.game.ui) {
            window.game.ui.showMessage("Maximum altitude reached!");
        }
        
        Logger.log(`Hero ${this.name} flying higher: ${this.flightTargetHeight.toFixed(1)}`);
    }
    
    // Fly lower (decrease flight height)
    flyLower() {
        if (!this.isFlying) return;
        
        // Decrease target height down to a minimum
        const minHeight = 1;
        this.flightTargetHeight = Math.max(minHeight, this.flightTargetHeight - 2);
        
        // Create a small descent effect
        this.createFlightBoostEffect(0xff9900);
        
        // Show message when close to ground
        if (this.flightTargetHeight <= minHeight && window.game && window.game.ui) {
            window.game.ui.showMessage("Minimum altitude reached!");
        }
        
        Logger.log(`Hero ${this.name} flying lower: ${this.flightTargetHeight.toFixed(1)}`);
    }
    
    // Create visual effect for flight boost
    createFlightBoostEffect(color) {
        // Create a small particle burst effect
        const particles = [];
        const particleCount = 10;
        const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const particleMaterial = new THREE.MeshBasicMaterial({ color: color, transparent: true });
        
        for (let i = 0; i < particleCount; i++) {
            const particle = new THREE.Mesh(particleGeometry, particleMaterial.clone());
            
            // Position around the hero
            const angle = (i / particleCount) * Math.PI * 2;
            const radius = 0.5;
            particle.position.set(
                this.position.x + Math.cos(angle) * radius,
                this.model.position.y,
                this.position.z + Math.sin(angle) * radius
            );
            
            // Add to scene
            this.scene.add(particle);
            particles.push(particle);
            
            // Animate and remove after a short time
            const startTime = performance.now();
            const duration = 500 + Math.random() * 500; // 0.5-1s duration
            
            const animate = (time) => {
                const elapsed = time - startTime;
                const progress = Math.min(1, elapsed / duration);
                
                // Move outward and upward/downward
                const direction = color === 0x00ffff ? 1 : -1; // Up for blue, down for orange
                particle.position.y += direction * 0.05;
                particle.position.x += Math.cos(angle) * 0.02;
                particle.position.z += Math.sin(angle) * 0.02;
                
                // Fade out
                particle.material.opacity = 1 - progress;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    // Remove particle
                    this.scene.remove(particle);
                    particle.geometry.dispose();
                    particle.material.dispose();
                }
            };
            
            requestAnimationFrame(animate);
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