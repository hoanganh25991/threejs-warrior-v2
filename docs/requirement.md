# Legends of the Ancient Realms - Game Requirements

This document serves as the central hub for all game requirements and documentation. It provides an overview of the game concept and links to detailed specifications for each aspect of the game.

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
- **WASD Movement**: Alternative direct control using keyboard
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