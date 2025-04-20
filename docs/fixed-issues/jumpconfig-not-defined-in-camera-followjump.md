# Fixed: jumpConfig is not defined in camera followJump

## Issue
The game was throwing a console error:
```
[2025-04-20T08:22:50.736Z] ERROR: Final error in camera followJump: jumpConfig is not defined
```

## Root Cause
The `jumpConfig` and `flightConfig` variables were defined inside the first try-catch block in the `followJump` method of the camera, but they were being used in the second try-catch block. When an error occurred in the second block, these variables were not accessible because they were scoped to the first try-catch block.

## Solution
1. Moved the configuration variable declarations outside both try-catch blocks to make them accessible throughout the entire `followJump` method.
2. Added default values for all configuration properties.
3. Improved the configuration loading logic to merge loaded configurations with defaults using the spread operator.
4. Added the missing `cameraRollEnabled` property to the default `jumpConfig`.

## Files Changed
- `/Users/anhle/work-station/game-v2/js/game.js`

## Implementation Details
The fix involved restructuring the `followJump` method to ensure that the configuration variables are always defined and accessible throughout the method, even if errors occur during initialization or execution.

```javascript
// Before:
try {
    // ...
    const jumpConfig = window.configLoader?.getConfig('jumpConfig') || { ... };
    const flightConfig = window.configLoader?.getConfig('flightConfig') || { ... };
} catch (error) {
    // ...
}

try {
    // Using jumpConfig and flightConfig here could cause errors if they're not defined
    // ...
} catch (finalError) {
    // ...
}

// After:
// Define configurations outside try-catch blocks
let jumpConfig = { ... };
let flightConfig = { ... };

try {
    // ...
    if (window.configLoader) {
        const loadedJumpConfig = window.configLoader.getConfig('jumpConfig');
        const loadedFlightConfig = window.configLoader.getConfig('flightConfig');
        
        if (loadedJumpConfig) {
            jumpConfig = { ...jumpConfig, ...loadedJumpConfig };
        }
        
        if (loadedFlightConfig) {
            flightConfig = { ...flightConfig, ...loadedFlightConfig };
        }
    }
} catch (error) {
    // ...
}

try {
    // Now jumpConfig and flightConfig are always defined here
    // ...
} catch (finalError) {
    // ...
}
```

This ensures that the configuration variables are always defined, even if errors occur during initialization or execution.