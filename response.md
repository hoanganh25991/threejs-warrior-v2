# Error Fix: Logger.warn is not a function

## Issue
The game was encountering the following error:
```
config-loader.js:77 Uncaught (in promise) TypeError: Logger.warn is not a function
    at ConfigLoader.getConfig (config-loader.js:77:20)
    at UIManager.bindEvents (ui.js:48:57)
    at new UIManager (ui.js:30:14)
    at Game.init (game.js:43:26)
    at new Game (game.js:33:14)
```

## Root Cause
The error occurred because the `Logger` class in `utils.js` was missing the `warn` method, but this method was being called in the `ConfigLoader.getConfig` function. Additionally, the `error` method was being used elsewhere but was also not defined in the Logger class.

## Solution
Added the missing `warn` and `error` methods to the `Logger` class in `utils.js`:

```javascript
static warn(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] WARNING: ${message}`;
    console.warn(logMessage);
    
    // Append to progress.log
    this.appendToLog(logMessage);
}

static error(message, error) {
    const timestamp = new Date().toISOString();
    let logMessage = `[${timestamp}] ERROR: ${message}`;
    if (error) {
        logMessage += ` ${error.message || error}`;
    }
    console.error(logMessage);
    
    // Append to progress.log
    this.appendToLog(logMessage);
}
```

## Verification
The fix should resolve the TypeError by providing the missing `warn` method that's being called in the ConfigLoader class. The game should now be able to properly load configurations and continue initialization without errors.

## Progress Log
Updated the progress.log file to record this fix:
```
[2024-05-04T09:30:00.000Z] Fixed Logger class by adding missing warn and error methods to resolve ConfigLoader error
```