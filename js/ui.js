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
        
        // Game events
        Events.on('damageTaken', this.updateHealthBar.bind(this));
        Events.on('heroHealed', this.updateHealthBar.bind(this));
        Events.on('manaUsed', this.updateManaBar.bind(this));
        Events.on('manaRestored', this.updateManaBar.bind(this));
        Events.on('abilityUsed', this.updateAbilityCooldown.bind(this));
        Events.on('abilityCooldownComplete', this.resetAbilityCooldown.bind(this));
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
        const abilityQ = document.getElementById('ability-q');
        const abilityW = document.getElementById('ability-w');
        const abilityE = document.getElementById('ability-e');
        const abilityR = document.getElementById('ability-r');
        
        // Set ability icons based on hero type
        switch (hero.type) {
            case 'axe':
                abilityQ.textContent = 'Q';
                abilityQ.title = 'Berserker\'s Call';
                abilityW.textContent = 'W';
                abilityW.title = 'Battle Hunger';
                abilityE.textContent = 'E';
                abilityE.title = 'Counter Helix';
                abilityR.textContent = 'R';
                abilityR.title = 'Culling Blade';
                break;
            case 'crystal-maiden':
                abilityQ.textContent = 'Q';
                abilityQ.title = 'Crystal Nova';
                abilityW.textContent = 'W';
                abilityW.title = 'Frostbite';
                abilityE.textContent = 'E';
                abilityE.title = 'Arcane Aura';
                abilityR.textContent = 'R';
                abilityR.title = 'Freezing Field';
                break;
            case 'lich':
                abilityQ.textContent = 'Q';
                abilityQ.title = 'Frost Nova';
                abilityW.textContent = 'W';
                abilityW.title = 'Frost Armor';
                abilityE.textContent = 'E';
                abilityE.title = 'Dark Ritual';
                abilityR.textContent = 'R';
                abilityR.title = 'Chain Frost';
                break;
            case 'storm-spirit':
                abilityQ.textContent = 'Q';
                abilityQ.title = 'Static Remnant';
                abilityW.textContent = 'W';
                abilityW.title = 'Electric Vortex';
                abilityE.textContent = 'E';
                abilityE.title = 'Overload';
                abilityR.textContent = 'R';
                abilityR.title = 'Ball Lightning';
                break;
        }
    }
}