# Hero Reference Error

## Issue Description

When selecting a hero from the hero selection screen, the following error occurred in the browser console:

```
game.js:246 Uncaught (in promise) ReferenceError: Hero is not defined
    at Game.handleHeroSelected (game.js:246:25)
    at utils.js:225:13
    at Array.forEach (<anonymous>)
    at EventSystem.emit (utils.js:224:32)
    at UIManager.handleHeroSelection (ui.js:188:16)
    at HTMLButtonElement.<anonymous> (ui.js:40:22)
```

The error occurred because the `Hero` class was defined in `hero.js` but was not made available to `game.js` where it was being used.

## Root Cause

In `game.js`, there was a call to create a new `Hero` instance in the `handleHeroSelected` method:

```javascript
this.hero = new Hero(heroName, heroType, this.scene);
await this.hero.init();
```

However, the `Hero` class was defined in `hero.js` but was not exported or made available globally, so it couldn't be accessed from `game.js`.

## Solution

The solution was to make the `Hero` class available globally by adding it to the `window` object at the end of `hero.js`:

```javascript
// Make Hero class available globally
window.Hero = Hero;
window.HeroFactory = HeroFactory;
```

This approach makes both the `Hero` class and the `HeroFactory` class available to all scripts in the application, resolving the reference error.

## Files Modified

1. `/js/hero.js` - Added code to make the `Hero` class available globally

## Testing

After implementing the fix, the hero selection process works correctly without any errors in the console. The selected hero is created and displayed in the game world as expected.

## Alternative Solutions Considered

1. **ES6 Module Import/Export**: A more modern approach would be to use ES6 module syntax with `export` and `import` statements. However, this would require restructuring the application to use modules throughout.

2. **Dependency Injection**: Another approach would be to pass the `Hero` class as a dependency to the `Game` class. This would make the dependency explicit but would require more significant changes to the codebase.

3. **Ensuring Correct Script Loading Order**: We could have investigated further to ensure that `hero.js` is fully loaded and processed before `game.js` tries to use the `Hero` class.

The current solution was chosen for its simplicity, reliability, and minimal impact on the existing codebase, while still resolving the immediate issue.