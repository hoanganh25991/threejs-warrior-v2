/**
 * Axe Talents
 * 
 * Defines the talent specialization paths for Axe.
 */

const AxeTalents = {
    // Offensive Path - Focus on damage and aggression
    offensive: {
        tier1: {
            name: "Battle Rage",
            description: "Increases Strength by 5 and physical damage by 10%.",
            type: "attribute",
            attributes: {
                strength: 5
            },
            immediateEffect: function(entity) {
                const attributeSystem = entity.script.attributeSystem;
                if (attributeSystem) {
                    attributeSystem.physicalDamage *= 1.1;
                }
            }
        },
        tier2: {
            name: "Culling Mastery",
            description: "Culling Blade deals 25% more damage and has a 20% reduced cooldown.",
            type: "ability",
            abilitySlot: "ability4",
            modifications: {
                cooldown: 36 // 45 * 0.8 = 36
            },
            effectFunction: function(damage) {
                return damage * 1.25;
            }
        },
        tier3: {
            name: "Berserker's Fury",
            description: "After using Berserker's Call, gain 30% attack speed for 5 seconds.",
            type: "passive",
            effect: function(entity) {
                // This would be called after using Berserker's Call
                const attributeSystem = entity.script.attributeSystem;
                if (attributeSystem) {
                    // Apply temporary attack speed bonus
                    const originalAttackSpeed = attributeSystem.attackSpeed;
                    attributeSystem.attackSpeed *= 1.3;
                    
                    // Reset after 5 seconds
                    setTimeout(function() {
                        attributeSystem.attackSpeed = originalAttackSpeed;
                        console.log("Berserker's Fury effect ended");
                    }, 5000);
                    
                    console.log("Berserker's Fury activated: +30% attack speed for 5 seconds");
                }
            }
        },
        tier4: {
            name: "Relentless Onslaught",
            description: "Killing an enemy with Culling Blade grants 20% movement speed and 15% damage reduction for 8 seconds.",
            type: "passive",
            effect: function(entity) {
                // This would be called after a successful Culling Blade kill
                const attributeSystem = entity.script.attributeSystem;
                if (attributeSystem) {
                    // Store original values
                    const originalMovementSpeed = attributeSystem.movementSpeed;
                    
                    // Apply bonuses
                    attributeSystem.movementSpeed *= 1.2;
                    
                    // We'd need a damage reduction system to implement the 15% reduction
                    
                    // Reset after 8 seconds
                    setTimeout(function() {
                        attributeSystem.movementSpeed = originalMovementSpeed;
                        console.log("Relentless Onslaught effect ended");
                    }, 8000);
                    
                    console.log("Relentless Onslaught activated: +20% movement speed and 15% damage reduction for 8 seconds");
                }
            }
        },
        tier5: {
            name: "Unstoppable Juggernaut",
            description: "Gain 15% increased Strength and 20% increased health. Berserker's Call now also provides 50% crowd control resistance.",
            type: "attribute",
            attributes: {
                strength: 0 // Will be calculated based on current strength
            },
            immediateEffect: function(entity) {
                const attributeSystem = entity.script.attributeSystem;
                if (attributeSystem) {
                    // Increase strength by 15%
                    const strengthBonus = Math.floor(attributeSystem.strength * 0.15);
                    attributeSystem.strength += strengthBonus;
                    
                    // Increase max health by 20%
                    attributeSystem.maxHealth *= 1.2;
                    attributeSystem.currentHealth = attributeSystem.maxHealth;
                    
                    // The crowd control resistance would need a status effect system
                    
                    console.log(`Unstoppable Juggernaut activated: +${strengthBonus} Strength and +20% max health`);
                }
            }
        }
    },
    
    // Defensive Path - Focus on survivability and control
    defensive: {
        tier1: {
            name: "Reinforced Armor",
            description: "Increases Vitality by 5 and reduces physical damage taken by 10%.",
            type: "attribute",
            attributes: {
                vitality: 5
            },
            immediateEffect: function(entity) {
                // We'd need a damage reduction system to implement the 10% reduction
                console.log("Reinforced Armor activated: +5 Vitality and 10% physical damage reduction");
            }
        },
        tier2: {
            name: "Enhanced Taunt",
            description: "Berserker's Call has 2 seconds longer duration and grants 15 additional armor.",
            type: "ability",
            abilitySlot: "ability1",
            modifications: {
                // The duration would be handled in the ability implementation
            },
            effectFunction: function(armorBonus) {
                return armorBonus + 15;
            }
        },
        tier3: {
            name: "Counter Force",
            description: "Counter Helix has a 15% higher proc chance and deals 20% more damage.",
            type: "ability",
            abilitySlot: "ability3",
            modifications: {
                // The proc chance would be handled in the ability implementation
            },
            effectFunction: function(damage) {
                return damage * 1.2;
            }
        },
        tier4: {
            name: "Unbreakable",
            description: "When below 30% health, gain 30% damage reduction for 5 seconds. This effect can occur once every 60 seconds.",
            type: "passive",
            effect: function(entity) {
                // This would be checked whenever the hero takes damage
                const attributeSystem = entity.script.attributeSystem;
                if (!attributeSystem) return;
                
                // Check if below 30% health
                if (attributeSystem.currentHealth < attributeSystem.maxHealth * 0.3) {
                    // Check if the effect is on cooldown
                    if (!entity.unbreakableOnCooldown) {
                        entity.unbreakableOnCooldown = true;
                        
                        // Apply damage reduction (would need a damage reduction system)
                        console.log("Unbreakable activated: 30% damage reduction for 5 seconds");
                        
                        // End effect after 5 seconds
                        setTimeout(function() {
                            console.log("Unbreakable effect ended");
                        }, 5000);
                        
                        // Reset cooldown after 60 seconds
                        setTimeout(function() {
                            entity.unbreakableOnCooldown = false;
                            console.log("Unbreakable ready again");
                        }, 60000);
                    }
                }
            }
        },
        tier5: {
            name: "Indomitable Will",
            description: "Gain 20% maximum health and 15% crowd control resistance. When you use Berserker's Call, heal for 5% of your maximum health per second during its duration.",
            type: "resource",
            resourceModifications: {
                maxHealthMultiplier: 1.2
            },
            immediateEffect: function(entity) {
                // The healing during Berserker's Call would be implemented in the ability
                console.log("Indomitable Will activated: +20% maximum health and crowd control resistance");
            }
        }
    },
    
    // Utility Path - Focus on versatility and resource management
    utility: {
        tier1: {
            name: "Battle Momentum",
            description: "Increases Agility by 5 and reduces all ability cooldowns by 10%.",
            type: "attribute",
            attributes: {
                agility: 5
            },
            immediateEffect: function(entity) {
                const abilitySystem = entity.script.abilitySystem;
                if (abilitySystem && abilitySystem.abilityDefinitions) {
                    // Reduce cooldowns of all abilities by 10%
                    for (const slot in abilitySystem.abilityDefinitions) {
                        const ability = abilitySystem.abilityDefinitions[slot];
                        if (ability.cooldown) {
                            ability.cooldown *= 0.9;
                        }
                    }
                    console.log("Battle Momentum activated: +5 Agility and 10% cooldown reduction");
                }
            }
        },
        tier2: {
            name: "Tactical Advantage",
            description: "Battle Hunger now also increases your movement speed by 15% while active on any enemy.",
            type: "ability",
            abilitySlot: "ability2",
            modifications: {
                // The movement speed bonus would be handled in the ability implementation
            }
        },
        tier3: {
            name: "Adrenaline Rush",
            description: "Killing an enemy restores 5% of your maximum health and reduces all ability cooldowns by 1 second.",
            type: "passive",
            effect: function(entity) {
                // This would be called when killing an enemy
                const attributeSystem = entity.script.attributeSystem;
                const abilitySystem = entity.script.abilitySystem;
                
                if (attributeSystem) {
                    // Restore health
                    const healAmount = attributeSystem.maxHealth * 0.05;
                    attributeSystem.currentHealth = Math.min(
                        attributeSystem.currentHealth + healAmount,
                        attributeSystem.maxHealth
                    );
                    console.log(`Adrenaline Rush: Restored ${healAmount.toFixed(1)} health`);
                }
                
                if (abilitySystem) {
                    // Reduce cooldowns
                    for (const slot in abilitySystem.cooldowns) {
                        if (abilitySystem.cooldowns[slot] > 0) {
                            abilitySystem.cooldowns[slot] = Math.max(0, abilitySystem.cooldowns[slot] - 1);
                        }
                    }
                    console.log("Adrenaline Rush: Reduced all ability cooldowns by 1 second");
                }
            }
        },
        tier4: {
            name: "Battle Trance",
            description: "After using any ability, gain 10% increased damage and 10% increased movement speed for 3 seconds.",
            type: "passive",
            effect: function(entity) {
                // This would be called after using any ability
                const attributeSystem = entity.script.attributeSystem;
                if (attributeSystem) {
                    // Store original values
                    const originalMovementSpeed = attributeSystem.movementSpeed;
                    const originalPhysicalDamage = attributeSystem.physicalDamage;
                    const originalMagicalDamage = attributeSystem.magicalDamage;
                    
                    // Apply bonuses
                    attributeSystem.movementSpeed *= 1.1;
                    attributeSystem.physicalDamage *= 1.1;
                    attributeSystem.magicalDamage *= 1.1;
                    
                    // Reset after 3 seconds
                    setTimeout(function() {
                        attributeSystem.movementSpeed = originalMovementSpeed;
                        attributeSystem.physicalDamage = originalPhysicalDamage;
                        attributeSystem.magicalDamage = originalMagicalDamage;
                        console.log("Battle Trance effect ended");
                    }, 3000);
                    
                    console.log("Battle Trance activated: +10% damage and movement speed for 3 seconds");
                }
            }
        },
        tier5: {
            name: "Warlord's Command",
            description: "Berserker's Call now also empowers nearby allies, granting them 20% increased damage and 10% cooldown reduction for 5 seconds.",
            type: "playstyle",
            playstyleModification: "ally_buff",
            applyEffect: function(entity) {
                // This would require an ally system to implement
                console.log("Warlord's Command activated: Berserker's Call now buffs allies");
            }
        }
    }
};