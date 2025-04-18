# Legends of the Ancient Realms - Game Requirements

This document serves as the central hub for all game requirements and documentation. It provides an overview of the game concept and links to detailed specifications for each aspect of the game.

## Game Overview

Legends of the Ancient Realms is an isometric action RPG built with PlayCanvas that combines the quest-driven, dungeon-crawling gameplay of classic ARPGs with the diverse hero roster inspired by DotA. Players select from iconic heroes representing either the Sentinel or Scourge factions, each with unique abilities and playstyles, as they embark on a journey through a war-torn world.

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

## Documentation Structure

### Game Design
- [Game Concept](gameplay/concept.md) - Core game concept and vision
- [Gameplay Systems](gameplay/systems.md) - Detailed gameplay mechanics
- [Story & Narrative](gameplay/story.md) - Game lore and narrative structure
- [Progression](gameplay/progression.md) - Character progression and advancement

### World Design
- [Environments](world/environments.md) - World design and areas
- [NPCs](world/npcs.md) - Non-player characters
- [Quests](world/quests.md) - Quest system and mission structure
- [Items & Loot](world/items.md) - Equipment, consumables, and treasures

### Hero System
- [Hero Mechanics](heroes/system.md) - Hero mechanics and abilities
- [Sentinel Heroes](heroes/sentinel.md) - Heroes of the Sentinel faction
- [Scourge Heroes](heroes/scourge.md) - Heroes of the Scourge faction
- [Abilities](heroes/abilities.md) - Detailed ability descriptions

### Technical Specifications
- [Architecture](technical/architecture.md) - Game architecture overview
- [Performance](technical/performance.md) - Performance considerations
- [Controls](technical/controls.md) - Input and control systems
- [UI/UX](technical/ui.md) - User interface design

### Asset Requirements
- [Visual Style](assets/visual_style.md) - Art direction and visual guidelines
- [Sound Design](assets/sound.md) - Music and sound effects
- [Animation](assets/animation.md) - Character and effect animations
- [Asset Pipeline](assets/pipeline.md) - Asset creation workflow

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