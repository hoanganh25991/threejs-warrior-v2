# Fixed Issue: Cannot read properties of undefined (reading 'key')

## Issue Description
The game was throwing the following error when using abilities or basic attacks:
```
Uncaught TypeError: Cannot read properties of undefined (reading 'key')
    at UIManager.updateAbilityCooldown (ui.js:305:75)
    at utils.js:225:13
    at Array.forEach (<anonymous>)
    at EventSystem.emit (utils.js:224:32)
    at Hero.attack (hero.js:789:16)
    at Hero.update (hero.js:3314:22)
    at Game.update (game.js:422:23)
```

## Root Cause
The issue was caused by a mismatch in the event data format between different parts of the codebase:

1. In `hero.js`, the `abilityUsed` event was emitted with `abilityId` and `cooldownTime` properties:
   ```javascript
   Events.emit('abilityUsed', {
       abilityId: 'basic-attack',
       cooldownTime: this.attackCooldown
   });
   ```

2. However, in `ui.js`, the `updateAbilityCooldown` method was expecting an `ability` object with a `key` property:
   ```javascript
   updateAbilityCooldown(data) {
       const { ability } = data;
       const abilityElement = document.getElementById(`ability-${ability.key}`);
       // ...
   }
   ```

This inconsistency caused the error when trying to access `ability.key` on an undefined `ability` object.

## Solution
The solution was to update the `updateAbilityCooldown` and `resetAbilityCooldown` methods in `ui.js` to handle both data formats:

1. For `updateAbilityCooldown`:
   ```javascript
   updateAbilityCooldown(data) {
       // Handle both formats: {ability} and {abilityId, cooldownTime}
       const abilityKey = data.ability ? data.ability.key : data.abilityId;
       const cooldownTime = data.ability ? data.ability.cooldownMax : data.cooldownTime;
       
       if (!abilityKey) {
           Logger.warn('Missing ability key in updateAbilityCooldown');
           return;
       }
       
       // Find the ability element
       const abilityElement = document.getElementById(`ability-${abilityKey}`);
       // ...
   }
   ```

2. For `resetAbilityCooldown`:
   ```javascript
   resetAbilityCooldown(data) {
       // Handle both formats: {ability} and {abilityId}
       const abilityKey = data.ability ? data.ability.key : data.abilityId;
       
       if (!abilityKey) {
           Logger.warn('Missing ability key in resetAbilityCooldown');
           return;
       }
       
       // Find the ability element
       const abilityElement = document.getElementById(`ability-${abilityKey}`);
       // ...
   }
   ```

This change makes the UI manager more robust by handling both event data formats, ensuring that ability cooldowns are properly displayed regardless of how the event is triggered.

## Verification
After implementing this fix, the error no longer occurs when using basic attacks or abilities, and cooldown effects are properly displayed on the UI.