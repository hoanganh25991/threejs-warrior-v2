/**
 * Inventory System
 * 
 * Handles item management, equipment, and inventory UI.
 * Based on the requirements in docs/gameplay/progression.md
 */

const InventorySystem = pc.createScript('inventorySystem');

// Initialize the inventory system
InventorySystem.prototype.initialize = function() {
    // Inventory slots (grid-based)
    this.inventorySize = 24; // 6x4 grid
    this.inventory = new Array(this.inventorySize).fill(null);
    
    // Equipment slots
    this.equipment = {
        weapon: null,
        offhand: null,
        head: null,
        chest: null,
        hands: null,
        legs: null,
        feet: null,
        accessory1: null,
        accessory2: null
    };
    
    // Currency
    this.gold = 0;
    
    // Listen for key press to toggle inventory UI
    this.app.keyboard.on(pc.EVENT_KEYDOWN, this.onKeyDown, this);
    
    console.log("Inventory system initialized");
};

InventorySystem.prototype.update = function(dt) {
    // Nothing to update continuously
};

/**
 * Handle key press to toggle inventory
 */
InventorySystem.prototype.onKeyDown = function(event) {
    // Press I to toggle inventory UI
    if (event.key === pc.KEY_I) {
        // Fire event to toggle inventory UI
        this.app.fire('inventory:toggle');
    }
};

/**
 * Add an item to the inventory
 * @param {Object} item - The item to add
 * @returns {boolean} - Whether the item was successfully added
 */
InventorySystem.prototype.addItem = function(item) {
    // Check if the item is valid
    if (!item || !item.id) {
        console.error("Invalid item:", item);
        return false;
    }
    
    // Check if the item is stackable and if we already have it
    if (item.stackable) {
        for (let i = 0; i < this.inventory.length; i++) {
            const slot = this.inventory[i];
            if (slot && slot.id === item.id) {
                // Increase stack count
                slot.count = (slot.count || 1) + (item.count || 1);
                console.log(`Added ${item.name} x${item.count || 1} to existing stack. Total: ${slot.count}`);
                return true;
            }
        }
    }
    
    // Find an empty slot
    for (let i = 0; i < this.inventory.length; i++) {
        if (!this.inventory[i]) {
            // Add the item to the empty slot
            this.inventory[i] = item;
            // Initialize count for stackable items
            if (item.stackable) {
                item.count = item.count || 1;
            }
            console.log(`Added ${item.name} to inventory slot ${i}`);
            return true;
        }
    }
    
    // Inventory is full
    console.log("Inventory is full, cannot add item:", item.name);
    return false;
};

/**
 * Remove an item from the inventory
 * @param {number} slotIndex - The inventory slot index
 * @param {number} count - The number of items to remove (for stackable items)
 * @returns {Object|null} - The removed item, or null if removal failed
 */
InventorySystem.prototype.removeItem = function(slotIndex, count = 1) {
    // Check if the slot index is valid
    if (slotIndex < 0 || slotIndex >= this.inventory.length) {
        console.error("Invalid slot index:", slotIndex);
        return null;
    }
    
    // Check if there's an item in the slot
    const item = this.inventory[slotIndex];
    if (!item) {
        console.log("No item in slot:", slotIndex);
        return null;
    }
    
    // Handle stackable items
    if (item.stackable && item.count > count) {
        // Reduce the stack count
        item.count -= count;
        console.log(`Removed ${count} ${item.name} from stack. Remaining: ${item.count}`);
        
        // Create a copy of the item with the removed count
        const removedItem = Object.assign({}, item);
        removedItem.count = count;
        return removedItem;
    } else {
        // Remove the entire item
        this.inventory[slotIndex] = null;
        console.log(`Removed ${item.name} from inventory slot ${slotIndex}`);
        return item;
    }
};

/**
 * Move an item from one inventory slot to another
 * @param {number} fromSlot - The source slot index
 * @param {number} toSlot - The destination slot index
 * @returns {boolean} - Whether the move was successful
 */
InventorySystem.prototype.moveItem = function(fromSlot, toSlot) {
    // Check if the slot indices are valid
    if (fromSlot < 0 || fromSlot >= this.inventory.length ||
        toSlot < 0 || toSlot >= this.inventory.length) {
        console.error("Invalid slot indices:", fromSlot, toSlot);
        return false;
    }
    
    // Check if there's an item in the source slot
    if (!this.inventory[fromSlot]) {
        console.log("No item in source slot:", fromSlot);
        return false;
    }
    
    // Handle stacking if the destination slot has the same item type
    const sourceItem = this.inventory[fromSlot];
    const destItem = this.inventory[toSlot];
    
    if (destItem && sourceItem.id === destItem.id && sourceItem.stackable) {
        // Stack the items
        destItem.count = (destItem.count || 1) + (sourceItem.count || 1);
        this.inventory[fromSlot] = null;
        console.log(`Stacked ${sourceItem.name} from slot ${fromSlot} to slot ${toSlot}. Total: ${destItem.count}`);
        return true;
    } else {
        // Swap the items
        this.inventory[fromSlot] = destItem;
        this.inventory[toSlot] = sourceItem;
        console.log(`Moved ${sourceItem.name} from slot ${fromSlot} to slot ${toSlot}`);
        return true;
    }
};

/**
 * Equip an item from the inventory
 * @param {number} slotIndex - The inventory slot index
 * @returns {boolean} - Whether the equip was successful
 */
InventorySystem.prototype.equipItem = function(slotIndex) {
    // Check if the slot index is valid
    if (slotIndex < 0 || slotIndex >= this.inventory.length) {
        console.error("Invalid slot index:", slotIndex);
        return false;
    }
    
    // Check if there's an item in the slot
    const item = this.inventory[slotIndex];
    if (!item) {
        console.log("No item in slot:", slotIndex);
        return false;
    }
    
    // Check if the item is equippable
    if (!item.type || !item.slot) {
        console.log("Item is not equippable:", item.name);
        return false;
    }
    
    // Check if the slot is valid
    if (!this.equipment.hasOwnProperty(item.slot)) {
        console.error("Invalid equipment slot:", item.slot);
        return false;
    }
    
    // Unequip any existing item in the slot
    const existingItem = this.equipment[item.slot];
    if (existingItem) {
        // Try to add the existing item back to inventory
        const added = this.addItem(existingItem);
        if (!added) {
            console.log("Cannot unequip current item, inventory is full");
            return false;
        }
        
        // Remove any attribute bonuses from the existing item
        this.removeItemBonuses(existingItem);
    }
    
    // Equip the new item
    this.equipment[item.slot] = item;
    this.inventory[slotIndex] = null;
    
    // Apply attribute bonuses from the new item
    this.applyItemBonuses(item);
    
    console.log(`Equipped ${item.name} in ${item.slot} slot`);
    return true;
};

/**
 * Unequip an item from an equipment slot
 * @param {string} slot - The equipment slot
 * @returns {boolean} - Whether the unequip was successful
 */
InventorySystem.prototype.unequipItem = function(slot) {
    // Check if the slot is valid
    if (!this.equipment.hasOwnProperty(slot)) {
        console.error("Invalid equipment slot:", slot);
        return false;
    }
    
    // Check if there's an item in the slot
    const item = this.equipment[slot];
    if (!item) {
        console.log("No item equipped in slot:", slot);
        return false;
    }
    
    // Try to add the item back to inventory
    const added = this.addItem(item);
    if (!added) {
        console.log("Cannot unequip item, inventory is full");
        return false;
    }
    
    // Remove the item from the equipment slot
    this.equipment[slot] = null;
    
    // Remove attribute bonuses from the item
    this.removeItemBonuses(item);
    
    console.log(`Unequipped ${item.name} from ${slot} slot`);
    return true;
};

/**
 * Apply attribute bonuses from an item
 * @param {Object} item - The item to apply bonuses from
 */
InventorySystem.prototype.applyItemBonuses = function(item) {
    // Check if the item has attribute bonuses
    if (!item.attributes) {
        return;
    }
    
    // Get the attribute system
    const attributeSystem = this.entity.script.attributeSystem;
    if (!attributeSystem) {
        console.error("Attribute system not found");
        return;
    }
    
    // Apply each attribute bonus
    for (const attr in item.attributes) {
        attributeSystem.applyAttributeBonus(attr, item.attributes[attr]);
    }
    
    console.log(`Applied attribute bonuses from ${item.name}`);
};

/**
 * Remove attribute bonuses from an item
 * @param {Object} item - The item to remove bonuses from
 */
InventorySystem.prototype.removeItemBonuses = function(item) {
    // Check if the item has attribute bonuses
    if (!item.attributes) {
        return;
    }
    
    // Get the attribute system
    const attributeSystem = this.entity.script.attributeSystem;
    if (!attributeSystem) {
        console.error("Attribute system not found");
        return;
    }
    
    // Remove each attribute bonus
    for (const attr in item.attributes) {
        attributeSystem.removeAttributeBonus(attr, item.attributes[attr]);
    }
    
    console.log(`Removed attribute bonuses from ${item.name}`);
};

/**
 * Use a consumable item
 * @param {number} slotIndex - The inventory slot index
 * @returns {boolean} - Whether the item was successfully used
 */
InventorySystem.prototype.useItem = function(slotIndex) {
    // Check if the slot index is valid
    if (slotIndex < 0 || slotIndex >= this.inventory.length) {
        console.error("Invalid slot index:", slotIndex);
        return false;
    }
    
    // Check if there's an item in the slot
    const item = this.inventory[slotIndex];
    if (!item) {
        console.log("No item in slot:", slotIndex);
        return false;
    }
    
    // Check if the item is usable
    if (item.type !== 'consumable' || !item.effect) {
        console.log("Item is not usable:", item.name);
        return false;
    }
    
    // Apply the item effect
    const hero = this.entity.script.hero;
    const attributeSystem = this.entity.script.attributeSystem;
    
    if (!hero || !attributeSystem) {
        console.error("Hero or attribute system not found");
        return false;
    }
    
    // Handle different effect types
    switch (item.effect.type) {
        case 'heal':
            // Heal the hero
            const healAmount = item.effect.amount;
            hero.heal(healAmount);
            break;
            
        case 'mana':
            // Restore mana
            const manaAmount = item.effect.amount;
            hero.restoreMana(manaAmount);
            break;
            
        case 'buff':
            // Apply a temporary attribute buff
            const buffAttr = item.effect.attribute;
            const buffAmount = item.effect.amount;
            const buffDuration = item.effect.duration || 30; // Default 30 seconds
            
            attributeSystem.applyAttributeBonus(buffAttr, buffAmount);
            
            // Remove the buff after the duration
            setTimeout(function() {
                attributeSystem.removeAttributeBonus(buffAttr, buffAmount);
                console.log(`${item.name} buff expired`);
            }, buffDuration * 1000);
            
            console.log(`Applied ${buffAttr} buff of ${buffAmount} for ${buffDuration} seconds`);
            break;
            
        default:
            console.log(`Unknown effect type: ${item.effect.type}`);
            return false;
    }
    
    // Remove the item from inventory (or reduce stack)
    this.removeItem(slotIndex, 1);
    
    console.log(`Used ${item.name}`);
    return true;
};

/**
 * Get the total value of all items in the inventory
 * @returns {number} - The total value
 */
InventorySystem.prototype.getTotalInventoryValue = function() {
    let totalValue = 0;
    
    // Add up the value of inventory items
    for (const item of this.inventory) {
        if (item && item.value) {
            totalValue += item.value * (item.count || 1);
        }
    }
    
    // Add up the value of equipped items
    for (const slot in this.equipment) {
        const item = this.equipment[slot];
        if (item && item.value) {
            totalValue += item.value;
        }
    }
    
    return totalValue;
};

/**
 * Add gold to the inventory
 * @param {number} amount - The amount of gold to add
 */
InventorySystem.prototype.addGold = function(amount) {
    if (amount <= 0) {
        return;
    }
    
    this.gold += amount;
    console.log(`Added ${amount} gold. Total: ${this.gold}`);
};

/**
 * Remove gold from the inventory
 * @param {number} amount - The amount of gold to remove
 * @returns {boolean} - Whether the gold was successfully removed
 */
InventorySystem.prototype.removeGold = function(amount) {
    if (amount <= 0) {
        return true;
    }
    
    if (this.gold < amount) {
        console.log(`Not enough gold. Have: ${this.gold}, Need: ${amount}`);
        return false;
    }
    
    this.gold -= amount;
    console.log(`Removed ${amount} gold. Remaining: ${this.gold}`);
    return true;
};

/**
 * Get a list of all equipped items
 * @returns {Object} - The equipped items by slot
 */
InventorySystem.prototype.getEquippedItems = function() {
    return Object.assign({}, this.equipment);
};

/**
 * Get the inventory contents
 * @returns {Array} - The inventory items
 */
InventorySystem.prototype.getInventoryItems = function() {
    return this.inventory.slice();
};

/**
 * Calculate the total attribute bonuses from all equipped items
 * @returns {Object} - The total attribute bonuses
 */
InventorySystem.prototype.getTotalAttributeBonuses = function() {
    const bonuses = {
        strength: 0,
        agility: 0,
        intelligence: 0,
        vitality: 0,
        spirit: 0
    };
    
    // Add up bonuses from all equipped items
    for (const slot in this.equipment) {
        const item = this.equipment[slot];
        if (item && item.attributes) {
            for (const attr in item.attributes) {
                if (bonuses.hasOwnProperty(attr)) {
                    bonuses[attr] += item.attributes[attr];
                }
            }
        }
    }
    
    return bonuses;
};

/**
 * Sort the inventory by item type
 */
InventorySystem.prototype.sortInventory = function() {
    // Create a copy of the inventory
    const items = this.inventory.filter(item => item !== null);
    
    // Sort the items by type
    items.sort((a, b) => {
        // Sort order: weapons, armor, accessories, consumables, materials, other
        const typeOrder = {
            'weapon': 1,
            'armor': 2,
            'accessory': 3,
            'consumable': 4,
            'material': 5,
            'other': 6
        };
        
        const aOrder = typeOrder[a.type] || 6;
        const bOrder = typeOrder[b.type] || 6;
        
        return aOrder - bOrder;
    });
    
    // Clear the inventory
    this.inventory.fill(null);
    
    // Add the sorted items back to the inventory
    for (let i = 0; i < items.length; i++) {
        this.inventory[i] = items[i];
    }
    
    console.log("Inventory sorted by item type");
};