/**
 * Lich (Kel'Thuzad)
 * 
 * An undead sorcerer who commands the chilling power of frost.
 * Playstyle: Necromancer/Crowd Control
 * Signature Abilities: Frost Nova, Dark Ritual, Ice Chains, Chain Frost
 */

const Lich = pc.createScript('lich');

// Dependencies
Lich.attributes.add('modelAsset', { type: 'asset', assetType: 'model' });
Lich.attributes.add('textureAsset', { type: 'asset', assetType: 'texture' });

Lich.prototype.initialize = function() {
    // Ensure the entity has the required components and scripts
    if (!this.entity.script.hero) {
        this.entity.script.create('hero');
    }
    
    // Configure hero properties
    const hero = this.entity.script.hero;
    hero.heroName = "Lich (Kel'Thuzad)";
    hero.heroType = "specialist";
    hero.faction = "scourge";
    hero.description = "An undead sorcerer who commands the chilling power of frost. Once a respected mage, Kel'Thuzad's pursuit of forbidden knowledge led him to necromancy and ultimately to his transformation into a lich.";
    
    // Set up Lich-specific attributes
    this.configureLichAttributes();
    
    // Set up Lich's abilities
    this.setupLichAbilities();
    
    // Load Lich's model and textures (placeholder for now)
    this.setupVisuals();
    
    console.log("Lich has been initialized!");
};

Lich.prototype.update = function(dt) {
    // Lich-specific update logic
};

/**
 * Configure Lich's specific attributes
 */
Lich.prototype.configureLichAttributes = function() {
    const attributeSystem = this.entity.script.attributeSystem;
    
    // Lich is an intelligence-based specialist with high spirit
    attributeSystem.strength = 6;
    attributeSystem.agility = 7;
    attributeSystem.intelligence = 16;
    attributeSystem.vitality = 8;
    attributeSystem.spirit = 14;
    
    // Growth rates
    attributeSystem.strengthGrowth = 1.5;
    attributeSystem.agilityGrowth = 1.7;
    attributeSystem.intelligenceGrowth = 3.0;
    attributeSystem.vitalityGrowth = 1.8;
    attributeSystem.spiritGrowth = 2.7;
    
    // Primary attribute
    attributeSystem.primaryAttribute = 'intelligence';
    
    // Base values
    attributeSystem.baseHealth = 85;
    attributeSystem.baseMana = 130;
    attributeSystem.basePhysicalDamage = 7;
    
    // Recalculate derived stats
    attributeSystem.calculateDerivedStats();
};

/**
 * Set up Lich's abilities
 */
Lich.prototype.setupLichAbilities = function() {
    // Define the ability names and descriptions
    
    this.abilities = {
        ability1: {
            name: "Frost Nova",
            description: "Releases a burst of cold that damages and slows enemies in a target area.",
            cooldown: 8,
            manaCost: 125
        },
        ability2: {
            name: "Dark Ritual",
            description: "Sacrifices a portion of Lich's health to restore a larger amount of mana.",
            cooldown: 45,
            manaCost: 0 // No mana cost since it's a health-to-mana conversion
        },
        ability3: {
            name: "Ice Chains",
            description: "Binds an enemy in chains of ice, rooting them and dealing damage over time.",
            cooldown: 12,
            manaCost: 100
        },
        ability4: {
            name: "Chain Frost",
            description: "Launches a ball of frost that bounces between enemies, dealing damage and slowing with each hit.",
            cooldown: 120,
            manaCost: 200,
            ultimate: true
        }
    };
    
    // Set up passive ability: Frost Armor
    this.passiveAbility = {
        name: "Frost Armor",
        description: "Automatically encases Lich in protective ice that slows attackers.",
        passive: true
    };
    
    // Configure ability system if it exists
    if (this.entity.script.abilitySystem) {
        this.entity.script.abilitySystem.setupAbilities(this.abilities);
    }
    
    console.log("Lich abilities configured");
};

/**
 * Set up Lich's visual appearance
 */
Lich.prototype.setupVisuals = function() {
    // This is a placeholder for loading the actual model and textures
    // For now, we'll just create a dark blue box to represent Lich
    
    // If the entity doesn't have a render component, add one
    if (!this.entity.render) {
        this.entity.addComponent('render', {
            type: 'box',
            material: new pc.StandardMaterial()
        });
        
        // Set Lich's color to dark blue
        this.entity.render.material.diffuse = new pc.Color(0.2, 0.3, 0.7);
        this.entity.render.material.update();
        
        // Set the scale to make him look like an undead mage
        this.entity.setLocalScale(1.0, 2.1, 1.0);
    }
    
    console.log("Lich visuals configured (placeholder)");
};

/**
 * Frost Nova ability implementation
 */
Lich.prototype.frostnova = function() {
    const hero = this.entity.script.hero;
    const attributeSystem = this.entity.script.attributeSystem;
    const ability = this.abilities.ability1;
    
    // Check if enough mana
    if (hero.useMana(ability.manaCost)) {
        console.log(`${hero.heroName} uses ${ability.name}!`);
        
        // Calculate damage based on intelligence
        const damage = 60 + (attributeSystem.intelligence * 1.3);
        
        console.log(`Frost Nova deals ${Math.floor(damage)} magical damage and slows enemies in the area!`);
        
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
 * Dark Ritual ability implementation
 */
Lich.prototype.darkritual = function() {
    const hero = this.entity.script.hero;
    const attributeSystem = this.entity.script.attributeSystem;
    const ability = this.abilities.ability2;
    
    // Calculate health cost (20% of current health)
    const healthCost = Math.floor(attributeSystem.currentHealth * 0.2);
    
    // Ensure we don't kill ourselves
    if (attributeSystem.currentHealth <= healthCost + 10) {
        console.log(`Not enough health to safely use ${ability.name}`);
        return false;
    }
    
    // Calculate mana restored based on health sacrificed and intelligence
    const manaRestored = healthCost * (1.5 + (attributeSystem.intelligence * 0.01));
    
    // Apply the effects
    hero.takeDamage(healthCost, 'pure');
    hero.restoreMana(manaRestored);
    
    console.log(`${hero.heroName} uses ${ability.name}, sacrificing ${healthCost} health to restore ${Math.floor(manaRestored)} mana!`);
    
    // In a real implementation, we would:
    // 1. Create visual effects showing health being converted to mana
    // 2. Apply any additional effects based on ability level
    
    return true;
};

/**
 * Ice Chains ability implementation
 */
Lich.prototype.icechains = function() {
    const hero = this.entity.script.hero;
    const attributeSystem = this.entity.script.attributeSystem;
    const ability = this.abilities.ability3;
    
    // Check if enough mana
    if (hero.useMana(ability.manaCost)) {
        console.log(`${hero.heroName} uses ${ability.name}!`);
        
        // Calculate damage based on intelligence
        const damagePerSecond = 25 + (attributeSystem.intelligence * 0.7);
        const duration = 4;
        const totalDamage = damagePerSecond * duration;
        
        console.log(`Ice Chains binds the target for ${duration} seconds, dealing ${Math.floor(totalDamage)} magical damage over time!`);
        
        // In a real implementation, we would:
        // 1. Apply a root effect to the target
        // 2. Apply damage over time
        // 3. Create visual and sound effects
        
        return true;
    }
    
    return false;
};

/**
 * Chain Frost ability implementation (ultimate)
 */
Lich.prototype.chainfrost = function() {
    const hero = this.entity.script.hero;
    const attributeSystem = this.entity.script.attributeSystem;
    const ability = this.abilities.ability4;
    
    // Check if enough mana
    if (hero.useMana(ability.manaCost)) {
        console.log(`${hero.heroName} uses ${ability.name}!`);
        
        // Calculate damage based on intelligence
        const damagePerBounce = 150 + (attributeSystem.intelligence * 2.5);
        const maxBounces = 5;
        const potentialDamage = damagePerBounce * maxBounces;
        
        console.log(`Chain Frost launches a ball of ice that bounces up to ${maxBounces} times, dealing ${Math.floor(damagePerBounce)} magical damage per bounce (up to ${Math.floor(potentialDamage)} total)!`);
        
        // In a real implementation, we would:
        // 1. Create a projectile that bounces between enemies
        // 2. Apply damage and slow to each hit enemy
        // 3. Create visual and sound effects
        
        return true;
    }
    
    return false;
};

/**
 * Frost Armor passive ability effect
 */
Lich.prototype.frostArmorEffect = function() {
    const hero = this.entity.script.hero;
    const attributeSystem = this.entity.script.attributeSystem;
    
    // Calculate armor bonus based on intelligence
    const armorBonus = 5 + (attributeSystem.intelligence * 0.2);
    const slowEffect = 15 + (attributeSystem.intelligence * 0.3);
    
    console.log(`Frost Armor provides ${armorBonus.toFixed(1)} armor and slows attackers by ${slowEffect.toFixed(1)}% for 2 seconds.`);
    
    // In a real implementation, we would:
    // 1. Apply armor bonus to the hero
    // 2. Apply slow effect to attackers
    // 3. Create visual effects when triggered
    
    return true;
};