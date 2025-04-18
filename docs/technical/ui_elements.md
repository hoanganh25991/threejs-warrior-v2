# UI Elements

## Overview
The game features a comprehensive UI system that provides players with essential information and controls. The UI is designed to be intuitive, responsive, and adaptable to different screen sizes and device types.

## Health and Mana Bars

### Hero Health Bar
- **Position**: Top-left corner of the screen
- **Appearance**: Red horizontal bar with percentage fill
- **Components**:
  - Visual bar showing current/maximum health ratio
  - Numerical display showing current/maximum health values
  - Animated transitions when health changes
- **Implementation**: Managed by the `UIManager` class in `js/ui.js`
- **Updates**: Automatically updates when the hero takes damage or is healed

### Hero Mana Bar
- **Position**: Directly below the health bar in the top-left corner
- **Appearance**: Blue horizontal bar with percentage fill
- **Components**:
  - Visual bar showing current/maximum mana ratio
  - Numerical display showing current/maximum mana values
  - Animated transitions when mana changes
- **Implementation**: Managed by the `UIManager` class in `js/ui.js`
- **Updates**: Automatically updates when the hero uses abilities or regenerates mana

### Enemy Health Bars
- **Position**: Above each enemy in the 3D world space
- **Appearance**: Red horizontal bar that scales with distance
- **Components**:
  - Visual bar showing current/maximum health ratio
  - Optional name label for significant enemies
- **Implementation**: Rendered as billboarded sprites in the 3D scene
- **Updates**: Updates in real-time as enemies take damage
- **Visibility**: Only visible when enemies are in line of sight

## Hero Portrait and Level

### Hero Portrait
- **Position**: Top-left corner, adjacent to the health/mana bars
- **Appearance**: Colored square representing the hero
  - Axe: Red (#a83232)
  - Crystal Maiden: Light Blue (#32a8a8)
  - Lich: Dark Blue (#3232a8)
  - Storm Spirit: Green (#32a832)
- **Implementation**: HTML element styled based on selected hero

### Level Indicator
- **Position**: Below the hero portrait
- **Appearance**: Text showing "Level X" where X is the current level
- **Components**:
  - Level text
  - Experience bar showing progress to next level
- **Updates**: Updates when the hero gains experience or levels up

## Ability UI

### Ability Layout
- **Position**: Bottom-right corner of the screen
- **Arrangement**: Circular pattern with basic attack in the center
- **Components**:
  - Six ability buttons arranged in a circle
  - Each button shows an icon representing the ability
  - Cooldown overlay darkens abilities that are on cooldown
  - Mana cost indicator shown on hover/selection
- **Implementation**: HTML elements with event listeners for clicks and key presses

### Cooldown Display
- **Appearance**: Darkening overlay that gradually clears as cooldown progresses
- **Animation**: Circular sweep animation showing remaining cooldown time
- **Text**: Optional numerical countdown for longer cooldowns

## Movement Controls

### Jump Button
- **Position**: Bottom-left corner of the screen
- **Appearance**: Green circular button with "JUMP" text
- **Behavior**:
  - Single tap/click: Perform a jump
  - Long press: Perform consecutive jumps (up to 5)
- **Implementation**: HTML button with event listeners for various interactions

### Fly Button
- **Position**: Adjacent to the Jump button in the bottom-left corner
- **Appearance**: Blue circular button with context-sensitive text
  - "FLY" when on the ground
  - "FLY DOWN" when in the air
  - "LAND" when at minimum flight height
- **Behavior**:
  - Single tap/click: Toggle flight or change height
  - Long press: Continuously change height in the indicated direction
- **Implementation**: HTML button with event listeners and state tracking

### Virtual Joystick (Mobile)
- **Position**: Bottom-left area of the screen
- **Appearance**: 
  - Base circle indicating the joystick area
  - Movable smaller circle that follows touch input
  - Visual indicator showing direction of movement
- **Size**: 80 pixels diameter (configurable)
- **Behavior**:
  - Appears when touch begins in the designated area
  - Moves with touch within constraints
  - Direction and distance from center determine movement vector
- **Implementation**: Touch event handling in the `InputManager` class

## Message System

### Game Messages
- **Position**: Center of the screen, slightly above the midpoint
- **Appearance**: Fade-in/fade-out text messages
- **Behavior**:
  - Messages queue and display sequentially
  - Each message appears for a configurable duration (default: 2000ms)
  - Important messages may have longer durations or special styling
- **Implementation**: Managed by the `showMessage` method in the `UIManager` class

### Ability Announcements
- **Position**: Bottom-center of the screen
- **Appearance**: Temporary text with ability name and effect
- **Behavior**: Appears briefly when an ability is used, then fades out

## Loading and Selection Screens

### Loading Screen
- **Position**: Full screen overlay
- **Components**:
  - Loading bar showing progress
  - Percentage text
  - Game logo or title
- **Implementation**: HTML elements managed by the `UIManager` class

### Hero Selection Screen
- **Position**: Full screen interface
- **Components**:
  - Hero portraits with names and descriptions
  - Selection buttons for each hero
  - Brief description of hero playstyle
- **Implementation**: HTML elements with event listeners for selection

## Configuration
UI elements are configured in `config/ui/` directory, with specific files for different UI components:
- `controls.js`: Settings for input controls and button appearance
- Additional configuration files can be added for other UI aspects

## Responsive Design
- UI elements scale and reposition based on screen size
- Mobile-specific layouts activate on touch-capable devices
- Landscape orientation is optimized for gameplay on mobile devices

## Technical Implementation
- UI is implemented using a combination of HTML/CSS for 2D elements and Three.js for 3D elements
- The `UIManager` class in `js/ui.js` handles creation, updates, and event binding
- Event system allows game components to trigger UI updates
- CSS transitions and animations provide smooth visual feedback