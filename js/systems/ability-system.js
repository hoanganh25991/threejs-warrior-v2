/**
 * Ability System
 * 
 * Handles hero abilities, cooldowns, and ability advancement.
 * Based on the requirements in docs/gameplay/progression.md
 */

const AbilitySystem = pc.createScript('abilitySystem');

// Ability slots
AbilitySystem.attributes.add('ability1', { type: 'string', default: '' });
AbilitySystem.attributes.add('ability2', { type: 'string', default: '' });
AbilitySystem.attributes.add('ability3', { type: 'string', default: '' });
AbilitySystem.attributes.add('ability4', { type: 'string', default: '' });

// Initialize the ability system
AbilitySystem.prototype.initialize = function() {
    // Ability points available for spending
    this.abilityPoints = 0;
    
    // Ability levels (tier tracking)
    this.abilityLevels = {
        ability1: 0,
        ability2: 0,
        ability3: 0,
        ability4: 0
    };
    
    // Cooldown tracking
    this.cooldowns = {
        ability1: 0,
        ability2: 0,
        ability3: 0,
        ability4: 0
    };
    
    // Ability definitions will be populated by the hero script
    this.abilityDefinitions = {};
    
    // Listen for keyboard events to cast abilities if keyboard is available
    if (this.app.keyboard) {
        this.app.keyboard.on(pc.EVENT_KEYDOWN, this.onKeyDown, this);
    } else {
        console.warn("Keyboard input is not available for ability system");
    }
    
    console.log("Ability system initialized");
};

AbilitySystem.prototype.update = function(dt) {
    // Update cooldowns
    for (const key in this.cooldowns) {
        if (this.cooldowns[key] > 0) {
            this.cooldowns[key] = Math.max(0, this.cooldowns[key] - dt);
            
            // Log when an ability comes off cooldown
            if (this.cooldowns[key] === 0 && this.abilityDefinitions[key]) {
                console.log(`${this.abilityDefinitions[key].name} is ready!`);
            }
        }
    }
};

/**
 * Handle keyboard input for abilities
 */
AbilitySystem.prototype.onKeyDown = function(event) {
    // Q, W, E, R for abilities 1-4
    switch(event.key) {
        case pc.KEY_Q:
            this.useAbility('ability1');
            break;
        case pc.KEY_W:
            this.useAbility('ability2');
            break;
        case pc.KEY_E:
            this.useAbility('ability3');
            break;
        case pc.KEY_R:
            this.useAbility('ability4');
            break;
    }
};

/**
 * Set up abilities from hero definition
 * @param {Object} abilities - Object containing ability definitions
 */
AbilitySystem.prototype.setupAbilities = function(abilities) {
    this.abilityDefinitions = abilities;
    console.log("Abilities set up:", Object.keys(abilities).join(", "));
};

/**
 * Use an ability
 * @param {string} abilitySlot - The ability slot to use (ability1, ability2, etc.)
 * @returns {boolean} - Whether the ability was successfully used
 */
AbilitySystem.prototype.useAbility = function(abilitySlot) {
    // Check if the ability exists
    if (!this.abilityDefinitions[abilitySlot]) {
        console.log(`No ability in ${abilitySlot} slot`);
        return false;
    }
    
    const ability = this.abilityDefinitions[abilitySlot];
    
    // Check if the ability is on cooldown
    if (this.cooldowns[abilitySlot] > 0) {
        console.log(`${ability.name} is on cooldown (${this.cooldowns[abilitySlot].toFixed(1)}s remaining)`);
        return false;
    }
    
    // Check if it's a passive ability
    if (ability.passive) {
        console.log(`${ability.name} is a passive ability and cannot be activated manually`);
        return false;
    }
    
    // Get hero and attribute system references
    const hero = this.entity.script.hero;
    const attributeSystem = this.entity.script.attributeSystem;
    
    if (!hero || !attributeSystem) {
        console.error("Hero or attribute system not found");
        return false;
    }
    
    // Check mana cost
    if (ability.manaCost && attributeSystem.currentMana < ability.manaCost) {
        console.log(`Not enough mana to use ${ability.name} (${attributeSystem.currentMana}/${ability.manaCost})`);
        return false;
    }
    
    // Use the ability
    console.log(`Using ${ability.name}`);
    
    // Apply cooldown reduction from spirit attribute
    const cooldownReduction = attributeSystem.cooldownReduction;
    const adjustedCooldown = ability.cooldown * (1 - cooldownReduction);
    
    // Set the cooldown
    this.cooldowns[abilitySlot] = adjustedCooldown;
    
    // Consume mana
    if (ability.manaCost) {
        hero.useMana(ability.manaCost);
    }
    
    // Call the appropriate ability function on the hero
    // This assumes the hero has methods named after the abilities
    const heroScript = this.entity.script;
    const abilityName = ability.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    
    if (heroScript[abilityName] && typeof heroScript[abilityName] === 'function') {
        heroScript[abilityName]();
    } else {
        // Generic ability effect if no specific implementation exists
        console.log(`${ability.name} activated with generic effect`);
    }
    
    return true;
};

/**
 * Spend ability points to upgrade an ability
 * @param {string} abilitySlot - The ability slot to upgrade
 * @returns {boolean} - Whether the upgrade was successful
 */
AbilitySystem.prototype.upgradeAbility = function(abilitySlot) {
    // Check if the ability exists
    if (!this.abilityDefinitions[abilitySlot]) {
        console.log(`No ability in ${abilitySlot} slot`);
        return false;
    }
    
    const currentLevel = this.abilityLevels[abilitySlot];
    const ability = this.abilityDefinitions[abilitySlot];
    
    // Check if already at max level (tier 3)
    if (currentLevel >= 3) {
        console.log(`${ability.name} is already at maximum tier`);
        return false;
    }
    
    // Calculate points needed for next tier
    let pointsNeeded;
    if (currentLevel === 0) {
        pointsNeeded = 1; // Tier 1: 1 point
    } else if (currentLevel === 1) {
        pointsNeeded = 2; // Tier 2: 2 additional points
    } else if (currentLevel === 2) {
        pointsNeeded = 3; // Tier 3: 3 additional points
    }
    
    // Check if enough ability points are available
    if (this.abilityPoints < pointsNeeded) {
        console.log(`Not enough ability points to upgrade ${ability.name} (${this.abilityPoints}/${pointsNeeded} needed)`);
        return false;
    }
    
    // Spend the points and upgrade the ability
    this.abilityPoints -= pointsNeeded;
    this.abilityLevels[abilitySlot]++;
    
    // Apply the upgrade effects
    this.applyAbilityUpgrade(abilitySlot);
    
    console.log(`${ability.name} upgraded to Tier ${this.abilityLevels[abilitySlot]}!`);
    console.log(`Ability points remaining: ${this.abilityPoints}`);
    
    return true;
};

/**
 * Apply effects of ability upgrade
 * @param {string} abilitySlot - The ability slot that was upgraded
 */
AbilitySystem.prototype.applyAbilityUpgrade = function(abilitySlot) {
    const ability = this.abilityDefinitions[abilitySlot];
    const currentTier = this.abilityLevels[abilitySlot];
    
    // This is where we would apply the tier-specific enhancements to the ability
    // For now, just log the improvements
    
    if (currentTier === 1) {
        console.log(`Tier 1 ${ability.name}: Base functionality unlocked`);
    } else if (currentTier === 2) {
        console.log(`Tier 2 ${ability.name}: Enhanced damage/effect (+50%), reduced cooldown (-20%), additional minor effect`);
    } else if (currentTier === 3) {
        console.log(`Tier 3 ${ability.name}: Significantly enhanced damage/effect (+100% from base), further reduced cooldown (-40% from base), additional major effect`);
    }
};

/**
 * Add ability points (typically from leveling up)
 * @param {number} points - Number of points to add
 */
AbilitySystem.prototype.addAbilityPoints = function(points) {
    this.abilityPoints += points;
    console.log(`Gained ${points} ability point(s). Total: ${this.abilityPoints}`);
};