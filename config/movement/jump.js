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
    
    // Hold-to-jump settings
    holdJumpEnabled: true,      // Whether holding jump button increases height
    holdJumpAcceleration: 5,    // Acceleration when holding jump button
    holdJumpMaxVelocity: 15,    // Maximum velocity when holding jump button
    holdJumpDecay: 0.8,         // How quickly jump velocity decays when button is released
    
    // Jump effects
    jumpEffectColor: 0xffffff,  // Color of regular jump effect
    doubleJumpEffectColor: 0x00ffff, // Color of double jump effect
    holdJumpEffectColor: 0x66ccff, // Color of hold jump effect
    
    // Camera settings during jump
    cameraFollowJump: true,     // Whether camera should follow player during jump
    cameraJumpOffset: 0.7,      // How much camera follows the jump (0-1, where 1 is full follow)
    cameraTiltFactor: 0.3,      // How much camera tilts down as height increases (0-1)
    cameraRollEnabled: true,    // Whether to add subtle roll effect during jumps
    cameraBackOffset: 0.5,      // How much to move camera back as height increases
    cameraFovIncrease: 10,      // How much to increase field of view at max height
    cameraSkyViewFactor: 0.4,   // How much to adjust camera to see more sky (0-1)
    
    // Sound effects
    jumpSoundEffect: 'sounds/pop.mp3',
    landSoundEffect: 'sounds/blow.mp3',
    
    // Wing effects during high jumps
    showWings: true,            // Whether to show wings during high jumps
    wingAppearThreshold: 5,     // Height threshold for wings to appear
    wingSize: 2,                // Size of wings
    wingFlapSpeed: 0.5,         // Speed of wing flapping animation
    wingEffectColor: 0x66ccff,  // Color for wing effect
    wingOpenDuration: 0.8,      // Duration of wing open/close animation in seconds
    
    // Flight transition
    flightTransitionThreshold: 5, // Height threshold to transition to flight mode
    flightTransitionEnabled: true, // Whether to automatically transition to flight mode
    
    // Slow flight settings
    slowFlightThreshold: 5, // Height threshold for slow flight mode
    slowFlightAcceleration: 1.0, // Reduced acceleration when in slow flight mode (fighting gravity)
    slowFlightMaxVelocity: 5 // Maximum velocity when in slow flight mode
};

// Make the config available in the global scope for the config loader
window.JumpConfig = JumpConfig;

// Export the configuration for module systems
if (typeof module !== 'undefined') {
    module.exports = JumpConfig;
}