/**
 * Crystal Maiden Talents
 * 
 * Defines the talent specialization paths for Crystal Maiden.
 */

const CrystalMaidenTalents = {
    // Offensive Path - Focus on damage and crowd control
    offensive: {
        tier1: {
            name: "Frost Amplification",
            description: "Increases Intelligence by 5 and magical damage by 10%.",
            type: "attribute",
            attributes: {
                intelligence: 5
            },
            immediateEffect: function(entity) {
                const attributeSystem = entity.script.attributeSystem;
                if (attributeSystem) {
                    attributeSystem.magicalDamage *= 1.1;
                    console.log("Frost Amplification activated: +5 Intelligence and +10% magical damage");
                }
            }
        },
        tier2: {
            name: "Crystal Nova Mastery",
            description: "Crystal Nova has 20% increased area of effect and applies a 40% slow instead of 30%.",
            type: "ability",
            abilitySlot: "ability1",
            modifications: {
                // The area and slow effect would be handled in the ability implementation
            }
        },
        tier3: {
            name: "Piercing Cold",
            description: "Your damaging abilities reduce the target's magic resistance by 15% for 4 seconds.",
            type: "passive",
            effect: function(entity, target) {
                // This would be called when hitting an enemy with a damaging ability
                // We'd need a magic resistance system to implement this
                console.log("Piercing Cold applied: Target's magic resistance reduced by 15% for 4 seconds");
                
                // Reset after 4 seconds
                setTimeout(function() {
                    console.log("Piercing Cold effect ended on target");
                }, 4000);
            }
        },
        tier4: {
            name: "Freezing Field Enhancement",
            description: "Freezing Field deals 30% more damage and has a 15% larger radius.",
            type: "ability",
            abilitySlot: "ability4",
            modifications: {
                // The damage and radius would be handled in the ability implementation
            },
            effectFunction: function(damage) {
                return damage * 1.3;
            }
        },
        tier5: {
            name: "Absolute Zero",
            description: "Enemies at the center of Crystal Nova or Freezing Field are frozen solid for 1.5 seconds, unable to move or act.",
            type: "playstyle",
            playstyleModification: "hard_freeze",
            applyEffect: function(entity) {
                // This would be implemented in the ability effects
                console.log("Absolute Zero activated: Abilities can now freeze enemies solid");
            }
        }
    },
    
    // Defensive Path - Focus on survivability and ally protection
    defensive: {
        tier1: {
            name: "Frost Armor",
            description: "Increases Vitality by 5 and grants 10% resistance to physical damage.",
            type: "attribute",
            attributes: {
                vitality: 5
            },
            immediateEffect: function(entity) {
                // We'd need a damage reduction system to implement the 10% reduction
                console.log("Frost Armor activated: +5 Vitality and 10% physical damage reduction");
            }
        },
        tier2: {
            name: "Enhanced Frostbite",
            description: "Frostbite lasts 1 second longer and reduces the target's damage output by 20%.",
            type: "ability",
            abilitySlot: "ability2",
            modifications: {
                // The duration and damage reduction would be handled in the ability implementation
            }
        },
        tier3: {
            name: "Protective Aura",
            description: "Arcane Aura now also grants nearby allies 10% damage reduction.",
            type: "passive",
            effect: function(entity) {
                // This would require an ally system to implement
                console.log("Protective Aura activated: Allies receive 10% damage reduction");
            }
        },
        tier4: {
            name: "Ice Barrier",
            description: "When you fall below 30% health, automatically create an ice shield that absorbs 30% of your maximum health in damage. 60 second cooldown.",
            type: "passive",
            effect: function(entity) {
                // This would be checked whenever the hero takes damage
                const attributeSystem = entity.script.attributeSystem;
                if (!attributeSystem) return;
                
                // Check if below 30% health
                if (attributeSystem.currentHealth < attributeSystem.maxHealth * 0.3) {
                    // Check if the effect is on cooldown
                    if (!entity.iceBarrierOnCooldown) {
                        entity.iceBarrierOnCooldown = true;
                        
                        // Create shield
                        const shieldAmount = attributeSystem.maxHealth * 0.3;
                        entity.iceBarrierShield = shieldAmount;
                        
                        console.log(`Ice Barrier activated: Shield absorbs ${shieldAmount.toFixed(1)} damage`);
                        
                        // Reset cooldown after 60 seconds
                        setTimeout(function() {
                            entity.iceBarrierOnCooldown = false;
                            console.log("Ice Barrier ready again");
                        }, 60000);
                    }
                }
            }
        },
        tier5: {
            name: "Winter's Embrace",
            description: "Gain 20% maximum health. Freezing Field now heals you and nearby allies for 3% of maximum health per second while channeling.",
            type: "resource",
            resourceModifications: {
                maxHealthMultiplier: 1.2
            },
            immediateEffect: function(entity) {
                // The healing during Freezing Field would be implemented in the ability
                console.log("Winter's Embrace activated: +20% maximum health and healing during Freezing Field");
            }
        }
    },
    
    // Utility Path - Focus on mana management and support
    utility: {
        tier1: {
            name: "Mana Flow",
            description: "Increases Spirit by 5 and increases mana regeneration by 50%.",
            type: "attribute",
            attributes: {
                spirit: 5
            },
            immediateEffect: function(entity) {
                // We'd need a mana regeneration system to implement the 50% increase
                console.log("Mana Flow activated: +5 Spirit and +50% mana regeneration");
            }
        },
        tier2: {
            name: "Enhanced Arcane Aura",
            description: "Arcane Aura provides 100% more mana regeneration to you and allies.",
            type: "passive",
            effect: function(entity) {
                // This would be implemented in the passive ability
                console.log("Enhanced Arcane Aura activated: Double mana regeneration");
            }
        },
        tier3: {
            name: "Glacial Path Mastery",
            description: "Glacial Path costs 50% less mana and grants 30% movement speed instead of 20%.",
            type: "ability",
            abilitySlot: "ability3",
            modifications: {
                manaCost: 37.5 // 75 * 0.5 = 37.5
            }
        },
        tier4: {
            name: "Frost Channeling",
            description: "After casting an ability, your next ability within 4 seconds costs 40% less mana.",
            type: "passive",
            effect: function(entity) {
                // This would be called after casting an ability
                const abilitySystem = entity.script.abilitySystem;
                if (abilitySystem) {
                    entity.frostChannelingActive = true;
                    
                    console.log("Frost Channeling activated: Next ability costs 40% less mana");
                    
                    // Reset after 4 seconds
                    setTimeout(function() {
                        entity.frostChannelingActive = false;
                        console.log("Frost Channeling effect ended");
                    }, 4000);
                }
            }
        },
        tier5: {
            name: "Crystalline Brilliance",
            description: "Gain 30% maximum mana. Your abilities have a 15% chance to not consume mana and have no cooldown.",
            type: "resource",
            resourceModifications: {
                maxManaMultiplier: 1.3
            },
            immediateEffect: function(entity) {
                // The free cast chance would be checked when using abilities
                console.log("Crystalline Brilliance activated: +30% maximum mana and chance for free casts");
            }
        }
    }
};