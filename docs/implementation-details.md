# Game Implementation Details

This document provides a comprehensive overview of all the implementation details of the game, serving as a central reference for developers.

## Table of Contents
1. [Hero Selection](#hero-selection)
2. [Hero Skills](#hero-skills)
3. [UI Elements](#ui-elements)
4. [Movement Mechanics](#movement-mechanics)
5. [Control Systems](#control-systems)
6. [Configuration System](#configuration-system)
7. [Mobile Development](#mobile-development)

## Hero Selection

### Overview
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

### Implementation
- Hero data is stored in `config/hero/heroes.js`
- Selection UI is managed by the `UIManager` class in `js/ui.js`
- Hero creation is handled by `HeroFactory.createHero()` in `game.js`

For detailed information, see [Hero Selection System](heroes/hero_selection.md).

## Hero Skills

### Skill Structure
Each hero has six unique skills arranged in a circular pattern:
- Basic attack in the center
- Primary skills (1-4) in cardinal directions
- Secondary skills (5-6) in diagonal directions

### Skill Components
- **Basic Properties**: ID, name, type, description
- **Resource Management**: Mana cost, cooldown, passive flag
- **Effects**: Array of effect objects defining skill behavior
- **Scaling**: How the skill scales with hero attributes
- **Targeting**: How the skill is targeted and its range
- **Feedback**: Animation, sound, and visual effect references

### Implementation
- Skills are defined in `config/skills.js`
- Hero-specific skills are set up in the `setupAbilities()` method in `js/hero.js`
- Skill activation is handled by the `useAbility()` method in the `Hero` class

For detailed information, see [Hero Skills System](heroes/hero_skills.md).

## UI Elements

### Health and Mana Bars
- **Hero Health Bar**: Top-left corner, red horizontal bar
- **Hero Mana Bar**: Below health bar, blue horizontal bar
- **Enemy Health Bars**: Above enemies in 3D space, scales with distance

### Hero Portrait and Level
- **Hero Portrait**: Top-left corner, colored based on hero type
- **Level Indicator**: Below portrait, shows current level and XP progress

### Ability UI
- **Layout**: Bottom-right corner in circular pattern
- **Cooldown Display**: Darkening overlay with circular sweep animation
- **Mana Cost**: Shown on hover/selection

### Movement Controls
- **Jump Button**: Bottom-left corner, green circular button
- **Fly Button**: Adjacent to Jump button, blue circular button with context-sensitive text
- **Virtual Joystick**: Bottom-left area for mobile touch control

For detailed information, see [UI Elements](technical/ui_elements.md).

## Movement Mechanics

### Ground Movement
- **Keyboard Movement**: WASD keys for directional movement
- **Mouse Movement**: Right-click on ground to set target position
- **Virtual Joystick**: Touch control for mobile devices

### Jump Mechanics
- **Basic Jump**: Space key or Jump button, physics-based with velocity and gravity
- **Double Jump**: Second press while in air, higher than first jump
- **Configuration**: Customizable in `config/movement/jump.js`

### Flight Mechanics
- **Activation**: F key or Fly button toggles flight mode
- **Height Control**: Various methods including keyboard, mouse, and touch
- **Wing Effects**: Visual wings appear during flight, change with ascent/descent
- **Configuration**: Customizable in `config/movement/flight.js`

For detailed information, see [Movement Mechanics](heroes/movement_mechanics.md).

## Control Systems

### Physical Keyboard Controls
- **Movement**: WASD for direction, Space for jump, F for flight
- **Abilities**: 1-6 for abilities, QERT for quick abilities
- **Camera**: Middle mouse button for rotation, mouse wheel for zoom

### Mouse Controls
- **Left Click**: Select targets, use abilities
- **Right Click**: Move to location
- **Middle Click + Drag**: Rotate camera
- **Mouse Wheel**: Zoom in/out

### Virtual On-Screen Controls
- **Virtual Joystick**: Bottom-left corner for movement
- **Action Buttons**: Bottom-right area for abilities and special actions
- **Touch Gestures**: Various gestures for different actions

For detailed information, see [Control Systems](technical/control_systems.md).

## Configuration System

### Directory Organization
```
config/
├── hero/
├── movement/
├── skills/
├── skills.js
├── ui/
└── world/
```

### Configuration Types
- **Hero Configuration**: Hero stats, abilities, and appearance
- **Skills Configuration**: Skill properties, effects, and visuals
- **Movement Configuration**: Jump and flight mechanics
- **UI Configuration**: Control settings and button appearance
- **World Configuration**: Environment and game world settings

### Implementation
- Configurations are loaded by the `ConfigLoader` class
- Game systems access settings through `window.configLoader.getConfig()`
- Default values are provided as fallbacks

For detailed information, see [Configuration System](technical/configuration_system.md).

## Mobile Development

### Mobile UI Adaptations
- **Responsive Layout**: Adjusts to screen dimensions
- **Touch-Friendly Controls**: Larger hitboxes and clear feedback
- **Virtual Controls**: Joystick and action buttons optimized for touch

### Touch Interaction System
- **Touch Detection**: Processed by the `InputManager` class
- **Gesture Recognition**: Support for tap, long press, swipe, pinch, etc.
- **Implementation**: Custom touch handling for different interactions

### Landscape View Optimization
- **Screen Orientation**: Optimized for landscape mode
- **Viewport Configuration**: Proper scaling and fullscreen support
- **Aspect Ratio Handling**: Dynamic positioning based on screen space

For detailed information, see [Mobile Development](technical/mobile_development.md).

## Conclusion

This game implementation features a comprehensive set of systems designed to provide an engaging and accessible gaming experience across both desktop and mobile platforms. The modular architecture and extensive configuration options allow for easy customization and extension of game features.

Key strengths of the implementation include:
- Unique hero abilities with distinct playstyles
- Versatile movement mechanics including jumping and flying
- Multi-platform control systems supporting keyboard, mouse, and touch
- Comprehensive configuration system for easy adjustment
- Mobile-optimized interface with responsive design

Future development can build upon this foundation to add more heroes, abilities, environments, and gameplay features while maintaining the core systems established in this implementation.