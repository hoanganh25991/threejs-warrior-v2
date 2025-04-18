/**
 * Flight configuration settings
 */

const FlightConfig = {
    // Basic flight settings
    initialHeight: 5,           // Initial height when starting flight
    maxHeight: 20,              // Maximum flight height
    minHeight: 1,               // Minimum flight height
    
    // Height change rates
    heightChangeRate: {
        keyPress: 2,            // Height change per key press
        longPress: 1.5,         // Height change per second when holding button
        mouseWheel: 1           // Height change per mouse wheel tick
    },
    
    // Camera settings
    cameraFollowFlight: true,   // Whether camera follows player during flight
    cameraFlightOffset: 0.8,    // How much camera follows flight height (0-1)
    mouseLookSensitivity: 0.5,  // Sensitivity for mouse look during flight
    
    // Visual effects
    upwardEffectColor: 0x00ffff,    // Color for upward flight effect
    downwardEffectColor: 0xff9900,  // Color for downward flight effect
    wingEffectColor: 0x66ccff,      // Color for wing effect
    
    // Wing effects
    showWings: true,            // Whether to show wings during flight
    wingSize: 2,                // Size of wings
    wingFlapSpeed: 0.5,         // Speed of wing flapping animation
    wingOpenDuration: 0.8,      // Duration of wing open/close animation in seconds
    wingFlapIntensity: 0.3,     // Base intensity of wing flapping
    
    // Flight transition settings
    flightThreshold: 5,         // Height threshold to transition from jump to flight
    slowHeightChangeRate: 0.5,  // Slow height change rate when above threshold
    
    // Sound effects
    takeoffSoundEffect: 'assets/sounds/submarine.mp3',
    landingSoundEffect: 'assets/sounds/basso.mp3',
    flightLoopSoundEffect: null // Path to looping sound during flight
};

// Make the config available in the global scope for the config loader
window.FlightConfig = FlightConfig;

// Export the configuration for module systems
if (typeof module !== 'undefined') {
    module.exports = FlightConfig;
}