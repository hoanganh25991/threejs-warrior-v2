# Hero Selection System

## Overview
The hero selection system allows players to choose from four unique heroes at the beginning of the game. Each hero has distinct abilities, stats, and playstyles that cater to different gameplay preferences.

## Implementation Details

### Selection Interface
- The hero selection screen is displayed at the start of the game after assets are loaded
- Heroes are presented with visual representations and basic information about their playstyle
- Players can click on a hero to select them and begin gameplay

### Available Heroes
The game currently features four heroes from the Dota universe:

1. **Axe (Mogul Khan)**
   - **Playstyle**: Tank/Berserker
   - **Color**: Red (#cc0000)
   - **Base Stats**: 
     - Health: 150
     - Strength: 15
     - Movement Speed: 4.5
   - **Abilities**: 
     - Berserker's Call: Taunts nearby enemies and increases armor
     - Battle Hunger: Damages an enemy over time
     - Counter Helix: Automatically counterattacks when hit (passive)
     - Culling Blade: Instantly kills low-health enemies
     - War Cry: Increases armor and movement speed
     - Taunt: Makes enemies attack you

2. **Crystal Maiden (Rylai)**
   - **Playstyle**: Support/Elemental Mage
   - **Color**: Light Blue (#00ccff)
   - **Base Stats**: 
     - Mana: 120
     - Intelligence: 15
     - Movement Speed: 4
   - **Abilities**: 
     - Crystal Nova: Damages and slows enemies in an area
     - Frostbite: Freezes an enemy, preventing movement and attack
     - Brilliance Aura: Provides mana regeneration to allies (passive)
     - Freezing Field: Damages enemies in a large area over time
     - Frost Armor: Increases armor and provides frost shield
     - Cold Snap: Freezes the ground, creating an ice path

3. **Lich (Kel'Thuzad)**
   - **Playstyle**: Necromancer/Crowd Control
   - **Color**: Dark Blue (#0000cc)
   - **Base Stats**: 
     - Mana: 130
     - Intelligence: 18
     - Movement Speed: 4.2
   - **Abilities**: 
     - Frost Nova: Damages and slows enemies in an area
     - Frost Armor: Increases armor and slows attackers
     - Dark Ritual: Sacrifices a unit to gain mana
     - Chain Frost: Launches a frost orb that bounces between enemies
     - Frost Blast: Damages and slows enemies in a large area
     - Ice Barrier: Creates a shield that absorbs damage

4. **Storm Spirit (Raijin Thunderkeg)**
   - **Playstyle**: Mobile Caster/Assassin
   - **Color**: Green (#00cc00)
   - **Base Stats**: 
     - Agility: 15
     - Movement Speed: 5.5
     - Attack Speed: 1.2
   - **Abilities**: 
     - Static Remnant: Creates a static clone that damages nearby enemies
     - Electric Vortex: Pulls an enemy toward Storm Spirit
     - Overload: Empowers attacks after using abilities (passive)
     - Ball Lightning: Transforms into a ball of lightning to travel quickly
     - Electric Surge: Damages enemies in a line
     - Storm Gust: Creates a damaging field of energy

### Technical Implementation
- Hero data is stored in `config/hero/heroes.js`
- Each hero has a unique color, stats, and set of abilities
- The UI for hero selection is managed by the `UIManager` class in `js/ui.js`
- When a hero is selected, the `handleHeroSelected` method in `game.js` creates the hero and initializes the game

### Hero Switching
- Currently, heroes can only be selected at the beginning of the game
- Future implementation will allow switching heroes at special locations after completing the introduction

## Configuration
Hero configurations can be modified in the `config/hero/heroes.js` file, which defines:
- Available heroes list
- Default hero stats
- Hero-specific stats and abilities
- Visual appearance settings

## UI Elements
- Hero selection buttons with hero names and descriptions
- Visual indicators of hero type and playstyle
- Confirmation button to start the game with the selected hero