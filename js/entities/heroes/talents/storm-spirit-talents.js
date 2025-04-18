/**
 * Storm Spirit Talents
 * 
 * Defines the talent specialization paths for Storm Spirit.
 */

const StormSpiritTalents = {
    // Offensive Path - Focus on damage and mobility
    offensive: {
        tier1: {
            name: "Lightning Mastery",
            description: "Increases Intelligence by 5 and magical damage by 10%.",
            type: "attribute",
            attributes: {
                intelligence: 5
            },
            immediateEffect: function(entity) {
                const attributeSystem = entity.script.attributeSystem;
                if (attributeSystem) {
                    attributeSystem.magicalDamage *= 1.1;
                    console.log("Lightning Mastery activated: +5 Intelligence and +10% magical damage");
                }
            }
        },
        tier2: {
            name: "Overload Amplification",
            description: "Overload deals 30% more damage and has 20% increased area of effect.",
            type: "ability",
            abilitySlot: "ability3",
            modifications: {
                // The damage and area would be handled in the ability implementation
            },
            effectFunction: function(damage) {
                return damage * 1.3;
            }
        },
        tier3: {
            name: "Static Charge",
            description: "Static Remnant creates two remnants instead of one, with the second dealing 70% damage.",
            type: "ability",
            abilitySlot: "ability1",
            modifications: {
                // The second remnant would be handled in the ability implementation
            }
        },
        tier4: {
            name: "Electric Surge",
            description: "After using Ball Lightning, your next ability deals 40% more damage and has 20% increased area of effect.",
            type: "passive",
            effect: function(entity) {
                // This would be called after using Ball Lightning
                entity.electricSurgeActive = true;
                
                console.log("Electric Surge activated: Next ability has increased damage and area");
                
                // The effect would be consumed when using the next ability
            }
        },
        tier5: {
            name: "Lightning God",
            description: "Ball Lightning deals 50% more damage and costs 20% less mana. Overload now applies to all enemies in the Ball Lightning path.",
            type: "ability",
            abilitySlot: "ability4",
            modifications: {
                // The mana cost reduction would be handled in the ability implementation
            },
            effectFunction: function(damage) {
                return damage * 1.5;
            }
        }
    },
    
    // Defensive Path - Focus on survivability and control
    defensive: {
        tier1: {
            name: "Electric Shield",
            description: "Increases Vitality by 5 and grants 10% resistance to all damage.",
            type: "attribute",
            attributes: {
                vitality: 5
            },
            immediateEffect: function(entity) {
                // We'd need a damage reduction system to implement the 10% reduction
                console.log("Electric Shield activated: +5 Vitality and 10% damage reduction");
            }
        },
        tier2: {
            name: "Enhanced Electric Vortex",
            description: "Electric Vortex has 1 second longer duration and pulls enemies 30% closer.",
            type: "ability",
            abilitySlot: "ability2",
            modifications: {
                // The duration and pull strength would be handled in the ability implementation
            }
        },
        tier3: {
            name: "Static Field",
            description: "Creates a protective field that gives you 20% damage reduction for 3 seconds after using Ball Lightning.",
            type: "passive",
            effect: function(entity) {
                // This would be called after using Ball Lightning
                console.log("Static Field activated: 20% damage reduction for 3 seconds");
                
                // In a real implementation, we would:
                // 1. Apply damage reduction
                // 2. Create visual effects
                // 3. Remove after 3 seconds
                
                setTimeout(function() {
                    console.log("Static Field effect ended");
                }, 3000);
            }
        },
        tier4: {
            name: "Lightning Reflexes",
            description: "When you fall below 30% health, automatically become invulnerable and move at maximum speed for 1.5 seconds. 60 second cooldown.",
            type: "passive",
            effect: function(entity) {
                // This would be checked whenever the hero takes damage
                const attributeSystem = entity.script.attributeSystem;
                if (!attributeSystem) return;
                
                // Check if below 30% health
                if (attributeSystem.currentHealth < attributeSystem.maxHealth * 0.3) {
                    // Check if the effect is on cooldown
                    if (!entity.lightningReflexesOnCooldown) {
                        entity.lightningReflexesOnCooldown = true;
                        
                        console.log("Lightning Reflexes activated: Invulnerable and maximum speed for 1.5 seconds");
                        
                        // In a real implementation, we would:
                        // 1. Make the hero invulnerable
                        // 2. Increase movement speed
                        // 3. Create visual effects
                        // 4. Remove effects after 1.5 seconds
                        
                        setTimeout(function() {
                            console.log("Lightning Reflexes effect ended");
                        }, 1500);
                        
                        // Reset cooldown after 60 seconds
                        setTimeout(function() {
                            entity.lightningReflexesOnCooldown = false;
                            console.log("Lightning Reflexes ready again");
                        }, 60000);
                    }
                }
            }
        },
        tier5: {
            name: "Storm Avatar",
            description: "Gain 20% maximum health. While Overload is charged, gain 30% damage reduction and 20% crowd control resistance.",
            type: "resource",
            resourceModifications: {
                maxHealthMultiplier: 1.2
            },
            immediateEffect: function(entity) {
                // The effects during Overload would be implemented in the ability
                console.log("Storm Avatar activated: +20% maximum health and effects during Overload");
            }
        }
    },
    
    // Utility Path - Focus on resource management and mobility
    utility: {
        tier1: {
            name: "Energy Flow",
            description: "Increases Agility by 5 and increases movement speed by 10%.",
            type: "attribute",
            attributes: {
                agility: 5
            },
            immediateEffect: function(entity) {
                const attributeSystem = entity.script.attributeSystem;
                if (attributeSystem) {
                    attributeSystem.movementSpeed *= 1.1;
                    console.log("Energy Flow activated: +5 Agility and +10% movement speed");
                }
            }
        },
        tier2: {
            name: "Efficient Lightning",
            description: "Ball Lightning costs 30% less mana per unit traveled.",
            type: "ability",
            abilitySlot: "ability4",
            modifications: {
                // The mana cost reduction would be handled in the ability implementation
            }
        },
        tier3: {
            name: "Lightning Conductor",
            description: "After using any ability, gain 20% increased movement speed for 3 seconds.",
            type: "passive",
            effect: function(entity) {
                // This would be called after using any ability
                const attributeSystem = entity.script.attributeSystem;
                if (attributeSystem) {
                    // Store original value
                    const originalMovementSpeed = attributeSystem.movementSpeed;
                    
                    // Apply bonus
                    attributeSystem.movementSpeed *= 1.2;
                    
                    console.log("Lightning Conductor activated: +20% movement speed for 3 seconds");
                    
                    // Reset after 3 seconds
                    setTimeout(function() {
                        attributeSystem.movementSpeed = originalMovementSpeed;
                        console.log("Lightning Conductor effect ended");
                    }, 3000);
                }
            }
        },
        tier4: {
            name: "Energy Absorption",
            description: "Killing an enemy restores 5% of your maximum mana and reduces Ball Lightning's cooldown by 3 seconds.",
            type: "passive",
            effect: function(entity) {
                // This would be called when killing an enemy
                const attributeSystem = entity.script.attributeSystem;
                const abilitySystem = entity.script.abilitySystem;
                
                if (attributeSystem) {
                    // Restore mana
                    const manaAmount = attributeSystem.maxMana * 0.05;
                    attributeSystem.currentMana = Math.min(
                        attributeSystem.currentMana + manaAmount,
                        attributeSystem.maxMana
                    );
                    console.log(`Energy Absorption: Restored ${manaAmount.toFixed(1)} mana`);
                }
                
                if (abilitySystem) {
                    // Reduce Ball Lightning cooldown
                    if (abilitySystem.cooldowns.ability4 > 0) {
                        abilitySystem.cooldowns.ability4 = Math.max(0, abilitySystem.cooldowns.ability4 - 3);
                        console.log("Energy Absorption: Reduced Ball Lightning cooldown by 3 seconds");
                    }
                }
            }
        },
        tier5: {
            name: "Lightning Mastery",
            description: "Gain 30% maximum mana. Ball Lightning now allows you to cast other abilities while traveling.",
            type: "resource",
            resourceModifications: {
                maxManaMultiplier: 1.3
            },
            immediateEffect: function(entity) {
                // The ability to cast during Ball Lightning would be implemented in the ability
                console.log("Lightning Mastery activated: +30% maximum mana and casting during Ball Lightning");
            }
        }
    }
};