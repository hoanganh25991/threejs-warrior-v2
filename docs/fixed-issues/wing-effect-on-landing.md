# Wing Effect on Landing Implementation

## Issue Description
When the hero lands on the ground after flying or jumping, the wings needed to have a smooth closing animation with visual effects to enhance the gameplay experience.

## Implementation Details

### Wing Closing Animation
- Added a special wing closing effect when the hero lands on the ground
- Implemented a burst particle effect that emanates from the wings when they close
- Wings now smoothly transition from open to closed state before disappearing

### Technical Implementation
1. Enhanced the `createWingParticles` method to support a burst effect parameter:
   - When burst effect is enabled, particles have more velocity in all directions
   - Particles rotate and shrink over time for a more dynamic effect
   - Gravity is applied to the particles to create a natural falling motion

2. Created a new `createWingClosingEffect` method:
   - Generates a burst of particles from both wings
   - Creates a ring effect at the hero's position to show impact
   - Provides visual feedback when the hero lands

3. Updated the landing logic:
   - Wings now close with a smooth animation when the hero lands
   - Added sound effect support for wing closing
   - Improved event emission for UI updates

## Visual Effects
- Particles burst outward from the wings when closing
- Particles gradually fade out and fall to the ground
- Wing feathers appear to scatter slightly when landing

## Configuration
The effect uses the following configuration parameters from `flightConfig`:
- `wingOpenDuration`: Controls how long it takes for wings to close
- `wingEffectColor`: Determines the color of the wing particles

## Related Files
- `hero.js`: Contains the wing animation and particle effect logic
- `config/movement/flight.js`: Contains configuration for wing effects