# Wing Position TypeError Fix

## Issue
A TypeError was occurring in the game when trying to create wing flap effects:

```
Uncaught TypeError: Cannot read properties of undefined (reading 'position')
    at Hero.createWingFlapEffect (hero.js:577:48)
    at Hero.update (hero.js:3273:30)
    at Game.update (game.js:422:23)
    at Game.animate (game.js:453:14)
```

## Root Cause
In the `createWingFlapEffect` method, the code was trying to access `this.leftWing.position` and `this.rightWing.position`, but these properties don't exist in the Hero class. The wing objects are actually stored in `this.leftWingGroup` and `this.rightWingGroup`.

## Solution
Modified the `createWingFlapEffect` method to use the correct wing group objects:

```javascript
createWingFlapEffect(color, intensity) {
    // Skip if wings aren't visible
    if (!this.wings || !this.wings.visible || !this.leftWingGroup || !this.rightWingGroup) return;
    
    // Create particles at wing positions
    const particleCount = Math.floor(5 + intensity * 10); // More particles with higher intensity
    const particleSize = 0.05 + intensity * 0.1;
    const particleLifetime = 500 + intensity * 500; // Longer lifetime with higher intensity
    
    // Create particles for both wings
    this.createWingParticles(this.leftWingGroup.position, color, particleCount, particleSize, particleLifetime);
    this.createWingParticles(this.rightWingGroup.position, color, particleCount, particleSize, particleLifetime);
}
```

## Changes Made
1. Changed `this.leftWing.position` to `this.leftWingGroup.position`
2. Changed `this.rightWing.position` to `this.rightWingGroup.position`
3. Added additional null checks for `this.leftWingGroup` and `this.rightWingGroup`

## Impact
This fix resolves the TypeError that was occurring during gameplay when the hero was using wing effects, particularly during flight or jumping animations. The wing flap particle effects now display correctly.