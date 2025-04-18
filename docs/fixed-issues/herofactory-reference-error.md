# HeroFactory Reference Error

## Issue Description

When selecting a hero from the hero selection screen, the following error occurred in the browser console:

```
game.js:228 Uncaught (in promise) ReferenceError: HeroFactory is not defined
    at Game.handleHeroSelected (game.js:228:21)
    at utils.js:225:13
    at Array.forEach (<anonymous>)
    at EventSystem.emit (utils.js:224:32)
    at UIManager.handleHeroSelection (ui.js:188:16)
    at HTMLButtonElement.<anonymous> (ui.js:40:22)
```

The error occurred because the `HeroFactory` class was defined in `hero.js` but was not made available to `game.js` where it was being used.

## Root Cause

In `game.js`, there was a call to `HeroFactory.createHero()` in the `handleHeroSelected` method:

```javascript
// Create hero
this.hero = HeroFactory.createHero(heroType, this.scene);
await this.hero.init();
```

However, the `HeroFactory` class was defined in `hero.js` but was not exported or made available globally, so it couldn't be accessed from `game.js`.

## Initial Solution Attempt

Initially, we tried to make the `HeroFactory` class available globally by adding it to the `window` object at the end of `hero.js`:

```javascript
// Make HeroFactory available globally
window.HeroFactory = HeroFactory;
```

However, this approach didn't resolve the issue, possibly due to script loading order or other factors.

## Final Solution

The final solution was to modify the `Game` class to create heroes directly instead of using the `HeroFactory`:

```javascript
// Create hero directly instead of using HeroFactory
let heroName;
switch (heroType) {
    case 'axe':
        heroName = 'Axe';
        break;
    case 'crystal-maiden':
        heroName = 'Crystal Maiden';
        break;
    case 'lich':
        heroName = 'Lich';
        break;
    case 'storm-spirit':
        heroName = 'Storm Spirit';
        break;
    default:
        heroName = heroType;
}

this.hero = new Hero(heroName, heroType, this.scene);
await this.hero.init();
```

This approach eliminates the dependency on the `HeroFactory` class entirely, resolving the reference error.

## Files Modified

1. `/js/game.js` - Modified to create heroes directly instead of using HeroFactory

## Testing

After implementing the fix, the hero selection process works correctly without any errors in the console. The selected hero is created and displayed in the game world as expected.

## Alternative Solutions Considered

1. **ES6 Module Import/Export**: A more modern approach would be to use ES6 module syntax with `export` and `import` statements. However, this would require restructuring the application to use modules throughout.

2. **Dependency Injection**: Another approach would be to pass the `HeroFactory` as a dependency to the `Game` class. This would make the dependency explicit but would require more significant changes to the codebase.

3. **Ensuring Correct Script Loading Order**: We could have investigated further to ensure that `hero.js` is fully loaded and processed before `game.js` tries to use the `HeroFactory`.

The current solution was chosen for its simplicity, reliability, and minimal impact on the existing codebase, while still resolving the immediate issue.