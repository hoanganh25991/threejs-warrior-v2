# Add Wings Effect When Hero Flies

## Issue Description
The game needed a visual wings effect for heroes when they fly (hold jump). The wings needed to:
1. Show up on the back of the hero
2. Have a lot of feathers for realistic appearance
3. Animate from closed to open when transitioning from normal to flight mode
4. Have effects when the hero changes height (up/down)

## Implementation Details

### 3D Wings Creation
- Added 3D wing geometry that attaches to the hero model
- Wings are created with multiple individual feathers (configurable, default: 24 feathers)
- Wings have multiple layers of feathers (configurable, default: 3 layers)
- Added bone structure to wings for more realistic appearance
- Wings are positioned at the back of the hero model
- Each hero has two wings (left and right) that mirror each other

### Wing Visibility and Transition
- Wings are initially hidden and only appear when:
  - The hero is jumping and reaches a certain height threshold
  - The hero is holding the jump button to fly higher
  - The hero is in flight mode
- Smooth transition animation when wings appear:
  - Wings start in a closed/folded position
  - Gradually open/unfold as the hero transitions to flight mode
  - Fold back when the hero lands or stops flying
  - Animation uses easing functions for natural movement

### Dynamic Wing Animation
- Wings change color based on direction of movement:
  - Upward movement: Light blue color (0x00ffff)
  - Downward movement: Orange color (0xff9900)
- Wings flap faster and more intensely based on movement intensity
- Wing opacity and glow (emissive intensity) increase with movement intensity
- Individual feathers have slight variations in:
  - Color (random hue/saturation variations)
  - Movement (phase offset for more natural flapping)
  - Rotation (random initial rotation for natural appearance)

### Particle Effects
- Added particle effects that emit from the wings during flapping
- Particles inherit the wing color (blue for upward, orange for downward)
- More particles are generated with higher intensity movement
- Particles fade out and disperse over time

### Technical Implementation
- Wings are implemented as THREE.Mesh objects with custom geometry
- Each feather is an individual mesh with its own animation
- Wing animation uses requestAnimationFrame for smooth motion
- Wing flapping is controlled by sine wave animation for natural movement
- Particle effects use small sphere geometries with fading opacity
- Transition animations use cubic easing for smooth opening/closing

## Files Modified
- `/js/hero.js`: Added wing creation, animation, and particle effect methods
- Updated the hero update method to handle wing visibility and animation

## Configuration
Wings can be configured through the flight configuration:
- `wingSize`: Controls the size of the wings
- `wingFlapSpeed`: Controls how fast the wings flap
- `featherCount`: Number of feathers per wing
- `featherLayers`: Number of layers of feathers
- `wingOpenDuration`: Time in seconds for wings to fully open/close
- `wingEffectColor`: Base color for the wings
- `upwardEffectColor`: Color for upward movement
- `downwardEffectColor`: Color for downward movement

## Result
Heroes now have visually appealing wings with multiple feathers that appear when flying or jumping high. The wings smoothly transition from closed to open when the hero starts flying, and provide visual feedback about the direction and intensity of movement, enhancing the game's visual appeal and player feedback.