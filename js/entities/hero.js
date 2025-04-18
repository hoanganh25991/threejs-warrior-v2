/**
 * Hero Class
 * 
 * Base class for all playable heroes in the game.
 * Integrates with the attribute system and ability system.
 */

const Hero = pc.createScript('hero');

// Hero properties
Hero.attributes.add('heroName', { type: 'string', default: 'Unknown Hero' });
Hero.attributes.add('heroType', { 
    type: 'string', 
    default: 'warrior',
    enum: [
        { 'Warrior': 'warrior' },
        { 'Assassin': 'assassin' },
        { 'Mage': 'mage' },
        { 'Support': 'support' },
        { 'Specialist': 'specialist' }
    ]
});
Hero.attributes.add('faction', { 
    type: 'string', 
    default: 'sentinel',
    enum: [
        { 'Sentinel': 'sentinel' },
        { 'Scourge': 'scourge' }
    ]
});
Hero.attributes.add('description', { type: 'string', default: 'A mysterious hero with unknown origins.' });

// Initialize the hero
Hero.prototype.initialize = function() {
    // Ensure the entity has the required components
    if (!this.entity.script.attributeSystem) {
        this.entity.script.create('attributeSystem');
    }
    
    // Set up hero-specific attribute values based on hero type
    this.configureHeroAttributes();
    
    // Set up abilities
    this.setupAbilities();
    
    // Log hero information
    console.log(`Hero initialized: ${this.heroName} (${this.heroType} - ${this.faction})`);
    console.log(this.description);
};

Hero.prototype.update = function(dt) {
    // Hero-specific update logic
};

/**
 * Configure hero attributes based on hero type
 */
Hero.prototype.configureHeroAttributes = function() {
    const attributeSystem = this.entity.script.attributeSystem;
    
    // Set base attributes and growth rates based on hero type
    switch(this.heroType) {
        case 'warrior':
            // Warriors focus on strength and vitality
            attributeSystem.strength = 15;
            attributeSystem.agility = 8;
            attributeSystem.intelligence = 6;
            attributeSystem.vitality = 12;
            attributeSystem.spirit = 7;
            
            attributeSystem.strengthGrowth = 3.0;
            attributeSystem.vitalityGrowth = 2.5;
            
            // Warriors use strength as primary attribute
            attributeSystem.primaryAttribute = 'strength';
            break;
            
        case 'assassin':
            // Assassins focus on agility
            attributeSystem.strength = 8;
            attributeSystem.agility = 15;
            attributeSystem.intelligence = 7;
            attributeSystem.vitality = 7;
            attributeSystem.spirit = 9;
            
            attributeSystem.agilityGrowth = 3.0;
            
            // Assassins use agility as primary attribute
            attributeSystem.primaryAttribute = 'agility';
            break;
            
        case 'mage':
            // Mages focus on intelligence and spirit
            attributeSystem.strength = 6;
            attributeSystem.agility = 7;
            attributeSystem.intelligence = 15;
            attributeSystem.vitality = 7;
            attributeSystem.spirit = 12;
            
            attributeSystem.intelligenceGrowth = 3.0;
            attributeSystem.spiritGrowth = 2.5;
            
            // Mages use intelligence as primary attribute
            attributeSystem.primaryAttribute = 'intelligence';
            break;
            
        case 'support':
            // Supports focus on intelligence and spirit
            attributeSystem.strength = 7;
            attributeSystem.agility = 8;
            attributeSystem.intelligence = 12;
            attributeSystem.vitality = 9;
            attributeSystem.spirit = 14;
            
            attributeSystem.intelligenceGrowth = 2.5;
            attributeSystem.spiritGrowth = 3.0;
            
            // Supports use intelligence as primary attribute
            attributeSystem.primaryAttribute = 'intelligence';
            break;
            
        case 'specialist':
            // Specialists have balanced attributes
            attributeSystem.strength = 10;
            attributeSystem.agility = 10;
            attributeSystem.intelligence = 10;
            attributeSystem.vitality = 10;
            attributeSystem.spirit = 10;
            
            // Primary attribute depends on the specific specialist
            break;
    }
    
    // Recalculate derived stats
    attributeSystem.calculateDerivedStats();
};

/**
 * Set up hero abilities
 */
Hero.prototype.setupAbilities = function() {
    // This will be implemented when we create the ability system
    // For now, just a placeholder
    this.abilities = {
        ability1: null,
        ability2: null,
        ability3: null,
        ability4: null,
        passive: null,
        ultimate: null
    };
};

/**
 * Gain experience points
 * @param {number} amount - Amount of experience to gain
 */
Hero.prototype.gainExperience = function(amount) {
    if (this.entity.script.attributeSystem) {
        this.entity.script.attributeSystem.addExperience(amount);
    }
};

/**
 * Take damage
 * @param {number} amount - Amount of damage
 * @param {string} type - Damage type ('physical', 'magical', 'pure')
 * @returns {number} - Actual damage taken after mitigation
 */
Hero.prototype.takeDamage = function(amount, type = 'physical') {
    const attributeSystem = this.entity.script.attributeSystem;
    let actualDamage = amount;
    
    // Apply damage mitigation based on type
    if (type === 'physical') {
        // Physical damage can be reduced by armor (not implemented yet)
    } else if (type === 'magical') {
        // Magical damage can be reduced by magic resistance (not implemented yet)
    } else if (type === 'pure') {
        // Pure damage ignores resistances
    }
    
    // Apply damage
    attributeSystem.currentHealth -= actualDamage;
    
    // Check if hero is defeated
    if (attributeSystem.currentHealth <= 0) {
        attributeSystem.currentHealth = 0;
        this.onDefeat();
    }
    
    console.log(`${this.heroName} took ${actualDamage} ${type} damage. Health: ${attributeSystem.currentHealth}/${attributeSystem.maxHealth}`);
    return actualDamage;
};

/**
 * Heal the hero
 * @param {number} amount - Amount to heal
 */
Hero.prototype.heal = function(amount) {
    const attributeSystem = this.entity.script.attributeSystem;
    const oldHealth = attributeSystem.currentHealth;
    
    attributeSystem.currentHealth = Math.min(attributeSystem.currentHealth + amount, attributeSystem.maxHealth);
    const actualHeal = attributeSystem.currentHealth - oldHealth;
    
    console.log(`${this.heroName} healed for ${actualHeal}. Health: ${attributeSystem.currentHealth}/${attributeSystem.maxHealth}`);
    return actualHeal;
};

/**
 * Use mana
 * @param {number} amount - Amount of mana to use
 * @returns {boolean} - Whether there was enough mana
 */
Hero.prototype.useMana = function(amount) {
    const attributeSystem = this.entity.script.attributeSystem;
    
    if (attributeSystem.currentMana >= amount) {
        attributeSystem.currentMana -= amount;
        console.log(`${this.heroName} used ${amount} mana. Remaining: ${attributeSystem.currentMana}/${attributeSystem.maxMana}`);
        return true;
    } else {
        console.log(`${this.heroName} doesn't have enough mana (${attributeSystem.currentMana}/${amount} needed)`);
        return false;
    }
};

/**
 * Restore mana
 * @param {number} amount - Amount of mana to restore
 */
Hero.prototype.restoreMana = function(amount) {
    const attributeSystem = this.entity.script.attributeSystem;
    const oldMana = attributeSystem.currentMana;
    
    attributeSystem.currentMana = Math.min(attributeSystem.currentMana + amount, attributeSystem.maxMana);
    const actualRestore = attributeSystem.currentMana - oldMana;
    
    console.log(`${this.heroName} restored ${actualRestore} mana. Mana: ${attributeSystem.currentMana}/${attributeSystem.maxMana}`);
    return actualRestore;
};

/**
 * Called when hero is defeated
 */
Hero.prototype.onDefeat = function() {
    console.log(`${this.heroName} has been defeated!`);
    // Additional defeat logic will be implemented later
};