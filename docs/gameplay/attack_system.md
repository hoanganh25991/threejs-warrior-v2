# Attack System

This document describes the implementation of the basic attack system in the game.

## Overview

The attack system allows heroes to perform basic attacks on enemies by clicking or tapping on them. The system includes auto-attack functionality when holding down the mouse button or touch.

## Core Components

### Enemy Detection

The `checkForEnemyUnderCursor` method in the InputManager detects if an enemy is under the cursor:

```javascript
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
```

### Attack Handling

When a player clicks or taps, the `handleAbilityClick` method checks if an enemy was clicked:

```javascript
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
```

### Auto-Attack

The auto-attack functionality allows the hero to continuously attack an enemy while holding down the mouse button:

```javascript
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

stopAutoAttack() {
    if (this.autoAttackInterval) {
        clearInterval(this.autoAttackInterval);
        this.autoAttackInterval = null;
    }
}
```

### Hero Attack Method

The Hero class has an `attack` method that handles dealing damage to enemies:

```javascript
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
    
    // Create attack effect
    // ...
}
```

### Enemy Damage and Death

When an enemy takes damage, the `takeDamage` method is called:

```javascript
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
```

When an enemy dies, the `die` method is called:

```javascript
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
```

## Visual Feedback

### Attack Animation

When a hero attacks, an attack animation is played:

```javascript
// In the hero model's setupAnimations method
const attackAnimation = {
    name: 'attack',
    duration: 800,
    loop: false,
    update: (progress) => {
        // Ease in and out for smooth animation
        let easedProgress;
        if (progress < 0.5) {
            // Ease in (accelerate)
            easedProgress = 2 * progress * progress;
        } else {
            // Ease out (decelerate)
            easedProgress = -1 + (4 - 2 * progress) * progress;
        }
        
        // Forward motion for first half, return for second half
        const forwardMotion = progress < 0.5 ? easedProgress * 2 : (1 - (progress - 0.5) * 2);
        
        // Weapon swing or thrust animation
        // ...
        
        // Body twist
        // ...
        
        // Facial expression changes
        // ...
    }
};
```

### Damage Numbers

When an enemy takes damage, a damage number is displayed:

```javascript
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
    
    // Create sprite
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ 
        map: texture,
        transparent: true
    });
    const sprite = new THREE.Sprite(material);
    
    // Position above enemy
    sprite.position.copy(this.position);
    sprite.position.y += 2;
    
    // Add to scene
    this.scene.add(sprite);
    
    // Animate and remove
    const startTime = performance.now();
    const duration = 1000; // 1 second
    
    const animate = (time) => {
        const elapsed = time - startTime;
        
        if (elapsed < duration) {
            // Move up
            sprite.position.y += 0.01;
            
            // Fade out
            sprite.material.opacity = 1 - (elapsed / duration);
            
            requestAnimationFrame(animate);
        } else {
            // Remove from scene
            this.scene.remove(sprite);
        }
    };
    
    requestAnimationFrame(animate);
}
```

### Enemy Health Bars

Enemies have health bars that update when they take damage:

```javascript
updateHealthBar() {
    if (!this.healthBar || !this.healthBarBackground) {
        this.createHealthBar();
    }
    
    // Calculate health percentage
    const healthPercent = this.stats.health / this.stats.maxHealth;
    
    // Update health bar scale
    this.healthBar.scale.x = Math.max(0.01, healthPercent);
    
    // Update color based on health percentage
    if (healthPercent > 0.6) {
        this.healthBar.material.color.setHex(0x00ff00); // Green
    } else if (healthPercent > 0.3) {
        this.healthBar.material.color.setHex(0xffff00); // Yellow
    } else {
        this.healthBar.material.color.setHex(0xff0000); // Red
    }
    
    // Position health bar above enemy
    this.healthBarBackground.position.copy(this.position);
    this.healthBarBackground.position.y += 2.2;
    this.healthBar.position.copy(this.healthBarBackground.position);
}
```

## Future Improvements

Potential improvements for the attack system:

1. **Critical Hits**: Implement a chance for attacks to deal critical damage.
2. **Attack Types**: Add different attack types (melee, ranged, magic) with different effects.
3. **Combo System**: Allow players to perform combo attacks by clicking in specific patterns.
4. **Dodge/Block**: Implement enemy dodge or block mechanics.
5. **Area Attacks**: Add attacks that can hit multiple enemies.
6. **Attack Speed Scaling**: Make attack speed scale with hero stats.
7. **Visual Effects**: Add more detailed visual effects for different attack types.