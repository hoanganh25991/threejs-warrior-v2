# Fixed Issue: ability.startCooldown is not a function

## Issue Description
When attempting to use hero abilities, the following error was occurring:
```
hero.js:2024 Uncaught TypeError: ability.startCooldown is not a function
    at Hero.useAbility (hero.js:2024:17)
    at InputManager.handleAbilityKeyPress (input.js:76:34)
    at InputManager.handleKeyDown (input.js:53:18)
```

## Root Cause
The error occurred because the `Hero.useAbility()` method was calling a non-existent `startCooldown()` method on the ability object. Upon examining the `Ability` class, it was found that cooldowns are managed internally within the `use()` method of the `Ability` class, which sets the cooldown directly when an ability is successfully used.

## Solution
The solution was to modify the `useAbility()` method in the `Hero` class to properly use the `Ability` class's `use()` method instead of trying to call a non-existent `startCooldown()` method.

### Changes Made:
1. Replaced the check for `ability.isOnCooldown` with a direct check of `ability.cooldown > 0`
2. Removed the call to the non-existent `ability.startCooldown()` method
3. Called `ability.use()` which internally handles setting the cooldown
4. Stored the result of `ability.use()` to return from the method

### Code Changes:
```javascript
// Before:
ability.startCooldown();
Events.emit('abilityUsed', { hero: this, ability });
this.showSkillShoutOut(ability.name);

// After:
const result = ability.use();
this.showSkillShoutOut(ability.name);
return result;
```

## Verification
After making these changes, abilities can now be used without throwing the TypeError, and cooldowns are properly managed by the Ability class's internal logic.