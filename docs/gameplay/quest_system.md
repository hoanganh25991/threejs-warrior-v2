# Quest System

The quest system in Legends of the Ancient Realms provides a structured way to guide players through the game's narrative and provide objectives for gameplay.

## Core Components

### Quest Class

The `Quest` class represents a single quest with the following properties:

- **ID**: Unique identifier for the quest
- **Title**: Display name of the quest
- **Description**: Detailed description of what the quest involves
- **Type**: Category of quest (main, side, hero, repeatable)
- **Rewards**: Experience, gold, and items awarded upon completion
- **Objectives**: List of objectives that must be completed to finish the quest
- **State**: Current status (active, completed, etc.)

### Quest Objective Class

The `QuestObjective` class represents a single objective within a quest:

- **ID**: Unique identifier for the objective
- **Description**: What the player needs to do
- **Required Progress**: Numerical value needed to complete the objective
- **Current Progress**: Current progress toward completion
- **Type**: Category of objective (kill, collect, talk, explore, etc.)
- **State**: Current status (active, completed, etc.)

### Quest Manager

The `QuestManager` class handles all quests in the game:

- Maintains lists of available, active, and completed quests
- Activates and deactivates quests
- Tracks objective progress
- Creates and manages quest markers in the world
- Handles quest rewards

## Quest Types

1. **Main Quests**: Core storyline quests that advance the main narrative
   - Higher rewards
   - Often unlock new areas or abilities
   - Sequential progression

2. **Side Quests**: Optional quests that provide additional story and rewards
   - Varied objectives and themes
   - Can be completed in any order
   - Often tied to specific locations or NPCs

3. **Hero Quests**: Character-specific quests that develop the hero's backstory
   - Unique to each playable hero
   - Often involve using the hero's specific abilities
   - Provide rewards that complement the hero's playstyle

4. **Repeatable Quests**: Quests that can be completed multiple times
   - Often involve gathering resources or defeating enemies
   - Provide renewable source of experience and gold
   - May have cooldown periods between completions

## Objective Types

1. **Kill**: Defeat a specific number of enemies
   - Can target specific enemy types
   - May require using specific abilities

2. **Collect**: Gather items from the world
   - Items may drop from enemies
   - Items may be found in the environment
   - May involve crafting or combining items

3. **Talk**: Interact with NPCs
   - May involve dialogue choices
   - Can trigger events or reveal information

4. **Explore**: Visit specific locations
   - Discover new areas
   - Investigate points of interest
   - May involve solving environmental puzzles

5. **Escort**: Protect an NPC as they move through the world
   - Defend against enemy attacks
   - Ensure NPC reaches destination safely

6. **Ability**: Use specific abilities a number of times
   - Encourages players to use different abilities
   - May require specific targeting or combinations

## Quest Markers and UI

### World Markers

- **Color Coding**: Different colors for different quest types
  - Gold: Main quests
  - Blue: Side quests
  - Purple: Hero quests
  - Green: Repeatable quests

- **Animation**: Markers float and rotate to attract attention

- **Positioning**: Markers are placed at the location of the current objective

### UI Elements

- **Quest Log**: List of all active and completed quests
  - Sortable by type, progress, and rewards
  - Detailed view shows all objectives and rewards

- **Minimap Indicators**: Icons on the minimap show quest locations
  - Different icons for different quest types
  - Pulse effect for active quest objectives

- **Objective Tracker**: On-screen display of current objectives
  - Shows progress for active quests
  - Limited to 3-5 quests to avoid clutter

## Quest Rewards

### Experience

- Scaled based on quest difficulty and type
- Main quests provide more experience than side quests
- Hero quests provide moderate experience but unique rewards

### Gold

- Economic reward for completing quests
- Used for purchasing items and services
- Amount varies based on quest difficulty and type

### Items

- Equipment: Weapons, armor, and accessories
- Consumables: Potions, scrolls, and other single-use items
- Crafting Materials: Resources for crafting and upgrading
- Unique Items: Special items with unique properties or effects

## Implementation Details

### Event-Based Progress Tracking

The quest system uses an event-based approach to track progress:

1. Game events (enemy death, item collection, etc.) are broadcast
2. Quest manager listens for relevant events
3. When an event matches an active objective, progress is updated
4. When all objectives are completed, the quest is marked as complete and rewards are given

### Quest Persistence

Quest state is saved and loaded with the player's game data:

- Active quests and their current progress
- Completed quests
- Available quests and their unlock conditions

### Quest Dependencies

Some quests may have prerequisites:

- Require completion of other quests
- Require specific player level
- Require specific reputation or faction standing
- Require possession of specific items

## Future Enhancements

1. **Branching Quests**: Quests with multiple possible outcomes based on player choices
2. **Dynamic Quests**: Procedurally generated quests based on player behavior and world state
3. **Faction Quests**: Quests tied to different factions with reputation rewards
4. **Time-Limited Quests**: Quests that must be completed within a certain time frame
5. **Cooperative Quests**: Quests designed for multiple players working together