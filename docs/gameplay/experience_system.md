# Experience and Leveling System

This document describes the implementation of the experience and leveling system in the game.

## Overview

The experience system allows heroes to gain experience points (XP) by defeating enemies. When a hero accumulates enough XP, they level up, gaining improved stats and abilities.

## Core Components

### Hero Experience Properties

The Hero class has been extended with the following properties:

- `experience`: The current amount of experience points the hero has.
- `level`: The hero's current level (starting at 1).

### Experience Gain

Heroes gain experience by:

1. **Defeating Enemies**: When an enemy is defeated, the hero gains experience based on the enemy's `experienceValue` property.

The `gainExperience` method handles the experience gain:

```javascript
Hero.prototype.gainExperience = function(amount) {
    // Add experience
    this.experience += amount;
    
    // Check if we've leveled up
    const expNeeded = this.calculateExpForNextLevel();
    
    if (this.experience >= expNeeded) {
        this.levelUp();
    }
    
    // Update UI
    if (window.game && window.game.uiManager) {
        window.game.uiManager.updateXPBar(this.experience, expNeeded);
    }
};
```

### Level Up Mechanics

When a hero gains enough experience to level up, the `levelUp` method is called:

```javascript
Hero.prototype.levelUp = function() {
    // Increase level
    this.level++;
    
    // Reset experience (keep overflow)
    const expNeeded = this.calculateExpForNextLevel() / this.level;
    this.experience -= expNeeded;
    
    // Increase stats
    this.stats.maxHealth += 10;
    this.stats.health = this.stats.maxHealth; // Heal to full on level up
    this.stats.maxMana += 10;
    this.stats.mana = this.stats.maxMana; // Restore mana to full on level up
    this.stats.strength += 1;
    this.stats.agility += 1;
    this.stats.intelligence += 1;
    
    // Update UI and play effects
    // ...
};
```

### Experience Required for Leveling

The amount of experience required to level up is calculated using a simple formula:

```javascript
Hero.prototype.calculateExpForNextLevel = function() {
    // Simple formula: 100 * current level
    return 100 * this.level;
};
```

This means:
- Level 1 to 2: 100 XP
- Level 2 to 3: 200 XP
- Level 3 to 4: 300 XP
- And so on...

## Visual Feedback

### XP Bar

The UI displays an XP bar that shows the hero's progress toward the next level:

- The bar fills up as the hero gains experience.
- When the hero levels up, the bar resets and starts filling again.

The `updateXPBar` method in the UIManager handles updating the XP bar:

```javascript
updateXPBar(currentXP, neededXP) {
    if (!this.xpBar) return;
    
    // Calculate percentage
    const xpPercent = (currentXP / neededXP) * 100;
    
    // Update XP bar width
    this.xpBar.style.width = `${Math.min(100, xpPercent)}%`;
}
```

### Level Display

The UI displays the hero's current level:

```javascript
updateLevelText(level) {
    if (!this.levelText) return;
    this.levelText.textContent = `Level ${level}`;
}
```

### Level Up Effect

When a hero levels up, a visual effect is played to celebrate the achievement:

```javascript
Hero.prototype.playLevelUpEffect = function() {
    // Create a particle effect around the hero
    const particleCount = 30;
    const particles = [];
    
    // Create golden particles that rise up around the hero
    // ...
    
    // Animate particles
    // ...
};
```

## Enemy Integration

Enemies have an `experienceValue` property that determines how much XP they give when defeated:

```javascript
// In Enemy.setupStats()
this.stats = {
    // ...
    experienceValue: 10
};

// Adjust based on enemy type
switch (this.type) {
    case 'goblin':
        this.stats.experienceValue = 10;
        break;
    case 'troll':
        this.stats.experienceValue = 20;
        break;
    case 'skeleton':
        this.stats.experienceValue = 15;
        break;
}
```

When an enemy dies, it awards experience to the hero:

```javascript
// In Enemy.die()
if (window.game && window.game.hero) {
    window.game.hero.gainExperience(this.stats.experienceValue);
    
    // Show message
    if (window.game.uiManager) {
        window.game.uiManager.showMessage(`Defeated ${this.name}! +${this.stats.experienceValue} XP`);
    }
}
```

## Future Improvements

Potential improvements for the experience system:

1. **Ability Unlocks**: Unlock new abilities at specific levels.
2. **Talent System**: Allow players to choose talents or upgrades when leveling up.
3. **Experience Sources**: Add more ways to gain experience (completing objectives, exploring).
4. **Level Scaling**: Adjust enemy difficulty based on hero level.
5. **Experience Sharing**: Allow multiple heroes to share experience in multiplayer.
6. **Level Cap**: Implement a maximum level with special rewards for reaching it.