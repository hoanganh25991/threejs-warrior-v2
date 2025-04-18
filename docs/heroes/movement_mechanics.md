# Hero Movement Mechanics

## Overview
The game features a robust movement system that allows heroes to navigate the world using multiple control methods. The system includes basic ground movement, jumping, and flying mechanics, providing players with a high degree of mobility and control.

## Ground Movement

### Control Methods

#### Keyboard Movement (WASD)
- **W**: Move forward (relative to camera)
- **A**: Strafe left
- **S**: Move backward
- **D**: Strafe right
- **Implementation**: Direction is calculated relative to camera orientation
- **Animation**: "walk" animation plays during movement

#### Mouse Movement (Right-Click)
- Right-clicking on the ground sets a target position
- Hero automatically moves toward the target position
- Movement stops when the target is reached or a new command is issued
- **Implementation**: Raycasting from camera through mouse position to determine target
- **Visual Feedback**: Move indicator appears at the clicked position

#### Virtual Joystick (Mobile)
- Located in the bottom-left corner of the screen
- Size: 80 pixels diameter (configurable)
- Appears when touch begins in the designated area
- Direction and distance from center determine movement vector
- **Implementation**: Touch event handling in the `InputManager` class
- **Visual Feedback**: 
  - Base circle showing joystick area
  - Movable smaller circle that follows touch input
  - Visual indicator showing direction of movement

### Movement Properties
- **Speed**: Determined by hero's `movementSpeed` stat (default: 5)
- **Rotation**: Hero automatically rotates to face movement direction
- **Collision**: Heroes cannot move through solid objects or terrain
- **Animation**: Walking animation plays during movement

## Jump Mechanics

### Basic Jump
- **Controls**: Space key (keyboard) or Jump button (mobile)
- **Height**: Determined by `initialVelocity` and `gravity` in jump configuration
- **Default Values**:
  - Initial Velocity: 10
  - Gravity: 20
  - Maximum Jump Count: 2 (double jump)
- **Animation**: Jump animation plays during ascent and descent

### Double Jump
- Pressing jump while already in the air performs a second jump
- Second jump can reach higher than the first (multiJumpHeightIncrease: 1.5)
- Maximum of 2 consecutive jumps by default (configurable)
- **Visual Feedback**: Different effect color for double jump (0x00ffff)

### Jump Configuration
Jump mechanics are configured in `config/movement/jump.js`, which includes:
- Initial velocity and gravity settings
- Maximum jump count
- Multi-jump height increase factor
- Visual effect colors
- Camera follow settings
- Sound effects for jumping and landing

### Technical Implementation
- Jump physics are simulated using velocity and gravity
- Jump state is tracked in the Hero class
- Camera follows jump with configurable offset (cameraJumpOffset: 0.7)
- Sound effects play on jump initiation and landing

## Flight Mechanics

### Basic Flight
- **Controls**: F key (keyboard) or Fly button (mobile)
- **Activation**: Toggles flight mode on/off
- **Initial Height**: 5 units above ground (configurable)
- **Height Limits**:
  - Maximum: 20 units (configurable)
  - Minimum: 1 unit (configurable)
- **Animation**: Flying animation plays during flight

### Height Control

#### Keyboard Height Control
- **Controls**: 
  - F key: Toggle flight
  - Space: Ascend
  - Shift or Ctrl: Descend
- **Rate**: Configurable in `heightChangeRate.keyPress` (default: 2 units per press)

#### Mouse Height Control
- **Controls**:
  - Mouse wheel: Adjust height
  - Left-click while flying: Ascend
  - Right-click while flying: Descend
- **Rate**: Configurable in `heightChangeRate.mouseWheel` (default: 1 unit per tick)

#### Touch Height Control
- **Controls**:
  - Tap Fly button: Toggle flight
  - Long press Fly button: Continuously change height
  - Direction based on current button text ("FLY UP" or "FLY DOWN")
- **Visual Feedback**: Button text changes based on current state

### Wing Effects
- 3D wings appear on the back of the hero model when flying or jumping high
- Wings are created using custom geometry with a curved wing shape
- Wing size is configurable (default: 2 units)
- Wings flap at a configurable speed (wingFlapSpeed: 0.5)
- Wing color changes based on movement direction:
  - Upward movement: Light blue color (0x00ffff)
  - Downward movement: Orange color (0xff9900)
- Wing animation adapts to movement:
  - Flap speed increases with movement intensity
  - Flap amplitude (how wide the wings flap) increases with intensity
  - Wing opacity and glow increase with movement intensity
- Particle effects emit from wings during flapping:
  - Particles inherit wing color based on direction
  - More particles generate with higher intensity movement
  - Particles fade out and disperse over time

### Flight Configuration
Flight mechanics are configured in `config/movement/flight.js`, which includes:
- Height limits and change rates
- Camera follow settings
- Visual effect colors
- Wing appearance and animation settings
- Sound effects for takeoff and landing

### Technical Implementation
- Flight state is tracked in the Hero class
- Camera follows flight height with configurable offset (cameraFlightOffset: 0.8)
- Long press detection for continuous height change
- Sound effects play on takeoff and landing

## Camera System

### Camera Following
- Camera follows the hero's position with a configurable offset
- Default isometric view positions camera at (10, 10, 10) relative to hero
- Camera smoothly transitions during movement, jumps, and flight

### Camera Rotation
- Middle mouse button (or two-finger touch) rotates the camera around the hero
- Rotation is smooth and maintains the same distance from the hero
- Camera always looks at the hero's position

### Camera Zoom
- Mouse wheel (or pinch gesture) adjusts camera distance
- Zoom limits prevent getting too close or too far from the hero
- Zoom is smooth and maintains the camera's viewing angle

## Configuration System
Movement mechanics are highly configurable through files in the `config/movement/` directory:
- `jump.js`: Jump-related settings
- `flight.js`: Flight-related settings

The configuration system allows for easy adjustment of movement parameters without modifying the core code.

## Technical Implementation
- Movement is implemented in the `Hero` class in `js/hero.js`
- Input handling is managed by the `InputManager` class in `js/input.js`
- Events system allows for communication between input and movement systems
- Physics calculations are performed in the update loop
- Animation system transitions between different movement states