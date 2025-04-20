# Inventory System

The inventory system in Legends of the Ancient Realms manages the player's items, equipment, and resources. It provides a structured way to organize, use, and equip items throughout the game.

## Core Components

### Item Class

The `Item` class represents a single item with the following properties:

- **ID**: Unique identifier for the item
- **Name**: Display name of the item
- **Type**: Category of item (weapon, armor, accessory, consumable)
- **Rarity**: Quality level (common, uncommon, rare, epic, legendary)
- **Stats**: Attributes and effects the item provides
- **Description**: Detailed description of the item
- **Icon**: Visual representation in the UI
- **Model**: 3D model for the world representation
- **Stackable**: Whether multiple instances can be combined
- **Quantity**: Number of items in a stack (for stackable items)

### Inventory Class

The `Inventory` class manages the player's collection of items:

- **Slots**: Fixed number of inventory positions
- **Equipment**: Special slots for equipped items
- **Gold**: Currency for purchasing items
- **Methods**: Functions for adding, removing, using, and equipping items

### ItemFactory Class

The `ItemFactory` class handles the creation of items:

- **Item Templates**: Predefined item definitions
- **Random Item Generation**: Creating items with random properties
- **Item Registration**: Adding new item types to the system

## Item Types

1. **Weapons**: Offensive equipment that affects attack damage and abilities
   - Melee: Swords, axes, maces
   - Ranged: Bows, wands, staves
   - Stats: Attack damage, attack speed, critical chance

2. **Armor**: Defensive equipment that provides protection
   - Body Armor: Chest protection
   - Helmets: Head protection
   - Gloves: Hand protection
   - Boots: Foot protection
   - Stats: Armor, health, resistances

3. **Accessories**: Additional equipment that provides various benefits
   - Rings: Small bonuses to multiple stats
   - Amulets: Significant bonus to a primary stat
   - Trinkets: Unique effects or abilities
   - Stats: Various attribute bonuses, special effects

4. **Consumables**: Single-use items that provide temporary effects
   - Potions: Instant health or mana restoration
   - Scrolls: Temporary buffs or special abilities
   - Food: Gradual regeneration effects
   - Elixirs: Permanent stat increases

## Rarity System

Items are classified by rarity, which affects their power and value:

1. **Common** (White)
   - Basic items with minimal stats
   - Easily found or purchased
   - No special properties

2. **Uncommon** (Green)
   - Improved items with better stats
   - Moderately available
   - May have one minor special property

3. **Rare** (Blue)
   - High-quality items with strong stats
   - Limited availability
   - Usually has one significant special property

4. **Epic** (Purple)
   - Exceptional items with powerful stats
   - Very limited availability
   - Multiple special properties or effects

5. **Legendary** (Orange)
   - The most powerful items
   - Extremely rare
   - Unique effects and properties
   - Often tied to lore or quests

## Item Properties

### Base Stats

- **Attack Damage**: Increases damage dealt
- **Attack Speed**: Increases attack frequency
- **Armor**: Reduces damage taken
- **Health**: Increases maximum health
- **Mana**: Increases maximum mana
- **Movement Speed**: Increases character speed

### Special Effects

- **On-Hit Effects**: Trigger when attacking
- **Passive Abilities**: Constant effects while equipped
- **Active Abilities**: Can be activated by the player
- **Conditional Bonuses**: Activate under specific conditions
- **Set Bonuses**: Additional effects when wearing multiple pieces

## Inventory Management

### Adding Items

- Items are added to the first available slot
- Stackable items combine with existing stacks
- If inventory is full, items cannot be added

### Removing Items

- Items can be removed individually or in stacks
- Removed items can be dropped, sold, or destroyed

### Using Items

- Consumable items can be used directly from inventory
- Effects are applied immediately
- Item is removed after use (or quantity reduced)

### Equipping Items

- Equipment items can be equipped to appropriate slots
- Only one item can be equipped per slot
- Equipped items apply their stats to the character
- Previously equipped items are returned to inventory

## Equipment System

### Equipment Slots

- **Weapon**: Primary offensive equipment
- **Armor**: Primary defensive equipment
- **Helmet**: Head protection
- **Gloves**: Hand protection
- **Boots**: Foot protection
- **Accessory 1**: First accessory slot
- **Accessory 2**: Second accessory slot

### Equipment Effects

- Equipped items apply their stats to the character
- Visual appearance of character may change
- Special effects may be visible on character
- Some abilities may be modified by equipment

## Item Interaction

### Item Use

- Right-click or use button to activate consumables
- Effects are applied immediately
- Cooldowns may apply to certain items

### Item Equip/Unequip

- Drag and drop to equip/unequip
- Right-click to quickly equip
- Compare feature shows stat differences

### Item Sorting

- Sort by type, rarity, name, or value
- Filter by various properties
- Search by name or description

## UI Elements

### Inventory Grid

- Visual representation of inventory slots
- Drag and drop interface
- Tooltips show detailed item information
- Color coding based on item rarity

### Equipment Panel

- Visual representation of equipped items
- Character preview shows appearance
- Stat summary shows total effects

### Item Details

- Detailed view of selected item
- Compare feature for equipment
- Use/equip buttons for direct interaction

## Implementation Details

### Item Data Structure

Items are stored with the following data:

```javascript
{
    id: "sword_rare_1",
    name: "Enchanted Blade",
    type: "weapon",
    rarity: "rare",
    stats: {
        attackDamage: 15,
        attackSpeed: 0.1
    },
    description: "A blade with magical properties.",
    icon: "assets/icons/items/rare_weapon.png",
    equipped: false,
    stackable: false,
    quantity: 1
}
```

### Inventory Persistence

Inventory state is saved and loaded with the player's game data:

- Items in inventory slots
- Equipped items
- Gold amount
- Item properties and quantities

## Future Enhancements

1. **Crafting System**: Combine items to create new ones
2. **Enchantment System**: Add or improve properties on existing items
3. **Durability System**: Items wear out with use and need repair
4. **Weight System**: Limit inventory based on item weight
5. **Item Sets**: Special bonuses for wearing matching equipment
6. **Unique Items**: One-of-a-kind items with special properties
7. **Soulbound Items**: Items that cannot be traded or sold