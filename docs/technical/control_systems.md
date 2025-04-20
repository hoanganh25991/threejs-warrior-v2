# Control Systems

## Overview
The game features a simplified keyboard-only control system. This streamlined approach focuses on providing a consistent experience with WASD movement, F for jump/fly, and HJKL for abilities.

## Keyboard Controls

### Movement Controls
- **W**: Move forward
- **A**: Strafe left
- **S**: Move backward
- **D**: Strafe right
- **F**: Jump/Fly (hold to increase height)

### Ability Controls
- **H**: Basic attack and Ability 1
- **J**: Ability 2
- **K**: Ability 3
- **L**: Ability 4

### Interaction Controls
- **I**: Open inventory
- **C**: Open character screen
- **M**: Open map
- **Escape**: Pause game

## Jump and Flight Controls
- **Press F**: Initiate jump
- **Hold F**: Increase jump height
- **Press F while jumping**: Enter flight mode
- **Press F while flying**: Adjust flight height

## Auto-Targeting System
Since mouse controls have been removed, the game uses an auto-targeting system:
- Automatically selects the nearest enemy within range
- Prioritizes enemies in the direction the hero is facing
- Visual indicator shows the currently targeted enemy
- Abilities are cast at the current target or in the direction of movement if no target is available

## Configuration System

### Controls Configuration
Control settings are defined in `config/ui/controls.js`, which includes:
- Keyboard key mappings
- Button appearance and positioning

### Customization Options
- Key bindings can be modified in the configuration file
- Visual feedback settings for abilities and targeting

## Technical Implementation

### Input Management
- The `InputManager` class in `js/input.js` handles all keyboard input detection
- Event system translates raw input into game actions
- Input state tracking for continuous actions (e.g., movement)
- Auto-targeting system for abilities and attacks

### Movement Implementation
- WASD keys control character movement relative to the camera view
- Movement vector is calculated based on the combination of pressed keys
- Diagonal movement is supported when multiple direction keys are pressed

### Ability System
- HJKL keys trigger abilities with auto-targeting
- Abilities automatically select appropriate targets based on range and type
- Visual feedback indicates ability activation and targeting

### Accessibility Features
- Simplified control scheme reduces complexity
- Auto-targeting removes need for precise aiming
- Visual indicators for all interactions
- Consistent key layout for intuitive control