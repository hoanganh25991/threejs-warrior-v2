# Hero Skills System

## Overview
Each hero in the game has a unique set of six skills that define their playstyle and combat capabilities. Skills are arranged in a circular pattern around the basic attack button, allowing for quick access during gameplay.

## Skill Structure

### Basic Attack
- Located at the center of the skill arrangement
- Performs a standard attack against the targeted enemy
- Deals damage based on the hero's attack damage stat
- No cooldown or mana cost

### Skill Arrangement
Skills are arranged in a circular pattern around the basic attack button:
- Primary skills (1-4) are positioned in the cardinal directions
- Secondary skills (5-6) are positioned in the diagonal directions
- This arrangement is inspired by Diablo Immortal's skill layout

## Skill Types

### Active Skills
- Require player activation through number keys (1-6) or on-screen buttons
- Consume mana when used
- Have cooldown periods before they can be used again
- Visual effects indicate when skills are ready or on cooldown

### Passive Skills
- Provide constant benefits without requiring activation
- Do not consume mana or have cooldowns
- Usually occupy the third skill slot (key 3)

## Skill Components
Each skill consists of the following components:

1. **Basic Properties**
   - ID: Unique identifier for the skill
   - Name: Display name shown in the UI
   - Type: Category of skill (attack, defense, utility, etc.)
   - Description: Brief explanation of what the skill does

2. **Resource Management**
   - Mana Cost: Amount of mana required to use the skill
   - Cooldown: Time in seconds before the skill can be used again
   - Passive Flag: Boolean indicating if this is a passive skill

3. **Effects**
   - Array of effect objects that define what happens when the skill is used
   - Can include damage, buffs, debuffs, crowd control, etc.
   - May have conditions for different effects based on targets or circumstances

4. **Scaling**
   - How the skill's effectiveness increases with hero attributes
   - Different skills scale with different attributes (strength, agility, intelligence)

5. **Targeting**
   - Type: How the skill is targeted (self, single-target, ground-target, etc.)
   - Range: Maximum distance the skill can reach
   - Radius: Area of effect for AoE skills

6. **Visual and Audio Feedback**
   - Animation: Reference to the animation played when the skill is used
   - Sound: Reference to the sound effect played
   - Visuals: Visual effects displayed when the skill is activated

## Hero-Specific Skills

### Axe Skills
1. **Berserker's Call** (Key 1)
   - Type: Taunt
   - Effect: Taunts nearby enemies and increases armor
   - Cooldown: 8 seconds
   - Mana Cost: 10

2. **Battle Hunger** (Key 2)
   - Type: Debuff
   - Effect: Damages an enemy over time until they kill a unit
   - Cooldown: 5 seconds
   - Mana Cost: 15

3. **Counter Helix** (Key 3)
   - Type: Counter (Passive)
   - Effect: Automatically counterattacks when hit
   - Cooldown: 0.5 seconds (internal)
   - Mana Cost: 0

4. **Culling Blade** (Key 4)
   - Type: Execute
   - Effect: Instantly kills low-health enemies
   - Cooldown: 10 seconds
   - Mana Cost: 25

5. **War Cry** (Key 5)
   - Type: Buff
   - Effect: Increases armor and movement speed
   - Cooldown: 12 seconds
   - Mana Cost: 15

6. **Taunt** (Key 6)
   - Type: Utility
   - Effect: Taunts enemies, making them attack you
   - Cooldown: 5 seconds
   - Mana Cost: 5

### Crystal Maiden Skills
1. **Crystal Nova** (Key 1)
   - Type: AoE
   - Effect: Damages and slows enemies in an area
   - Cooldown: 5 seconds
   - Mana Cost: 15

2. **Frostbite** (Key 2)
   - Type: Disable
   - Effect: Freezes an enemy, preventing movement and attack
   - Cooldown: 6 seconds
   - Mana Cost: 20

3. **Brilliance Aura** (Key 3)
   - Type: Aura (Passive)
   - Effect: Provides mana regeneration to allies
   - Cooldown: 0 seconds
   - Mana Cost: 0

4. **Freezing Field** (Key 4)
   - Type: Channeled
   - Effect: Damages enemies in a large area over time
   - Cooldown: 12 seconds
   - Mana Cost: 30

5. **Frost Armor** (Key 5)
   - Type: Buff
   - Effect: Increases armor and provides frost shield
   - Cooldown: 10 seconds
   - Mana Cost: 18

6. **Cold Snap** (Key 6)
   - Type: Utility
   - Effect: Freezes the ground, creating an ice path
   - Cooldown: 8 seconds
   - Mana Cost: 22

### Lich Skills
1. **Frost Nova** (Key 1)
   - Type: AoE
   - Effect: Damages and slows enemies in an area
   - Cooldown: 5 seconds
   - Mana Cost: 15

2. **Frost Armor** (Key 2)
   - Type: Buff
   - Effect: Increases armor and slows attackers
   - Cooldown: 8 seconds
   - Mana Cost: 10

3. **Dark Ritual** (Key 3)
   - Type: Utility
   - Effect: Sacrifices a unit to gain mana
   - Cooldown: 4 seconds
   - Mana Cost: 5

4. **Chain Frost** (Key 4)
   - Type: Ultimate
   - Effect: Launches a frost orb that bounces between enemies
   - Cooldown: 12 seconds
   - Mana Cost: 30

5. **Frost Blast** (Key 5)
   - Type: AoE
   - Effect: Damages and slows enemies in a large area
   - Cooldown: 10 seconds
   - Mana Cost: 20

6. **Ice Barrier** (Key 6)
   - Type: Defense
   - Effect: Creates a shield that absorbs damage
   - Cooldown: 8 seconds
   - Mana Cost: 15

### Storm Spirit Skills
1. **Static Remnant** (Key 1)
   - Type: AoE
   - Effect: Creates a static clone that damages nearby enemies
   - Cooldown: 4 seconds
   - Mana Cost: 10

2. **Electric Vortex** (Key 2)
   - Type: Disable
   - Effect: Pulls an enemy toward Storm Spirit
   - Cooldown: 6 seconds
   - Mana Cost: 20

3. **Overload** (Key 3)
   - Type: Passive
   - Effect: Empowers attacks after using abilities
   - Cooldown: 0 seconds
   - Mana Cost: 0

4. **Ball Lightning** (Key 4)
   - Type: Movement
   - Effect: Transforms into a ball of lightning to travel quickly
   - Cooldown: 3 seconds
   - Mana Cost: 15

5. **Electric Surge** (Key 5)
   - Type: Damage
   - Effect: Damages enemies in a line
   - Cooldown: 5 seconds
   - Mana Cost: 12

6. **Storm Gust** (Key 6)
   - Type: AoE
   - Effect: Creates a damaging field of energy
   - Cooldown: 15 seconds
   - Mana Cost: 25

## UI Representation
- Skills are displayed as circular buttons in the bottom-right of the screen
- Cooldown is shown as a darkening overlay that gradually clears
- Mana cost is displayed on hover/selection
- Keyboard shortcuts (1-6) are shown on the skill buttons

## Configuration
Skill configurations are defined in `config/skills.js`, which contains:
- Detailed skill properties
- Effect definitions
- Scaling information
- Visual and audio references

## Technical Implementation
- Skills are implemented in the `Hero` class in `js/hero.js`
- Each hero has a `setupAbilities` method that configures their unique skills
- The `Ability` class manages cooldowns, mana costs, and activation
- Skill effects are processed by the combat system