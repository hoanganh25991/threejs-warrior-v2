/**
 * Hero configuration settings
 */

// Define the HeroesConfig object
const HeroesConfig = {
    // Available heroes
    availableHeroes: [
        'crystal-maiden',
        'lich',
        'storm-spirit',
        'axe',
    ],
    
    // Default hero stats
    defaultStats: {
        health: 100,
        maxHealth: 100,
        mana: 300_000,
        maxMana: 300_000,
        strength: 10,
        agility: 10,
        intelligence: 10,
        movementSpeed: 5,
        attackSpeed: 10,
        attackDamage: 10,
        attackRange: 3 // Default attack range
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
            // Hero-specific wing configuration
            wings: {
                wingEffectColor: 0xff3300,  // Red-orange fiery wings
                wingSize: 2.2,              // Larger wings
                wingFlapSpeed: 0.7,         // Faster flapping
                featherCount: 20,           // Fewer, larger feathers
                featherLayers: 2            // Fewer layers for more solid appearance
            },
            abilities: {
                '1': {
                    skillId: 'berserkers-call',
                    // Hero-specific overrides can be added here
                    // For example: cooldown: 7 would override the default cooldown
                },
                '2': {
                    skillId: 'battle-hunger',
                },
                '3': {
                    skillId: 'counter-helix',
                },
                '4': {
                    skillId: 'culling-blade',
                },
                '5': {
                    skillId: 'war-cry',
                },
                '6': {
                    skillId: 'berserkers-rage',
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
            // Hero-specific wing configuration
            wings: {
                wingEffectColor: 0x88ddff,  // Light blue ice wings
                wingSize: 1.8,              // Smaller, delicate wings
                wingFlapSpeed: 0.4,         // Slower, graceful flapping
                featherCount: 30,           // More feathers for detailed appearance
                featherLayers: 4,           // More layers for crystalline effect
                opacity: 0.6                // More transparent for ice effect
            },
            abilities: {
                '1': {
                    skillId: 'crystal-nova',
                },
                '2': {
                    skillId: 'frostbite',
                },
                '3': {
                    skillId: 'brilliance-aura',
                },
                '4': {
                    skillId: 'freezing-field',
                },
                '5': {
                    skillId: 'frost-armor',
                },
                '6': {
                    skillId: 'frost-nova',
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
            // Hero-specific wing configuration
            wings: {
                wingEffectColor: 0x3333aa,  // Dark blue spectral wings
                wingSize: 2.5,              // Large, imposing wings
                wingFlapSpeed: 0.3,         // Slow, ominous flapping
                featherCount: 18,           // Fewer, larger feathers
                featherLayers: 3,           // Medium layers for ghostly effect
                opacity: 0.5,               // Translucent for spectral effect
                emissiveIntensity: 0.6      // Glowing effect
            },
            abilities: {
                '1': {
                    skillId: 'frost-nova-lich',
                },
                '2': {
                    skillId: 'frost-armor-lich',
                },
                '3': {
                    skillId: 'dark-ritual',
                },
                '4': {
                    skillId: 'chain-frost',
                },
                '5': {
                    skillId: 'frost-blast',
                },
                '6': {
                    skillId: 'ice-barrier',
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
            // Hero-specific wing configuration
            wings: {
                wingEffectColor: 0x22cc22,  // Electric green energy wings
                wingSize: 2.0,              // Medium sized wings
                wingFlapSpeed: 1.2,         // Very fast flapping
                featherCount: 24,           // Standard feather count
                featherLayers: 2,           // Fewer layers for more energy-like appearance
                opacity: 0.8,               // More solid for energy effect
                emissiveIntensity: 0.9,     // Strong glow
                particleIntensity: 2.0,     // More particles
                particleSpeed: 1.5          // Faster particle movement
            },
            abilities: {
                '1': {
                    skillId: 'static-remnant',
                },
                '2': {
                    skillId: 'electric-vortex',
                },
                '3': {
                    skillId: 'overload',
                },
                '4': {
                    skillId: 'ball-lightning',
                },
                '5': {
                    skillId: 'lightning-rush',
                },
                '6': {
                    skillId: 'electric-field',
                }
            }
        }
    }
};

// Make the config available in the global scope for the config loader
window.HeroesConfig = HeroesConfig;

// Export the configuration for module systems
if (typeof module !== 'undefined') {
    module.exports = HeroesConfig;
}