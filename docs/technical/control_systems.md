# Control Systems

## Overview
The game features a comprehensive control system that supports multiple input methods, including keyboard, mouse, and touch controls. This allows players to enjoy the game on both desktop and mobile devices with an optimized experience for each platform.

## Physical Keyboard Controls

### Movement Controls
- **W**: Move forward (relative to camera)
- **A**: Strafe left
- **S**: Move backward
- **D**: Strafe right
- **Space**: Jump
- **F**: Toggle flight mode

### Ability Controls
- **1-6**: Activate corresponding abilities
- **Q**: Quick ability 1
- **E**: Quick ability 2
- **R**: Quick ability 3
- **T**: Quick ability 4

### Camera Controls
- **Middle Mouse Button**: Rotate camera
- **Mouse Wheel**: Zoom in/out
- **Q**: Rotate camera left (alternative)
- **E**: Rotate camera right (alternative)
- **Z**: Zoom in (alternative)
- **X**: Zoom out (alternative)

### Interaction Controls
- **F**: Interact with objects (when not flying)
- **I**: Open inventory
- **C**: Open character screen
- **M**: Open map
- **Escape**: Pause game

## Mouse Controls

### Basic Controls
- **Left Click**: Select targets, use abilities
- **Right Click**: Move to location
- **Middle Click + Drag**: Rotate camera
- **Mouse Wheel**: Zoom in/out

### Flight Controls
- **Left Click** (while flying): Ascend
- **Right Click** (while flying): Descend
- **Right Click + Drag** (while flying): Look around

### Targeting
- Hover over enemies to highlight them
- Left-click on enemies to target them for attacks or abilities
- Right-click on the ground to move to that location
- Left-click on the ground with an ability selected to use ground-targeted abilities

## Virtual On-Screen Controls (Mobile)

### Virtual Joystick
- **Position**: Bottom-left corner of the screen
- **Size**: 80 pixels diameter (configurable)
- **Appearance**: 
  - Base circle indicating the joystick area
  - Movable smaller circle that follows touch input
  - Visual indicator showing direction of movement
- **Behavior**:
  - Appears when touch begins in the designated area
  - Direction and distance from center determine movement vector
  - Disappears when touch ends

### Action Buttons
- **Jump Button**:
  - Position: Bottom-right area
  - Appearance: Green circular button with "JUMP" text
  - Behavior:
    - Single tap: Perform a jump
    - Double tap: Perform a double jump
    - Long press: Perform consecutive jumps (up to 5)

- **Fly Button**:
  - Position: Adjacent to Jump button
  - Appearance: Blue circular button with context-sensitive text
  - Behavior:
    - Single tap: Toggle flight or change height
    - Text changes based on state ("FLY", "FLY DOWN", "LAND")
    - Long press: Continuously change height

- **Ability Buttons**:
  - Position: Bottom-right corner in a circular arrangement
  - Appearance: Circular buttons with ability icons
  - Behavior:
    - Tap to activate the corresponding ability
    - Visual feedback for cooldowns and mana costs

### Touch Gestures
- **Single Tap**: Select targets, use abilities
- **Double Tap**: Move to location
- **Two-Finger Drag**: Rotate camera
- **Pinch**: Zoom in/out
- **Long Press**: Context-sensitive actions

## Mobile-Specific Optimizations

### Landscape Mode
- UI layout optimized for landscape orientation
- Elements positioned to avoid hand obstruction
- Larger touch targets for better usability

### Touch Adaptations
- Increased button sizes for touch input
- Visual feedback for all interactions
- Auto-targeting assistance for small targets
- Reduced precision requirements for targeting

### Performance Considerations
- Simplified visual effects for lower-end devices
- Adaptive quality settings based on device capabilities
- Battery usage optimizations

## Configuration System

### Controls Configuration
Control settings are defined in `config/ui/controls.js`, which includes:
- Keyboard key mappings
- Mouse button assignments
- Touch control settings
- Button appearance and positioning

### Customization Options
- Button size adjustment
- Joystick position and size
- Touch sensitivity settings
- Long press threshold timing

## Technical Implementation

### Input Management
- The `InputManager` class in `js/input.js` handles all input detection
- Event system translates raw input into game actions
- Input state tracking for continuous actions (e.g., movement)

### Touch Controls
- Touch event handling for mobile devices
- Multi-touch support for gestures
- Long press detection for context-sensitive actions
- Virtual joystick implementation

### Accessibility Features
- Alternative control schemes
- Configurable sensitivity
- Visual indicators for all interactions
- Auto-targeting assistance

## Responsive Design
- Controls adapt to different screen sizes
- Mobile-specific layout activates on touch-capable devices
- Landscape orientation optimized for gameplay
- UI elements scale appropriately for different resolutions