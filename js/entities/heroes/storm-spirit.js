/**
 * Storm Spirit (Raijin Thunderkeg)
 * 
 * A jovial elemental spirit who rides the storm with electrifying speed.
 * Playstyle: Mobile Caster/Assassin
 * Signature Abilities: Static Remnant, Electric Vortex, Overload, Ball Lightning
 */

const StormSpirit = pc.createScript('stormSpirit');

// Dependencies
StormSpirit.attributes.add('modelAsset', { type: 'asset', assetType: 'model' });
StormSpirit.attributes.add('textureAsset', { type: 'asset', assetType: 'texture' });

StormSpirit.prototype.initialize = function() {
    // Ensure the entity has the required components and scripts
    if (!this.entity.script.hero) {
        this.entity.script.create('hero');
    }
    
    // Configure hero properties
    const hero = this.entity.script.hero;
    hero.heroName = "Storm Spirit (Raijin Thunderkeg)";
    hero.heroType = "mage";
    hero.faction = "scourge";
    hero.description = "A jovial elemental spirit who rides the storm with electrifying speed. Raijin Thunderkeg was once a brewmaster who merged with a storm spirit during an accident, gaining incredible electrical powers.";
    
    // Set up Storm Spirit-specific attributes
    this.configureStormSpiritAttributes();
    
    // Set up Storm Spirit's abilities
    this.setupStormSpiritAbilities();
    
    // Load Storm Spirit's model and textures (placeholder for now)
    this.setupVisuals();
    
    console.log("Storm Spirit has been initialized!");
};

StormSpirit.prototype.update = function(dt) {
    // Storm Spirit-specific update logic
};

/**
 * Configure Storm Spirit's specific attributes
 */
StormSpirit.prototype.configureStormSpiritAttributes = function() {
    const attributeSystem = this.entity.script.attributeSystem;
    
    // Storm Spirit is an intelligence-based mage with high agility
    attributeSystem.strength = 8;
    attributeSystem.agility = 12;
    attributeSystem.intelligence = 15;
    attributeSystem.vitality = 8;
    attributeSystem.spirit = 10;
    
    // Growth rates
    attributeSystem.strengthGrowth = 1.8;
    attributeSystem.agilityGrowth = 2.6;
    attributeSystem.intelligenceGrowth = 2.9;
    attributeSystem.vitalityGrowth = 1.9;
    attributeSystem.spiritGrowth = 2.2;
    
    // Primary attribute
    attributeSystem.primaryAttribute = 'intelligence';
    
    // Base values
    attributeSystem.baseHealth = 95;
    attributeSystem.baseMana = 110;
    attributeSystem.basePhysicalDamage = 9;
    
    // Recalculate derived stats
    attributeSystem.calculateDerivedStats();
};

/**
 * Set up Storm Spirit's abilities
 */
StormSpirit.prototype.setupStormSpiritAbilities = function() {
    // Define the ability names and descriptions
    
    this.abilities = {
        ability1: {
            name: "Static Remnant",
            description: "Creates an electrical duplicate that explodes when enemies approach, dealing damage in an area.",
            cooldown: 3.5,
            manaCost: 70
        },
        ability2: {
            name: "Electric Vortex",
            description: "Creates a vortex that pulls an enemy toward Storm Spirit and briefly disables them.",
            cooldown: 16,
            manaCost: 85
        },
        ability3: {
            name: "Overload",
            description: "After using any ability, Storm Spirit's next attack deals bonus damage and slows in an area.",
            passive: true
        },
        ability4: {
            name: "Ball Lightning",
            description: "Storm Spirit transforms into a ball of lightning, becoming invulnerable while traveling and damaging enemies along the path.",
            cooldown: 12,
            manaCost: 100, // Initial cost, plus distance-based cost
            ultimate: true
        }
    };
    
    // Configure ability system if it exists
    if (this.entity.script.abilitySystem) {
        this.entity.script.abilitySystem.setupAbilities(this.abilities);
    }
    
    // Initialize overload tracking
    this.overloadCharged = false;
    
    console.log("Storm Spirit abilities configured");
};

/**
 * Set up Storm Spirit's visual appearance
 */
StormSpirit.prototype.setupVisuals = function() {
    // This is a placeholder for loading the actual model and textures
    // For now, we'll just create a blue/purple box to represent Storm Spirit
    
    // If the entity doesn't have a render component, add one
    if (!this.entity.render) {
        this.entity.addComponent('render', {
            type: 'box',
            material: new pc.StandardMaterial()
        });
        
        // Set Storm Spirit's color to blue/purple
        this.entity.render.material.diffuse = new pc.Color(0.4, 0.3, 0.8);
        this.entity.render.material.update();
        
        // Set the scale to make him look like a rotund elemental
        this.entity.setLocalScale(1.3, 1.8, 1.3);
    }
    
    console.log("Storm Spirit visuals configured (placeholder)");
};

/**
 * Static Remnant ability implementation
 */
StormSpirit.prototype.staticremnant = function() {
    const hero = this.entity.script.hero;
    const attributeSystem = this.entity.script.attributeSystem;
    const ability = this.abilities.ability1;
    
    // Check if enough mana
    if (hero.useMana(ability.manaCost)) {
        console.log(`${hero.heroName} uses ${ability.name}!`);
        
        // Calculate damage based on intelligence
        const damage = 70 + (attributeSystem.intelligence * 1.1);
        
        console.log(`Static Remnant creates an electrical duplicate that will deal ${Math.floor(damage)} magical damage when triggered!`);
        
        // Charge Overload
        this.chargeOverload();
        
        // In a real implementation, we would:
        // 1. Create a remnant entity at the hero's position
        // 2. Set up trigger detection for nearby enemies
        // 3. Apply damage when triggered
        // 4. Create visual and sound effects
        
        return true;
    }
    
    return false;
};

/**
 * Electric Vortex ability implementation
 */
StormSpirit.prototype.electricvortex = function() {
    const hero = this.entity.script.hero;
    const attributeSystem = this.entity.script.attributeSystem;
    const ability = this.abilities.ability2;
    
    // Check if enough mana
    if (hero.useMana(ability.manaCost)) {
        console.log(`${hero.heroName} uses ${ability.name}!`);
        
        // Calculate duration based on intelligence
        const duration = 1.5 + (attributeSystem.intelligence * 0.01);
        
        console.log(`Electric Vortex pulls the target toward Storm Spirit and disables them for ${duration.toFixed(1)} seconds!`);
        
        // Charge Overload
        this.chargeOverload();
        
        // In a real implementation, we would:
        // 1. Apply a pull effect to the target
        // 2. Apply a disable effect
        // 3. Create visual and sound effects
        
        return true;
    }
    
    return false;
};

/**
 * Overload passive ability effect
 */
StormSpirit.prototype.overloadEffect = function() {
    const hero = this.entity.script.hero;
    const attributeSystem = this.entity.script.attributeSystem;
    
    if (!this.overloadCharged) {
        console.log("Overload is not charged. Use an ability first.");
        return false;
    }
    
    // Calculate bonus damage based on intelligence
    const bonusDamage = 40 + (attributeSystem.intelligence * 1.2);
    const slowPercent = 30 + (attributeSystem.intelligence * 0.2);
    
    console.log(`Overload discharges, dealing ${Math.floor(bonusDamage)} bonus magical damage and slowing nearby enemies by ${slowPercent.toFixed(1)}%!`);
    
    // Discharge overload
    this.overloadCharged = false;
    
    // In a real implementation, we would:
    // 1. Apply bonus damage to the attack target
    // 2. Apply damage and slow to nearby enemies
    // 3. Create visual and sound effects
    
    return true;
};

/**
 * Ball Lightning ability implementation (ultimate)
 */
StormSpirit.prototype.balllightning = function() {
    const hero = this.entity.script.hero;
    const attributeSystem = this.entity.script.attributeSystem;
    const ability = this.abilities.ability4;
    
    // Check if enough mana for initial cost
    if (hero.useMana(ability.manaCost)) {
        console.log(`${hero.heroName} uses ${ability.name}!`);
        
        // Calculate damage based on intelligence
        const damagePerUnit = 8 + (attributeSystem.intelligence * 0.7);
        
        // Simulate traveling a distance
        const distance = 10; // Units
        const additionalManaCost = distance * 10;
        
        // Check if enough mana for the distance
        if (attributeSystem.currentMana >= additionalManaCost) {
            hero.useMana(additionalManaCost);
            
            const totalDamage = damagePerUnit * distance;
            
            console.log(`Ball Lightning travels ${distance} units, dealing ${Math.floor(totalDamage)} magical damage along the path!`);
            
            // Charge Overload
            this.chargeOverload();
            
            // In a real implementation, we would:
            // 1. Transform the hero into a ball of lightning
            // 2. Move rapidly to the target location
            // 3. Apply damage to enemies along the path
            // 4. Create visual and sound effects
            
            return true;
        } else {
            console.log(`Not enough mana to travel that far. Need ${additionalManaCost} more mana.`);
            return false;
        }
    }
    
    return false;
};

/**
 * Charge the Overload passive
 */
StormSpirit.prototype.chargeOverload = function() {
    this.overloadCharged = true;
    console.log("Overload is charged! Next attack will deal bonus damage and slow nearby enemies.");
};