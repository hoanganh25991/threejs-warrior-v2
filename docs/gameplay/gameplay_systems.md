# Gameplay Systems

## Movement & Controls

### Point-and-Click Navigation
- Primary movement method using left mouse button
- Click on ground to move character to that location
- Pathfinding automatically navigates around obstacles
- Double-click to perform a short dash in that direction (if hero has dash ability)
- Click on enemy to move within attack range and begin auto-attacking

### Arrow Keys Movement
- Alternative direct control using keyboard
- Arrow Up: Move forward relative to camera
- Arrow Left: Strafe left
- Arrow Down: Move backward
- Arrow Right: Strafe right
- Shift + movement key: Sprint (consumes stamina)
- Space: Dodge roll (direction based on movement keys)

### Camera Controls
- Middle-mouse button: Rotate camera 360 degrees around character
- Mouse wheel: Zoom in/out (minimum and maximum distances vary by environment)

## Combat System

### Auto-Attack
- Automatically attacks targeted enemy when in range
- Attack speed and damage based on hero attributes and equipped weapon
- Critical hits occur based on critical chance attribute
- Different attack animations based on weapon type and hero
- Combo system: consecutive attacks increase damage multiplier (resets after 3 seconds of not attacking)

### Ability System
- Each hero has 4 unique active abilities plus 1 passive and 1 ultimate
- 1, 2, 3, 4 number keys activate abilities
- Pressing an ability key while targeting will cast it immediately
- Visual indicators show area of effect for targeted abilities
- Ability cooldowns displayed on HUD
- Resource costs (mana, energy, rage, etc.) vary by hero type

### Status Effects
- **Damage Types**: Physical, Magical, Pure
- **Crowd Control**: Stun, Slow, Root, Silence, Disarm, Fear
- **Buffs**: Increased damage, speed, defense, regeneration
- **Debuffs**: Damage over time, reduced stats, vulnerability
- Status effect icons appear above character and on HUD
- Duration timers displayed on status effect icons

### Combat Mechanics
- **Blocking**: Chance to reduce incoming physical damage (shield equipment increases chance)
- **Dodging**: Chance to avoid attacks entirely (agility increases chance)
- **Interrupts**: Certain abilities can interrupt enemy casting
- **Combos**: Some abilities synergize for enhanced effects when used in sequence
- **Counter System**: Specific ability types are effective against certain enemy types
- **Execution Mechanics**: Some abilities deal bonus damage to low-health targets

## Progression Systems

### Experience & Leveling
- Maximum level 30
- Experience gained from:
  - Defeating enemies (scaled by enemy level relative to player)
  - Completing quests (main quests provide significant XP)
  - Discovering new areas (exploration bonuses)
  - Finding lore items (knowledge XP)
- Level-up grants:
  - Increased base attributes
  - Ability points
  - Talent points at specific thresholds (levels 5, 10, 15, 20, 25)
  - Increased health and resource pools

### Ability Advancement
- Each ability has 3 tiers of advancement
- Ability points earned on level-up (1 point every level)
- Tier 1: Base ability functionality
- Tier 2: Enhanced effects and reduced cooldowns
- Tier 3: Additional functionality or significant power increase
- Special ability tomes found in the world can grant extra ability points

### Talent System
- Hero-specific specialization options
- Three talent paths per hero representing different playstyles
- Talent points earned at levels 5, 10, 15, 20, and 25
- Each talent provides meaningful gameplay changes rather than just stat increases
- Talents can be reset at special locations for a resource cost

## Item & Equipment System

### Item Categories
- **Weapons**: Determines attack style, damage, and special effects
- **Armor**: Head, chest, hands, legs, feet slots with defense values
- **Accessories**: Rings, amulets, trinkets with special properties
- **Consumables**: Potions, scrolls, food with temporary effects
- **Crafting Materials**: Used to create or upgrade equipment
- **Quest Items**: Special items related to quests and story progression

### Item Properties
- **Base Stats**: Damage, defense, attribute bonuses
- **Special Effects**: Unique properties like life steal, area damage, etc.
- **Set Bonuses**: Additional effects when wearing multiple pieces of a set
- **Rarity Tiers**: Common, Uncommon, Rare, Epic, Legendary, Artifact
- **Durability**: Equipment degrades with use and must be repaired
- **Level Requirements**: Higher-tier items require minimum hero level

### Inventory Management
- Grid-based inventory with limited space (expandable via special items)
- Quick-access slots for consumables (accessible via number keys)
- Equipment comparison tooltips
- Item stacking for consumables and materials
- Sort and filter options
- Storage chests in safe areas for additional inventory space

## Quest & Objective System

### Quest Types
- **Main Quests**: Central storyline progression
- **Side Quests**: Optional content with unique rewards
- **Hero Quests**: Character-specific storylines
- **Faction Quests**: Missions related to Sentinel or Scourge
- **Repeatable Quests**: Daily/weekly challenges for resources
- **Dynamic Quests**: Procedurally generated based on world state

### Objective Tracking
- Quest log categorizes and tracks all active quests
- Minimap markers indicate objective locations
- Compass indicator points toward active objective
- Detailed quest descriptions with progress tracking
- Optional objective hints system
- Quest difficulty indicators

### Reward Systems
- Experience points
- Gold and resources
- Unique equipment
- Ability points
- Reputation with factions
- Access to new areas or vendors