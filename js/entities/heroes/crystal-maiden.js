/**
 * Crystal Maiden (Rylai)
 * 
 * An ice sorceress with a gentle heart and frosty powers.
 * Playstyle: Support/Elemental Mage
 * Signature Abilities: Crystal Nova, Frostbite, Glacial Path, Freezing Field
 */

const CrystalMaiden = pc.createScript('crystalMaiden');

// Dependencies
CrystalMaiden.attributes.add('modelAsset', { type: 'asset', assetType: 'model' });
CrystalMaiden.attributes.add('textureAsset', { type: 'asset', assetType: 'texture' });

CrystalMaiden.prototype.initialize = function() {
    // Ensure the entity has the required components and scripts
    if (!this.entity.script.hero) {
        this.entity.script.create('hero');
    }
    
    // Configure hero properties
    const hero = this.entity.script.hero;
    hero.heroName = "Crystal Maiden (Rylai)";
    hero.heroType = "support";
    hero.faction = "sentinel";
    hero.description = "An ice sorceress with a gentle heart and frosty powers. Rylai Crestfall, known as the Crystal Maiden, uses her mastery of ice magic to support allies and control the battlefield.";
    
    // Set up Crystal Maiden-specific attributes
    this.configureCrystalMaidenAttributes();
    
    // Set up Crystal Maiden's abilities
    this.setupCrystalMaidenAbilities();
    
    // Load Crystal Maiden's model and textures (placeholder for now)
    this.setupVisuals();
    
    console.log("Crystal Maiden has been initialized!");
};

CrystalMaiden.prototype.update = function(dt) {
    // Crystal Maiden-specific update logic
};

/**
 * Configure Crystal Maiden's specific attributes
 */
CrystalMaiden.prototype.configureCrystalMaidenAttributes = function() {
    const attributeSystem = this.entity.script.attributeSystem;
    
    // Crystal Maiden is an intelligence-based support with high spirit
    attributeSystem.strength = 7;
    attributeSystem.agility = 8;
    attributeSystem.intelligence = 14;
    attributeSystem.vitality = 9;
    attributeSystem.spirit = 15;
    
    // Growth rates
    attributeSystem.strengthGrowth = 1.7;
    attributeSystem.agilityGrowth = 1.9;
    attributeSystem.intelligenceGrowth = 2.8;
    attributeSystem.vitalityGrowth = 2.0;
    attributeSystem.spiritGrowth = 3.0;
    
    // Primary attribute
    attributeSystem.primaryAttribute = 'intelligence';
    
    // Base values
    attributeSystem.baseHealth = 90;
    attributeSystem.baseMana = 120;
    attributeSystem.basePhysicalDamage = 8;
    
    // Recalculate derived stats
    attributeSystem.calculateDerivedStats();
};

/**
 * Set up Crystal Maiden's abilities
 */
CrystalMaiden.prototype.setupCrystalMaidenAbilities = function() {
    // Define the ability names and descriptions
    
    this.abilities = {
        ability1: {
            name: "Crystal Nova",
            description: "Creates an explosion of ice that damages and slows enemies in a target area.",
            cooldown: 9,
            manaCost: 100
        },
        ability2: {
            name: "Frostbite",
            description: "Encases an enemy in ice, preventing movement and dealing damage over time.",
            cooldown: 10,
            manaCost: 125
        },
        ability3: {
            name: "Glacial Path",
            description: "Creates a path of ice that increases movement speed for allies and slows enemies.",
            cooldown: 15,
            manaCost: 75
        },
        ability4: {
            name: "Freezing Field",
            description: "Summons a powerful blizzard around Crystal Maiden that damages and slows enemies.",
            cooldown: 90,
            manaCost: 200,
            ultimate: true
        }
    };
    
    // Set up passive ability: Arcane Aura
    this.passiveAbility = {
        name: "Arcane Aura",
        description: "Provides mana regeneration to Crystal Maiden and nearby allies.",
        passive: true
    };
    
    // Configure ability system if it exists
    if (this.entity.script.abilitySystem) {
        this.entity.script.abilitySystem.setupAbilities(this.abilities);
    }
    
    console.log("Crystal Maiden abilities configured");
};

/**
 * Set up Crystal Maiden's visual appearance
 */
CrystalMaiden.prototype.setupVisuals = function() {
    // This is a placeholder for loading the actual model and textures
    // For now, we'll just create a light blue box to represent Crystal Maiden
    
    // If the entity doesn't have a render component, add one
    if (!this.entity.render) {
        this.entity.addComponent('render', {
            type: 'box',
            material: new pc.StandardMaterial()
        });
        
        // Set Crystal Maiden's color to light blue
        this.entity.render.material.diffuse = new pc.Color(0.6, 0.8, 0.9);
        this.entity.render.material.update();
        
        // Set the scale to make her look like a slender mage
        this.entity.setLocalScale(0.9, 2.0, 0.9);
    }
    
    console.log("Crystal Maiden visuals configured (placeholder)");
};

/**
 * Crystal Nova ability implementation
 */
CrystalMaiden.prototype.crystalnova = function() {
    const hero = this.entity.script.hero;
    const attributeSystem = this.entity.script.attributeSystem;
    const ability = this.abilities.ability1;
    
    // Check if enough mana
    if (hero.useMana(ability.manaCost)) {
        console.log(`${hero.heroName} uses ${ability.name}!`);
        
        // Calculate damage based on intelligence
        const damage = 50 + (attributeSystem.intelligence * 1.2);
        
        console.log(`Crystal Nova deals ${Math.floor(damage)} magical damage and slows enemies in the area!`);
        
        // In a real implementation, we would:
        // 1. Find enemies within the target area
        // 2. Apply damage to each of them
        // 3. Apply a slow effect
        // 4. Create visual and sound effects
        
        return true;
    }
    
    return false;
};

/**
 * Frostbite ability implementation
 */
CrystalMaiden.prototype.frostbite = function() {
    const hero = this.entity.script.hero;
    const attributeSystem = this.entity.script.attributeSystem;
    const ability = this.abilities.ability2;
    
    // Check if enough mana
    if (hero.useMana(ability.manaCost)) {
        console.log(`${hero.heroName} uses ${ability.name}!`);
        
        // Calculate damage based on intelligence
        const damagePerSecond = 30 + (attributeSystem.intelligence * 0.8);
        const duration = 3;
        const totalDamage = damagePerSecond * duration;
        
        console.log(`Frostbite encases the target in ice for ${duration} seconds, dealing ${Math.floor(totalDamage)} magical damage over time!`);
        
        // In a real implementation, we would:
        // 1. Apply a root effect to the target
        // 2. Apply damage over time
        // 3. Create visual and sound effects
        
        return true;
    }
    
    return false;
};

/**
 * Glacial Path ability implementation
 */
CrystalMaiden.prototype.glacialpath = function() {
    const hero = this.entity.script.hero;
    const attributeSystem = this.entity.script.attributeSystem;
    const ability = this.abilities.ability3;
    
    // Check if enough mana
    if (hero.useMana(ability.manaCost)) {
        console.log(`${hero.heroName} uses ${ability.name}!`);
        
        // Calculate speed boost based on intelligence
        const speedBoost = 20 + (attributeSystem.intelligence * 0.5);
        const duration = 5;
        
        console.log(`Glacial Path creates a trail of ice for ${duration} seconds, increasing ally movement speed by ${Math.floor(speedBoost)}% and slowing enemies!`);
        
        // In a real implementation, we would:
        // 1. Create a path of ice in the direction the hero is facing
        // 2. Apply speed boost to allies who walk on it
        // 3. Apply slow to enemies who walk on it
        // 4. Create visual and sound effects
        
        return true;
    }
    
    return false;
};

/**
 * Freezing Field ability implementation (ultimate)
 */
CrystalMaiden.prototype.freezingfield = function() {
    const hero = this.entity.script.hero;
    const attributeSystem = this.entity.script.attributeSystem;
    const ability = this.abilities.ability4;
    
    // Check if enough mana
    if (hero.useMana(ability.manaCost)) {
        console.log(`${hero.heroName} uses ${ability.name}!`);
        
        // Calculate damage based on intelligence
        const damagePerSecond = 60 + (attributeSystem.intelligence * 2);
        const duration = 6;
        const totalDamage = damagePerSecond * duration;
        
        console.log(`Freezing Field creates a massive blizzard for ${duration} seconds, dealing up to ${Math.floor(totalDamage)} magical damage to enemies in the area!`);
        
        // In a real implementation, we would:
        // 1. Create a channeled effect around the hero
        // 2. Apply damage and slow to enemies in the area
        // 3. Make the hero vulnerable during channeling
        // 4. Create visual and sound effects
        
        return true;
    }
    
    return false;
};

/**
 * Arcane Aura passive ability effect
 */
CrystalMaiden.prototype.arcaneAuraEffect = function() {
    const hero = this.entity.script.hero;
    const attributeSystem = this.entity.script.attributeSystem;
    
    // Calculate mana regeneration bonus based on intelligence and spirit
    const manaRegenBonus = 0.5 + (attributeSystem.intelligence * 0.05) + (attributeSystem.spirit * 0.03);
    
    console.log(`Arcane Aura provides ${manaRegenBonus.toFixed(1)} mana regeneration per second to Crystal Maiden and nearby allies.`);
    
    // In a real implementation, we would:
    // 1. Apply mana regeneration to the hero
    // 2. Find nearby allies and apply the effect to them
    // 3. Create subtle visual effects
    
    return true;
};