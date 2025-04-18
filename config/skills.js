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
        description: 'Taunts nearby enemies and increases armor',
        effects: [
            { type: 'taunt', radius: 5, duration: 3 },
            { type: 'buff', stat: 'armor', value: 10, duration: 3 }
        ],
        scaling: { strength: 0.2 },
        targeting: { type: 'self', radius: 5 },
        animation: 'axe_call',
        sound: 'axe_call',
        visuals: { effect: 'red_pulse', scale: 1.0 }
    },
    
    'battle-hunger': {
        id: 'battle-hunger',
        name: 'Battle Hunger',
        type: 'debuff',
        manaCost: 15,
        cooldown: 5,
        passive: false,
        description: 'Damages an enemy over time until they kill a unit',
        effects: [
            { type: 'damage-over-time', damageType: 'physical', value: 5, interval: 1, duration: 10 },
            { type: 'debuff', stat: 'movementSpeed', value: -1, duration: 10 }
        ],
        scaling: { strength: 0.15 },
        targeting: { type: 'single-target', range: 8 },
        animation: 'axe_hunger',
        sound: 'axe_hunger',
        visuals: { effect: 'red_debuff', attachToTarget: true }
    },
    
    'counter-helix': {
        id: 'counter-helix',
        name: 'Counter Helix',
        type: 'counter',
        manaCost: 0,
        cooldown: 0.5,
        passive: true,
        description: 'Automatically counterattacks when hit',
        effects: [
            { type: 'damage', damageType: 'physical', value: 15, radius: 3 }
        ],
        scaling: { strength: 0.3 },
        targeting: { type: 'passive', radius: 3 },
        animation: 'axe_helix',
        sound: 'axe_helix',
        visuals: { effect: 'spin_attack', scale: 1.0 }
    },
    
    'culling-blade': {
        id: 'culling-blade',
        name: 'Culling Blade',
        type: 'execute',
        manaCost: 25,
        cooldown: 10,
        passive: false,
        description: 'Instantly kills low-health enemies',
        effects: [
            { 
                type: 'conditional-damage', 
                condition: { type: 'health-below', threshold: 30 },
                success: { type: 'execute' },
                failure: { type: 'damage', damageType: 'physical', value: 40 }
            },
            { type: 'buff', stat: 'movementSpeed', value: 2, duration: 4, condition: 'on-kill' }
        ],
        scaling: { strength: 0.5 },
        targeting: { type: 'single-target', range: 3 },
        animation: 'axe_cull',
        sound: 'axe_cull',
        visuals: { effect: 'execute_slash', scale: 1.5 }
    },
    
    'war-cry': {
        id: 'war-cry',
        name: 'War Cry',
        type: 'buff',
        manaCost: 15,
        cooldown: 12,
        passive: false,
        description: 'Increases armor and movement speed',
        effects: [
            { type: 'buff', stat: 'armor', value: 8, duration: 6 },
            { type: 'buff', stat: 'movementSpeed', value: 1.5, duration: 6 }
        ],
        scaling: { strength: 0.2 },
        targeting: { type: 'self', radius: 0 },
        animation: 'axe_warcry',
        sound: 'axe_warcry',
        visuals: { effect: 'buff_aura', scale: 1.0 }
    },
    
    'taunt': {
        id: 'taunt',
        name: 'Taunt',
        type: 'utility',
        manaCost: 5,
        cooldown: 5,
        passive: false,
        description: 'Taunts enemies, making them attack you',
        effects: [
            { type: 'taunt', radius: 4, duration: 2 }
        ],
        scaling: {},
        targeting: { type: 'self', radius: 4 },
        animation: 'axe_taunt',
        sound: 'axe_taunt',
        visuals: { effect: 'taunt_emote', scale: 1.0 }
    },
    
    // ===== CRYSTAL MAIDEN SKILLS =====
    'crystal-nova': {
        id: 'crystal-nova',
        name: 'Crystal Nova',
        type: 'aoe',
        manaCost: 15,
        cooldown: 5,
        passive: false,
        description: 'Damages and slows enemies in an area',
        effects: [
            { type: 'damage', damageType: 'magical', value: 25, radius: 5 },
            { type: 'debuff', stat: 'movementSpeed', value: -2, duration: 4, radius: 5 }
        ],
        scaling: { intelligence: 0.4 },
        targeting: { type: 'ground-target', range: 8, radius: 5 },
        animation: 'cm_nova',
        sound: 'cm_nova',
        visuals: { effect: 'frost_explosion', scale: 1.2 }
    },
    
    'frostbite': {
        id: 'frostbite',
        name: 'Frostbite',
        type: 'disable',
        manaCost: 20,
        cooldown: 6,
        passive: false,
        description: 'Freezes an enemy, preventing movement and attack',
        effects: [
            { type: 'root', duration: 2.5 },
            { type: 'disarm', duration: 2.5 },
            { type: 'damage-over-time', damageType: 'magical', value: 8, interval: 0.5, duration: 2.5 }
        ],
        scaling: { intelligence: 0.3 },
        targeting: { type: 'single-target', range: 6 },
        animation: 'cm_frostbite',
        sound: 'cm_frostbite',
        visuals: { effect: 'ice_encasing', attachToTarget: true }
    },
    
    'brilliance-aura': {
        id: 'brilliance-aura',
        name: 'Brilliance Aura',
        type: 'aura',
        manaCost: 0,
        cooldown: 0,
        passive: true,
        description: 'Provides mana regeneration to allies',
        effects: [
            { type: 'buff', stat: 'manaRegen', value: 2, duration: -1, radius: 8, affectsAllies: true }
        ],
        scaling: { intelligence: 0.1 },
        targeting: { type: 'passive', radius: 8 },
        animation: null,
        sound: null,
        visuals: { effect: 'blue_aura', scale: 0.8, persistent: true }
    },
    
    'freezing-field': {
        id: 'freezing-field',
        name: 'Freezing Field',
        type: 'channeled',
        manaCost: 30,
        cooldown: 12,
        passive: false,
        description: 'Damages enemies in a large area over time',
        effects: [
            { 
                type: 'damage-over-time', 
                damageType: 'magical', 
                value: 12, 
                interval: 0.5, 
                duration: 6,
                radius: 8
            },
            { type: 'debuff', stat: 'movementSpeed', value: -1, duration: 1, radius: 8 }
        ],
        scaling: { intelligence: 0.6 },
        targeting: { type: 'channeled', radius: 8, duration: 6 },
        animation: 'cm_freezing_field',
        sound: 'cm_freezing_field',
        visuals: { effect: 'blizzard', scale: 2.0 }
    },
    
    'frost-armor': {
        id: 'frost-armor',
        name: 'Frost Armor',
        type: 'buff',
        manaCost: 18,
        cooldown: 10,
        passive: false,
        description: 'Increases armor and provides frost shield',
        effects: [
            { type: 'buff', stat: 'armor', value: 6, duration: 8 },
            { 
                type: 'counter-effect', 
                trigger: 'on-hit', 
                effect: { 
                    type: 'debuff', 
                    stat: 'attackSpeed', 
                    value: -0.2, 
                    duration: 2 
                }
            }
        ],
        scaling: { intelligence: 0.2 },
        targeting: { type: 'single-target', range: 6, canTargetSelf: true, canTargetAllies: true },
        animation: 'cm_frost_armor',
        sound: 'cm_frost_armor',
        visuals: { effect: 'ice_shield', attachToTarget: true }
    },
    
    'cold-snap': {
        id: 'cold-snap',
        name: 'Cold Snap',
        type: 'utility',
        manaCost: 22,
        cooldown: 8,
        passive: false,
        description: 'Freezes the ground, creating an ice path',
        effects: [
            { type: 'ground-effect', effect: 'slippery', duration: 6, length: 10, width: 2 },
            { type: 'debuff', stat: 'movementSpeed', value: -2, duration: 1.5, condition: 'on-contact' }
        ],
        scaling: { intelligence: 0.25 },
        targeting: { type: 'direction', range: 10, width: 2 },
        animation: 'cm_cold_snap',
        sound: 'cm_cold_snap',
        visuals: { effect: 'ice_path', scale: 1.0 }
    },
    
    // ===== LICH SKILLS =====
    'frost-nova': {
        id: 'frost-nova',
        name: 'Frost Nova',
        type: 'aoe',
        manaCost: 15,
        cooldown: 5,
        passive: false,
        description: 'Damages and slows enemies in an area',
        effects: [
            { type: 'damage', damageType: 'magical', value: 30, radius: 4 },
            { type: 'debuff', stat: 'movementSpeed', value: -2, duration: 3, radius: 4 }
        ],
        scaling: { intelligence: 0.45 },
        targeting: { type: 'ground-target', range: 7, radius: 4 },
        animation: 'lich_nova',
        sound: 'lich_nova',
        visuals: { effect: 'frost_explosion', scale: 1.0 }
    },
    
    'frost-armor-lich': {
        id: 'frost-armor-lich',
        name: 'Frost Armor',
        type: 'buff',
        manaCost: 10,
        cooldown: 8,
        passive: false,
        description: 'Increases armor and slows attackers',
        effects: [
            { type: 'buff', stat: 'armor', value: 8, duration: 10 },
            { 
                type: 'counter-effect', 
                trigger: 'on-hit', 
                effect: { 
                    type: 'debuff', 
                    stat: 'attackSpeed', 
                    value: -0.3, 
                    duration: 3 
                }
            }
        ],
        scaling: { intelligence: 0.25 },
        targeting: { type: 'single-target', range: 7, canTargetSelf: true, canTargetAllies: true },
        animation: 'lich_frost_armor',
        sound: 'lich_frost_armor',
        visuals: { effect: 'ice_armor', attachToTarget: true }
    },
    
    'dark-ritual': {
        id: 'dark-ritual',
        name: 'Dark Ritual',
        type: 'utility',
        manaCost: 5,
        cooldown: 4,
        passive: false,
        description: 'Sacrifices a unit to gain mana',
        effects: [
            { type: 'sacrifice', targetType: 'friendly-unit' },
            { type: 'resource-gain', resource: 'mana', value: 40 }
        ],
        scaling: { intelligence: 0.3 },
        targeting: { type: 'single-target', range: 5, targetTypes: ['friendly-unit'] },
        animation: 'lich_ritual',
        sound: 'lich_ritual',
        visuals: { effect: 'soul_drain', scale: 1.0 }
    },
    
    'chain-frost': {
        id: 'chain-frost',
        name: 'Chain Frost',
        type: 'ultimate',
        manaCost: 30,
        cooldown: 12,
        passive: false,
        description: 'Launches a frost orb that bounces between enemies',
        effects: [
            { 
                type: 'chain-damage', 
                damageType: 'magical', 
                value: 35, 
                bounces: 5, 
                bounceRange: 6,
                slowEffect: { stat: 'movementSpeed', value: -2, duration: 2 }
            }
        ],
        scaling: { intelligence: 0.5 },
        targeting: { type: 'single-target', range: 8 },
        animation: 'lich_chain_frost',
        sound: 'lich_chain_frost',
        visuals: { effect: 'bouncing_ice_orb', scale: 1.2 }
    },
    
    'frost-blast': {
        id: 'frost-blast',
        name: 'Frost Blast',
        type: 'aoe',
        manaCost: 20,
        cooldown: 10,
        passive: false,
        description: 'Damages and slows enemies in a large area',
        effects: [
            { type: 'damage', damageType: 'magical', value: 40, radius: 6 },
            { type: 'debuff', stat: 'movementSpeed', value: -3, duration: 4, radius: 6 }
        ],
        scaling: { intelligence: 0.4 },
        targeting: { type: 'ground-target', range: 9, radius: 6 },
        animation: 'lich_frost_blast',
        sound: 'lich_frost_blast',
        visuals: { effect: 'ice_explosion', scale: 1.5 }
    },
    
    'ice-barrier': {
        id: 'ice-barrier',
        name: 'Ice Barrier',
        type: 'defense',
        manaCost: 15,
        cooldown: 8,
        passive: false,
        description: 'Creates a shield that absorbs damage',
        effects: [
            { type: 'shield', value: 50, duration: 6 }
        ],
        scaling: { intelligence: 0.35 },
        targeting: { type: 'single-target', range: 6, canTargetSelf: true, canTargetAllies: true },
        animation: 'lich_barrier',
        sound: 'lich_barrier',
        visuals: { effect: 'ice_shield', attachToTarget: true }
    },
    
    // ===== STORM SPIRIT SKILLS =====
    'static-remnant': {
        id: 'static-remnant',
        name: 'Static Remnant',
        type: 'trap',
        manaCost: 10,
        cooldown: 4,
        passive: false,
        description: 'Creates a remnant that damages nearby enemies',
        effects: [
            { 
                type: 'summon', 
                summonType: 'remnant', 
                duration: 12,
                triggerRadius: 3,
                triggerEffect: { 
                    type: 'damage', 
                    damageType: 'magical', 
                    value: 25, 
                    radius: 3 
                }
            }
        ],
        scaling: { intelligence: 0.3 },
        targeting: { type: 'ground-target', range: 3, radius: 0 },
        animation: 'storm_remnant',
        sound: 'storm_remnant',
        visuals: { effect: 'electric_clone', scale: 1.0 }
    },
    
    'electric-vortex': {
        id: 'electric-vortex',
        name: 'Electric Vortex',
        type: 'disable',
        manaCost: 20,
        cooldown: 6,
        passive: false,
        description: 'Pulls an enemy toward you',
        effects: [
            { type: 'pull', duration: 1.5, speed: 6 },
            { type: 'damage', damageType: 'magical', value: 15 }
        ],
        scaling: { intelligence: 0.25 },
        targeting: { type: 'single-target', range: 7 },
        animation: 'storm_vortex',
        sound: 'storm_vortex',
        visuals: { effect: 'lightning_pull', scale: 1.0 }
    },
    
    'overload': {
        id: 'overload',
        name: 'Overload',
        type: 'passive',
        manaCost: 0,
        cooldown: 0,
        passive: true,
        description: 'Empowers attacks after using abilities',
        effects: [
            { 
                type: 'buff', 
                trigger: 'after-ability-use',
                stat: 'attackDamage', 
                damageType: 'magical',
                value: 20, 
                duration: 1,
                maxStacks: 1
            },
            { 
                type: 'debuff', 
                trigger: 'on-attack',
                condition: 'has-overload-buff',
                stat: 'movementSpeed', 
                value: -2, 
                duration: 1.5 
            }
        ],
        scaling: { intelligence: 0.2 },
        targeting: { type: 'passive' },
        animation: null,
        sound: 'storm_overload_ready',
        visuals: { effect: 'electric_charge', attachToHero: true, showOnBuff: true }
    },
    
    'ball-lightning': {
        id: 'ball-lightning',
        name: 'Ball Lightning',
        type: 'movement',
        manaCost: 15,
        cooldown: 3,
        passive: false,
        description: 'Transforms into lightning to travel quickly',
        effects: [
            { type: 'dash', speed: 15, invulnerable: true },
            { 
                type: 'damage', 
                damageType: 'magical', 
                value: 10, 
                radius: 2,
                continuous: true
            },
            { type: 'mana-drain', perSecond: 10, continuous: true }
        ],
        scaling: { intelligence: 0.15 },
        targeting: { type: 'ground-target', range: 20, pathfinding: true },
        animation: 'storm_ball',
        sound: 'storm_ball',
        visuals: { effect: 'lightning_trail', scale: 1.0 }
    },
    
    'electric-surge': {
        id: 'electric-surge',
        name: 'Electric Surge',
        type: 'attack',
        manaCost: 12,
        cooldown: 5,
        passive: false,
        description: 'Damages enemies in a line',
        effects: [
            { type: 'damage', damageType: 'magical', value: 30, shape: 'line', length: 8, width: 2 }
        ],
        scaling: { intelligence: 0.35 },
        targeting: { type: 'direction', range: 8, width: 2 },
        animation: 'storm_surge',
        sound: 'storm_surge',
        visuals: { effect: 'lightning_beam', scale: 1.0 }
    },
    
    'storm-gust': {
        id: 'storm-gust',
        name: 'Storm Gust',
        type: 'aoe',
        manaCost: 25,
        cooldown: 15,
        passive: false,
        description: 'Creates a field of energy that damages enemies',
        effects: [
            { 
                type: 'ground-effect', 
                effect: 'storm-field', 
                duration: 8, 
                radius: 5,
                tickEffect: {
                    type: 'damage',
                    damageType: 'magical',
                    value: 8,
                    interval: 1
                }
            }
        ],
        scaling: { intelligence: 0.4 },
        targeting: { type: 'ground-target', range: 10, radius: 5 },
        animation: 'storm_gust',
        sound: 'storm_gust',
        visuals: { effect: 'electric_field', scale: 1.5 }
    }
};

// Export the configuration
if (typeof module !== 'undefined') {
    module.exports = SkillsConfig;
}