# Fixed Issues: NaN Buffer Geometry and Flight Improvements

## Issue 1: THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN

### Problem
The game was experiencing an error: "THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The 'position' attribute is likely to have NaN values."

### Root Cause
The `hero.radius` property was being used in the `createGlowEffect` method to create a SphereGeometry, but this property was not properly defined in the Hero class. This led to NaN values being passed to the THREE.js geometry constructor.

### Solution
1. Added a default `radius` property to the Hero class constructor:
   ```javascript
   // Physical properties
   this.radius = 1.0; // Default collision/effect radius
   ```

2. Updated the `createGlowEffect` method to validate parameters before creating geometries:
   ```javascript
   // Ensure radius is valid
   const effectRadius = isNaN(this.radius) ? 1.0 : this.radius;
   const effectSize = isNaN(size) ? 1.0 : size;
   
   // Create a sphere geometry for the glow with validated parameters
   const geometry = new THREE.SphereGeometry(effectRadius * effectSize, 16, 16);
   ```

3. Added similar validation in the `createHitEffect` and `createDamageNumber` methods in the combat system to prevent NaN values from causing errors.

## Issue 2: On Fly, Can Touch/Click Jump to Maintain Height

### Problem
When flying, there was no way to maintain or increase height with touch/click interactions.

### Solution
1. Added a new `maintainFlightHeight` method to the Hero class:
   ```javascript
   // Maintain flight height (called when touch/click during flight)
   maintainFlightHeight() {
       if (!this.isFlying) return;
       
       // Get jump configuration
       const jumpConfig = window.configLoader?.getConfig('jumpConfig') || {
           flightJumpSustainedIncrease: 1.0,
           flightJumpMaxHeight: 20
       };
       
       // Increase flight height
       const currentHeight = this.flightHeight || 0;
       this.flightTargetHeight = Math.min(
           currentHeight + jumpConfig.flightJumpSustainedIncrease,
           jumpConfig.flightJumpMaxHeight
       );
       
       // Create subtle wing pulse effect
       this.createWingPulseEffect(0x66ffff, 0.5);
       
       // Show message
       if (window.game && window.game.ui) {
           window.game.ui.showMessage("Maintaining height!");
       }
       
       Logger.log(`Hero ${this.name} maintaining flight height at ${this.flightTargetHeight.toFixed(1)}`);
   }
   ```

2. Enhanced the `flightJump` method to provide better height control and visual feedback.

3. Updated the input handler to call `maintainFlightHeight` when clicking or touching during flight:
   ```javascript
   // Check if hero is flying and maintain height if so
   if (window.game && window.game.hero && window.game.hero.isFlying) {
       window.game.hero.maintainFlightHeight();
   }
   ```

## Issue 3: Play Sounds and Stop Properly

### Problem
Sound effects were being created with direct Audio objects and not properly managed, leading to potential memory leaks and inability to control volume or stop sounds.

### Solution
1. Created a comprehensive `AudioManager` class to handle all game audio:
   - Organized sounds into categories (sfx, music, ambient, ui, voice)
   - Implemented volume controls for master and per-category
   - Added methods to play, stop, and manage sounds
   - Implemented proper cleanup for ended sounds
   - Added support for looping sounds

2. Updated the game initialization to create and configure the AudioManager:
   ```javascript
   initAudio() {
       // Create audio manager
       this.audio = new AudioManager();
       
       // Set default volumes
       this.audio.setMasterVolume(0.5);
       
       // Preload common sounds
       this.audio.preloadCommonSounds();
   }
   ```

3. Updated the hero's flight and jump methods to use the AudioManager:
   ```javascript
   // Play takeoff sound using audio manager
   if (window.game && window.game.audio) {
       window.game.audio.playSound('takeoff', 0.4);
       
       // Start looping flight sound
       this.flightLoopSoundId = window.game.audio.playSound('flightLoop', 0.2, true);
   }
   ```

4. Added proper sound cleanup when stopping actions:
   ```javascript
   // Stop any flight loop sound
   if (this.flightLoopSoundId) {
       window.game.audio.stopSound(this.flightLoopSoundId);
       this.flightLoopSoundId = null;
   }
   ```

These improvements provide a more robust audio system with better control over sound playback and cleanup.