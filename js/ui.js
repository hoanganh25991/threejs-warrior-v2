/**
 * UI manager for the game
 */

class UIManager {
    constructor() {
        // UI elements
        this.loadingScreen = document.getElementById('loading-screen');
        this.loadingBar = document.getElementById('loading-bar');
        this.loadingText = document.getElementById('loading-text');
        this.heroSelection = document.getElementById('hero-selection');
        this.gameUI = document.getElementById('game-ui');
        this.healthBar = document.getElementById('health-bar');
        this.healthText = document.getElementById('health-text');
        this.manaBar = document.getElementById('mana-bar');
        this.manaText = document.getElementById('mana-text');
        this.abilitiesContainer = document.getElementById('abilities-container');
        this.playerPortrait = document.getElementById('player-portrait');
        this.levelText = document.getElementById('level-text');
        this.xpBar = document.getElementById('xp-bar');
        this.messageContainer = document.getElementById('message-container');
        this.jumpAbility = document.getElementById('jump-ability');
        
        // Message queue for skill announcements
        this.messageQueue = [];
        this.isProcessingMessages = false;
        
        // Bind event listeners
        this.bindEvents();
        
        Logger.log('UI manager initialized');
    }
    
    bindEvents() {
        // Hero selection buttons
        const heroButtons = document.querySelectorAll('.select-hero-btn');
        heroButtons.forEach(button => {
            button.addEventListener('click', () => {
                const heroType = button.getAttribute('data-hero');
                this.handleHeroSelection(heroType);
            });
        });
        
        // Special ability buttons
        if (this.jumpAbility) {
            // Get controls configuration
            const controlsConfig = window.configLoader?.getConfig('controlsConfig') || {
                touch: { 
                    longPressThreshold: 300,
                    longPressInterval: 100
                }
            };
            
            // Track long press state
            let longPressTimer = null;
            let isLongPress = false;
            let jumpCount = 0;
            
            // Handle click/tap
            this.jumpAbility.addEventListener('click', (event) => {
                // Prevent default to avoid double triggering
                event.preventDefault();
                
                // Only handle if not a long press
                if (!isLongPress && window.game && window.game.hero) {
                    window.game.hero.jump();
                }
                
                // Reset long press state
                isLongPress = false;
            });
            
            // Handle mousedown/touchstart for hold-to-jump
            this.jumpAbility.addEventListener('mousedown', startHoldJump);
            this.jumpAbility.addEventListener('touchstart', startHoldJump);
            
            // Handle mouseup/touchend to end hold-to-jump
            this.jumpAbility.addEventListener('mouseup', endHoldJump);
            this.jumpAbility.addEventListener('touchend', endHoldJump);
            this.jumpAbility.addEventListener('mouseleave', endHoldJump);
            this.jumpAbility.addEventListener('touchcancel', endHoldJump);
            
            // Start hold-to-jump
            function startHoldJump() {
                // Clear any existing timer
                if (longPressTimer) {
                    clearTimeout(longPressTimer);
                }
                
                // First trigger a normal jump if not already jumping
                if (window.game && window.game.hero && !window.game.hero.isJumping) {
                    window.game.hero.jump();
                }
                
                // Set flag to track if we're handling a long press
                isLongPress = false;
                
                // Start timer for hold-to-jump
                longPressTimer = setTimeout(() => {
                    isLongPress = true;
                    
                    // Start hold-to-jump
                    if (window.game && window.game.hero) {
                        window.game.hero.startHoldJump();
                        
                        // Add visual feedback
                        this.jumpAbility.classList.add('active');
                    }
                }, controlsConfig.touch.longPressThreshold);
            }
            
            // End hold-to-jump
            function endHoldJump() {
                // Clear timer
                if (longPressTimer) {
                    clearTimeout(longPressTimer);
                    longPressTimer = null;
                }
                
                // Stop hold-to-jump if it was active
                if (isLongPress && window.game && window.game.hero) {
                    window.game.hero.stopHoldJump();
                    
                    // Remove visual feedback
                    this.jumpAbility.classList.remove('active');
                }
                
                // Reset long press state after a short delay
                setTimeout(() => {
                    isLongPress = false;
                }, 50);
            }
        }
        
        // Add event listener for wing visibility changes
        Events.on('wingsVisibilityChanged', (data) => {
            const wingsElement = document.querySelector('.wings-container');
            if (wingsElement) {
                if (data.visible) {
                    wingsElement.classList.add('visible');
                } else {
                    wingsElement.classList.remove('visible');
                }
            }
        });
        
        // Game events
        Events.on('damageTaken', this.updateHealthBar.bind(this));
        Events.on('heroHealed', this.updateHealthBar.bind(this));
        Events.on('manaUsed', this.updateManaBar.bind(this));
        Events.on('manaRestored', this.updateManaBar.bind(this));
        Events.on('abilityUsed', this.updateAbilityCooldown.bind(this));
        Events.on('abilityCooldownComplete', this.resetAbilityCooldown.bind(this));
        Events.on('experienceGained', this.updateExperience.bind(this));
        Events.on('levelUp', this.updateLevel.bind(this));
    }
    
    showLoadingScreen() {
        this.loadingScreen.classList.remove('hidden');
        this.heroSelection.classList.add('hidden');
        this.gameUI.classList.add('hidden');
    }
    
    updateLoadingProgress(progress) {
        const percent = Math.floor(progress * 100);
        this.loadingBar.style.width = `${percent}%`;
        this.loadingText.textContent = `Loading... ${percent}%`;
    }
    
    hideLoadingScreen() {
        this.loadingScreen.classList.add('hidden');
    }
    
    showHeroSelection() {
        this.heroSelection.classList.remove('hidden');
        this.loadingScreen.classList.add('hidden');
        this.gameUI.classList.add('hidden');
    }
    
    handleHeroSelection(heroType) {
        // Hide hero selection screen
        this.heroSelection.classList.add('hidden');
        
        // Show loading screen while hero is being loaded
        this.showLoadingScreen();
        
        // Emit hero selected event
        Events.emit('heroSelected', { heroType });
    }
    
    showGameUI() {
        this.gameUI.classList.remove('hidden');
        this.loadingScreen.classList.add('hidden');
        this.heroSelection.classList.add('hidden');
        
        // Update player portrait if hero exists
        if (window.game && window.game.hero) {
            this.updatePlayerPortrait(window.game.hero.type);
        }
    }
    
    updatePlayerPortrait(heroType) {
        if (!this.playerPortrait) return;
        
        // Set background color based on hero type
        switch (heroType) {
            case 'axe':
                this.playerPortrait.style.backgroundColor = '#a83232';
                break;
            case 'crystal-maiden':
                this.playerPortrait.style.backgroundColor = '#32a8a8';
                break;
            case 'lich':
                this.playerPortrait.style.backgroundColor = '#3232a8';
                break;
            case 'storm-spirit':
                this.playerPortrait.style.backgroundColor = '#32a832';
                break;
            default:
                this.playerPortrait.style.backgroundColor = '#666666';
        }
    }
    
    updateExperience(data) {
        if (!this.xpBar) return;
        
        const { currentXP, requiredXP } = data;
        const percentage = Math.min(100, (currentXP / requiredXP) * 100);
        
        this.xpBar.style.width = `${percentage}%`;
    }
    
    updateLevel(data) {
        if (!this.levelText) return;
        
        const { level } = data;
        this.levelText.textContent = `Level ${level}`;
        
        // Show level up message
        this.showMessage(`Level Up! You are now level ${level}`);
    }
    
    showMessage(text, duration = 2000) {
        // Add message to queue
        this.messageQueue.push({ text, duration });
        
        // Process queue if not already processing
        if (!this.isProcessingMessages) {
            this.processMessageQueue();
        }
    }
    
    processMessageQueue() {
        if (this.messageQueue.length === 0) {
            this.isProcessingMessages = false;
            return;
        }
        
        this.isProcessingMessages = true;
        const { text, duration } = this.messageQueue.shift();
        
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.textContent = text;
        
        // Add to container
        this.messageContainer.appendChild(messageElement);
        
        // Remove after duration
        setTimeout(() => {
            if (messageElement.parentNode === this.messageContainer) {
                this.messageContainer.removeChild(messageElement);
            }
            
            // Process next message
            setTimeout(() => this.processMessageQueue(), 100);
        }, duration);
    }
    
    updateHealthBar(data) {
        if (!window.game || !window.game.hero) return;
        
        const hero = window.game.hero;
        const healthPercent = (hero.stats.health / hero.stats.maxHealth) * 100;
        
        this.healthBar.style.width = `${healthPercent}%`;
        this.healthText.textContent = `${hero.stats.health}/${hero.stats.maxHealth}`;
    }
    
    updateManaBar(data) {
        if (!window.game || !window.game.hero) return;
        
        const hero = window.game.hero;
        const manaPercent = (hero.stats.mana / hero.stats.maxMana) * 100;
        
        this.manaBar.style.width = `${manaPercent}%`;
        this.manaText.textContent = `${hero.stats.mana}/${hero.stats.maxMana}`;
    }
    
    updateAbilityCooldown(data) {
        const { ability } = data;
        
        // Find the ability element
        const abilityElement = document.getElementById(`ability-${ability.key}`);
        if (!abilityElement) return;
        
        // Add cooldown overlay
        let cooldownOverlay = abilityElement.querySelector('.cooldown-overlay');
        if (!cooldownOverlay) {
            cooldownOverlay = document.createElement('div');
            cooldownOverlay.className = 'cooldown-overlay';
            abilityElement.appendChild(cooldownOverlay);
        }
        
        // Set initial height to 100%
        cooldownOverlay.style.height = '100%';
        
        // Start cooldown animation
        this.animateCooldown(ability, cooldownOverlay);
    }
    
    animateCooldown(ability, overlay) {
        const startTime = performance.now();
        const duration = ability.cooldownMax * 1000; // Convert to milliseconds
        
        const updateCooldown = (currentTime) => {
            const elapsed = currentTime - startTime;
            const remaining = Math.max(0, duration - elapsed);
            const percent = (remaining / duration) * 100;
            
            overlay.style.height = `${percent}%`;
            
            if (remaining > 0) {
                requestAnimationFrame(updateCooldown);
            } else {
                // Cooldown complete
                overlay.remove();
            }
        };
        
        requestAnimationFrame(updateCooldown);
    }
    
    resetAbilityCooldown(data) {
        const { ability } = data;
        
        // Find the ability element
        const abilityElement = document.getElementById(`ability-${ability.key}`);
        if (!abilityElement) return;
        
        // Remove cooldown overlay
        const cooldownOverlay = abilityElement.querySelector('.cooldown-overlay');
        if (cooldownOverlay) {
            cooldownOverlay.remove();
        }
    }
    
    showMessage(message, duration = 3000) {
        // Create message element if it doesn't exist
        let messageContainer = document.getElementById('message-container');
        if (!messageContainer) {
            messageContainer = document.createElement('div');
            messageContainer.id = 'message-container';
            messageContainer.style.position = 'absolute';
            messageContainer.style.top = '20px';
            messageContainer.style.left = '50%';
            messageContainer.style.transform = 'translateX(-50%)';
            messageContainer.style.zIndex = '100';
            document.body.appendChild(messageContainer);
        }
        
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = 'game-message';
        messageElement.textContent = message;
        messageElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        messageElement.style.color = 'white';
        messageElement.style.padding = '10px 20px';
        messageElement.style.borderRadius = '5px';
        messageElement.style.marginBottom = '10px';
        messageElement.style.transition = 'opacity 0.3s ease';
        
        // Add to container
        messageContainer.appendChild(messageElement);
        
        // Remove after duration
        setTimeout(() => {
            messageElement.style.opacity = '0';
            setTimeout(() => {
                messageElement.remove();
            }, 300);
        }, duration);
    }
    
    showGameOver() {
        // Create game over screen
        const gameOverScreen = document.createElement('div');
        gameOverScreen.id = 'game-over-screen';
        gameOverScreen.style.position = 'absolute';
        gameOverScreen.style.top = '0';
        gameOverScreen.style.left = '0';
        gameOverScreen.style.width = '100%';
        gameOverScreen.style.height = '100%';
        gameOverScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        gameOverScreen.style.display = 'flex';
        gameOverScreen.style.flexDirection = 'column';
        gameOverScreen.style.justifyContent = 'center';
        gameOverScreen.style.alignItems = 'center';
        gameOverScreen.style.zIndex = '1000';
        
        // Game over text
        const gameOverText = document.createElement('h1');
        gameOverText.textContent = 'Game Over';
        gameOverText.style.color = 'red';
        gameOverText.style.fontSize = '4rem';
        gameOverText.style.marginBottom = '2rem';
        
        // Restart button
        const restartButton = document.createElement('button');
        restartButton.textContent = 'Restart Game';
        restartButton.style.padding = '1rem 2rem';
        restartButton.style.fontSize = '1.5rem';
        restartButton.style.backgroundColor = '#f8d000';
        restartButton.style.color = 'black';
        restartButton.style.border = 'none';
        restartButton.style.borderRadius = '5px';
        restartButton.style.cursor = 'pointer';
        
        restartButton.addEventListener('click', () => {
            // Reload the page to restart
            window.location.reload();
        });
        
        // Add elements to game over screen
        gameOverScreen.appendChild(gameOverText);
        gameOverScreen.appendChild(restartButton);
        
        // Add to document
        document.body.appendChild(gameOverScreen);
    }
    
    showVictory() {
        // Create victory screen
        const victoryScreen = document.createElement('div');
        victoryScreen.id = 'victory-screen';
        victoryScreen.style.position = 'absolute';
        victoryScreen.style.top = '0';
        victoryScreen.style.left = '0';
        victoryScreen.style.width = '100%';
        victoryScreen.style.height = '100%';
        victoryScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        victoryScreen.style.display = 'flex';
        victoryScreen.style.flexDirection = 'column';
        victoryScreen.style.justifyContent = 'center';
        victoryScreen.style.alignItems = 'center';
        victoryScreen.style.zIndex = '1000';
        
        // Victory text
        const victoryText = document.createElement('h1');
        victoryText.textContent = 'Victory!';
        victoryText.style.color = '#f8d000';
        victoryText.style.fontSize = '4rem';
        victoryText.style.marginBottom = '2rem';
        
        // Continue button
        const continueButton = document.createElement('button');
        continueButton.textContent = 'Continue';
        continueButton.style.padding = '1rem 2rem';
        continueButton.style.fontSize = '1.5rem';
        continueButton.style.backgroundColor = '#f8d000';
        continueButton.style.color = 'black';
        continueButton.style.border = 'none';
        continueButton.style.borderRadius = '5px';
        continueButton.style.cursor = 'pointer';
        
        continueButton.addEventListener('click', () => {
            // Hide victory screen
            victoryScreen.remove();
            
            // Continue game
            if (window.game) {
                window.game.continueGame();
            }
        });
        
        // Add elements to victory screen
        victoryScreen.appendChild(victoryText);
        victoryScreen.appendChild(continueButton);
        
        // Add to document
        document.body.appendChild(victoryScreen);
    }
    
    updateAbilityIcons(hero) {
        // Update ability icons based on hero type
        if (!hero) return;
        
        // Get ability elements
        const ability1 = document.getElementById('ability-1');
        const ability2 = document.getElementById('ability-2');
        const ability3 = document.getElementById('ability-3');
        const ability4 = document.getElementById('ability-4');
        const ability5 = document.getElementById('ability-5');
        const ability6 = document.getElementById('ability-6');
        
        // Set ability icons based on hero type
        switch (hero.type) {
            case 'axe':
                // Set tooltips for abilities
                ability1.title = 'Berserker\'s Call';
                ability2.title = 'Battle Hunger';
                ability3.title = 'Counter Helix (Passive)';
                ability4.title = 'Culling Blade (Ultimate)';
                ability5.title = 'War Cry';
                ability6.title = 'Taunt';
                
                // Set colors for abilities
                ability1.style.borderColor = '#cc3333';
                ability2.style.borderColor = '#cc3333';
                ability3.style.borderColor = '#cc3333';
                ability4.style.borderColor = '#ff0000';
                ability5.style.borderColor = '#cc3333';
                ability6.style.borderColor = '#cc3333';
                break;
                
            case 'crystal-maiden':
                ability1.title = 'Crystal Nova';
                ability2.title = 'Frostbite';
                ability3.title = 'Brilliance Aura (Passive)';
                ability4.title = 'Freezing Field (Ultimate)';
                ability5.title = 'Frost Armor';
                ability6.title = 'Cold Snap';
                
                // Set colors for abilities
                ability1.style.borderColor = '#33ccff';
                ability2.style.borderColor = '#33ccff';
                ability3.style.borderColor = '#33ccff';
                ability4.style.borderColor = '#0088ff';
                ability5.style.borderColor = '#33ccff';
                ability6.style.borderColor = '#33ccff';
                break;
                
            case 'lich':
                ability1.title = 'Frost Nova';
                ability2.title = 'Frost Armor';
                ability3.title = 'Dark Ritual';
                ability4.title = 'Chain Frost (Ultimate)';
                ability5.title = 'Frost Blast';
                ability6.title = 'Ice Barrier';
                
                // Set colors for abilities
                ability1.style.borderColor = '#3333cc';
                ability2.style.borderColor = '#3333cc';
                ability3.style.borderColor = '#3333cc';
                ability4.style.borderColor = '#0000ff';
                ability5.style.borderColor = '#3333cc';
                ability6.style.borderColor = '#3333cc';
                break;
                
            case 'storm-spirit':
                ability1.title = 'Static Remnant';
                ability2.title = 'Electric Vortex';
                ability3.title = 'Overload (Passive)';
                ability4.title = 'Ball Lightning (Ultimate)';
                ability5.title = 'Electric Surge';
                ability6.title = 'Storm Gust';
                
                // Set colors for abilities
                ability1.style.borderColor = '#33cc33';
                ability2.style.borderColor = '#33cc33';
                ability3.style.borderColor = '#33cc33';
                ability4.style.borderColor = '#00ff00';
                ability5.style.borderColor = '#33cc33';
                ability6.style.borderColor = '#33cc33';
                break;
        }
        
        // Add ability icons (placeholder)
        this.addAbilityIcons(hero);
    }
    
    addAbilityIcons(hero) {
        // Add small icon images to abilities
        if (!hero) return;
        
        // Get ability elements
        const abilities = [
            document.getElementById('ability-1'),
            document.getElementById('ability-2'),
            document.getElementById('ability-3'),
            document.getElementById('ability-4'),
            document.getElementById('ability-5'),
            document.getElementById('ability-6')
        ];
        
        // Add background color based on hero type
        let color;
        switch (hero.type) {
            case 'axe':
                color = '#a83232';
                break;
            case 'crystal-maiden':
                color = '#32a8a8';
                break;
            case 'lich':
                color = '#3232a8';
                break;
            case 'storm-spirit':
                color = '#32a832';
                break;
            default:
                color = '#666666';
        }
        
        // Apply background color to abilities
        abilities.forEach(ability => {
            if (ability) {
                ability.style.backgroundColor = color;
                ability.style.color = 'white';
                ability.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.8)';
                ability.style.fontWeight = 'bold';
            }
        });
    }
}