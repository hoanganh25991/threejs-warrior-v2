/**
 * Jump configuration settings
 */

const JumpConfig = {
    // Basic jump settings
    initialVelocity: 10,        // Initial upward velocity for jump
    gravity: 20,                // Gravity applied during jump
    maxJumpCount: 2,            // Maximum number of consecutive jumps (double jump)
    
    // Multi-jump settings
    multiJumpHeightIncrease: 1.5, // Height multiplier for each consecutive jump
    maxJumpHeight: 15,          // Maximum height player can reach with multiple jumps
    
    // Jump effects
    jumpEffectColor: 0xffffff,  // Color of regular jump effect
    doubleJumpEffectColor: 0x00ffff, // Color of double jump effect
    
    // Camera settings during jump
    cameraFollowJump: true,     // Whether camera should follow player during jump
    cameraJumpOffset: 0.7,      // How much camera follows the jump (0-1, where 1 is full follow)
    
    // Jump on flight settings
    flightJumpVelocity: 3,      // Initial velocity when jumping while flying
    flightJumpGravity: 10,      // Gravity applied during flight jump
    flightJumpHeightIncrease: 0.5, // How much height is added when jumping during flight
    
    // Sound effects
    jumpSoundEffect: '/System/Library/Sounds/Pop.aiff',
    landSoundEffect: '/System/Library/Sounds/Blow.aiff'
};

// Make the config available in the global scope for the config loader
window.JumpConfig = JumpConfig;

// Export the configuration for module systems
if (typeof module !== 'undefined') {
    module.exports = JumpConfig;
}