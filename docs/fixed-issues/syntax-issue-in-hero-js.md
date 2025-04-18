# Syntax Issue in hero.js

## Issue Description
There was a syntax error in the `js/hero.js` file. The `animateWings` method had an extra closing brace at line 460, which caused the rest of the method's code to be outside of the method scope. This resulted in a syntax error when trying to run the JavaScript file.

## Fix Applied
Removed the extra closing brace at line 460, which allowed the rest of the `animateWings` method to be properly contained within the method scope. The method now correctly ends at line 528 with the closing brace before the `animateWingOpenTransition` method.

## Technical Details
- The issue was identified by examining the structure of the `animateWings` method and finding an extra closing brace.
- The fix was verified by running `node -c js/hero.js` which checks the syntax of the JavaScript file without executing it.
- No functionality was changed, only the syntax error was corrected.

## Impact
This fix ensures that the hero's wing animation functionality works correctly, which is important for the visual effects when heroes are jumping or flying in the game.