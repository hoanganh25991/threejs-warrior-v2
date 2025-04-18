# Fixed Issue: Camera FollowJump Not a Function

## Issue Description

The game was encountering an error during the hero jump action:
```
hero.js:1690 Uncaught TypeError: window.game.camera.followJump is not a function
    at Hero.jump (hero.js:1690:36)
    at InputManager.update (input.js:395:38)
    at Game.update (game.js:401:31)
    at Game.animate (game.js:437:14)
```

This error occurred because the code was trying to call a `followJump` method on the camera object, but this method was not defined.

## Root Cause

In the `Hero.jump` method, there's a call to `window.game.camera.followJump(this, jumpConfig.cameraJumpOffset)` when the `cameraFollowJump` setting is enabled in the jump configuration. However, the camera object (which is a THREE.PerspectiveCamera) doesn't have a `followJump` method by default.

The jump configuration in `config/movement/jump.js` has the following settings:
```javascript
// Camera settings during jump
cameraFollowJump: true,     // Whether camera should follow player during jump
cameraJumpOffset: 0.7,      // How much camera follows the jump (0-1, where 1 is full follow)
```

## Solution

Added the `followJump` method to the camera object in the `initThreeJS` method of the `Game` class:

```javascript
// Add followJump method to camera
this.camera.followJump = (hero, offsetFactor) => {
    // Store the current camera position relative to the hero
    const offset = new THREE.Vector3().subVectors(this.camera.position, hero.position);
    
    // Adjust camera height based on hero's jump height and offset factor
    const heightAdjustment = hero.jumpHeight * offsetFactor;
    offset.y += heightAdjustment;
    
    // Update camera position
    this.camera.position.copy(hero.position).add(offset);
    
    // Look at hero
    this.camera.lookAt(hero.position);
};
```

This implementation:
1. Calculates the current offset between the camera and the hero
2. Adjusts the camera height based on the hero's jump height and the configured offset factor
3. Updates the camera position to maintain the same relative position to the hero but with the adjusted height
4. Ensures the camera continues to look at the hero

## Verification

After implementing this solution, the camera now properly follows the hero during jumps, providing a more dynamic and immersive view of the jumping action. The error no longer occurs when the hero jumps.

## Lessons Learned

When extending functionality of third-party objects like THREE.js camera, it's important to ensure that all required methods are properly implemented. In this case, we needed to add a custom method to the camera object to support the game's camera follow feature during jumps.