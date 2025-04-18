/**
 * Hero configuration settings
 */

const HeroesConfig = {
    // Available heroes
    availableHeroes: [
        'axe',
        'crystal-maiden',
        'lich',
        'storm-spirit'
    ],
    
    // Default hero stats
    defaultStats: {
        health: 100,
        maxHealth: 100,
        mana: 100,
        maxMana: 100,
        strength: 10,
        agility: 10,
        intelligence: 10,
        movementSpeed: 5,
        attackSpeed: 1,
        attackDamage: 10
    },
    
    // Hero-specific stats and abilities
    heroes: {
        'axe': {
            name: 'Axe (Mogul Khan)',
            description: 'A bloodthirsty warrior who thrives in the chaos of battle.',
            playstyle: 'Tank/Berserker',
            color: 0xcc0000,
            stats: {
                health: 150,
                maxHealth: 150,
                strength: 15,
                movementSpeed: 4.5
            },
            abilities: {
                '1': {
                    name: 'Berserker\'s Call',
                    manaCost: 10,
                    cooldown: 8,
                    description: 'Taunts nearby enemies and increases armor'
                },
                '2': {
                    name: 'Battle Hunger',
                    manaCost: 15,
                    cooldown: 5,
                    description: 'Damages an enemy over time until they kill a unit'
                },
                '3': {
                    name: 'Counter Helix',
                    passive: true,
                    description: 'Automatically counterattacks when hit'
                },
                '4': {
                    name: 'Culling Blade',
                    manaCost: 25,
                    cooldown: 10,
                    description: 'Instantly kills low-health enemies'
                },
                '5': {
                    name: 'War Cry',
                    manaCost: 15,
                    cooldown: 12,
                    description: 'Increases armor and movement speed'
                },
                '6': {
                    name: 'Taunt',
                    manaCost: 5,
                    cooldown: 5,
                    description: 'Taunts enemies, making them attack you'
                }
            }
        },
        'crystal-maiden': {
            name: 'Crystal Maiden (Rylai)',
            description: 'An ice sorceress with a gentle heart and frosty powers.',
            playstyle: 'Support/Elemental Mage',
            color: 0x00ccff,
            stats: {
                mana: 120,
                maxMana: 120,
                intelligence: 15,
                movementSpeed: 4
            },
            abilities: {
                '1': {
                    name: 'Crystal Nova',
                    manaCost: 15,
                    cooldown: 5,
                    description: 'Damages and slows enemies in an area'
                },
                '2': {
                    name: 'Frostbite',
                    manaCost: 20,
                    cooldown: 6,
                    description: 'Freezes an enemy, preventing movement and attack'
                },
                '3': {
                    name: 'Brilliance Aura',
                    passive: true,
                    description: 'Provides mana regeneration to allies'
                },
                '4': {
                    name: 'Freezing Field',
                    manaCost: 30,
                    cooldown: 12,
                    description: 'Damages enemies in a large area over time'
                },
                '5': {
                    name: 'Frost Armor',
                    manaCost: 18,
                    cooldown: 10,
                    description: 'Increases armor and provides frost shield'
                },
                '6': {
                    name: 'Cold Snap',
                    manaCost: 22,
                    cooldown: 8,
                    description: 'Freezes the ground, creating an ice path'
                }
            }
        },
        'lich': {
            name: 'Lich (Kel\'Thuzad)',
            description: 'An undead sorcerer who commands the chilling power of frost.',
            playstyle: 'Necromancer/Crowd Control',
            color: 0x0000cc,
            stats: {
                mana: 130,
                maxMana: 130,
                intelligence: 18,
                movementSpeed: 4.2
            },
            abilities: {
                '1': {
                    name: 'Frost Nova',
                    manaCost: 15,
                    cooldown: 5,
                    description: 'Damages and slows enemies in an area'
                },
                '2': {
                    name: 'Frost Armor',
                    manaCost: 10,
                    cooldown: 8,
                    description: 'Increases armor and slows attackers'
                },
                '3': {
                    name: 'Dark Ritual',
                    manaCost: 5,
                    cooldown: 4,
                    description: 'Sacrifices a unit to gain mana'
                },
                '4': {
                    name: 'Chain Frost',
                    manaCost: 30,
                    cooldown: 12,
                    description: 'Launches a frost orb that bounces between enemies'
                },
                '5': {
                    name: 'Frost Blast',
                    manaCost: 20,
                    cooldown: 10,
                    description: 'Damages and slows enemies in a large area'
                },
                '6': {
                    name: 'Ice Barrier',
                    manaCost: 15,
                    cooldown: 8,
                    description: 'Creates a shield that absorbs damage'
                }
            }
        },
        'storm-spirit': {
            name: 'Storm Spirit (Raijin Thunderkeg)',
            description: 'A jovial elemental spirit who rides the storm with electrifying speed.',
            playstyle: 'Mobile Caster/Assassin',
            color: 0x00cc00,
            stats: {
                agility: 15,
                movementSpeed: 5.5,
                attackSpeed: 1.2
            },
            abilities: {
                '1': {
                    name: 'Static Remnant',
                    manaCost: 10,
                    cooldown: 4,
                    description: 'Creates a remnant that damages nearby enemies'
                },
                '2': {
                    name: 'Electric Vortex',
                    manaCost: 20,
                    cooldown: 6,
                    description: 'Pulls an enemy toward you'
                },
                '3': {
                    name: 'Overload',
                    passive: true,
                    description: 'Empowers attacks after using abilities'
                },
                '4': {
                    name: 'Ball Lightning',
                    manaCost: 15,
                    cooldown: 3,
                    description: 'Transforms into lightning to travel quickly'
                },
                '5': {
                    name: 'Electric Surge',
                    manaCost: 12,
                    cooldown: 5,
                    description: 'Damages enemies in a line'
                },
                '6': {
                    name: 'Storm Gust',
                    manaCost: 25,
                    cooldown: 15,
                    description: 'Creates a field of energy that damages enemies'
                }
            }
        }
    }
};

// Export the configuration
if (typeof module !== 'undefined') {
    module.exports = HeroesConfig;
}