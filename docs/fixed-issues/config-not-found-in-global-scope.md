# Fixed Issue: Config Not Found in Global Scope

## Issue Description

The game was encountering an error during initialization:
```
ERROR: Error loading configuration files: Config not found in global scope: jumpConfig
```

This error occurred because the configuration files in the `config/movement` directory were not properly exporting their configurations to the global scope, which is required by the `ConfigLoader` class to access them.

## Root Cause

The configuration files (`jump.js` and `flight.js`) were defining their configuration objects but not making them available in the global scope (window object). The `ConfigLoader` class expects these configurations to be available as global variables.

In the `ConfigLoader.loadConfig` method, it attempts to access the configuration from the global scope using:
```javascript
const configObject = window[configVarName.charAt(0).toUpperCase() + configVarName.slice(1) + 'Config'];
```

However, the configuration files were only exporting the configurations for module systems using:
```javascript
if (typeof module !== 'undefined') {
    module.exports = JumpConfig;
}
```

## Solution

Updated the configuration files to explicitly add the configuration objects to the global scope (window object) before exporting them for module systems:

1. In `config/movement/jump.js`:
```javascript
// Make the config available in the global scope for the config loader
window.JumpConfig = JumpConfig;

// Export the configuration for module systems
if (typeof module !== 'undefined') {
    module.exports = JumpConfig;
}
```

2. In `config/movement/flight.js`:
```javascript
// Make the config available in the global scope for the config loader
window.FlightConfig = FlightConfig;

// Export the configuration for module systems
if (typeof module !== 'undefined') {
    module.exports = FlightConfig;
}
```

## Verification

After making these changes, the configuration files are properly loaded by the `ConfigLoader` class, and the game can access the jump and flight configurations without errors.

## Lessons Learned

When working with browser-based JavaScript that uses both global variables and module systems, it's important to ensure that objects are properly exposed to the appropriate scope. In this case, the configuration loader expected the configurations to be available in the global scope, so we needed to explicitly add them to the window object.