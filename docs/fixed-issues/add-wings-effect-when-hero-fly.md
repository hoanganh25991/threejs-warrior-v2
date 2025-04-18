# Add Wings Effect When Hero Flies

## Issue Description
The game needed a visual wings effect for heroes when they fly (hold jump). The wings needed to:
1. Show up on the back of the hero
2. Have effects when the hero changes height (up/down)

## Implementation Details

### 3D Wings Creation
- Added 3D wing geometry that attaches to the hero model
- Wings are created using THREE.Shape with a curved wing outline
- Wings are positioned at the back of the hero model
- Each hero has two wings (left and right) that mirror each other

### Wing Visibility
- Wings are initially hidden and only appear when:
  - The hero is jumping and reaches a certain height threshold
  - The hero is holding the jump button to fly higher
  - The hero is in flight mode

### Dynamic Wing Animation
- Wings change color based on direction of movement:
  - Upward movement: Light blue color (0x00ffff)
  - Downward movement: Orange color (0xff9900)
- Wings flap faster and more intensely based on movement intensity
- Wing opacity and glow (emissive intensity) increase with movement intensity

### Particle Effects
- Added particle effects that emit from the wings during flapping
- Particles inherit the wing color (blue for upward, orange for downward)
- More particles are generated with higher intensity movement
- Particles fade out and disperse over time

### Technical Implementation
- Wings are implemented as THREE.Mesh objects with custom geometry
- Wing animation uses requestAnimationFrame for smooth motion
- Wing flapping is controlled by sine wave animation for natural movement
- Particle effects use small sphere geometries with fading opacity

## Files Modified
- `/js/hero.js`: Added wing creation, animation, and particle effect methods
- Updated the hero update method to handle wing visibility and animation

## Configuration
Wings can be configured through the flight configuration:
- `wingSize`: Controls the size of the wings
- `wingFlapSpeed`: Controls how fast the wings flap
- `wingEffectColor`: Base color for the wings
- `upwardEffectColor`: Color for upward movement
- `downwardEffectColor`: Color for downward movement

## Result
Heroes now have visually appealing wings that appear when flying or jumping high. The wings provide visual feedback about the direction and intensity of movement, enhancing the game's visual appeal and player feedback.