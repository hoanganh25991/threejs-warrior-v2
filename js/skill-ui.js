/**
 * Skill UI and Joystick Manager
 * 
 * This file handles the circular skill UI and joystick functionality
 * inspired by Diablo Immortal
 */

class SkillUIManager {
    constructor() {
        // Skill UI elements
        this.skillCircleContainer = document.getElementById('skill-circle-container');
        this.basicAttack = document.getElementById('basic-attack');
        this.skill1 = document.getElementById('skill-1');
        this.skill2 = document.getElementById('skill-2');
        this.skill3 = document.getElementById('skill-3');
        this.skill4 = document.getElementById('skill-4');
        this.wingsContainer = document.querySelector('.wings-container');
        
        // Joystick elements
        this.joystickContainer = document.getElementById('joystick-container');
        this.joystickBase = document.getElementById('joystick-base');
        this.joystickThumb = document.getElementById('joystick-thumb');
        
        // Joystick state
        this.joystickActive = false;
        this.joystickPosition = { x: 0, y: 0 };
        this.joystickDirection = { x: 0, y: 0 };
        
        // Cooldown tracking
        this.cooldowns = {
            'basic-attack': 0,
            'skill-1': 0,
            'skill-2': 0,
            'skill-3': 0,
            'skill-4': 0
        };
        
        // Bind event listeners
        this.bindEvents();
        
        Logger.log('Skill UI Manager initialized');
    }
    
    bindEvents() {
        // Basic attack
        if (this.basicAttack) {
            this.basicAttack.addEventListener('click', this.handleBasicAttack.bind(this));
            // Add touch events for mobile
            this.basicAttack.addEventListener('touchstart', (e) => {
                e.preventDefault(); // Prevent default to avoid double triggering
                this.handleBasicAttack();
            });
        }
        
        // Skills
        if (this.skill1) {
            this.skill1.addEventListener('click', () => this.handleSkillActivation(1));
            this.skill1.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleSkillActivation(1);
            });
        }
        if (this.skill2) {
            this.skill2.addEventListener('click', () => this.handleSkillActivation(2));
            this.skill2.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleSkillActivation(2);
            });
        }
        if (this.skill3) {
            this.skill3.addEventListener('click', () => this.handleSkillActivation(3));
            this.skill3.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleSkillActivation(3);
            });
        }
        if (this.skill4) {
            this.skill4.addEventListener('click', () => this.handleSkillActivation(4));
            this.skill4.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleSkillActivation(4);
            });
        }
        
        // Joystick events
        if (this.joystickContainer) {
            // Mouse events
            this.joystickContainer.addEventListener('mousedown', this.startJoystick.bind(this));
            document.addEventListener('mousemove', this.moveJoystick.bind(this));
            document.addEventListener('mouseup', this.stopJoystick.bind(this));
            
            // Touch events
            this.joystickContainer.addEventListener('touchstart', this.startJoystick.bind(this));
            document.addEventListener('touchmove', this.moveJoystick.bind(this));
            document.addEventListener('touchend', this.stopJoystick.bind(this));
            document.addEventListener('touchcancel', this.stopJoystick.bind(this));
        }
        
        // Game events
        Events.on('heroSelected', this.updateHeroClass.bind(this));
        Events.on('abilityUsed', this.startCooldown.bind(this));
        Events.on('abilityCooldownComplete', this.endCooldown.bind(this));
        Events.on('flightStateChanged', this.updateWingsVisibility.bind(this));
    }
    
    handleBasicAttack() {
        // Check if on cooldown
        if (this.cooldowns['basic-attack'] > 0) return;
        
        // Get the player hero
        const hero = window.game.hero;
        if (!hero) return;
        
        // Find nearest enemy to attack
        const nearestEnemy = this.findNearestEnemy();
        if (nearestEnemy) {
            // Attack the enemy
            hero.attack(nearestEnemy);
            
            // Start cooldown
            this.startCooldown({ 
                abilityId: 'basic-attack', 
                cooldownTime: 1 / hero.stats.attackSpeed 
            });
            
            Logger.log(`Basic attack used on ${nearestEnemy.name}`);
        } else {
            Logger.log('No enemies in range for basic attack');
        }
    }
    
    handleSkillActivation(skillNumber) {
        // Check if on cooldown
        if (this.cooldowns[`skill-${skillNumber}`] > 0) return;
        
        // Map skill number to ability key
        const abilityKey = String(skillNumber);
        
        // Emit ability activation event
        Events.emit('abilityActivated', { ability: abilityKey });
        
        Logger.log(`Skill ${skillNumber} activated`);
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
    
    startCooldown(data) {
        const { abilityId, cooldownTime } = data;
        
        // Map ability ID to UI element ID
        let uiElementId;
        
        if (abilityId === 'basic-attack') {
            uiElementId = 'basic-attack';
        } else {
            // Convert ability key (1-4) to skill-N format
            uiElementId = `skill-${abilityId}`;
        }
        
        // Set cooldown time
        this.cooldowns[uiElementId] = cooldownTime;
        
        // Create cooldown overlay
        const skillElement = document.getElementById(uiElementId);
        if (!skillElement) return;
        
        // Remove any existing cooldown overlay
        const existingOverlay = skillElement.querySelector('.cooldown-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        
        // Create new cooldown overlay
        const overlay = document.createElement('div');
        overlay.className = 'cooldown-overlay';
        skillElement.appendChild(overlay);
        
        // Start cooldown animation
        this.animateCooldown(uiElementId, cooldownTime);
    }
    
    animateCooldown(elementId, duration) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const overlay = element.querySelector('.cooldown-overlay');
        if (!overlay) return;
        
        // Create or update cooldown text element
        let cooldownText = overlay.querySelector('.cooldown-text');
        if (!cooldownText) {
            cooldownText = document.createElement('div');
            cooldownText.className = 'cooldown-text';
            overlay.appendChild(cooldownText);
        }
        
        const startTime = performance.now();
        const endTime = startTime + (duration * 1000);
        
        const updateCooldown = (currentTime) => {
            if (currentTime >= endTime) {
                // Cooldown complete
                overlay.remove();
                this.cooldowns[elementId] = 0;
                
                // Emit cooldown complete event
                Events.emit('abilityCooldownComplete', { abilityId: elementId });
                return;
            }
            
            // Calculate remaining percentage and time
            const elapsed = currentTime - startTime;
            const remainingTime = duration - (elapsed / 1000);
            const remaining = 1 - (elapsed / (duration * 1000));
            
            // Update cooldown display with pie animation
            overlay.style.clipPath = `polygon(50% 50%, 50% 0%, ${this.getClipPathCoordinates(remaining)})`;
            
            // Update cooldown text
            cooldownText.textContent = remainingTime.toFixed(1);
            
            // Update cooldown time in tracking object
            this.cooldowns[elementId] = remainingTime;
            
            // Continue animation
            requestAnimationFrame(updateCooldown);
        };
        
        requestAnimationFrame(updateCooldown);
    }
    
    getClipPathCoordinates(percentage) {
        // Convert percentage to angle (0% = 0deg, 100% = 360deg)
        const angle = percentage * 360;
        
        // Calculate which quadrant the angle is in
        if (angle <= 90) {
            // First quadrant
            const radians = (angle * Math.PI) / 180;
            const x = 50 + 50 * Math.sin(radians);
            return `${x}% 0%`;
        } else if (angle <= 180) {
            // Second quadrant
            const radians = ((angle - 90) * Math.PI) / 180;
            const y = 50 * Math.sin(radians);
            return `100% ${y}%`;
        } else if (angle <= 270) {
            // Third quadrant
            const radians = ((angle - 180) * Math.PI) / 180;
            const x = 50 - 50 * Math.sin(radians);
            return `${x}% 100%`;
        } else {
            // Fourth quadrant
            const radians = ((angle - 270) * Math.PI) / 180;
            const y = 100 - 50 * Math.sin(radians);
            return `0% ${y}%`;
        }
    }
    
    endCooldown(data) {
        const { abilityId } = data;
        
        // Map ability ID to UI element ID
        let uiElementId;
        
        if (abilityId === 'basic-attack') {
            uiElementId = 'basic-attack';
        } else {
            // Convert ability key (1-4) to skill-N format
            uiElementId = `skill-${abilityId}`;
        }
        
        // Reset cooldown
        this.cooldowns[uiElementId] = 0;
        
        // Remove cooldown overlay
        const skillElement = document.getElementById(uiElementId);
        if (!skillElement) return;
        
        const overlay = skillElement.querySelector('.cooldown-overlay');
        if (overlay) {
            overlay.remove();
        }
    }
    
    updateHeroClass(data) {
        const { heroType } = data;
        
        // Remove any existing hero class
        if (this.skillCircleContainer) {
            this.skillCircleContainer.className = 'skill-circle-container';
            
            // Add hero-specific class
            this.skillCircleContainer.classList.add(`hero-${heroType}`);
        }
        
        // Update skill icons based on hero type
        this.updateSkillIcons(heroType);
    }
    
    updateSkillIcons(heroType) {
        // Get hero abilities from config
        const hero = window.game.hero;
        if (!hero) return;
        
        // Update basic attack text
        if (this.basicAttack) {
            this.basicAttack.textContent = 'A';
            this.basicAttack.setAttribute('data-tooltip', 'Basic Attack');
            
            // Add key hint
            this.addKeyHint(this.basicAttack, 'a');
        }
        
        // Update skill icons with ability names
        if (this.skill1 && hero.abilities['1']) {
            const abilityName = hero.abilities['1'].name;
            const firstChar = abilityName.charAt(0);
            this.skill1.textContent = firstChar;
            this.skill1.setAttribute('data-tooltip', abilityName);
            
            // Add key hint
            this.addKeyHint(this.skill1, '1');
        }
        
        if (this.skill2 && hero.abilities['2']) {
            const abilityName = hero.abilities['2'].name;
            const firstChar = abilityName.charAt(0);
            this.skill2.textContent = firstChar;
            this.skill2.setAttribute('data-tooltip', abilityName);
            
            // Add key hint
            this.addKeyHint(this.skill2, '2');
        }
        
        if (this.skill3 && hero.abilities['3']) {
            const abilityName = hero.abilities['3'].name;
            const firstChar = abilityName.charAt(0);
            this.skill3.textContent = firstChar;
            this.skill3.setAttribute('data-tooltip', abilityName);
            
            // Add key hint
            this.addKeyHint(this.skill3, '3');
        }
        
        if (this.skill4 && hero.abilities['4']) {
            const abilityName = hero.abilities['4'].name;
            const firstChar = abilityName.charAt(0);
            this.skill4.textContent = firstChar;
            this.skill4.setAttribute('data-tooltip', abilityName);
            
            // Add key hint
            this.addKeyHint(this.skill4, '4');
        }
    }
    
    addKeyHint(element, key) {
        // Remove any existing key hint
        const existingHint = element.querySelector('.key-hint');
        if (existingHint) {
            existingHint.remove();
        }
        
        // Create key hint element
        const keyHint = document.createElement('div');
        keyHint.className = 'key-hint';
        keyHint.textContent = key;
        element.appendChild(keyHint);
    }
    
    updateWingsVisibility(data) {
        const { isFlying } = data;
        
        if (this.skillCircleContainer) {
            if (isFlying) {
                this.skillCircleContainer.classList.add('flying');
            } else {
                this.skillCircleContainer.classList.remove('flying');
            }
        }
    }
    
    // Joystick methods
    startJoystick(event) {
        event.preventDefault();
        
        this.joystickActive = true;
        
        // Get joystick container dimensions and position
        const containerRect = this.joystickContainer.getBoundingClientRect();
        const containerCenterX = containerRect.left + containerRect.width / 2;
        const containerCenterY = containerRect.top + containerRect.height / 2;
        
        // Position the base at the center of the container
        this.joystickBase.style.left = '50%';
        this.joystickBase.style.top = '50%';
        this.joystickBase.style.transform = 'translate(-50%, -50%)';
        
        // Get initial touch/mouse position
        const clientX = event.clientX || (event.touches && event.touches[0].clientX);
        const clientY = event.clientY || (event.touches && event.touches[0].clientY);
        
        // Position the thumb at the touch/mouse position relative to the container
        const thumbX = clientX - containerRect.left;
        const thumbY = clientY - containerRect.top;
        
        this.positionJoystickThumb(thumbX, thumbY);
        this.calculateJoystickDirection(thumbX, thumbY);
    }
    
    moveJoystick(event) {
        if (!this.joystickActive) return;
        
        event.preventDefault();
        
        // Get joystick container dimensions and position
        const containerRect = this.joystickContainer.getBoundingClientRect();
        
        // Get current touch/mouse position
        const clientX = event.clientX || (event.touches && event.touches[0].clientX);
        const clientY = event.clientY || (event.touches && event.touches[0].clientY);
        
        // Calculate position relative to the container
        const thumbX = clientX - containerRect.left;
        const thumbY = clientY - containerRect.top;
        
        this.positionJoystickThumb(thumbX, thumbY);
        this.calculateJoystickDirection(thumbX, thumbY);
    }
    
    stopJoystick(event) {
        if (!this.joystickActive) return;
        
        this.joystickActive = false;
        
        // Reset thumb position to center
        this.joystickThumb.style.left = '50%';
        this.joystickThumb.style.top = '50%';
        this.joystickThumb.style.transform = 'translate(-50%, -50%)';
        
        // Reset direction
        this.joystickDirection = { x: 0, y: 0 };
        
        // Stop hero movement
        if (window.game && window.game.hero) {
            window.game.hero.stopMovement();
        }
    }
    
    positionJoystickThumb(x, y) {
        // Get container dimensions
        const containerWidth = this.joystickContainer.offsetWidth;
        const containerHeight = this.joystickContainer.offsetHeight;
        
        // Calculate center of container
        const centerX = containerWidth / 2;
        const centerY = containerHeight / 2;
        
        // Calculate distance from center
        const deltaX = x - centerX;
        const deltaY = y - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Limit distance to container radius
        const maxDistance = containerWidth / 2 - this.joystickThumb.offsetWidth / 2;
        const limitedDistance = Math.min(distance, maxDistance);
        
        // Calculate limited position
        let limitedX, limitedY;
        
        if (distance > 0) {
            const ratio = limitedDistance / distance;
            limitedX = centerX + deltaX * ratio;
            limitedY = centerY + deltaY * ratio;
        } else {
            limitedX = centerX;
            limitedY = centerY;
        }
        
        // Position the thumb
        this.joystickThumb.style.left = `${limitedX}px`;
        this.joystickThumb.style.top = `${limitedY}px`;
        this.joystickThumb.style.transform = 'translate(-50%, -50%)';
        
        // Store position
        this.joystickPosition = { x: limitedX, y: limitedY };
    }
    
    calculateJoystickDirection(x, y) {
        // Get container dimensions
        const containerWidth = this.joystickContainer.offsetWidth;
        const containerHeight = this.joystickContainer.offsetHeight;
        
        // Calculate center of container
        const centerX = containerWidth / 2;
        const centerY = containerHeight / 2;
        
        // Calculate direction vector (normalized)
        const deltaX = x - centerX;
        const deltaY = y - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance > 0) {
            // Normalize direction vector
            this.joystickDirection = {
                x: deltaX / distance,
                y: deltaY / distance
            };
            
            // Move hero in this direction
            if (window.game && window.game.hero) {
                // Convert screen coordinates to world coordinates
                // In a 3D isometric game, we need to map screen x,y to world x,z
                const worldDirection = new THREE.Vector3(
                    this.joystickDirection.x,
                    0,
                    this.joystickDirection.y
                );
                
                // Apply camera rotation to get correct world direction
                if (window.game.camera) {
                    const cameraRotation = window.game.camera.rotation.y;
                    const rotatedX = worldDirection.x * Math.cos(cameraRotation) - worldDirection.z * Math.sin(cameraRotation);
                    const rotatedZ = worldDirection.x * Math.sin(cameraRotation) + worldDirection.z * Math.cos(cameraRotation);
                    worldDirection.x = rotatedX;
                    worldDirection.z = rotatedZ;
                }
                
                // Move hero in this direction
                window.game.hero.moveInDirection(worldDirection);
            }
        } else {
            this.joystickDirection = { x: 0, y: 0 };
        }
    }
    
    update(deltaTime) {
        // Update cooldowns
        for (const [elementId, cooldownTime] of Object.entries(this.cooldowns)) {
            if (cooldownTime > 0) {
                this.cooldowns[elementId] = Math.max(0, cooldownTime - deltaTime);
                
                if (this.cooldowns[elementId] === 0) {
                    // Cooldown complete
                    this.endCooldown({ abilityId: elementId });
                }
            }
        }
    }
}

// Create global instance
window.skillUIManager = new SkillUIManager();