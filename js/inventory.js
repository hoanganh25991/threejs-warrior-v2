/**
 * Inventory and item system for the game
 */

class Item {
    constructor(id, name, type, rarity, stats, description) {
        this.id = id;
        this.name = name;
        this.type = type; // 'weapon', 'armor', 'accessory', 'consumable'
        this.rarity = rarity; // 'common', 'uncommon', 'rare', 'epic', 'legendary'
        this.stats = stats || {};
        this.description = description || '';
        this.icon = null; // Path to icon image
        this.model = null; // 3D model for the item
        this.equipped = false;
        this.stackable = this.type === 'consumable'; // Only consumables are stackable by default
        this.quantity = 1;
        
        // Set icon based on type and rarity
        this.setDefaultIcon();
        
        Logger.log(`Item created: ${this.name} (${this.type}, ${this.rarity})`);
    }
    
    setDefaultIcon() {
        // Set default icon based on type and rarity
        const rarityPrefix = this.rarity.toLowerCase();
        const typePrefix = this.type.toLowerCase();
        
        this.icon = `assets/icons/items/${rarityPrefix}_${typePrefix}.png`;
    }
    
    use(target) {
        if (this.type !== 'consumable') {
            Logger.log(`Cannot use non-consumable item: ${this.name}`);
            return false;
        }
        
        // Apply effects based on item stats
        if (target) {
            // Apply healing
            if (this.stats.healing) {
                target.heal(this.stats.healing);
                Logger.log(`${target.name} healed for ${this.stats.healing} by using ${this.name}`);
            }
            
            // Apply mana restoration
            if (this.stats.mana) {
                target.restoreMana(this.stats.mana);
                Logger.log(`${target.name} restored ${this.stats.mana} mana by using ${this.name}`);
            }
            
            // Apply temporary buffs
            if (this.stats.buffs) {
                Object.entries(this.stats.buffs).forEach(([stat, value]) => {
                    const originalValue = target.stats[stat] || 0;
                    target.stats[stat] = originalValue + value;
                    
                    // Set timeout to remove buff
                    setTimeout(() => {
                        target.stats[stat] = originalValue;
                        Logger.log(`Buff from ${this.name} expired for ${target.name}`);
                    }, (this.stats.duration || 10) * 1000);
                    
                    Logger.log(`Applied ${stat} buff of ${value} to ${target.name} from ${this.name}`);
                });
            }
        }
        
        // Reduce quantity
        this.quantity--;
        
        // Emit item used event
        Events.emit('itemUsed', { item: this, target: target });
        
        Logger.log(`Used item: ${this.name}`);
        return true;
    }
    
    equip(character) {
        if (this.type === 'consumable') {
            Logger.log(`Cannot equip consumable item: ${this.name}`);
            return false;
        }
        
        // Apply item stats to character
        Object.entries(this.stats).forEach(([stat, value]) => {
            // Store original value for unequipping
            if (!character.originalStats) {
                character.originalStats = {};
            }
            
            character.originalStats[stat] = character.stats[stat] || 0;
            character.stats[stat] = (character.stats[stat] || 0) + value;
            
            Logger.log(`Applied ${stat} +${value} to ${character.name} from equipping ${this.name}`);
        });
        
        this.equipped = true;
        
        // Emit item equipped event
        Events.emit('itemEquipped', { item: this, character: character });
        
        Logger.log(`Equipped item: ${this.name} on ${character.name}`);
        return true;
    }
    
    unequip(character) {
        if (!this.equipped) {
            Logger.log(`Item not equipped: ${this.name}`);
            return false;
        }
        
        // Remove item stats from character
        if (character.originalStats) {
            Object.entries(this.stats).forEach(([stat, value]) => {
                if (character.originalStats[stat] !== undefined) {
                    character.stats[stat] = character.originalStats[stat];
                    Logger.log(`Restored ${stat} to ${character.stats[stat]} for ${character.name} after unequipping ${this.name}`);
                }
            });
        }
        
        this.equipped = false;
        
        // Emit item unequipped event
        Events.emit('itemUnequipped', { item: this, character: character });
        
        Logger.log(`Unequipped item: ${this.name} from ${character.name}`);
        return true;
    }
    
    // Get color based on rarity
    getRarityColor() {
        switch (this.rarity.toLowerCase()) {
            case 'common':
                return '#ffffff'; // White
            case 'uncommon':
                return '#1eff00'; // Green
            case 'rare':
                return '#0070dd'; // Blue
            case 'epic':
                return '#a335ee'; // Purple
            case 'legendary':
                return '#ff8000'; // Orange
            default:
                return '#ffffff'; // White
        }
    }
    
    // Clone the item
    clone() {
        const newItem = new Item(
            this.id,
            this.name,
            this.type,
            this.rarity,
            JSON.parse(JSON.stringify(this.stats)),
            this.description
        );
        
        newItem.icon = this.icon;
        newItem.stackable = this.stackable;
        newItem.quantity = this.quantity;
        
        return newItem;
    }
}

class Inventory {
    constructor(size = 20) {
        this.size = size;
        this.slots = new Array(size).fill(null);
        this.gold = 0;
        
        // Equipment slots
        this.equipment = {
            weapon: null,
            armor: null,
            helmet: null,
            gloves: null,
            boots: null,
            accessory1: null,
            accessory2: null
        };
        
        Logger.log(`Inventory created with ${size} slots`);
    }
    
    addItem(item) {
        // Check if item is stackable and if we already have it
        if (item.stackable) {
            for (let i = 0; i < this.slots.length; i++) {
                const slot = this.slots[i];
                if (slot && slot.id === item.id) {
                    // Stack with existing item
                    slot.quantity += item.quantity;
                    
                    // Emit item added event
                    Events.emit('itemAdded', { item: item, slot: i });
                    
                    Logger.log(`Added ${item.quantity} ${item.name} to existing stack (total: ${slot.quantity})`);
                    return true;
                }
            }
        }
        
        // Find first empty slot
        const emptySlot = this.slots.findIndex(slot => slot === null);
        if (emptySlot === -1) {
            Logger.log('Inventory is full');
            return false;
        }
        
        // Add item to empty slot
        this.slots[emptySlot] = item.clone();
        
        // Emit item added event
        Events.emit('itemAdded', { item: item, slot: emptySlot });
        
        Logger.log(`Added ${item.name} to inventory slot ${emptySlot}`);
        return true;
    }
    
    removeItem(slotIndex, quantity = 1) {
        if (slotIndex < 0 || slotIndex >= this.slots.length) {
            Logger.log(`Invalid slot index: ${slotIndex}`);
            return false;
        }
        
        const item = this.slots[slotIndex];
        if (!item) {
            Logger.log(`No item in slot ${slotIndex}`);
            return false;
        }
        
        if (item.stackable) {
            // Reduce quantity
            item.quantity -= quantity;
            
            // Remove item if quantity is 0 or less
            if (item.quantity <= 0) {
                const removedItem = this.slots[slotIndex];
                this.slots[slotIndex] = null;
                
                // Emit item removed event
                Events.emit('itemRemoved', { item: removedItem, slot: slotIndex });
                
                Logger.log(`Removed all ${removedItem.name} from inventory slot ${slotIndex}`);
            } else {
                // Emit item updated event
                Events.emit('itemUpdated', { item: item, slot: slotIndex });
                
                Logger.log(`Removed ${quantity} ${item.name} from inventory slot ${slotIndex} (remaining: ${item.quantity})`);
            }
        } else {
            // Non-stackable item, remove completely
            const removedItem = this.slots[slotIndex];
            this.slots[slotIndex] = null;
            
            // Emit item removed event
            Events.emit('itemRemoved', { item: removedItem, slot: slotIndex });
            
            Logger.log(`Removed ${removedItem.name} from inventory slot ${slotIndex}`);
        }
        
        return true;
    }
    
    useItem(slotIndex, target) {
        if (slotIndex < 0 || slotIndex >= this.slots.length) {
            Logger.log(`Invalid slot index: ${slotIndex}`);
            return false;
        }
        
        const item = this.slots[slotIndex];
        if (!item) {
            Logger.log(`No item in slot ${slotIndex}`);
            return false;
        }
        
        if (item.type !== 'consumable') {
            Logger.log(`Cannot use non-consumable item: ${item.name}`);
            return false;
        }
        
        // Use the item
        if (item.use(target)) {
            // Remove item if quantity is 0
            if (item.quantity <= 0) {
                this.slots[slotIndex] = null;
                
                // Emit item removed event
                Events.emit('itemRemoved', { item: item, slot: slotIndex });
                
                Logger.log(`Removed ${item.name} from inventory after use`);
            } else {
                // Emit item updated event
                Events.emit('itemUpdated', { item: item, slot: slotIndex });
            }
            
            return true;
        }
        
        return false;
    }
    
    equipItem(slotIndex, character) {
        if (slotIndex < 0 || slotIndex >= this.slots.length) {
            Logger.log(`Invalid slot index: ${slotIndex}`);
            return false;
        }
        
        const item = this.slots[slotIndex];
        if (!item) {
            Logger.log(`No item in slot ${slotIndex}`);
            return false;
        }
        
        if (item.type === 'consumable') {
            Logger.log(`Cannot equip consumable item: ${item.name}`);
            return false;
        }
        
        // Determine equipment slot based on item type
        let equipmentSlot;
        switch (item.type) {
            case 'weapon':
                equipmentSlot = 'weapon';
                break;
            case 'armor':
                equipmentSlot = 'armor';
                break;
            case 'helmet':
                equipmentSlot = 'helmet';
                break;
            case 'gloves':
                equipmentSlot = 'gloves';
                break;
            case 'boots':
                equipmentSlot = 'boots';
                break;
            case 'accessory':
                // Use first empty accessory slot
                equipmentSlot = this.equipment.accessory1 ? 'accessory2' : 'accessory1';
                break;
            default:
                Logger.log(`Unknown item type: ${item.type}`);
                return false;
        }
        
        // Unequip current item in that slot if any
        if (this.equipment[equipmentSlot]) {
            this.equipment[equipmentSlot].unequip(character);
            
            // Move current equipped item back to inventory
            this.addItem(this.equipment[equipmentSlot]);
            
            Logger.log(`Unequipped ${this.equipment[equipmentSlot].name} from ${equipmentSlot}`);
        }
        
        // Equip new item
        if (item.equip(character)) {
            // Remove from inventory
            this.slots[slotIndex] = null;
            
            // Add to equipment slot
            this.equipment[equipmentSlot] = item;
            
            // Emit item equipped event
            Events.emit('itemEquipped', { item: item, slot: equipmentSlot, character: character });
            
            Logger.log(`Equipped ${item.name} to ${equipmentSlot}`);
            return true;
        }
        
        return false;
    }
    
    unequipItem(equipmentSlot, character) {
        if (!this.equipment[equipmentSlot]) {
            Logger.log(`No item equipped in ${equipmentSlot}`);
            return false;
        }
        
        const item = this.equipment[equipmentSlot];
        
        // Unequip the item
        if (item.unequip(character)) {
            // Add back to inventory
            if (this.addItem(item)) {
                // Clear equipment slot
                this.equipment[equipmentSlot] = null;
                
                // Emit item unequipped event
                Events.emit('itemUnequipped', { item: item, slot: equipmentSlot, character: character });
                
                Logger.log(`Unequipped ${item.name} from ${equipmentSlot}`);
                return true;
            } else {
                // Inventory full, re-equip
                item.equip(character);
                Logger.log(`Cannot unequip ${item.name}: inventory full`);
                return false;
            }
        }
        
        return false;
    }
    
    moveItem(fromSlot, toSlot) {
        if (fromSlot < 0 || fromSlot >= this.slots.length || toSlot < 0 || toSlot >= this.slots.length) {
            Logger.log(`Invalid slot index: from ${fromSlot} to ${toSlot}`);
            return false;
        }
        
        const fromItem = this.slots[fromSlot];
        if (!fromItem) {
            Logger.log(`No item in slot ${fromSlot}`);
            return false;
        }
        
        const toItem = this.slots[toSlot];
        
        // If destination slot is empty, simple move
        if (!toItem) {
            this.slots[toSlot] = fromItem;
            this.slots[fromSlot] = null;
            
            // Emit item moved event
            Events.emit('itemMoved', { item: fromItem, fromSlot: fromSlot, toSlot: toSlot });
            
            Logger.log(`Moved ${fromItem.name} from slot ${fromSlot} to slot ${toSlot}`);
            return true;
        }
        
        // If both items are the same and stackable, combine
        if (fromItem.id === toItem.id && fromItem.stackable) {
            toItem.quantity += fromItem.quantity;
            this.slots[fromSlot] = null;
            
            // Emit item updated event
            Events.emit('itemUpdated', { item: toItem, slot: toSlot });
            
            Logger.log(`Combined ${fromItem.quantity} ${fromItem.name} from slot ${fromSlot} to slot ${toSlot} (total: ${toItem.quantity})`);
            return true;
        }
        
        // Otherwise, swap items
        this.slots[toSlot] = fromItem;
        this.slots[fromSlot] = toItem;
        
        // Emit items swapped event
        Events.emit('itemsSwapped', { fromItem: fromItem, toItem: toItem, fromSlot: fromSlot, toSlot: toSlot });
        
        Logger.log(`Swapped ${fromItem.name} in slot ${fromSlot} with ${toItem.name} in slot ${toSlot}`);
        return true;
    }
    
    getItem(slotIndex) {
        if (slotIndex < 0 || slotIndex >= this.slots.length) {
            return null;
        }
        
        return this.slots[slotIndex];
    }
    
    getEquippedItem(slot) {
        return this.equipment[slot];
    }
    
    getEquippedItems() {
        return Object.values(this.equipment).filter(item => item !== null);
    }
    
    getItemCount(itemId) {
        let count = 0;
        
        for (const item of this.slots) {
            if (item && item.id === itemId) {
                count += item.quantity;
            }
        }
        
        return count;
    }
    
    hasItem(itemId, quantity = 1) {
        return this.getItemCount(itemId) >= quantity;
    }
    
    isFull() {
        return !this.slots.some(slot => slot === null);
    }
    
    getEmptySlotCount() {
        return this.slots.filter(slot => slot === null).length;
    }
    
    clear() {
        this.slots = new Array(this.size).fill(null);
        this.equipment = {
            weapon: null,
            armor: null,
            helmet: null,
            gloves: null,
            boots: null,
            accessory1: null,
            accessory2: null
        };
        
        // Emit inventory cleared event
        Events.emit('inventoryCleared', {});
        
        Logger.log('Inventory cleared');
    }
}

class ItemFactory {
    constructor() {
        this.itemTemplates = {};
        
        // Initialize with some default items
        this.initializeDefaultItems();
        
        Logger.log('Item factory initialized');
    }
    
    initializeDefaultItems() {
        // Weapons
        this.registerItem('sword_common', {
            name: 'Iron Sword',
            type: 'weapon',
            rarity: 'common',
            stats: { attackDamage: 5 },
            description: 'A basic iron sword.'
        });
        
        this.registerItem('sword_uncommon', {
            name: 'Steel Sword',
            type: 'weapon',
            rarity: 'uncommon',
            stats: { attackDamage: 10 },
            description: 'A well-crafted steel sword.'
        });
        
        this.registerItem('sword_rare', {
            name: 'Enchanted Blade',
            type: 'weapon',
            rarity: 'rare',
            stats: { attackDamage: 15, attackSpeed: 0.1 },
            description: 'A blade with magical properties.'
        });
        
        // Armor
        this.registerItem('armor_common', {
            name: 'Leather Armor',
            type: 'armor',
            rarity: 'common',
            stats: { armor: 5 },
            description: 'Basic leather armor.'
        });
        
        this.registerItem('armor_uncommon', {
            name: 'Chain Mail',
            type: 'armor',
            rarity: 'uncommon',
            stats: { armor: 10 },
            description: 'Protective chain mail armor.'
        });
        
        this.registerItem('armor_rare', {
            name: 'Plate Armor',
            type: 'armor',
            rarity: 'rare',
            stats: { armor: 15, health: 20 },
            description: 'Heavy plate armor offering excellent protection.'
        });
        
        // Consumables
        this.registerItem('potion_health_small', {
            name: 'Minor Health Potion',
            type: 'consumable',
            rarity: 'common',
            stats: { healing: 20 },
            description: 'Restores a small amount of health.'
        });
        
        this.registerItem('potion_health_medium', {
            name: 'Health Potion',
            type: 'consumable',
            rarity: 'uncommon',
            stats: { healing: 50 },
            description: 'Restores a moderate amount of health.'
        });
        
        this.registerItem('potion_health_large', {
            name: 'Major Health Potion',
            type: 'consumable',
            rarity: 'rare',
            stats: { healing: 100 },
            description: 'Restores a large amount of health.'
        });
        
        this.registerItem('potion_mana_small', {
            name: 'Minor Mana Potion',
            type: 'consumable',
            rarity: 'common',
            stats: { mana: 20 },
            description: 'Restores a small amount of mana.'
        });
        
        this.registerItem('potion_mana_medium', {
            name: 'Mana Potion',
            type: 'consumable',
            rarity: 'uncommon',
            stats: { mana: 50 },
            description: 'Restores a moderate amount of mana.'
        });
        
        this.registerItem('potion_mana_large', {
            name: 'Major Mana Potion',
            type: 'consumable',
            rarity: 'rare',
            stats: { mana: 100 },
            description: 'Restores a large amount of mana.'
        });
        
        // Accessories
        this.registerItem('ring_strength', {
            name: 'Ring of Strength',
            type: 'accessory',
            rarity: 'uncommon',
            stats: { strength: 5 },
            description: 'Increases strength.'
        });
        
        this.registerItem('amulet_vitality', {
            name: 'Amulet of Vitality',
            type: 'accessory',
            rarity: 'rare',
            stats: { health: 30, healthRegen: 1 },
            description: 'Increases maximum health and health regeneration.'
        });
        
        Logger.log(`Registered ${Object.keys(this.itemTemplates).length} default items`);
    }
    
    registerItem(id, template) {
        this.itemTemplates[id] = template;
    }
    
    createItem(id, quantity = 1) {
        const template = this.itemTemplates[id];
        if (!template) {
            Logger.warn(`Item template not found: ${id}`);
            return null;
        }
        
        const item = new Item(
            id,
            template.name,
            template.type,
            template.rarity,
            JSON.parse(JSON.stringify(template.stats)),
            template.description
        );
        
        if (item.stackable) {
            item.quantity = quantity;
        }
        
        return item;
    }
    
    createRandomItem(minRarity = 'common', maxRarity = 'legendary') {
        // Get all item templates
        const templates = Object.entries(this.itemTemplates);
        
        // Filter by rarity if specified
        const rarityLevels = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
        const minRarityIndex = rarityLevels.indexOf(minRarity.toLowerCase());
        const maxRarityIndex = rarityLevels.indexOf(maxRarity.toLowerCase());
        
        const filteredTemplates = templates.filter(([id, template]) => {
            const rarityIndex = rarityLevels.indexOf(template.rarity.toLowerCase());
            return rarityIndex >= minRarityIndex && rarityIndex <= maxRarityIndex;
        });
        
        if (filteredTemplates.length === 0) {
            Logger.warn(`No items found with rarity between ${minRarity} and ${maxRarity}`);
            return null;
        }
        
        // Select a random template
        const randomIndex = Math.floor(Math.random() * filteredTemplates.length);
        const [id, template] = filteredTemplates[randomIndex];
        
        // Create the item
        return this.createItem(id);
    }
}