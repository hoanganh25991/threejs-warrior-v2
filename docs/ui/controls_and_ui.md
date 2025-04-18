# Controls and UI Documentation

## Overview

This document outlines the control schemes and user interface elements in Legends of the Ancient Realms, including keyboard controls, touch controls, and visual feedback systems.

## Keyboard Controls

### Movement Controls
- **Arrow Up**: Move forward
- **Arrow Down**: Move backward
- **Arrow Left**: Move left
- **Arrow Right**: Move right
- **Space**: Jump
- **F**: Toggle fly mode

### Combat Controls
- **A**: Basic attack (auto-targets nearby enemies)
- **1-6**: Activate abilities 1-6
- **Q, E, R, T**: Quick ability shortcuts

### Camera Controls
- **Q**: Rotate camera left
- **E**: Rotate camera right
- **Z**: Zoom in
- **X**: Zoom out

### Interaction Controls
- **F**: Interact with objects
- **I**: Open inventory
- **C**: Open character panel
- **M**: Open map
- **Escape**: Pause game

## Touch Controls

### Joystick Movement
- A virtual joystick appears on the left side of the screen
- The joystick dynamically appears where the player first touches
- Direction indicator shows the current movement direction
- The joystick handle follows the finger beyond the base for more precise control

### Skill Activation
- Tap skill buttons to activate
- Drag from skill buttons to aim directional skills
- Visual indicators show targeting area
- Haptic feedback (vibration) provides tactile confirmation

### Auto-Targeting
- Basic attacks automatically target the nearest enemy within range
- Visual indicator shows the current target
- Preference for closest enemies to ensure intuitive targeting

## UI Elements

### Skill Buttons

#### Layout
- Main attack button in the center
- Skill buttons arranged in a circle around the main attack
- Size and spacing optimized for comfortable touch interaction

#### Visual Elements
- First letter of skill name displayed prominently on each button
- Key hint shown in top-right corner of each button
- Hero-specific colors for easy identification
- Border highlights active skills

#### Cooldown Visualization
- Radial overlay shows remaining cooldown time
- Numerical countdown for precise timing
- Visual pulse effect when skill becomes available
- Color-coded based on skill type

### Joystick

#### Appearance
- Translucent base circle with contrasting handle
- Direction indicator shows current movement vector
- Dynamic positioning based on initial touch location
- Follows finger beyond base radius for extended range

#### Feedback
- Visual feedback for movement direction
- Opacity changes based on interaction state
- Size adjusts based on screen size for optimal usability

### Combat Feedback

#### Target Selection
- Highlighted outline around current target
- Range indicator for basic attacks
- Auto-targeting preference settings configurable

#### Skill Effects
- Distinct visual effects for each skill type
- Hero-specific particle colors
- Screen effects for powerful abilities
- Cooldown visualization with ready notification

## Mobile-Specific Features

### Adaptive Layout
- UI elements position adjusts based on screen size and orientation
- Optimized for landscape mode on mobile devices
- Touch areas sized appropriately for finger interaction

### Touch Gestures
- Double-tap for self-cast abilities
- Hold for skill information
- Drag for directional targeting
- Pinch to zoom camera

### Performance Considerations
- Reduced particle effects on lower-end devices
- Simplified visual feedback options
- Battery-saving mode available

## Accessibility Features

### Customization
- Adjustable UI scale
- Customizable control bindings
- Option to increase touch target sizes
- High contrast mode for visual clarity

### Feedback Systems
- Visual, audio, and haptic feedback options
- Text size adjustments
- Color-blind friendly mode
- Reduced motion setting

## Configuration

All UI and control settings can be adjusted in the following configuration files:
- `config/ui/controls.js`: Keyboard and touch control settings
- `config/ui/skills.js`: Skill button layout and interaction
- `config/ui/effects.js`: Visual effects for skills and abilities

Players can customize these settings through the in-game options menu.