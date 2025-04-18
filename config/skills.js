/**
 * Skills Configuration
 * 
 * This file defines all skills available in the game.
 * Heroes can reference these skills in their abilities configuration.
 * 
 * Structure:
 * - id: Unique identifier for the skill
 * - name: Display name of the skill
 * - type: Category of skill (attack, defense, utility, movement, etc.)
 * - manaCost: Base mana cost to use the skill
 * - cooldown: Base cooldown time in seconds
 * - passive: Boolean indicating if this is a passive skill
 * - description: Brief description of what the skill does
 * - effects: Array of effect objects that define what happens when skill is used
 * - scaling: How the skill scales with hero attributes
 * - targeting: Information about how the skill is targeted
 * - animation: Reference to animation to play when skill is used
 * - sound: Reference to sound effect to play
 * - visuals: Visual effects to display
 */

const SkillsConfig = {
    // ===== AXE SKILLS =====
    'berserkers-call': {
        id: 'berserkers-call',
        name: 'Berserker\'s Call',
        type: 'taunt',
        manaCost: 10,
        cooldown: 8,
        passive: false,
        description: 'Taunts nearby enemies and increases armor while entering a battle rage',
        effects: [
            { type: 'taunt', radius: 5, duration: 3 },
            { type: 'buff', stat: 'armor', value: 15, duration: 3 },
            { type: 'buff', stat: 'attackSpeed', value: 0.3, duration: 3 },
            { type: 'visual-effect', effect: 'rage_aura', duration: 3 }
        ],
        scaling: { strength: 0.25 },
        targeting: { type: 'self', radius: 5 },
        animation: 'axe_call',
        sound: 'axe_call',
        visuals: { effect: 'red_pulse', scale: 1.2, particleColor: 0xff0000 }
    },
    
    'battle-hunger': {
        id: 'battle-hunger',
        name: 'Battle Hunger',
        type: 'debuff',
        manaCost: 15,
        cooldown: 5,
        passive: false,
        description: 'Enrages an enemy with hunger for battle, causing damage over time and granting Axe movement speed if the target doesn\'t kill a unit',
        effects: [
            { type: 'damage-over-time', damageType: 'physical', value: 5, interval: 1, duration: 10 },
            { type: 'debuff', stat: 'movementSpeed', value: -1, duration: 10 },
            { type: 'debuff', stat: 'attackDamage', value: -5, duration: 10 },
            { type: 'buff', stat: 'movementSpeed', value: 1, duration: 10, target: 'self', condition: 'while-debuff-active' }
        ],
        scaling: { strength: 0.2 },
        targeting: { type: 'single-target', range: 8 },
        animation: 'axe_hunger',
        sound: 'axe_hunger',
        visuals: { effect: 'red_debuff', attachToTarget: true, particleColor: 0xcc0000 }
    },
    
    'counter-helix': {
        id: 'counter-helix',
        name: 'Counter Helix',
        type: 'counter',
        manaCost: 0,
        cooldown: 0.5,
        passive: true,
        description: 'When attacked, Axe performs a furious counterattack, dealing damage to all nearby enemies and gaining a stack of Berserker\'s Fury',
        effects: [
            { type: 'damage', damageType: 'physical', value: 15, radius: 3 },
            { 
                type: 'buff', 
                stat: 'attackDamage', 
                value: 2, 
                duration: 5, 
                maxStacks: 5, 
                stackable: true,
                target: 'self'
            }
        ],
        scaling: { strength: 0.35 },
        targeting: { type: 'passive', radius: 3 },
        animation: 'axe_helix',
        sound: 'axe_helix',
        visuals: { effect: 'spin_attack', scale: 1.0, particleColor: 0xff3300 }
    },
    
    'culling-blade': {
        id: 'culling-blade',
        name: 'Culling Blade',
        type: 'execute',
        manaCost: 25,
        cooldown: 10,
        passive: false,
        description: 'Axe delivers a killing blow that instantly executes low-health enemies. On successful execution, Axe and nearby allies gain attack and movement speed',
        effects: [
            { 
                type: 'conditional-damage', 
                condition: { type: 'health-below', threshold: 30 },
                success: { type: 'execute' },
                failure: { type: 'damage', damageType: 'physical', value: 50 }
            },
            { 
                type: 'buff', 
                stat: 'movementSpeed', 
                value: 3, 
                duration: 6, 
                condition: 'on-kill',
                radius: 5,
                affectsAllies: true
            },
            { 
                type: 'buff', 
                stat: 'attackSpeed', 
                value: 0.4, 
                duration: 6, 
                condition: 'on-kill',
                radius: 5,
                affectsAllies: true
            },
            { type: 'cooldown-reset', condition: 'on-kill' }
        ],
        scaling: { strength: 0.6 },
        targeting: { type: 'single-target', range: 3 },
        animation: 'axe_cull',
        sound: 'axe_cull',
        visuals: { effect: 'execute_slash', scale: 1.8, particleColor: 0xff0000 }
    },
    
    'war-cry': {
        id: 'war-cry',
        name: 'War Cry',
        type: 'buff',
        manaCost: 15,
        cooldown: 12,
        passive: false,
        description: 'Axe lets out a mighty battle cry, increasing armor and movement speed while striking fear into enemies',
        effects: [
            { type: 'buff', stat: 'armor', value: 10, duration: 6 },
            { type: 'buff', stat: 'movementSpeed', value: 2, duration: 6 },
            { type: 'buff', stat: 'damageReduction', value: 0.15, duration: 6 },
            { type: 'debuff', stat: 'attackDamage', value: -5, duration: 3, radius: 6, affectsEnemies: true }
        ],
        scaling: { strength: 0.25 },
        targeting: { type: 'self', radius: 6 },
        animation: 'axe_warcry',
        sound: 'axe_warcry',
        visuals: { effect: 'buff_aura', scale: 1.2, particleColor: 0xcc3300 }
    },
    
    'berserkers-rage': {
        id: 'berserkers-rage',
        name: 'Berserker\'s Rage',
        type: 'toggle',
        manaCost: 5,
        cooldown: 5,
        passive: false,
        description: 'Axe enters a frenzied rage, sacrificing health for increased damage and attack speed',
        effects: [
            { type: 'toggle-effect', 
              activeEffects: [
                { type: 'buff', stat: 'attackDamage', value: 15, duration: -1 },
                { type: 'buff', stat: 'attackSpeed', value: 0.3, duration: -1 },
                { type: 'health-drain', perSecond: 2, continuous: true }
              ],
              deactivateOn: { type: 'health-below', threshold: 15 }
            }
        ],
        scaling: { strength: 0.3 },
        targeting: { type: 'self' },
        animation: 'axe_rage',
        sound: 'axe_rage',
        visuals: { effect: 'rage_aura', scale: 1.0, particleColor: 0xff0000, persistent: true }
    },
    
    // ===== CRYSTAL MAIDEN SKILLS =====
    'crystal-nova': {
        id: 'crystal-nova',
        name: 'Crystal Nova',
        type: 'aoe',
        manaCost: 15,
        cooldown: 5,
        passive: false,
        description: 'Summons a burst of ice crystals that damage and slow enemies while creating a lingering frost field',
        effects: [
            { type: 'damage', damageType: 'magical', value: 30, radius: 5 },
            { type: 'debuff', stat: 'movementSpeed', value: -3, duration: 4, radius: 5 },
            { 
                type: 'ground-effect', 
                effect: 'frost-field', 
                duration: 5, 
                radius: 5,
                tickEffect: {
                    type: 'damage',
                    damageType: 'magical',
                    value: 5,
                    interval: 1
                }
            }
        ],
        scaling: { intelligence: 0.45 },
        targeting: { type: 'ground-target', range: 8, radius: 5 },
        animation: 'cm_nova',
        sound: 'cm_nova',
        visuals: { effect: 'frost_explosion', scale: 1.3, particleColor: 0x80e5ff }
    },
    
    'frostbite': {
        id: 'frostbite',
        name: 'Frostbite',
        type: 'disable',
        manaCost: 20,
        cooldown: 6,
        passive: false,
        description: 'Encases an enemy in ice, preventing movement and attacks while dealing damage over time. The target becomes brittle, taking increased magical damage',
        effects: [
            { type: 'root', duration: 3 },
            { type: 'disarm', duration: 3 },
            { type: 'damage-over-time', damageType: 'magical', value: 10, interval: 0.5, duration: 3 },
            { 
                type: 'debuff', 
                stat: 'magicalResistance', 
                value: -20, 
                duration: 5,
                description: 'Brittle: Increases magical damage taken'
            }
        ],
        scaling: { intelligence: 0.35 },
        targeting: { type: 'single-target', range: 6 },
        animation: 'cm_frostbite',
        sound: 'cm_frostbite',
        visuals: { effect: 'ice_encasing', attachToTarget: true, particleColor: 0x40c0ff }
    },
    
    'brilliance-aura': {
        id: 'brilliance-aura',
        name: 'Arcane Brilliance',
        type: 'aura',
        manaCost: 0,
        cooldown: 0,
        passive: true,
        description: 'Crystal Maiden\'s presence enhances magical energy, providing mana regeneration to all allies and reducing cooldowns of nearby allies\' abilities',
        effects: [
            { type: 'buff', stat: 'manaRegen', value: 3, duration: -1, radius: 8, affectsAllies: true },
            { type: 'buff', stat: 'cooldownReduction', value: 0.1, duration: -1, radius: 8, affectsAllies: true },
            { type: 'buff', stat: 'spellAmplification', value: 0.05, duration: -1, target: 'self' }
        ],
        scaling: { intelligence: 0.15 },
        targeting: { type: 'passive', radius: 8 },
        animation: null,
        sound: null,
        visuals: { effect: 'blue_aura', scale: 0.9, persistent: true, particleColor: 0x00aaff }
    },
    
    'freezing-field': {
        id: 'freezing-field',
        name: 'Freezing Field',
        type: 'channeled',
        manaCost: 30,
        cooldown: 12,
        passive: false,
        description: 'Crystal Maiden summons a devastating blizzard around her that damages enemies and has a chance to freeze them in place. The cold intensifies over time, increasing damage and slow effects',
        effects: [
            { 
                type: 'damage-over-time', 
                damageType: 'magical', 
                value: 15, 
                interval: 0.5, 
                duration: 6,
                radius: 8,
                increasingEffect: { stat: 'damage', increasePerTick: 1 }
            },
            { 
                type: 'debuff', 
                stat: 'movementSpeed', 
                value: -2, 
                duration: 1.5, 
                radius: 8,
                increasingEffect: { stat: 'slow', increasePerSecond: 0.5, maxIncrease: 2 }
            },
            {
                type: 'random-effect',
                chance: 0.15,
                interval: 0.5,
                effect: { type: 'stun', duration: 1, radius: 8 }
            },
            { type: 'buff', stat: 'armor', value: 10, duration: 6, target: 'self' }
        ],
        scaling: { intelligence: 0.7 },
        targeting: { type: 'channeled', radius: 8, duration: 6 },
        animation: 'cm_freezing_field',
        sound: 'cm_freezing_field',
        visuals: { effect: 'blizzard', scale: 2.2, particleColor: 0xb3e0ff }
    },
    
    'frost-armor': {
        id: 'frost-armor',
        name: 'Glacial Barrier',
        type: 'buff',
        manaCost: 18,
        cooldown: 10,
        passive: false,
        description: 'Creates a protective barrier of ice that increases armor and reflects frost damage to attackers. When the barrier breaks, it releases a burst of cold that slows nearby enemies',
        effects: [
            { type: 'buff', stat: 'armor', value: 8, duration: 8 },
            { type: 'shield', value: 40, duration: 8 },
            { 
                type: 'counter-effect', 
                trigger: 'on-hit', 
                effect: { 
                    type: 'damage', 
                    damageType: 'magical',
                    value: 10,
                    target: 'attacker'
                }
            },
            {
                type: 'trigger-effect',
                trigger: 'on-shield-break',
                effect: {
                    type: 'debuff',
                    stat: 'movementSpeed',
                    value: -3,
                    duration: 3,
                    radius: 5
                }
            }
        ],
        scaling: { intelligence: 0.3 },
        targeting: { type: 'single-target', range: 6, canTargetSelf: true, canTargetAllies: true },
        animation: 'cm_frost_armor',
        sound: 'cm_frost_armor',
        visuals: { effect: 'ice_shield', attachToTarget: true, particleColor: 0x99ddff }
    },
    
    'frost-nova': {
        id: 'frost-nova',
        name: 'Frost Nova',
        type: 'utility',
        manaCost: 22,
        cooldown: 8,
        passive: false,
        description: 'Crystal Maiden releases a wave of frost in all directions, damaging and briefly freezing enemies while creating a ring of ice shards that block movement',
        effects: [
            { type: 'damage', damageType: 'magical', value: 25, radius: 6, shape: 'ring' },
            { type: 'stun', duration: 1, radius: 6 },
            { 
                type: 'create-terrain', 
                terrainType: 'ice-wall', 
                shape: 'ring', 
                radius: 6, 
                duration: 4,
                passable: false
            }
        ],
        scaling: { intelligence: 0.4 },
        targeting: { type: 'self', radius: 6 },
        animation: 'cm_frost_nova',
        sound: 'cm_frost_nova',
        visuals: { effect: 'ice_wave', scale: 1.5, particleColor: 0x80d4ff }
    },
    
    // ===== LICH SKILLS =====
    'frost-nova-lich': {
        id: 'frost-nova-lich',
        name: 'Frost Nova',
        type: 'aoe',
        manaCost: 15,
        cooldown: 5,
        passive: false,
        description: 'Unleashes a blast of necromantic frost that damages enemies and drains their life force, healing Lich for a portion of the damage dealt',
        effects: [
            { type: 'damage', damageType: 'magical', value: 35, radius: 4 },
            { type: 'debuff', stat: 'movementSpeed', value: -2, duration: 3, radius: 4 },
            { 
                type: 'life-drain', 
                percentOfDamage: 0.3, 
                radius: 4,
                target: 'self'
            }
        ],
        scaling: { intelligence: 0.5 },
        targeting: { type: 'ground-target', range: 7, radius: 4 },
        animation: 'lich_nova',
        sound: 'lich_nova',
        visuals: { effect: 'frost_explosion', scale: 1.0, particleColor: 0x0033cc }
    },
    
    'frost-armor-lich': {
        id: 'frost-armor-lich',
        name: 'Ice Carapace',
        type: 'buff',
        manaCost: 10,
        cooldown: 8,
        passive: false,
        description: 'Encases the target in a shell of necromantic ice that increases armor, grants spell resistance, and inflicts a curse on attackers that slows their attack and movement speed',
        effects: [
            { type: 'buff', stat: 'armor', value: 10, duration: 10 },
            { type: 'buff', stat: 'magicalResistance', value: 15, duration: 10 },
            { 
                type: 'counter-effect', 
                trigger: 'on-hit', 
                effect: { 
                    type: 'debuff', 
                    name: 'Frost Curse',
                    stat: 'attackSpeed', 
                    value: -0.3, 
                    duration: 3,
                    secondaryEffect: {
                        type: 'debuff',
                        stat: 'movementSpeed',
                        value: -1.5,
                        duration: 3
                    }
                }
            }
        ],
        scaling: { intelligence: 0.3 },
        targeting: { type: 'single-target', range: 7, canTargetSelf: true, canTargetAllies: true },
        animation: 'lich_frost_armor',
        sound: 'lich_frost_armor',
        visuals: { effect: 'ice_armor', attachToTarget: true, particleColor: 0x0066ff }
    },
    
    'dark-ritual': {
        id: 'dark-ritual',
        name: 'Soul Sacrifice',
        type: 'utility',
        manaCost: 5,
        cooldown: 4,
        passive: false,
        description: 'Sacrifices a friendly unit to absorb its life essence, restoring mana and granting temporary spell amplification. If cast on an enemy corpse, also restores health',
        effects: [
            { type: 'sacrifice', targetType: 'friendly-unit' },
            { type: 'resource-gain', resource: 'mana', value: 50 },
            { type: 'buff', stat: 'spellAmplification', value: 0.15, duration: 8 },
            { 
                type: 'conditional-effect',
                condition: { type: 'target-is', targetType: 'enemy-corpse' },
                success: { type: 'heal', value: 30 }
            }
        ],
        scaling: { intelligence: 0.4 },
        targeting: { type: 'single-target', range: 5, targetTypes: ['friendly-unit', 'enemy-corpse'] },
        animation: 'lich_ritual',
        sound: 'lich_ritual',
        visuals: { effect: 'soul_drain', scale: 1.2, particleColor: 0x3366ff }
    },
    
    'chain-frost': {
        id: 'chain-frost',
        name: 'Chain Frost',
        type: 'ultimate',
        manaCost: 30,
        cooldown: 12,
        passive: false,
        description: 'Unleashes a powerful orb of frost that bounces between enemies, dealing increasing damage with each bounce and applying a stacking slow effect. Each bounce has a chance to freeze the target',
        effects: [
            { 
                type: 'chain-damage', 
                damageType: 'magical', 
                value: 40, 
                bounces: 7, 
                bounceRange: 6,
                damageIncrease: 10,
                slowEffect: { 
                    stat: 'movementSpeed', 
                    value: -1.5, 
                    duration: 3,
                    stackable: true,
                    maxStacks: 3
                },
                secondaryEffect: {
                    type: 'random-effect',
                    chance: 0.2,
                    effect: { type: 'root', duration: 1.5 }
                }
            }
        ],
        scaling: { intelligence: 0.6 },
        targeting: { type: 'single-target', range: 8 },
        animation: 'lich_chain_frost',
        sound: 'lich_chain_frost',
        visuals: { effect: 'bouncing_ice_orb', scale: 1.4, particleColor: 0x0099ff }
    },
    
    'frost-blast': {
        id: 'frost-blast',
        name: 'Necrotic Frost',
        type: 'aoe',
        manaCost: 20,
        cooldown: 10,
        passive: false,
        description: 'Channels the power of death and frost to create an explosion of necrotic energy that damages enemies, slows them, and reduces their healing received',
        effects: [
            { type: 'damage', damageType: 'magical', value: 45, radius: 6 },
            { type: 'debuff', stat: 'movementSpeed', value: -3, duration: 4, radius: 6 },
            { 
                type: 'debuff', 
                stat: 'healingReceived', 
                value: -0.5, 
                duration: 5, 
                radius: 6,
                name: 'Necrotic Wound'
            }
        ],
        scaling: { intelligence: 0.45 },
        targeting: { type: 'ground-target', range: 9, radius: 6 },
        animation: 'lich_frost_blast',
        sound: 'lich_frost_blast',
        visuals: { effect: 'ice_explosion', scale: 1.5, particleColor: 0x0066cc }
    },
    
    'ice-barrier': {
        id: 'ice-barrier',
        name: 'Frozen Tomb',
        type: 'defense',
        manaCost: 15,
        cooldown: 8,
        passive: false,
        description: 'Surrounds the target with a protective barrier of necromantic ice that absorbs damage and creates frost spirits when destroyed. These spirits seek out nearby enemies to damage and slow them',
        effects: [
            { type: 'shield', value: 60, duration: 6 },
            {
                type: 'trigger-effect',
                trigger: 'on-shield-break',
                effect: {
                    type: 'summon',
                    summonType: 'frost-spirit',
                    count: 3,
                    duration: 8,
                    summonEffect: {
                        type: 'damage',
                        damageType: 'magical',
                        value: 15,
                        secondaryEffect: {
                            type: 'debuff',
                            stat: 'movementSpeed',
                            value: -1,
                            duration: 2
                        }
                    }
                }
            }
        ],
        scaling: { intelligence: 0.4 },
        targeting: { type: 'single-target', range: 6, canTargetSelf: true, canTargetAllies: true },
        animation: 'lich_barrier',
        sound: 'lich_barrier',
        visuals: { effect: 'ice_shield', attachToTarget: true, particleColor: 0x0055cc }
    },
    
    // ===== STORM SPIRIT SKILLS =====
    'static-remnant': {
        id: 'static-remnant',
        name: 'Static Remnant',
        type: 'trap',
        manaCost: 10,
        cooldown: 4,
        passive: false,
        description: 'Storm Spirit creates an electrical duplicate of himself that watches for nearby enemies. When triggered, it explodes with lightning, damaging foes and briefly revealing their location',
        effects: [
            { 
                type: 'summon', 
                summonType: 'remnant', 
                duration: 12,
                triggerRadius: 3,
                triggerEffect: { 
                    type: 'damage', 
                    damageType: 'magical', 
                    value: 30, 
                    radius: 3,
                    secondaryEffect: {
                        type: 'reveal',
                        duration: 4,
                        radius: 3
                    }
                }
            },
            {
                type: 'buff',
                stat: 'movementSpeed',
                value: 1,
                duration: 2,
                target: 'self',
                condition: 'on-remnant-trigger'
            }
        ],
        scaling: { intelligence: 0.35, agility: 0.1 },
        targeting: { type: 'ground-target', range: 3, radius: 0 },
        animation: 'storm_remnant',
        sound: 'storm_remnant',
        visuals: { effect: 'electric_clone', scale: 1.0, particleColor: 0x00ff66 }
    },
    
    'electric-vortex': {
        id: 'electric-vortex',
        name: 'Electric Vortex',
        type: 'disable',
        manaCost: 20,
        cooldown: 6,
        passive: false,
        description: 'Storm Spirit creates a vortex of electric energy that pulls an enemy toward him while slowing nearby foes. The target is briefly stunned upon reaching Storm Spirit',
        effects: [
            { type: 'pull', duration: 1.5, speed: 8 },
            { type: 'damage', damageType: 'magical', value: 20 },
            { type: 'stun', duration: 0.5, condition: 'on-pull-complete' },
            { 
                type: 'debuff', 
                stat: 'movementSpeed', 
                value: -1.5, 
                duration: 2, 
                radius: 4,
                excludeMainTarget: true
            }
        ],
        scaling: { intelligence: 0.3, agility: 0.1 },
        targeting: { type: 'single-target', range: 7 },
        animation: 'storm_vortex',
        sound: 'storm_vortex',
        visuals: { effect: 'lightning_pull', scale: 1.2, particleColor: 0x33ff99 }
    },
    
    'overload': {
        id: 'overload',
        name: 'Overload',
        type: 'passive',
        manaCost: 0,
        cooldown: 0,
        passive: true,
        description: 'After using any ability, Storm Spirit\'s next attack is empowered with electric energy, dealing bonus damage in an area around the target and slowing affected enemies. Each consecutive Overload attack increases the damage',
        effects: [
            { 
                type: 'buff', 
                trigger: 'after-ability-use',
                stat: 'attackDamage', 
                damageType: 'magical',
                value: 25, 
                duration: 3,
                maxStacks: 3,
                stackable: true,
                areaOfEffect: true,
                radius: 2
            },
            { 
                type: 'debuff', 
                trigger: 'on-attack',
                condition: 'has-overload-buff',
                stat: 'movementSpeed', 
                value: -2.5, 
                duration: 2,
                radius: 2
            },
            {
                type: 'buff',
                trigger: 'on-overload-attack',
                stat: 'attackSpeed',
                value: 0.1,
                duration: 3,
                maxStacks: 3,
                stackable: true
            }
        ],
        scaling: { intelligence: 0.25, agility: 0.15 },
        targeting: { type: 'passive' },
        animation: null,
        sound: 'storm_overload_ready',
        visuals: { effect: 'electric_charge', attachToHero: true, showOnBuff: true, particleColor: 0x00ff99 }
    },
    
    'ball-lightning': {
        id: 'ball-lightning',
        name: 'Ball Lightning',
        type: 'movement',
        manaCost: 15,
        cooldown: 3,
        passive: false,
        description: 'Storm Spirit transforms into a ball of lightning, becoming invulnerable and highly mobile while damaging enemies along his path. Each enemy hit reduces the mana cost of the ability',
        effects: [
            { type: 'dash', speed: 20, invulnerable: true },
            { 
                type: 'damage', 
                damageType: 'magical', 
                value: 15, 
                radius: 2.5,
                continuous: true,
                uniqueTargets: true
            },
            { type: 'mana-drain', perSecond: 12, continuous: true },
            { 
                type: 'resource-gain', 
                resource: 'mana', 
                value: 5, 
                condition: 'on-enemy-hit',
                maxTargets: 5
            },
            { type: 'buff', stat: 'movementSpeed', value: 2, duration: 2, condition: 'after-ability-end' }
        ],
        scaling: { intelligence: 0.2, agility: 0.2 },
        targeting: { type: 'ground-target', range: 25, pathfinding: true },
        animation: 'storm_ball',
        sound: 'storm_ball',
        visuals: { effect: 'lightning_trail', scale: 1.2, particleColor: 0x00ffaa }
    },
    
    'lightning-rush': {
        id: 'lightning-rush',
        name: 'Lightning Rush',
        type: 'attack',
        manaCost: 12,
        cooldown: 5,
        passive: false,
        description: 'Storm Spirit charges forward, damaging enemies in a line and gaining attack speed for each enemy hit. If at least three enemies are hit, the cooldown is reduced',
        effects: [
            { 
                type: 'dash', 
                speed: 12, 
                distance: 8,
                damageType: 'magical',
                value: 35,
                shape: 'line',
                width: 2
            },
            {
                type: 'buff',
                stat: 'attackSpeed',
                value: 0.1,
                duration: 4,
                stackPerTarget: true,
                maxStacks: 5
            },
            {
                type: 'cooldown-reduction',
                value: 3,
                condition: { type: 'targets-hit', count: 3 }
            }
        ],
        scaling: { intelligence: 0.3, agility: 0.2 },
        targeting: { type: 'direction', range: 8, width: 2 },
        animation: 'storm_rush',
        sound: 'storm_rush',
        visuals: { effect: 'lightning_dash', scale: 1.0, particleColor: 0x66ffcc }
    },
    
    'electric-field': {
        id: 'electric-field',
        name: 'Electric Field',
        type: 'aoe',
        manaCost: 25,
        cooldown: 15,
        passive: false,
        description: 'Storm Spirit creates an energized field that damages enemies and increases the attack and movement speed of allies within it. Storm Spirit gains double the benefit while inside the field',
        effects: [
            { 
                type: 'ground-effect', 
                effect: 'storm-field', 
                duration: 8, 
                radius: 5,
                tickEffect: {
                    type: 'damage',
                    damageType: 'magical',
                    value: 10,
                    interval: 1
                }
            },
            {
                type: 'buff',
                stat: 'attackSpeed',
                value: 0.2,
                duration: 1.5,
                refreshWhileInArea: true,
                radius: 5,
                affectsAllies: true
            },
            {
                type: 'buff',
                stat: 'movementSpeed',
                value: 1.5,
                duration: 1.5,
                refreshWhileInArea: true,
                radius: 5,
                affectsAllies: true
            },
            {
                type: 'buff',
                stat: 'attackSpeed',
                value: 0.2,
                duration: 1.5,
                refreshWhileInArea: true,
                target: 'self',
                condition: 'while-in-field'
            },
            {
                type: 'buff',
                stat: 'movementSpeed',
                value: 1.5,
                duration: 1.5,
                refreshWhileInArea: true,
                target: 'self',
                condition: 'while-in-field'
            }
        ],
        scaling: { intelligence: 0.45, agility: 0.1 },
        targeting: { type: 'ground-target', range: 10, radius: 5 },
        animation: 'storm_field',
        sound: 'storm_field',
        visuals: { effect: 'electric_field', scale: 1.5, particleColor: 0x00ffcc }
    }
};

// Export the configuration
if (typeof module !== 'undefined') {
    module.exports = SkillsConfig;
}