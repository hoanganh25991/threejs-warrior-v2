# Hero Models Implementation

This document describes the implementation of 3D hero models in the game, using a Ghibli-inspired art style.

## Overview

The hero models are implemented using Three.js, with a focus on a stylized, Ghibli-inspired aesthetic. Each hero has a unique model with custom animations and visual effects that match their theme and abilities.

## Model Structure

Each hero model follows a similar structure:

1. **Base Model**: A group of 3D objects that form the hero's body, clothing, and equipment.
2. **Animations**: Custom animations for idle, walking, and attacking.
3. **Visual Effects**: Particle effects and lighting that match the hero's theme.

## Heroes

### Axe (Mogul Khan)

Axe is represented as a muscular warrior with red skin and armor, carrying a large battle axe.

- **Theme**: Rage and battle fury
- **Visual Effects**: Red rage particles that intensify during attacks
- **Animations**:
  - Idle: Subtle breathing motion with occasional twitching of eyebrows
  - Walk: Heavy steps with axe swinging
  - Attack: Powerful axe swing with body twist

### Crystal Maiden (Rylai)

Crystal Maiden is represented as a young sorceress with blonde hair, wearing a blue robe and carrying a staff with a crystal.

- **Theme**: Frost and ice magic
- **Visual Effects**: Snowflakes and ice crystals that float around her
- **Animations**:
  - Idle: Gentle floating motion with staff crystal pulsing
  - Walk: Light steps with cape billowing
  - Attack: Staff thrust with crystal glowing intensely

### Lich (Kel'Thuzad)

Lich is represented as an undead sorcerer with a skeletal appearance, wearing a dark blue robe and carrying a staff with a frost orb.

- **Theme**: Necromantic frost magic
- **Visual Effects**: Frost particles and glowing blue eyes
- **Animations**:
  - Idle: Hovering motion with occasional jaw movement
  - Walk: Floating movement with robe swaying
  - Attack: Staff thrust with frost orb growing and intensifying

### Storm Spirit (Raijin Thunderkeg)

Storm Spirit is represented as a jovial elemental spirit with a round body, carrying a lightning orb.

- **Theme**: Lightning and mobility
- **Visual Effects**: Lightning bolts and electric particles
- **Animations**:
  - Idle: Bobbing motion with lightning orb pulsing
  - Walk: Hovering movement with arms swinging
  - Attack: Forward thrust with lightning orb growing and intensifying

## Animation System

The animation system uses a custom approach rather than skeletal animations:

1. Each animation (idle, walk, attack) is defined as an object with:
   - A name
   - A duration
   - A loop flag
   - An update function that takes a progress value (0-1)

2. The update function modifies the model's properties based on the animation progress:
   - Position and rotation of body parts
   - Scale and intensity of visual effects
   - Creation and movement of particles

3. Animations are played by setting the current animation and starting a timer.

4. Non-looping animations (like attack) automatically transition back to idle when completed.

## Model Manager

The ModelManager class handles the creation and management of hero models:

- Creates hero models based on type
- Manages the active model
- Handles animation playback
- Updates all models each frame

## Integration with Hero Class

The Hero class has been updated to use the new models:

- The init() method creates a model based on the hero type
- The playAnimation() method plays animations on the model
- The update() method updates the model animations

## Future Improvements

Potential improvements for the hero models:

1. Add more animations (jump, death, ability-specific animations)
2. Implement skeletal animations for more complex movements
3. Add more detailed visual effects for abilities
4. Create more detailed models with higher polygon counts
5. Add customization options (skins, equipment)