/**
 * Axe (Mogul Khan)
 * 
 * A bloodthirsty warrior who thrives in the chaos of battle.
 * Playstyle: Tank/Berserker
 * Signature Abilities: Berserker's Call, Counter Helix, Culling Blade
 */

const Axe = pc.createScript('axe');

// Dependencies
Axe.attributes.add('modelAsset', { type: 'asset', assetType: 'model' });
Axe.attributes.add('textureAsset', { type: 'asset', assetType: 'texture' });

Axe.prototype.initialize = function() {
    // Ensure the entity has the required components and scripts
    if (!this.entity.script.hero) {
        this.entity.script.create('hero');
    }
    
    // Configure hero properties
    const hero = this.entity.script.hero;
    hero.heroName = "Axe (Mogul Khan)";
    hero.heroType = "warrior";
    hero.faction = "scourge";
    hero.description = "A bloodthirsty warrior who thrives in the chaos of battle. As a general of the Red Mist Army, Mogul Khan (known simply as 'Axe') leads from the front, charging headlong into battle and challenging enemies to face him in combat.";
    
    // Set up Axe-specific attributes
    this.configureAxeAttributes();
    
    // Set up Axe's abilities
    this.setupAxeAbilities();
    
    // Load Axe's model and textures (placeholder for now)
    this.setupVisuals();
    
    console.log("Axe has been initialized!");
};

Axe.prototype.update = function(dt) {
    // Axe-specific update logic
};

/**
 * Configure Axe's specific attributes
 */
Axe.prototype.configureAxeAttributes = function() {
    const attributeSystem = this.entity.script.attributeSystem;
    
    // Axe is a strength-based warrior with high vitality
    attributeSystem.strength = 18;
    attributeSystem.agility = 7;
    attributeSystem.intelligence = 5;
    attributeSystem.vitality = 15;
    attributeSystem.spirit = 6;
    
    // Growth rates
    attributeSystem.strengthGrowth = 3.2;
    attributeSystem.agilityGrowth = 1.8;
    attributeSystem.intelligenceGrowth = 1.5;
    attributeSystem.vitalityGrowth = 2.8;
    attributeSystem.spiritGrowth = 1.6;
    
    // Primary attribute
    attributeSystem.primaryAttribute = 'strength';
    
    // Base values
    attributeSystem.baseHealth = 120;
    attributeSystem.baseMana = 40;
    attributeSystem.basePhysicalDamage = 12;
    
    // Recalculate derived stats
    attributeSystem.calculateDerivedStats();
};

/**
 * Set up Axe's abilities
 */
Axe.prototype.setupAxeAbilities = function() {
    // This will be implemented when we create the ability system
    // For now, just define the ability names and descriptions
    
    this.abilities = {
        ability1: {
            name: "Berserker's Call",
            description: "Axe taunts nearby enemy units, forcing them to attack him, while gaining bonus armor during the duration.",
            cooldown: 10,
            manaCost: 30
        },
        ability2: {
            name: "Battle Hunger",
            description: "Axe drives an enemy unit into a hunger-induced rage, causing it to take damage over time until it kills another unit.",
            cooldown: 8,
            manaCost: 25
        },
        ability3: {
            name: "Counter Helix",
            description: "When attacked, Axe has a chance to perform a counterattack, dealing damage to all nearby enemies.",
            passive: true
        },
        ability4: {
            name: "Culling Blade",
            description: "Axe spots a weakness and strikes, instantly killing an enemy unit with low health. If successful, Axe and nearby allies gain movement speed.",
            cooldown: 45,
            manaCost: 60,
            ultimate: true
        }
    };
    
    console.log("Axe abilities configured");
};

/**
 * Set up Axe's visual appearance
 */
Axe.prototype.setupVisuals = function() {
    // This is a placeholder for loading the actual model and textures
    // For now, we'll just create a red box to represent Axe
    
    // If the entity doesn't have a render component, add one
    if (!this.entity.render) {
        this.entity.addComponent('render', {
            type: 'box',
            material: new pc.StandardMaterial()
        });
        
        // Set Axe's color to red
        this.entity.render.material.diffuse = new pc.Color(0.8, 0.2, 0.2);
        this.entity.render.material.update();
        
        // Set the scale to make him look like a burly warrior
        this.entity.setLocalScale(1.2, 2.2, 1.2);
    }
    
    console.log("Axe visuals configured (placeholder)");
};

/**
 * Berserker's Call ability implementation
 */
Axe.prototype.berserkersCall = function() {
    const hero = this.entity.script.hero;
    const attributeSystem = this.entity.script.attributeSystem;
    const ability = this.abilities.ability1;
    
    // Check if enough mana
    if (hero.useMana(ability.manaCost)) {
        console.log(`${hero.heroName} uses ${ability.name}!`);
        
        // Apply taunt effect (placeholder)
        console.log("Nearby enemies are taunted and forced to attack Axe!");
        
        // Apply armor bonus (placeholder)
        const armorBonus = 10 + Math.floor(attributeSystem.strength / 5);
        console.log(`Axe gains ${armorBonus} bonus armor!`);
        
        // In a real implementation, we would:
        // 1. Find nearby enemies within range
        // 2. Apply a taunt status effect to them
        // 3. Apply an armor bonus to Axe
        // 4. Create visual and sound effects
        
        return true;
    }
    
    return false;
};

/**
 * Counter Helix ability implementation (passive)
 */
Axe.prototype.counterHelix = function() {
    const hero = this.entity.script.hero;
    const attributeSystem = this.entity.script.attributeSystem;
    const ability = this.abilities.ability3;
    
    console.log(`${hero.heroName} triggers ${ability.name}!`);
    
    // Calculate damage based on strength
    const damage = 20 + attributeSystem.strength;
    
    console.log(`Counter Helix deals ${damage} physical damage to nearby enemies!`);
    
    // In a real implementation, we would:
    // 1. Find nearby enemies within range
    // 2. Apply damage to each of them
    // 3. Create visual and sound effects
    
    return true;
};

/**
 * Culling Blade ability implementation (ultimate)
 */
Axe.prototype.cullingBlade = function(target) {
    const hero = this.entity.script.hero;
    const attributeSystem = this.entity.script.attributeSystem;
    const ability = this.abilities.ability4;
    
    // Check if enough mana
    if (hero.useMana(ability.manaCost)) {
        console.log(`${hero.heroName} uses ${ability.name}!`);
        
        // In a real implementation, we would:
        // 1. Check if target's health is below threshold
        // 2. If yes, instantly kill them and grant speed buff to allies
        // 3. If no, deal moderate damage
        // 4. Create visual and sound effects
        
        // For now, just a placeholder
        console.log("Axe executes his ultimate ability, potentially killing a low-health target instantly!");
        
        return true;
    }
    
    return false;
};