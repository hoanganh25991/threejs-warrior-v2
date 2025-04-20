# Fixed Issue: playAmbientSound is not a function

## Issue Description
The game was throwing the following error when trying to set up ambient sounds in the world:

```
world.js:475 Uncaught (in promise) TypeError: window.game.audio.playAmbientSound is not a function
    at World.setupAmbientSounds (world.js:475:31)
    at World.createEnvironmentalEffects (world.js:297:14)
    at World.createEnvironment (world.js:112:14)
    at World.init (world.js:37:14)
    at Game.init (game.js:69:20)
```

The error occurred because the `World` class was trying to call `window.game.audio.playAmbientSound()`, but this method didn't exist in the `AudioManager` class.

## Solution
Added the missing `playAmbientSound` method to the `AudioManager` class in `js/audio-manager.js`. The method wraps the existing `playSound` method but specifically handles ambient sounds with appropriate defaults (looping by default) and tracking.

Also added:
1. A dedicated `ambientSounds` collection to track ambient sounds separately
2. A `stopAllAmbientSounds` method to stop all ambient sounds at once
3. Updated the `cleanupSound` method to properly clean up ambient sounds
4. Added preloading for 'wind' and 'birds' ambient sound files

## Implementation Details
The new `playAmbientSound` method:
- Takes the same parameters as `playSound` but defaults `loop` to `true` for ambient sounds
- Stores the sound instance in a dedicated `ambientSounds` collection
- Returns the instance ID for later reference

## Related Files
- `/js/audio-manager.js` - Added the new method and updated related functionality
- `/js/world.js` - Contains the call to `playAmbientSound` in the `setupAmbientSounds` method

## Date Fixed
[Current Date]