# Legends of the Ancient Realms - Game Requirements & Implementation

This document serves as the central hub for all game requirements and implementation details. It provides an overview of the game concept and links to detailed specifications for each aspect of the game.

## Game Overview

Legends of the Ancient Realms is an isometric action RPG built with Three.js that combines the quest-driven, dungeon-crawling gameplay of classic ARPGs with the diverse hero roster inspired by DotA. Players select from iconic heroes representing either the Sentinel or Scourge factions, each with unique abilities and playstyles, as they embark on a journey through a war-torn world.

## Game Concept

### Core Vision
Legends of the Ancient Realms aims to deliver a rich single-player experience where players can embody iconic hero archetypes in a narrative-driven adventure. The game combines fast-paced, skill-based combat with a compelling story where heroes from opposing factions must unite against a greater threat.

### Key Pillars
- **Hero-Centric Gameplay**: Distinct heroes with predefined personalities, backstories, and core abilities
- **Isometric Action Combat**: Real-time, skill-based combat viewed from an isometric perspective
- **Rich Narrative Experience**: A compelling story where player choices influence how the narrative unfolds
- **Dynamic World**: Diverse and reactive environments that change based on player actions and story progression

## Core Requirements

1. **3D Isometric Perspective**: The game must feature a 3D isometric view with free camera rotation
2. **Hero-Based Gameplay**: Players must be able to select from distinct heroes with unique abilities
3. **Free Movement**: Characters must move freely in the environment using both mouse and keyboard controls
4. **Dynamic Camera**: Middle-mouse button must rotate the camera around the character
5. **Skill-Based Combat**: Combat must involve active use of hero abilities and tactical positioning
6. **Quest-Driven Narrative**: The game must feature a story-driven campaign with meaningful quests
7. **Browser-Based**: The game must run in modern web browsers without plugins

## Technical Requirements

1. **Target Platforms**: Modern desktop browsers (Chrome, Firefox, Safari, Edge)
2. **Minimum Specifications**: 
   - Dual-core processor, 2.0 GHz
   - 4 GB RAM
   - Integrated graphics with WebGL 2.0 support
   - 5 Mbps internet connection
3. **Performance Targets**: 
   - 60 FPS on recommended hardware
   - 30 FPS minimum on lower-end systems
4. **Network Requirements**: 
   - Low latency for responsive controls
   - Efficient asset loading for quick startup

## Gameplay Systems

### Movement & Controls
- **Point-and-Click Navigation**: Primary movement method using mouse clicks
- **Arrow Keys Movement**: Alternative direct control using keyboard
- **Camera Rotation**: Middle-mouse button to rotate view 360 degrees
- **Camera Zoom**: Mouse wheel to adjust distance

### Combat System
- **Auto-Attack**: Basic attacks when targeting enemies
- **Ability System**: 4 unique abilities per hero with cooldowns and resource costs
- **Status Effects**: Buffs/debuffs, crowd control, damage over time effects
- **Damage Types**: Physical, magical, pure damage types with different resistances

### Progression Systems
- **Experience & Leveling**: Maximum level 30 with experience from enemies, quests, exploration
- **Ability Advancement**: Ability points to increase power and unlock enhanced functionality
- **Talent System**: Hero-specific specialization options unlocked at specific level thresholds

### Item & Equipment System
- **Item Categories**: Weapons, armor, accessories, consumables
- **Item Properties**: Base stats, special effects, set bonuses, rarity tiers
- **Inventory Management**: Grid-based inventory with limited space

### Quest & Objective System
- **Quest Types**: Main quests, side quests, hero quests, repeatable quests
- **Objective Tracking**: Quest log, objective markers, progress tracking

## Documentation Structure

### Game Design
- [Game Concept](gameplay/game_concept.md) - Core game concept and vision
- [Gameplay Systems](gameplay/gameplay_systems.md) - Detailed gameplay mechanics
- [Story & Narrative](gameplay/story_narrative.md) - Game lore and narrative structure
- [Progression](gameplay/progression.md) - Character progression and advancement

## World Design

### Environments
- **Major Regions**: Sentinel Territories, Scourge Territories, Neutral/Contested Zones
- **Settlement Types**: Major cities, outposts, villages with distinct architectural styles
- **Dungeon Types**: Ancient ruins, natural caverns, faction strongholds, corrupted zones
- **Environmental Features**: Interactive elements, weather effects, day/night cycle, seasonal changes

### NPCs
- **Faction Characters**: Sentinel and Scourge representatives with unique dialogue and quests
- **Neutral Entities**: Merchants, craftsmen, mercenaries, and other non-aligned characters
- **Hostile Creatures**: Wildlife, monsters, bandits, and faction-specific enemies
- **Bosses**: Unique, powerful adversaries with special abilities and mechanics

### Quests
- **Main Campaign**: Central narrative focusing on the conflict between factions and emerging threats
- **Side Missions**: Optional content that expands the world and provides additional rewards
- **Hero Quests**: Character-specific storylines that develop individual hero backgrounds
- **Dynamic Events**: Procedurally generated encounters that respond to player actions

### Items & Loot
- **Equipment System**: Weapons, armor, and accessories with varying stats and effects
- **Consumables**: Potions, scrolls, and other single-use items with temporary benefits
- **Crafting Materials**: Resources gathered throughout the world for item creation
- **Unique Artifacts**: Legendary items with special properties and lore significance

### Documentation Structure
- [Environments](world/environments.md) - World design and areas
- [NPCs](world/npcs.md) - Non-player characters
- [Quests](world/quests.md) - Quest system and mission structure
- [Items & Loot](world/items_loot.md) - Equipment, consumables, and treasures

## Hero System

### Hero Structure
- **Base Attributes**: Strength, Agility, Intelligence, Vitality, Spirit
- **Hero Types**: Warrior, Assassin, Mage, Support, Specialist
- **Faction Alignment**: Sentinel (order, protection, light) or Scourge (chaos, power, darkness)

### Ability System
- **Ability Structure**: 4 Active Abilities, 1 Passive Ability, 1 Ultimate Ability
- **Ability Components**: Cooldown, Resource Cost, Targeting Type, Effect, Scaling
- **Ability Advancement**: Ability Points, Ability Tiers, Ability Modifications

### Talent System
- **Talent Structure**: 3 specialization paths per hero with points earned at specific level thresholds
- **Talent Types**: Ability Enhancements, New Abilities, Attribute Bonuses, Utility Effects, Playstyle Modifiers

### Hero Selection & Switching
- **Initial Selection**: Choose starting hero at the beginning of the game
- **Hero Switching**: Switch heroes at special locations after completing the introduction
- **Hero Relationships**: Unique dialogue and interactions between heroes

### Documentation Structure
- [Hero Mechanics](heroes/hero_mechanics.md) - Hero mechanics and abilities
- [Sentinel Heroes](heroes/sentinel_heroes.md) - Heroes of the Sentinel faction
- [Scourge Heroes](heroes/scourge_heroes.md) - Heroes of the Scourge faction
- [Abilities](heroes/abilities.md) - Detailed ability descriptions

## Technical Specifications

### Architecture
- **Entity-Component System**: Flexible game object management using PlayCanvas ECS
- **Scene Management**: Efficient loading and unloading of game areas
- **Asset Pipeline**: Optimized asset loading and management
- **Network Architecture**: Client-side prediction with optional server validation

### Performance Considerations
- **Rendering Optimizations**: LOD, texture management, shader optimization, draw call reduction
- **Memory Management**: Asset loading, object pooling, garbage collection management
- **Physics Optimizations**: Collision detection, physics simulation, sleep states
- **Adaptive Performance**: Dynamic quality adjustment based on device capabilities

### Controls System
- **Mouse Controls**: Left-click to move/attack, right-click for abilities, middle-mouse for camera rotation
- **Keyboard Controls**: WASD for movement, Q/W/E/R for abilities, space for dodge/evade
- **Camera System**: Isometric perspective with rotation, zoom, and multiple camera modes
- **Accessibility Options**: Auto-targeting, movement assist, camera assist, colorblind modes

### UI/UX Design
- **HUD Elements**: Health/mana bars, ability cooldowns, minimap, quest tracker
- **Menu Systems**: Inventory, character sheet, skill tree, quest log, options
- **Feedback Systems**: Combat text, visual effects, audio cues, haptic feedback
- **Onboarding**: Tutorial system, tooltips, contextual help

### Documentation Structure
- [Architecture](technical/architecture.md) - Game architecture overview
- [Performance](technical/performance.md) - Performance considerations
- [Controls](technical/controls.md) - Input and control systems
- [UI/UX](technical/ui_ux.md) - User interface design

## Asset Requirements

### Visual Style
- **Art Direction**: Stylized fantasy with vibrant colors and distinctive silhouettes
- **Character Design**: Unique, recognizable heroes with faction-specific visual themes
- **Environment Design**: Diverse biomes with strong visual identity and mood
- **VFX Design**: Spectacular ability effects with clear gameplay readability

### Sound Design
- **Music System**: Adaptive music that responds to gameplay context and intensity
- **Sound Effects**: Distinctive audio for abilities, environments, and interactions
- **Voice Acting**: Character-specific voice lines for abilities, reactions, and dialogue
- **Audio Implementation**: Spatial audio, mixing, and performance optimization

### Animation
- **Character Animation**: Fluid movement, combat, and ability animations
- **Procedural Systems**: Blending and transitions for responsive character control
- **Environmental Animation**: Dynamic elements that bring the world to life
- **VFX Animation**: Particle systems and shader effects for abilities and atmosphere

### Asset Pipeline
- **Creation Workflow**: Standardized processes for consistent asset quality
- **Optimization Guidelines**: Polygon budgets, texture sizes, and performance targets
- **Integration Process**: Smooth pipeline from art tools to game engine
- **Quality Assurance**: Review processes to maintain visual consistency

### Documentation Structure
- Visual Style - Art direction and visual guidelines
- Sound Design - Music and sound effects
- Animation - Character and effect animations
- Asset Pipeline - Asset creation workflow

## Development Roadmap

### Phase 1: Core Mechanics
- Character movement and camera controls
- Basic combat system
- Implementation of first playable hero (Axe)
- Simple test environment

### Phase 2: Expanded Features
- Additional heroes (Crystal Maiden, Lich, Storm Spirit)
- Skill systems and progression
- Basic inventory and item system
- First dungeon area

### Phase 3: Content Development
- Complete story implementation
- Multiple environments and dungeons
- Full roster of enemies and bosses
- Quest system

### Phase 4: Polish and Release
- UI refinement
- Performance optimization
- Audio implementation
- Beta testing and release

## Inspiration References

### Game Style References
- Diablo II: For isometric perspective and action RPG mechanics
- DotA/Warcraft III: For hero designs and abilities
- Path of Exile: For skill systems and progression

### Technical References
- PlayCanvas showcase: Aritelia - For technical implementation reference

## Initial Hero Selection

1. **Axe (Mogul Khan)**: A bloodthirsty warrior who thrives in the chaos of battle.
   - **Playstyle**: Tank/Berserker
   - **Signature Abilities**: Berserker's Call, Counter Helix, Culling Blade

2. **Crystal Maiden (Rylai)**: An ice sorceress with a gentle heart and frosty powers.
   - **Playstyle**: Support/Elemental Mage
   - **Signature Abilities**: Frost Nova, Freezing Field, Crystal Nova

3. **Lich (Kel'Thuzad)**: An undead sorcerer who commands the chilling power of frost.
   - **Playstyle**: Necromancer/Crowd Control
   - **Signature Abilities**: Frost Armor, Chain Frost, Dark Ritual

4. **Storm Spirit (Raijin Thunderkeg)**: A jovial elemental spirit who rides the storm with electrifying speed.
   - **Playstyle**: Mobile Caster/Assassin
   - **Signature Abilities**: Ball Lightning, Electric Vortex, Overload

## Implementation Details

### Hero Selection Implementation

#### Overview
The game features four unique heroes from the Dota universe, each with distinct abilities, stats, and playstyles:

1. **Axe (Mogul Khan)**
   - Tank/Berserker playstyle
   - Red color theme (#cc0000)
   - Higher health and strength

2. **Crystal Maiden (Rylai)**
   - Support/Elemental Mage playstyle
   - Light blue color theme (#00ccff)
   - Higher mana and intelligence

3. **Lich (Kel'Thuzad)**
   - Necromancer/Crowd Control playstyle
   - Dark blue color theme (#0000cc)
   - Highest intelligence and mana

4. **Storm Spirit (Raijin Thunderkeg)**
   - Mobile Caster/Assassin playstyle
   - Green color theme (#00cc00)
   - Higher agility and movement speed

#### Implementation
- Hero data is stored in `config/hero/heroes.js`
- Selection UI is managed by the `UIManager` class in `js/ui.js`
- Hero creation is handled by `HeroFactory.createHero()` in `game.js`

For detailed information, see [Hero Selection System](heroes/hero_selection.md).

### Hero Skills Implementation

#### Skill Structure
Each hero has six unique skills arranged in a circular pattern:
- Basic attack in the center
- Primary skills (1-4) in cardinal directions
- Secondary skills (5-6) in diagonal directions

#### Skill Components
- **Basic Properties**: ID, name, type, description
- **Resource Management**: Mana cost, cooldown, passive flag
- **Effects**: Array of effect objects defining skill behavior
- **Scaling**: How the skill scales with hero attributes
- **Targeting**: How the skill is targeted and its range
- **Feedback**: Animation, sound, and visual effect references

#### Implementation
- Skills are defined in `config/skills.js`
- Hero-specific skills are set up in the `setupAbilities()` method in `js/hero.js`
- Skill activation is handled by the `useAbility()` method in the `Hero` class

For detailed information, see [Hero Skills System](heroes/hero_skills.md).

### UI Elements Implementation

#### Health and Mana Bars
- **Hero Health Bar**: Top-left corner, red horizontal bar
- **Hero Mana Bar**: Below health bar, blue horizontal bar
- **Enemy Health Bars**: Above enemies in 3D space, scales with distance

#### Hero Portrait and Level
- **Hero Portrait**: Top-left corner, colored based on hero type
- **Level Indicator**: Below portrait, shows current level and XP progress

#### Ability UI
- **Layout**: Bottom-right corner in circular pattern
- **Cooldown Display**: Darkening overlay with circular sweep animation
- **Mana Cost**: Shown on hover/selection

#### Movement Controls
- **Jump Button**: Bottom-left corner, green circular button
- **Fly Button**: Adjacent to Jump button, blue circular button with context-sensitive text
- **Virtual Joystick**: Bottom-left area for mobile touch control

For detailed information, see [UI Elements](technical/ui_elements.md).

### Movement Mechanics Implementation

#### Ground Movement
- **Keyboard Movement**: Arrow keys for directional movement
- **Mouse Movement**: Right-click on ground to set target position
- **Virtual Joystick**: Touch control for mobile devices

#### Jump Mechanics
- **Basic Jump**: Space key or Jump button, physics-based with velocity and gravity
- **Double Jump**: Second press while in air, higher than first jump
- **Configuration**: Customizable in `config/movement/jump.js`

#### Flight Mechanics
- **Activation**: F key or Fly button toggles flight mode
- **Height Control**: Various methods including keyboard, mouse, and touch
- **Wing Effects**: Visual wings appear during flight, change with ascent/descent
- **Configuration**: Customizable in `config/movement/flight.js`

For detailed information, see [Movement Mechanics](heroes/movement_mechanics.md).

### Control Systems Implementation

#### Physical Keyboard Controls
- **Movement**: WASD for direction, Space for jump, F for flight
- **Abilities**: 1-6 for abilities, QERT for quick abilities
- **Camera**: Middle mouse button for rotation, mouse wheel for zoom

#### Mouse Controls
- **Left Click**: Select targets, use abilities
- **Right Click**: Move to location
- **Middle Click + Drag**: Rotate camera
- **Mouse Wheel**: Zoom in/out

#### Virtual On-Screen Controls
- **Virtual Joystick**: Bottom-left corner for movement
- **Action Buttons**: Bottom-right area for abilities and special actions
- **Touch Gestures**: Various gestures for different actions

For detailed information, see [Control Systems](technical/control_systems.md).

### Configuration System Implementation

#### Directory Organization
```
config/
├── hero/
├── movement/
├── skills/
├── skills.js
├── ui/
└── world/
```

#### Configuration Types
- **Hero Configuration**: Hero stats, abilities, and appearance
- **Skills Configuration**: Skill properties, effects, and visuals
- **Movement Configuration**: Jump and flight mechanics
- **UI Configuration**: Control settings and button appearance
- **World Configuration**: Environment and game world settings

#### Implementation
- Configurations are loaded by the `ConfigLoader` class
- Game systems access settings through `window.configLoader.getConfig()`
- Default values are provided as fallbacks

For detailed information, see [Configuration System](technical/configuration_system.md).

### Mobile Development Implementation

#### Mobile UI Adaptations
- **Responsive Layout**: Adjusts to screen dimensions
- **Touch-Friendly Controls**: Larger hitboxes and clear feedback
- **Virtual Controls**: Joystick and action buttons optimized for touch

#### Touch Interaction System
- **Touch Detection**: Processed by the `InputManager` class
- **Gesture Recognition**: Support for tap, long press, swipe, pinch, etc.
- **Implementation**: Custom touch handling for different interactions

#### Landscape View Optimization
- **Screen Orientation**: Optimized for landscape mode
- **Viewport Configuration**: Proper scaling and fullscreen support
- **Aspect Ratio Handling**: Dynamic positioning based on screen space

For detailed information, see [Mobile Development](technical/mobile_development.md).

### Inventory System Implementation

#### Item Structure
Each item in the game has the following properties:
- **ID**: Unique identifier for the item
- **Name**: Display name of the item
- **Type**: Category of item (weapon, armor, accessory, consumable)
- **Rarity**: Quality level (common, uncommon, rare, epic, legendary)
- **Stats**: Attributes and effects the item provides
- **Description**: Detailed description of the item

#### Inventory Management
- **Slots**: Fixed number of inventory positions (default: 20)
- **Equipment**: Special slots for equipped items (weapon, armor, helmet, etc.)
- **Gold**: Currency for purchasing items
- **Item Interaction**: Add, remove, use, equip, and move items

#### Implementation
- Item class is defined in `js/inventory.js`
- Inventory management is handled by the `Inventory` class
- Item creation is managed by the `ItemFactory` class
- Integration with hero stats through equipment system

For detailed information, see [Inventory System](gameplay/inventory_system.md).

### Quest System Implementation

#### Quest Structure
Each quest contains:
- **ID**: Unique identifier for the quest
- **Title**: Display name of the quest
- **Description**: Detailed description of what the quest involves
- **Type**: Category of quest (main, side, hero, repeatable)
- **Rewards**: Experience, gold, and items awarded upon completion
- **Objectives**: List of objectives that must be completed

#### Quest Management
- **Quest Manager**: Handles all quests in the game
- **Objective Tracking**: Monitors progress toward completion
- **Quest States**: Available, active, completed, failed
- **Reward Distribution**: Provides rewards upon completion

#### Implementation
- Quest system is defined in `js/quest.js`
- Quest management is handled by the `QuestManager` class
- Quest objectives are tracked through the `QuestObjective` class
- Integration with game events for progress tracking

For detailed information, see [Quest System](gameplay/quest_system.md).

### World Environment Implementation

#### Core Components
- **Skybox System**: Creates the illusion of a distant environment
- **Terrain System**: Forms the foundation of the game world
- **Environmental Objects**: Populate the world with visual interest
- **Environmental Effects**: Add life and movement to the world

#### Visual Elements
- **Gradient Sky**: Smooth transition from horizon to zenith
- **Dynamic Clouds**: Moving cloud formations
- **Sun and Glow**: Central light source with visual effects
- **Water System**: Reflective surfaces with animation
- **Particle Systems**: Leaves, dust, and other atmospheric elements

#### Implementation
- Environment creation is handled in `js/world.js`
- Skybox and visual effects are created in the `World` class
- Particle systems are managed through dedicated update methods
- Integration with game loop for continuous animation

For detailed information, see [World Environment](world/environment.md).

## Conclusion

This game implementation features a comprehensive set of systems designed to provide an engaging and accessible gaming experience across both desktop and mobile platforms. The modular architecture and extensive configuration options allow for easy customization and extension of game features.

Key strengths of the implementation include:
- Unique hero abilities with distinct playstyles
- Versatile movement mechanics including jumping and flying
- Multi-platform control systems supporting keyboard, mouse, and touch
- Comprehensive configuration system for easy adjustment
- Mobile-optimized interface with responsive design
- Inventory and item system with equipment and consumables
- Quest system for structured gameplay progression
- Enhanced world environment with visual effects and atmosphere

Future development can build upon this foundation to add more heroes, abilities, environments, and gameplay features while maintaining the core systems established in this implementation.