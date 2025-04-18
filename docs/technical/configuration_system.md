# Configuration System

## Overview
The game utilizes a comprehensive configuration system that centralizes game settings in the `config` folder. This approach allows for easy modification of game parameters without changing the core code, facilitating rapid iteration, balancing, and customization.

## Configuration Structure

### Directory Organization
The configuration system is organized into subdirectories by category:

```
config/
├── hero/
│   └── heroes.js       # Hero definitions and stats
├── movement/
│   ├── flight.js       # Flight mechanics settings
│   └── jump.js         # Jump mechanics settings
├── skills/
│   └── ...             # Skill-specific configurations
├── skills.js           # Main skills definitions
├── ui/
│   └── controls.js     # UI and control settings
└── world/
    └── ...             # World and environment settings
```

### Configuration Loading
Configurations are loaded at game initialization by the `ConfigLoader` class, which:
1. Loads all configuration files
2. Merges settings as needed
3. Makes configurations available to game systems
4. Provides methods for accessing specific configuration values

## Hero Configuration

### File: `config/hero/heroes.js`

#### Available Heroes List
```javascript
availableHeroes: [
    'axe',
    'crystal-maiden',
    'lich',
    'storm-spirit'
]
```

#### Default Hero Stats
```javascript
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
}
```

#### Hero-Specific Configurations
Each hero has custom settings that override the defaults:
```javascript
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
        // Ability configurations
    }
}
```

## Skills Configuration

### File: `config/skills.js`

#### Skill Structure
Each skill is defined with comprehensive parameters:
```javascript
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
}
```

#### Skill Components
- **Basic Properties**: ID, name, type, description
- **Resource Management**: Mana cost, cooldown, passive flag
- **Effects**: Array of effect objects defining skill behavior
- **Scaling**: How the skill scales with hero attributes
- **Targeting**: How the skill is targeted and its range
- **Feedback**: Animation, sound, and visual effect references

## Movement Configuration

### Jump Configuration (`config/movement/jump.js`)
```javascript
const JumpConfig = {
    initialVelocity: 10,        // Initial upward velocity for jump
    gravity: 20,                // Gravity applied during jump
    maxJumpCount: 2,            // Maximum number of consecutive jumps
    multiJumpHeightIncrease: 1.5, // Height multiplier for each consecutive jump
    maxJumpHeight: 15,          // Maximum height player can reach
    jumpEffectColor: 0xffffff,  // Color of regular jump effect
    doubleJumpEffectColor: 0x00ffff, // Color of double jump effect
    cameraFollowJump: true,     // Whether camera should follow player during jump
    cameraJumpOffset: 0.7,      // How much camera follows the jump
    jumpSoundEffect: 'sounds/pop.mp3',
    landSoundEffect: 'sounds/blow.mp3'
};
```

### Flight Configuration (`config/movement/flight.js`)
```javascript
const FlightConfig = {
    initialHeight: 5,           // Initial height when starting flight
    maxHeight: 20,              // Maximum flight height
    minHeight: 1,               // Minimum flight height
    heightChangeRate: {
        keyPress: 2,            // Height change per key press
        longPress: 1.5,         // Height change per second when holding button
        mouseWheel: 1           // Height change per mouse wheel tick
    },
    cameraFollowFlight: true,   // Whether camera follows player during flight
    cameraFlightOffset: 0.8,    // How much camera follows flight height
    showWings: true,            // Whether to show wings during flight
    wingSize: 2,                // Size of wings
    wingFlapSpeed: 0.5,         // Speed of wing flapping animation
    wingEffectColor: 0x66ccff,  // Color for wing effect
    takeoffSoundEffect: 'sounds/submarine.mp3',
    landingSoundEffect: 'sounds/basso.mp3'
};
```

## UI and Controls Configuration

### Controls Configuration (`config/ui/controls.js`)
```javascript
const ControlsConfig = {
    keyboard: {
        movement: {
            forward: 'w',
            backward: 's',
            left: 'a',
            right: 'd',
            jump: ' ', // Space key
            fly: 'f'
        },
        abilities: {
            ability1: '1',
            ability2: '2',
            // Additional ability mappings
        }
        // Additional control categories
    },
    mouse: {
        primary: 'left',
        secondary: 'right',
        tertiary: 'middle',
        // Flight-specific controls
    },
    touch: {
        enabled: true,
        joystickSize: 80,
        joystickPosition: { x: 100, y: 100 },
        buttonSize: 80,
        buttonSpacing: 10,
        // Touch timing settings
    },
    buttons: {
        jump: {
            text: 'JUMP',
            color: 'rgba(76,175,80,0.8)',
            borderColor: '#999',
            textColor: 'white',
            size: 80
        },
        fly: {
            text: 'FLY',
            color: 'rgba(33,150,243,0.8)',
            borderColor: '#999',
            textColor: 'white',
            size: 80,
            textVariations: {
                flying: 'FLY DOWN',
                landing: 'LAND'
            }
        }
    }
};
```

## World Configuration
World settings define environment parameters, enemy properties, and game world characteristics.

### Potential World Configuration Files
- `config/world/environment.js`: Lighting, weather, day/night cycle
- `config/world/enemies.js`: Enemy types, stats, and behaviors
- `config/world/items.js`: Item properties, effects, and drop rates
- `config/world/terrain.js`: Terrain generation and properties

## Technical Implementation

### Configuration Loading
The `ConfigLoader` class in `js/config-loader.js` handles loading and providing access to configurations:

```javascript
// Example usage
const jumpConfig = window.configLoader.getConfig('jumpConfig');
const heroConfig = window.configLoader.getConfig('heroesConfig');
```

### Configuration Access
Game systems access configuration values through the global `configLoader` instance:

```javascript
// Example from Hero class
this.maxJumpCount = window.configLoader?.getConfig('jumpConfig')?.maxJumpCount || 2;
```

### Default Values
Systems provide fallback default values when configurations are unavailable:

```javascript
const controlsConfig = window.configLoader?.getConfig('controlsConfig') || {
    touch: { 
        longPressThreshold: 300,
        longPressInterval: 100
    }
};
```

## Benefits of the Configuration System

1. **Centralized Settings**: All game parameters are defined in one location
2. **Easy Balancing**: Game balance can be adjusted without code changes
3. **Rapid Iteration**: Quick testing of different parameter values
4. **Modding Support**: Facilitates future modding capabilities
5. **Separation of Concerns**: Keeps game logic separate from specific values
6. **Documentation**: Configuration files serve as self-documenting specifications

## Future Enhancements

1. **JSON Configuration**: Move to JSON format for easier editing and validation
2. **Configuration UI**: In-game interface for adjusting settings
3. **Profile System**: Save and load different configuration profiles
4. **Dynamic Reloading**: Reload configurations without restarting the game
5. **Validation System**: Validate configuration values to prevent errors