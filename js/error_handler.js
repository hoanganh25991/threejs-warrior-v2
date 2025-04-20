/**
 * Global error handler for the game
 */

// Set up global error handling
window.onerror = function(message, source, lineno, colno, error) {
    // Format the error message
    const errorMessage = `${message} at ${source}:${lineno}:${colno}`;
    
    // Log to console
    console.error(errorMessage, error);
    
    // Use the Logger if available
    if (window.Logger) {
        window.Logger.error(errorMessage, error);
    }
    
    // Return false to allow the default browser error handling to occur
    return false;
};

// Wrap console methods to ensure proper object serialization
const originalConsoleError = console.error;
console.error = function(...args) {
    // Process arguments to ensure objects are properly stringified
    const processedArgs = args.map(arg => {
        if (arg instanceof Error) {
            return arg.toString();
        } else if (typeof arg === 'object' && arg !== null) {
            try {
                return JSON.stringify(arg);
            } catch (e) {
                return '[Object]';
            }
        }
        return arg;
    });
    
    // Call original console.error with processed arguments
    originalConsoleError.apply(console, processedArgs);
};

// Add to window for access
window.ErrorHandler = {
    // Utility function to format error objects
    formatError: function(error) {
        if (error instanceof Error) {
            return error.toString();
        } else if (typeof error === 'object' && error !== null) {
            try {
                return JSON.stringify(error);
            } catch (e) {
                return '[Object]';
            }
        }
        return String(error);
    },
    
    // Wrap a function with error handling
    wrap: function(fn, context) {
        return function(...args) {
            try {
                return fn.apply(context || this, args);
            } catch (error) {
                console.error('Error in wrapped function:', error);
                if (window.Logger) {
                    window.Logger.error('Error in wrapped function:', error);
                }
                throw error; // Re-throw to maintain original behavior
            }
        };
    }
};