# Controls Config Not Found in Global Scope

## Issue Description

The game was encountering an error during initialization:

```
error_handler.js:1 [2025-04-18T20:23:03.883Z] ERROR: Error loading configuration files: Config not found in global scope: controlsConfig
```

This error occurred because the `ControlsConfig` object defined in `config/ui/controls.js` was not properly exposed to the global scope, causing the configuration loader to fail when trying to access it.

## Root Cause

In the `config/ui/controls.js` file, the `ControlsConfig` object was defined using `const ControlsConfig = {...}`, which made it available only within the scope of that file. The configuration loader was expecting to find this object in the global scope (window object) when loading the script.

The issue was in the way the configuration was defined and exported:

```javascript
const ControlsConfig = {
    // Configuration properties...
};

// Export the configuration
if (typeof module !== 'undefined') {
    module.exports = ControlsConfig;
}
```

This approach works for module-based systems but doesn't make the configuration available in the global scope for browser-based script loading.

## Solution

The solution was to explicitly assign the configuration object to the global window object:

```javascript
window.ControlsConfig = {
    // Configuration properties...
};

// For module compatibility
if (typeof module !== 'undefined') {
    module.exports = window.ControlsConfig;
}
```

By using `window.ControlsConfig`, we ensure that the configuration is available globally, which allows the configuration loader to access it when the script is loaded.

## Implementation

The fix was implemented by modifying the `config/ui/controls.js` file to explicitly assign the configuration to the window object.

## Verification

After implementing the fix, the error no longer appears during game initialization, and the controls configuration is successfully loaded.

## Related Files

- `/config/ui/controls.js` - Modified to expose the configuration to the global scope
- `/js/config-loader.js` - The file that loads and manages configuration files

## Lessons Learned

When working with browser-based JavaScript that uses dynamic script loading, it's important to ensure that objects that need to be accessed across different scripts are properly exposed to the global scope. This is especially important for configuration objects that are loaded dynamically.