/**
 * Attribute System
 * 
 * Handles character attributes, derived statistics, and attribute growth.
 * Based on the requirements in docs/gameplay/progression.md
 */

const AttributeSystem = pc.createScript('attributeSystem');

// Primary attributes
AttributeSystem.attributes.add('strength', { type: 'number', default: 10 });
AttributeSystem.attributes.add('agility', { type: 'number', default: 10 });
AttributeSystem.attributes.add('intelligence', { type: 'number', default: 10 });
AttributeSystem.attributes.add('vitality', { type: 'number', default: 10 });
AttributeSystem.attributes.add('spirit', { type: 'number', default: 10 });

// Base values for derived statistics
AttributeSystem.attributes.add('baseHealth', { type: 'number', default: 100 });
AttributeSystem.attributes.add('baseMana', { type: 'number', default: 50 });
AttributeSystem.attributes.add('basePhysicalDamage', { type: 'number', default: 10 });
AttributeSystem.attributes.add('baseMagicalDamage', { type: 'number', default: 10 });
AttributeSystem.attributes.add('baseAttackSpeed', { type: 'number', default: 1.0 });
AttributeSystem.attributes.add('baseMovementSpeed', { type: 'number', default: 5.0 });
AttributeSystem.attributes.add('baseDodgeChance', { type: 'number', default: 5.0 });
AttributeSystem.attributes.add('baseCriticalChance', { type: 'number', default: 5.0 });
AttributeSystem.attributes.add('baseCooldownReduction', { type: 'number', default: 0.0 });

// Growth rates
AttributeSystem.attributes.add('strengthGrowth', { type: 'number', default: 2.0 });
AttributeSystem.attributes.add('agilityGrowth', { type: 'number', default: 2.0 });
AttributeSystem.attributes.add('intelligenceGrowth', { type: 'number', default: 2.0 });
AttributeSystem.attributes.add('vitalityGrowth', { type: 'number', default: 2.0 });
AttributeSystem.attributes.add('spiritGrowth', { type: 'number', default: 2.0 });

// Primary attribute (determines physical damage scaling)
AttributeSystem.attributes.add('primaryAttribute', { 
    type: 'string', 
    default: 'strength',
    enum: [
        { 'Strength': 'strength' },
        { 'Agility': 'agility' },
        { 'Intelligence': 'intelligence' }
    ]
});

// Derived statistics
AttributeSystem.prototype.initialize = function() {
    // Current level and experience
    this.level = 1;
    this.experience = 0;
    this.experienceToNextLevel = 1000; // Level 1-10: 1,000 XP per level
    
    // Attribute bonuses from equipment, buffs, etc.
    this.attributeBonuses = {
        strength: 0,
        agility: 0,
        intelligence: 0,
        vitality: 0,
        spirit: 0
    };
    
    // Calculate initial derived statistics
    this.calculateDerivedStats();
    
    // Log initial stats
    this.logCharacterStats();
};

AttributeSystem.prototype.update = function(dt) {
    // This could be used for time-based effects like regeneration
    // or to check for attribute changes that require recalculation
};

/**
 * Calculate all derived statistics based on current attributes
 */
AttributeSystem.prototype.calculateDerivedStats = function() {
    // Get total attributes (base + bonuses)
    const totalStrength = this.strength + this.attributeBonuses.strength;
    const totalAgility = this.agility + this.attributeBonuses.agility;
    const totalIntelligence = this.intelligence + this.attributeBonuses.intelligence;
    const totalVitality = this.vitality + this.attributeBonuses.vitality;
    const totalSpirit = this.spirit + this.attributeBonuses.spirit;
    
    // Calculate derived statistics according to formulas in progression.md
    this.maxHealth = this.baseHealth + (totalStrength * 10) + (totalVitality * 15);
    this.maxMana = this.baseMana + (totalIntelligence * 8) + (totalSpirit * 5);
    
    // Physical damage scales with primary attribute
    let primaryAttributeValue = 0;
    switch(this.primaryAttribute) {
        case 'strength':
            primaryAttributeValue = totalStrength;
            break;
        case 'agility':
            primaryAttributeValue = totalAgility;
            break;
        case 'intelligence':
            primaryAttributeValue = totalIntelligence;
            break;
    }
    
    this.physicalDamage = this.basePhysicalDamage + (primaryAttributeValue * 2);
    this.magicalDamage = this.baseMagicalDamage + (totalIntelligence * 1.5);
    this.attackSpeed = this.baseAttackSpeed + (totalAgility * 0.005); // 0.5% per point
    this.movementSpeed = this.baseMovementSpeed + (totalAgility * 0.003); // 0.3% per point
    this.dodgeChance = this.baseDodgeChance + (totalAgility * 0.2);
    this.criticalChance = this.baseCriticalChance + (totalSpirit * 0.3);
    this.cooldownReduction = this.baseCooldownReduction + (totalSpirit * 0.005); // 0.5% per point
    
    // Initialize current health and mana to max if not already set
    if (!this.currentHealth) this.currentHealth = this.maxHealth;
    if (!this.currentMana) this.currentMana = this.maxMana;
    
    // Ensure current values don't exceed maximums
    this.currentHealth = Math.min(this.currentHealth, this.maxHealth);
    this.currentMana = Math.min(this.currentMana, this.maxMana);
};

/**
 * Add experience points and handle level-ups
 * @param {number} amount - Amount of experience to add
 */
AttributeSystem.prototype.addExperience = function(amount) {
    this.experience += amount;
    console.log(`Gained ${amount} experience. Total: ${this.experience}`);
    
    // Check for level up
    while (this.experience >= this.experienceToNextLevel && this.level < 30) {
        this.levelUp();
    }
};

/**
 * Handle level up logic
 */
AttributeSystem.prototype.levelUp = function() {
    // Subtract required XP
    this.experience -= this.experienceToNextLevel;
    
    // Increase level
    this.level++;
    
    // Update XP required for next level
    if (this.level <= 10) {
        this.experienceToNextLevel = 1000;
    } else if (this.level <= 20) {
        this.experienceToNextLevel = 2000;
    } else {
        this.experienceToNextLevel = 3000;
    }
    
    // Increase attributes based on growth rates
    this.strength += this.strengthGrowth;
    this.agility += this.agilityGrowth;
    this.intelligence += this.intelligenceGrowth;
    this.vitality += this.vitalityGrowth;
    this.spirit += this.spiritGrowth;
    
    // Recalculate derived stats
    this.calculateDerivedStats();
    
    // Restore health and mana on level up
    this.currentHealth = this.maxHealth;
    this.currentMana = this.maxMana;
    
    console.log(`Level up! Now level ${this.level}`);
    this.logCharacterStats();
    
    // Determine rewards based on level
    this.grantLevelUpRewards();
};

/**
 * Grant appropriate rewards based on current level
 */
AttributeSystem.prototype.grantLevelUpRewards = function() {
    // Always grant 1 ability point per level
    console.log("Gained 1 Ability Point");
    
    // Grant talent points at specific levels
    if ([5, 10, 15, 20, 25].includes(this.level)) {
        console.log("Gained 1 Talent Point");
    }
};

/**
 * Apply a temporary attribute bonus
 * @param {string} attribute - The attribute to modify
 * @param {number} value - The bonus value
 */
AttributeSystem.prototype.applyAttributeBonus = function(attribute, value) {
    if (this.attributeBonuses.hasOwnProperty(attribute)) {
        this.attributeBonuses[attribute] += value;
        this.calculateDerivedStats();
        console.log(`Applied ${value} bonus to ${attribute}`);
    }
};

/**
 * Remove a temporary attribute bonus
 * @param {string} attribute - The attribute to modify
 * @param {number} value - The bonus value to remove
 */
AttributeSystem.prototype.removeAttributeBonus = function(attribute, value) {
    if (this.attributeBonuses.hasOwnProperty(attribute)) {
        this.attributeBonuses[attribute] -= value;
        this.calculateDerivedStats();
        console.log(`Removed ${value} bonus from ${attribute}`);
    }
};

/**
 * Log current character stats to console
 */
AttributeSystem.prototype.logCharacterStats = function() {
    console.log("=== Character Stats ===");
    console.log(`Level: ${this.level}`);
    console.log(`Experience: ${this.experience}/${this.experienceToNextLevel}`);
    console.log("\nPrimary Attributes:");
    console.log(`Strength: ${this.strength} + ${this.attributeBonuses.strength}`);
    console.log(`Agility: ${this.agility} + ${this.attributeBonuses.agility}`);
    console.log(`Intelligence: ${this.intelligence} + ${this.attributeBonuses.intelligence}`);
    console.log(`Vitality: ${this.vitality} + ${this.attributeBonuses.vitality}`);
    console.log(`Spirit: ${this.spirit} + ${this.attributeBonuses.spirit}`);
    console.log("\nDerived Statistics:");
    console.log(`Health: ${this.currentHealth}/${this.maxHealth}`);
    console.log(`Mana: ${this.currentMana}/${this.maxMana}`);
    console.log(`Physical Damage: ${this.physicalDamage}`);
    console.log(`Magical Damage: ${this.magicalDamage}`);
    console.log(`Attack Speed: ${this.attackSpeed.toFixed(2)}`);
    console.log(`Movement Speed: ${this.movementSpeed.toFixed(2)}`);
    console.log(`Dodge Chance: ${this.dodgeChance.toFixed(2)}%`);
    console.log(`Critical Chance: ${this.criticalChance.toFixed(2)}%`);
    console.log(`Cooldown Reduction: ${(this.cooldownReduction * 100).toFixed(2)}%`);
};