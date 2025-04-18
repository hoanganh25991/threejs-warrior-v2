/**
 * Talent System
 * 
 * Handles hero talents, specialization paths, and talent point allocation.
 * Based on the requirements in docs/gameplay/progression.md
 */

const TalentSystem = pc.createScript('talentSystem');

// Initialize the talent system
TalentSystem.prototype.initialize = function() {
    // Talent points available for spending
    this.talentPoints = 0;
    
    // Talent paths and selections
    this.talentPaths = {
        offensive: {
            name: "Offensive",
            description: "Focus on maximizing damage output and aggressive playstyle.",
            tiers: {}
        },
        defensive: {
            name: "Defensive",
            description: "Focus on survivability and control abilities.",
            tiers: {}
        },
        utility: {
            name: "Utility",
            description: "Focus on versatility and resource management.",
            tiers: {}
        }
    };
    
    // Selected talents (tier -> path)
    this.selectedTalents = {
        tier1: null, // Level 5
        tier2: null, // Level 10
        tier3: null, // Level 15
        tier4: null, // Level 20
        tier5: null  // Level 25
    };
    
    // Register for level up events to gain talent points
    this.entity.on('level:up', this.onLevelUp, this);
    
    console.log("Talent system initialized");
};

TalentSystem.prototype.update = function(dt) {
    // Nothing to update continuously
};

/**
 * Handle level up events
 * @param {number} level - The new level
 */
TalentSystem.prototype.onLevelUp = function(level) {
    // Grant talent points at specific levels
    if ([5, 10, 15, 20, 25].includes(level)) {
        this.talentPoints++;
        console.log(`Level ${level} reached! Gained 1 Talent Point. Total: ${this.talentPoints}`);
    }
};

/**
 * Set up hero-specific talents
 * @param {Object} talents - Object containing talent definitions for this hero
 */
TalentSystem.prototype.setupTalents = function(talents) {
    // Store the talent definitions
    if (talents.offensive) {
        this.talentPaths.offensive.tiers = talents.offensive;
    }
    
    if (talents.defensive) {
        this.talentPaths.defensive.tiers = talents.defensive;
    }
    
    if (talents.utility) {
        this.talentPaths.utility.tiers = talents.utility;
    }
    
    console.log("Hero-specific talents configured");
};

/**
 * Spend a talent point
 * @param {string} tier - The tier to spend the point on (tier1, tier2, etc.)
 * @param {string} path - The path to select (offensive, defensive, utility)
 * @returns {boolean} - Whether the talent was successfully selected
 */
TalentSystem.prototype.selectTalent = function(tier, path) {
    // Check if we have talent points available
    if (this.talentPoints <= 0) {
        console.log("No talent points available to spend");
        return false;
    }
    
    // Check if the tier is valid
    if (!this.selectedTalents.hasOwnProperty(tier)) {
        console.log(`Invalid talent tier: ${tier}`);
        return false;
    }
    
    // Check if the path is valid
    if (!this.talentPaths.hasOwnProperty(path)) {
        console.log(`Invalid talent path: ${path}`);
        return false;
    }
    
    // Check if the tier has a talent for this path
    if (!this.talentPaths[path].tiers[tier]) {
        console.log(`No talent defined for ${path} path at ${tier}`);
        return false;
    }
    
    // Check if we've already selected a talent for this tier
    if (this.selectedTalents[tier]) {
        console.log(`A talent has already been selected for ${tier}`);
        return false;
    }
    
    // Check if we meet the level requirement for this tier
    const tierLevel = {
        tier1: 5,
        tier2: 10,
        tier3: 15,
        tier4: 20,
        tier5: 25
    };
    
    const currentLevel = this.entity.script.experienceSystem ? 
                         this.entity.script.experienceSystem.level : 1;
                         
    if (currentLevel < tierLevel[tier]) {
        console.log(`Cannot select ${tier} talent until level ${tierLevel[tier]}`);
        return false;
    }
    
    // All checks passed, select the talent
    this.selectedTalents[tier] = path;
    this.talentPoints--;
    
    // Apply the talent effect
    this.applyTalentEffect(tier, path);
    
    console.log(`Selected ${this.talentPaths[path].tiers[tier].name} talent from the ${this.talentPaths[path].name} path!`);
    console.log(`Talent points remaining: ${this.talentPoints}`);
    
    return true;
};

/**
 * Apply the effect of a selected talent
 * @param {string} tier - The tier of the selected talent
 * @param {string} path - The path of the selected talent
 */
TalentSystem.prototype.applyTalentEffect = function(tier, path) {
    const talent = this.talentPaths[path].tiers[tier];
    
    if (!talent) {
        console.error(`No talent found for ${path} path at ${tier}`);
        return;
    }
    
    console.log(`Applying talent effect: ${talent.name}`);
    
    // Get references to other systems
    const attributeSystem = this.entity.script.attributeSystem;
    const abilitySystem = this.entity.script.abilitySystem;
    const hero = this.entity.script.hero;
    
    // Apply the talent effect based on its type
    switch (talent.type) {
        case 'attribute':
            // Apply attribute bonuses
            if (attributeSystem && talent.attributes) {
                for (const attr in talent.attributes) {
                    if (attributeSystem.hasOwnProperty(attr)) {
                        attributeSystem[attr] += talent.attributes[attr];
                        console.log(`Increased ${attr} by ${talent.attributes[attr]}`);
                    }
                }
                // Recalculate derived stats
                attributeSystem.calculateDerivedStats();
            }
            break;
            
        case 'ability':
            // Modify an ability
            if (abilitySystem && talent.abilitySlot && talent.modifications) {
                const ability = abilitySystem.abilityDefinitions[talent.abilitySlot];
                if (ability) {
                    // Apply modifications
                    for (const prop in talent.modifications) {
                        ability[prop] = talent.modifications[prop];
                        console.log(`Modified ${ability.name} ${prop} to ${talent.modifications[prop]}`);
                    }
                    
                    // If there's a special effect function, store it for later use
                    if (talent.effectFunction) {
                        ability.talentEffect = talent.effectFunction;
                        console.log(`Added special effect to ${ability.name}`);
                    }
                }
            }
            break;
            
        case 'passive':
            // Add a new passive effect
            if (hero && talent.effect) {
                // Store the passive effect in the hero
                if (!hero.passiveEffects) {
                    hero.passiveEffects = [];
                }
                
                hero.passiveEffects.push({
                    name: talent.name,
                    description: talent.description,
                    effect: talent.effect
                });
                
                console.log(`Added passive effect: ${talent.name}`);
                
                // If the passive has an immediate effect, apply it
                if (talent.immediateEffect && typeof talent.immediateEffect === 'function') {
                    talent.immediateEffect(this.entity);
                }
            }
            break;
            
        case 'resource':
            // Modify resource mechanics
            if (attributeSystem && talent.resourceModifications) {
                for (const mod in talent.resourceModifications) {
                    // Apply resource modifications
                    if (mod === 'maxHealthMultiplier') {
                        attributeSystem.maxHealth *= talent.resourceModifications[mod];
                        attributeSystem.currentHealth = attributeSystem.maxHealth;
                        console.log(`Applied ${mod} of ${talent.resourceModifications[mod]}`);
                    } else if (mod === 'maxManaMultiplier') {
                        attributeSystem.maxMana *= talent.resourceModifications[mod];
                        attributeSystem.currentMana = attributeSystem.maxMana;
                        console.log(`Applied ${mod} of ${talent.resourceModifications[mod]}`);
                    } else if (mod === 'healthRegenBonus') {
                        // Would need to implement health regen system
                        console.log(`Applied ${mod} of ${talent.resourceModifications[mod]}`);
                    } else if (mod === 'manaRegenBonus') {
                        // Would need to implement mana regen system
                        console.log(`Applied ${mod} of ${talent.resourceModifications[mod]}`);
                    }
                }
            }
            break;
            
        case 'playstyle':
            // Fundamental change to hero mechanics
            if (hero && talent.playstyleModification) {
                // Store the playstyle modification
                if (!hero.playstyleModifications) {
                    hero.playstyleModifications = [];
                }
                
                hero.playstyleModifications.push({
                    name: talent.name,
                    description: talent.description,
                    modification: talent.playstyleModification
                });
                
                console.log(`Applied playstyle modification: ${talent.name}`);
                
                // If there's an immediate effect, apply it
                if (talent.applyEffect && typeof talent.applyEffect === 'function') {
                    talent.applyEffect(this.entity);
                }
            }
            break;
            
        default:
            console.log(`Unknown talent type: ${talent.type}`);
    }
};

/**
 * Get all available talents for the current hero
 * @returns {Object} - Object containing all talent paths and tiers
 */
TalentSystem.prototype.getAvailableTalents = function() {
    return this.talentPaths;
};

/**
 * Get currently selected talents
 * @returns {Object} - Object containing selected talents by tier
 */
TalentSystem.prototype.getSelectedTalents = function() {
    const result = {};
    
    for (const tier in this.selectedTalents) {
        const path = this.selectedTalents[tier];
        if (path) {
            result[tier] = {
                path: path,
                talent: this.talentPaths[path].tiers[tier]
            };
        }
    }
    
    return result;
};

/**
 * Reset all talent selections (for testing or respec)
 */
TalentSystem.prototype.resetTalents = function() {
    // Restore talent points
    let pointsToRestore = 0;
    for (const tier in this.selectedTalents) {
        if (this.selectedTalents[tier]) {
            pointsToRestore++;
        }
    }
    
    this.talentPoints += pointsToRestore;
    
    // Clear selections
    for (const tier in this.selectedTalents) {
        this.selectedTalents[tier] = null;
    }
    
    console.log(`Talents reset. Restored ${pointsToRestore} talent points. Total: ${this.talentPoints}`);
    
    // Note: This doesn't undo the effects of talents
    // In a real implementation, we would need to track and remove all talent effects
    console.log("Warning: Talent effects have not been removed. Entity state may be inconsistent.");
};

/**
 * Add talent points (for testing or special rewards)
 * @param {number} points - Number of points to add
 */
TalentSystem.prototype.addTalentPoints = function(points) {
    this.talentPoints += points;
    console.log(`Gained ${points} talent point(s). Total: ${this.talentPoints}`);
};