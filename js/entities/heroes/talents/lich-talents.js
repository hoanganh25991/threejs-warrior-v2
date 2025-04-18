/**
 * Lich Talents
 * 
 * Defines the talent specialization paths for Lich.
 */

const LichTalents = {
    // Offensive Path - Focus on damage and crowd control
    offensive: {
        tier1: {
            name: "Frost Mastery",
            description: "Increases Intelligence by 5 and magical damage by 10%.",
            type: "attribute",
            attributes: {
                intelligence: 5
            },
            immediateEffect: function(entity) {
                const attributeSystem = entity.script.attributeSystem;
                if (attributeSystem) {
                    attributeSystem.magicalDamage *= 1.1;
                    console.log("Frost Mastery activated: +5 Intelligence and +10% magical damage");
                }
            }
        },
        tier2: {
            name: "Chain Frost Enhancement",
            description: "Chain Frost bounces 2 additional times and deals 15% more damage per bounce.",
            type: "ability",
            abilitySlot: "ability4",
            modifications: {
                // The bounce count would be handled in the ability implementation
            },
            effectFunction: function(damage) {
                return damage * 1.15;
            }
        },
        tier3: {
            name: "Frost Nova Amplification",
            description: "Frost Nova has 25% increased radius and applies a 40% slow instead of 30%.",
            type: "ability",
            abilitySlot: "ability1",
            modifications: {
                // The radius and slow effect would be handled in the ability implementation
            }
        },
        tier4: {
            name: "Ice Shards",
            description: "Your damaging abilities have a 20% chance to create ice shards that deal 30% of the ability's damage to nearby enemies.",
            type: "passive",
            effect: function(entity, damage, position) {
                // This would be called when a damaging ability hits
                // Check for proc chance
                if (Math.random() < 0.2) {
                    const shardDamage = damage * 0.3;
                    console.log(`Ice Shards proc! Dealing ${shardDamage.toFixed(1)} additional damage to nearby enemies`);
                    
                    // In a real implementation, we would:
                    // 1. Find nearby enemies
                    // 2. Apply the shard damage to each
                    // 3. Create visual effects
                }
            }
        },
        tier5: {
            name: "Absolute Zero",
            description: "Your frost abilities reduce enemy magic resistance by 5% per hit, stacking up to 25%. Chain Frost now pierces spell immunity.",
            type: "playstyle",
            playstyleModification: "magic_penetration",
            applyEffect: function(entity) {
                // This would be implemented in the ability effects
                console.log("Absolute Zero activated: Abilities now reduce magic resistance");
            }
        }
    },
    
    // Defensive Path - Focus on survivability and control
    defensive: {
        tier1: {
            name: "Ice Barrier",
            description: "Increases Vitality by 5 and grants 10% resistance to all damage.",
            type: "attribute",
            attributes: {
                vitality: 5
            },
            immediateEffect: function(entity) {
                // We'd need a damage reduction system to implement the 10% reduction
                console.log("Ice Barrier activated: +5 Vitality and 10% damage reduction");
            }
        },
        tier2: {
            name: "Enhanced Frost Armor",
            description: "Frost Armor provides 50% more armor and slows attackers by an additional 10%.",
            type: "passive",
            effect: function(entity) {
                // This would be implemented in the passive ability
                console.log("Enhanced Frost Armor activated: Increased armor and slow effect");
            }
        },
        tier3: {
            name: "Ice Chains Mastery",
            description: "Ice Chains lasts 1.5 seconds longer and reduces the target's damage output by 20%.",
            type: "ability",
            abilitySlot: "ability3",
            modifications: {
                // The duration and damage reduction would be handled in the ability implementation
            }
        },
        tier4: {
            name: "Frozen Soul",
            description: "When you fall below 30% health, automatically freeze all enemies within 10 meters for 1.5 seconds. 60 second cooldown.",
            type: "passive",
            effect: function(entity) {
                // This would be checked whenever the hero takes damage
                const attributeSystem = entity.script.attributeSystem;
                if (!attributeSystem) return;
                
                // Check if below 30% health
                if (attributeSystem.currentHealth < attributeSystem.maxHealth * 0.3) {
                    // Check if the effect is on cooldown
                    if (!entity.frozenSoulOnCooldown) {
                        entity.frozenSoulOnCooldown = true;
                        
                        console.log("Frozen Soul activated: Nearby enemies frozen for 1.5 seconds");
                        
                        // In a real implementation, we would:
                        // 1. Find nearby enemies
                        // 2. Apply a freeze effect to each
                        // 3. Create visual effects
                        
                        // Reset cooldown after 60 seconds
                        setTimeout(function() {
                            entity.frozenSoulOnCooldown = false;
                            console.log("Frozen Soul ready again");
                        }, 60000);
                    }
                }
            }
        },
        tier5: {
            name: "Ice Fortress",
            description: "Gain 20% maximum health and 15% cooldown reduction. Dark Ritual now converts 30% of sacrificed health to a shield that absorbs damage.",
            type: "resource",
            resourceModifications: {
                maxHealthMultiplier: 1.2
            },
            immediateEffect: function(entity) {
                const abilitySystem = entity.script.abilitySystem;
                if (abilitySystem && abilitySystem.abilityDefinitions) {
                    // Reduce cooldowns of all abilities by 15%
                    for (const slot in abilitySystem.abilityDefinitions) {
                        const ability = abilitySystem.abilityDefinitions[slot];
                        if (ability.cooldown) {
                            ability.cooldown *= 0.85;
                        }
                    }
                }
                
                // The shield from Dark Ritual would be implemented in the ability
                console.log("Ice Fortress activated: +20% maximum health, 15% CDR, and Dark Ritual shield");
            }
        }
    },
    
    // Utility Path - Focus on resource management and versatility
    utility: {
        tier1: {
            name: "Necromantic Power",
            description: "Increases Spirit by 5 and increases mana regeneration by 50%.",
            type: "attribute",
            attributes: {
                spirit: 5
            },
            immediateEffect: function(entity) {
                // We'd need a mana regeneration system to implement the 50% increase
                console.log("Necromantic Power activated: +5 Spirit and +50% mana regeneration");
            }
        },
        tier2: {
            name: "Enhanced Dark Ritual",
            description: "Dark Ritual converts 50% more health to mana and has a 15 second reduced cooldown.",
            type: "ability",
            abilitySlot: "ability2",
            modifications: {
                cooldown: 30 // 45 - 15 = 30
            }
        },
        tier3: {
            name: "Frost Efficiency",
            description: "All abilities cost 20% less mana and have 10% reduced cooldowns.",
            type: "passive",
            effect: function(entity) {
                const abilitySystem = entity.script.abilitySystem;
                if (abilitySystem && abilitySystem.abilityDefinitions) {
                    // Reduce mana costs and cooldowns
                    for (const slot in abilitySystem.abilityDefinitions) {
                        const ability = abilitySystem.abilityDefinitions[slot];
                        if (ability.manaCost) {
                            ability.manaCost *= 0.8;
                        }
                        if (ability.cooldown) {
                            ability.cooldown *= 0.9;
                        }
                    }
                    console.log("Frost Efficiency activated: 20% less mana cost and 10% reduced cooldowns");
                }
            }
        },
        tier4: {
            name: "Soul Harvest",
            description: "Killing an enemy restores 5% of your maximum mana and reduces all ability cooldowns by 1 second.",
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
                    console.log(`Soul Harvest: Restored ${manaAmount.toFixed(1)} mana`);
                }
                
                if (abilitySystem) {
                    // Reduce cooldowns
                    for (const slot in abilitySystem.cooldowns) {
                        if (abilitySystem.cooldowns[slot] > 0) {
                            abilitySystem.cooldowns[slot] = Math.max(0, abilitySystem.cooldowns[slot] - 1);
                        }
                    }
                    console.log("Soul Harvest: Reduced all ability cooldowns by 1 second");
                }
            }
        },
        tier5: {
            name: "Arcane Mastery",
            description: "Gain 30% maximum mana. Chain Frost has a 15% chance to reset its cooldown when cast.",
            type: "resource",
            resourceModifications: {
                maxManaMultiplier: 1.3
            },
            immediateEffect: function(entity) {
                // The cooldown reset chance would be checked when using Chain Frost
                console.log("Arcane Mastery activated: +30% maximum mana and Chain Frost reset chance");
            }
        }
    }
};