/**
 * Inventory UI
 * 
 * Provides a UI for viewing and managing inventory and equipment.
 */

const InventoryUI = pc.createScript('inventoryUI');

// Initialize the inventory UI
InventoryUI.prototype.initialize = function() {
    // Create UI elements
    this.createUI();
    
    // Listen for inventory toggle event
    this.app.on('inventory:toggle', this.toggleUI, this);
    
    // Hide UI initially
    this.toggleUI(false);
};

InventoryUI.prototype.update = function(dt) {
    // Update UI if visible
    if (this.screen && this.screen.enabled) {
        this.updateInventoryDisplay();
        this.updateEquipmentDisplay();
        this.updateGoldDisplay();
    }
};

/**
 * Create the inventory UI
 */
InventoryUI.prototype.createUI = function() {
    // Create a screen entity for the UI
    this.screen = new pc.Entity('inventoryScreen');
    this.screen.addComponent('screen', {
        resolution: new pc.Vec2(1280, 720),
        screenSpace: true
    });
    this.app.root.addChild(this.screen);
    
    // Create a panel for the inventory UI
    this.panel = new pc.Entity('inventoryPanel');
    this.panel.addComponent('element', {
        type: 'image',
        color: new pc.Color(0, 0, 0, 0.8),
        anchor: new pc.Vec4(0.5, 0.5, 0.5, 0.5),
        pivot: new pc.Vec2(0.5, 0.5),
        width: 900,
        height: 600
    });
    this.screen.addChild(this.panel);
    
    // Add title
    const title = new pc.Entity('title');
    title.addComponent('element', {
        type: 'text',
        text: 'Inventory',
        fontAsset: null, // We'll use the default font
        fontSize: 32,
        color: new pc.Color(1, 1, 1),
        width: 900,
        height: 50,
        anchor: new pc.Vec4(0.5, 0, 0.5, 0),
        pivot: new pc.Vec2(0.5, 0),
        margin: new pc.Vec4(0, 20, 0, 0)
    });
    this.panel.addChild(title);
    
    // Add gold display
    this.goldDisplay = new pc.Entity('goldDisplay');
    this.goldDisplay.addComponent('element', {
        type: 'text',
        text: 'Gold: 0',
        fontAsset: null,
        fontSize: 20,
        color: new pc.Color(1, 0.8, 0.2),
        width: 200,
        height: 30,
        anchor: new pc.Vec4(1, 0, 1, 0),
        pivot: new pc.Vec2(1, 0),
        margin: new pc.Vec4(0, 30, 20, 0)
    });
    this.panel.addChild(this.goldDisplay);
    
    // Create inventory grid
    this.createInventoryGrid();
    
    // Create equipment slots
    this.createEquipmentSlots();
    
    // Create item details panel
    this.createItemDetailsPanel();
    
    // Create close button
    this.createCloseButton();
};

/**
 * Create the inventory grid
 */
InventoryUI.prototype.createInventoryGrid = function() {
    const gridContainer = new pc.Entity('inventoryGridContainer');
    gridContainer.addComponent('element', {
        type: 'element',
        anchor: new pc.Vec4(0, 0, 0.7, 1),
        pivot: new pc.Vec2(0, 0),
        margin: new pc.Vec4(20, 80, 0, 20)
    });
    this.panel.addChild(gridContainer);
    
    // Create inventory grid title
    const gridTitle = new pc.Entity('inventoryGridTitle');
    gridTitle.addComponent('element', {
        type: 'text',
        text: 'Inventory',
        fontAsset: null,
        fontSize: 24,
        color: new pc.Color(1, 1, 1),
        width: 200,
        height: 30,
        anchor: new pc.Vec4(0, 0, 0, 0),
        pivot: new pc.Vec2(0, 0),
        margin: new pc.Vec4(0, -40, 0, 0)
    });
    gridContainer.addChild(gridTitle);
    
    // Create grid background
    const gridBackground = new pc.Entity('inventoryGridBackground');
    gridBackground.addComponent('element', {
        type: 'image',
        color: new pc.Color(0.1, 0.1, 0.1, 0.7),
        anchor: new pc.Vec4(0, 0, 1, 1),
        pivot: new pc.Vec2(0, 0)
    });
    gridContainer.addChild(gridBackground);
    
    // Create inventory slots (6x4 grid)
    const slotSize = 80;
    const slotSpacing = 10;
    const gridWidth = 6;
    const gridHeight = 4;
    
    this.inventorySlots = [];
    
    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            const slotIndex = y * gridWidth + x;
            const slot = new pc.Entity(`inventorySlot${slotIndex}`);
            
            slot.addComponent('element', {
                type: 'image',
                color: new pc.Color(0.2, 0.2, 0.2, 0.8),
                anchor: new pc.Vec4(0, 0, 0, 0),
                pivot: new pc.Vec2(0, 0),
                width: slotSize,
                height: slotSize,
                margin: new pc.Vec4(
                    x * (slotSize + slotSpacing) + 20,
                    y * (slotSize + slotSpacing) + 20,
                    0,
                    0
                )
            });
            
            // Add slot index text
            const slotIndexText = new pc.Entity(`slotIndex${slotIndex}`);
            slotIndexText.addComponent('element', {
                type: 'text',
                text: `${slotIndex + 1}`,
                fontAsset: null,
                fontSize: 12,
                color: new pc.Color(0.7, 0.7, 0.7),
                width: 20,
                height: 20,
                anchor: new pc.Vec4(0, 0, 0, 0),
                pivot: new pc.Vec2(0, 0),
                margin: new pc.Vec4(5, 5, 0, 0)
            });
            slot.addChild(slotIndexText);
            
            // Add item name text (hidden initially)
            const itemNameText = new pc.Entity(`itemName${slotIndex}`);
            itemNameText.addComponent('element', {
                type: 'text',
                text: '',
                fontAsset: null,
                fontSize: 14,
                color: new pc.Color(1, 1, 1),
                width: slotSize,
                height: 20,
                anchor: new pc.Vec4(0.5, 1, 0.5, 1),
                pivot: new pc.Vec2(0.5, 1),
                margin: new pc.Vec4(0, -5, 0, 0)
            });
            slot.addChild(itemNameText);
            
            // Add item count text (hidden initially)
            const itemCountText = new pc.Entity(`itemCount${slotIndex}`);
            itemCountText.addComponent('element', {
                type: 'text',
                text: '',
                fontAsset: null,
                fontSize: 14,
                color: new pc.Color(1, 1, 0.5),
                width: 40,
                height: 20,
                anchor: new pc.Vec4(1, 0, 1, 0),
                pivot: new pc.Vec2(1, 0),
                margin: new pc.Vec4(0, 5, 5, 0)
            });
            slot.addChild(itemCountText);
            
            // Store references to text elements
            slot.nameText = itemNameText;
            slot.countText = itemCountText;
            
            // Add click event
            slot.element.on('click', function(index) {
                return function() {
                    this.selectInventorySlot(index);
                };
            }(slotIndex).bind(this));
            
            gridContainer.addChild(slot);
            this.inventorySlots.push(slot);
        }
    }
};

/**
 * Create the equipment slots
 */
InventoryUI.prototype.createEquipmentSlots = function() {
    const equipmentContainer = new pc.Entity('equipmentContainer');
    equipmentContainer.addComponent('element', {
        type: 'element',
        anchor: new pc.Vec4(0.7, 0, 1, 1),
        pivot: new pc.Vec2(0, 0),
        margin: new pc.Vec4(20, 80, 20, 20)
    });
    this.panel.addChild(equipmentContainer);
    
    // Create equipment title
    const equipmentTitle = new pc.Entity('equipmentTitle');
    equipmentTitle.addComponent('element', {
        type: 'text',
        text: 'Equipment',
        fontAsset: null,
        fontSize: 24,
        color: new pc.Color(1, 1, 1),
        width: 200,
        height: 30,
        anchor: new pc.Vec4(0, 0, 0, 0),
        pivot: new pc.Vec2(0, 0),
        margin: new pc.Vec4(0, -40, 0, 0)
    });
    equipmentContainer.addChild(equipmentTitle);
    
    // Create equipment background
    const equipmentBackground = new pc.Entity('equipmentBackground');
    equipmentBackground.addComponent('element', {
        type: 'image',
        color: new pc.Color(0.1, 0.1, 0.1, 0.7),
        anchor: new pc.Vec4(0, 0, 1, 1),
        pivot: new pc.Vec2(0, 0)
    });
    equipmentContainer.addChild(equipmentBackground);
    
    // Equipment slot configuration
    const slotSize = 80;
    const slotSpacing = 20;
    const equipmentSlots = [
        { id: 'weapon', name: 'Weapon', x: 0, y: 0 },
        { id: 'offhand', name: 'Off-Hand', x: 1, y: 0 },
        { id: 'head', name: 'Head', x: 0.5, y: 1 },
        { id: 'chest', name: 'Chest', x: 0.5, y: 2 },
        { id: 'hands', name: 'Hands', x: 0, y: 3 },
        { id: 'legs', name: 'Legs', x: 0.5, y: 3 },
        { id: 'feet', name: 'Feet', x: 0.5, y: 4 },
        { id: 'accessory1', name: 'Accessory 1', x: 0, y: 5 },
        { id: 'accessory2', name: 'Accessory 2', x: 1, y: 5 }
    ];
    
    this.equipmentSlots = {};
    
    for (const slotConfig of equipmentSlots) {
        const slot = new pc.Entity(`equipmentSlot_${slotConfig.id}`);
        
        slot.addComponent('element', {
            type: 'image',
            color: new pc.Color(0.2, 0.2, 0.2, 0.8),
            anchor: new pc.Vec4(0, 0, 0, 0),
            pivot: new pc.Vec2(0, 0),
            width: slotSize,
            height: slotSize,
            margin: new pc.Vec4(
                slotConfig.x * (slotSize + slotSpacing) + 20,
                slotConfig.y * (slotSize + slotSpacing) + 20,
                0,
                0
            )
        });
        
        // Add slot name text
        const slotNameText = new pc.Entity(`slotName_${slotConfig.id}`);
        slotNameText.addComponent('element', {
            type: 'text',
            text: slotConfig.name,
            fontAsset: null,
            fontSize: 12,
            color: new pc.Color(0.7, 0.7, 0.7),
            width: slotSize,
            height: 20,
            anchor: new pc.Vec4(0.5, 0, 0.5, 0),
            pivot: new pc.Vec2(0.5, 0),
            margin: new pc.Vec4(0, -20, 0, 0)
        });
        slot.addChild(slotNameText);
        
        // Add item name text (hidden initially)
        const itemNameText = new pc.Entity(`itemName_${slotConfig.id}`);
        itemNameText.addComponent('element', {
            type: 'text',
            text: '',
            fontAsset: null,
            fontSize: 14,
            color: new pc.Color(1, 1, 1),
            width: slotSize,
            height: 20,
            anchor: new pc.Vec4(0.5, 1, 0.5, 1),
            pivot: new pc.Vec2(0.5, 1),
            margin: new pc.Vec4(0, -5, 0, 0)
        });
        slot.addChild(itemNameText);
        
        // Store reference to text element
        slot.nameText = itemNameText;
        
        // Add click event
        slot.element.on('click', function(slotId) {
            return function() {
                this.selectEquipmentSlot(slotId);
            };
        }(slotConfig.id).bind(this));
        
        equipmentContainer.addChild(slot);
        this.equipmentSlots[slotConfig.id] = slot;
    }
};

/**
 * Create the item details panel
 */
InventoryUI.prototype.createItemDetailsPanel = function() {
    this.detailsPanel = new pc.Entity('itemDetailsPanel');
    this.detailsPanel.addComponent('element', {
        type: 'image',
        color: new pc.Color(0.15, 0.15, 0.15, 0.9),
        anchor: new pc.Vec4(0, 0, 0.7, 0.3),
        pivot: new pc.Vec2(0, 0),
        margin: new pc.Vec4(20, 20, 20, 20)
    });
    this.panel.addChild(this.detailsPanel);
    
    // Item name
    this.itemNameText = new pc.Entity('itemNameText');
    this.itemNameText.addComponent('element', {
        type: 'text',
        text: 'Select an item to view details',
        fontAsset: null,
        fontSize: 18,
        color: new pc.Color(1, 1, 1),
        width: 500,
        height: 30,
        anchor: new pc.Vec4(0, 0, 1, 0),
        pivot: new pc.Vec2(0, 0),
        margin: new pc.Vec4(10, 10, 0, 0)
    });
    this.detailsPanel.addChild(this.itemNameText);
    
    // Item description
    this.itemDescriptionText = new pc.Entity('itemDescriptionText');
    this.itemDescriptionText.addComponent('element', {
        type: 'text',
        text: '',
        fontAsset: null,
        fontSize: 14,
        color: new pc.Color(0.8, 0.8, 0.8),
        width: 500,
        height: 60,
        anchor: new pc.Vec4(0, 0, 1, 0),
        pivot: new pc.Vec2(0, 0),
        margin: new pc.Vec4(10, 50, 0, 0)
    });
    this.detailsPanel.addChild(this.itemDescriptionText);
    
    // Item stats
    this.itemStatsText = new pc.Entity('itemStatsText');
    this.itemStatsText.addComponent('element', {
        type: 'text',
        text: '',
        fontAsset: null,
        fontSize: 14,
        color: new pc.Color(0.6, 0.8, 1),
        width: 500,
        height: 60,
        anchor: new pc.Vec4(0, 0, 1, 0),
        pivot: new pc.Vec2(0, 0),
        margin: new pc.Vec4(10, 120, 0, 0)
    });
    this.detailsPanel.addChild(this.itemStatsText);
    
    // Action buttons container
    const actionContainer = new pc.Entity('actionContainer');
    actionContainer.addComponent('element', {
        type: 'element',
        anchor: new pc.Vec4(1, 1, 1, 1),
        pivot: new pc.Vec2(1, 1),
        margin: new pc.Vec4(0, 0, 10, 10)
    });
    this.detailsPanel.addChild(actionContainer);
    
    // Use/Equip button
    this.primaryActionButton = new pc.Entity('primaryActionButton');
    this.primaryActionButton.addComponent('element', {
        type: 'image',
        color: new pc.Color(0.2, 0.4, 0.2),
        anchor: new pc.Vec4(1, 1, 1, 1),
        pivot: new pc.Vec2(1, 1),
        width: 100,
        height: 30,
        margin: new pc.Vec4(0, 0, 0, 0)
    });
    
    // Button text
    this.primaryActionText = new pc.Entity('primaryActionText');
    this.primaryActionText.addComponent('element', {
        type: 'text',
        text: 'Equip',
        fontAsset: null,
        fontSize: 14,
        color: new pc.Color(1, 1, 1),
        width: 100,
        height: 30,
        anchor: new pc.Vec4(0, 0, 1, 1),
        pivot: new pc.Vec2(0.5, 0.5)
    });
    this.primaryActionButton.addChild(this.primaryActionText);
    
    // Add click event
    this.primaryActionButton.element.on('click', function() {
        this.performPrimaryAction();
    }.bind(this));
    
    actionContainer.addChild(this.primaryActionButton);
    
    // Drop button
    this.secondaryActionButton = new pc.Entity('secondaryActionButton');
    this.secondaryActionButton.addComponent('element', {
        type: 'image',
        color: new pc.Color(0.4, 0.2, 0.2),
        anchor: new pc.Vec4(1, 1, 1, 1),
        pivot: new pc.Vec2(1, 1),
        width: 100,
        height: 30,
        margin: new pc.Vec4(0, 0, 110, 0)
    });
    
    // Button text
    this.secondaryActionText = new pc.Entity('secondaryActionText');
    this.secondaryActionText.addComponent('element', {
        type: 'text',
        text: 'Drop',
        fontAsset: null,
        fontSize: 14,
        color: new pc.Color(1, 1, 1),
        width: 100,
        height: 30,
        anchor: new pc.Vec4(0, 0, 1, 1),
        pivot: new pc.Vec2(0.5, 0.5)
    });
    this.secondaryActionButton.addChild(this.secondaryActionText);
    
    // Add click event
    this.secondaryActionButton.element.on('click', function() {
        this.performSecondaryAction();
    }.bind(this));
    
    actionContainer.addChild(this.secondaryActionButton);
    
    // Hide action buttons initially
    this.primaryActionButton.enabled = false;
    this.secondaryActionButton.enabled = false;
};

/**
 * Create the close button
 */
InventoryUI.prototype.createCloseButton = function() {
    const closeButton = new pc.Entity('closeButton');
    closeButton.addComponent('element', {
        type: 'image',
        color: new pc.Color(0.5, 0.5, 0.5),
        anchor: new pc.Vec4(1, 0, 1, 0),
        pivot: new pc.Vec2(1, 0),
        width: 100,
        height: 40,
        margin: new pc.Vec4(0, 20, 20, 0)
    });
    
    // Button text
    const buttonText = new pc.Entity('closeButtonText');
    buttonText.addComponent('element', {
        type: 'text',
        text: 'Close',
        fontAsset: null,
        fontSize: 16,
        color: new pc.Color(1, 1, 1),
        width: 100,
        height: 40,
        anchor: new pc.Vec4(0, 0, 1, 1),
        pivot: new pc.Vec2(0.5, 0.5)
    });
    closeButton.addChild(buttonText);
    
    // Add click event
    closeButton.element.on('click', function() {
        this.toggleUI(false);
    }.bind(this));
    
    this.panel.addChild(closeButton);
};

/**
 * Update the inventory display
 */
InventoryUI.prototype.updateInventoryDisplay = function() {
    // Find the hero entity
    const heroEntity = this.app.root.findByName('hero');
    if (!heroEntity || !heroEntity.script.inventorySystem) {
        return;
    }
    
    const inventorySystem = heroEntity.script.inventorySystem;
    const inventoryItems = inventorySystem.getInventoryContents();
    
    // Update each inventory slot
    for (let i = 0; i < this.inventorySlots.length; i++) {
        const slot = this.inventorySlots[i];
        const item = inventoryItems[i];
        
        if (item) {
            // Update slot with item info
            slot.nameText.element.text = item.name;
            
            // Show count for stackable items
            if (item.stackable && item.count > 1) {
                slot.countText.element.text = item.count;
            } else {
                slot.countText.element.text = '';
            }
            
            // Set slot color based on item rarity
            if (item.rarity) {
                switch(item.rarity) {
                    case 'common':
                        slot.element.color = new pc.Color(0.2, 0.2, 0.2, 0.8);
                        break;
                    case 'uncommon':
                        slot.element.color = new pc.Color(0.2, 0.4, 0.2, 0.8);
                        break;
                    case 'rare':
                        slot.element.color = new pc.Color(0.2, 0.2, 0.4, 0.8);
                        break;
                    case 'epic':
                        slot.element.color = new pc.Color(0.4, 0.2, 0.4, 0.8);
                        break;
                    case 'legendary':
                        slot.element.color = new pc.Color(0.4, 0.3, 0.1, 0.8);
                        break;
                }
            } else {
                slot.element.color = new pc.Color(0.2, 0.2, 0.2, 0.8);
            }
        } else {
            // Empty slot
            slot.nameText.element.text = '';
            slot.countText.element.text = '';
            slot.element.color = new pc.Color(0.2, 0.2, 0.2, 0.8);
        }
    }
};

/**
 * Update the equipment display
 */
InventoryUI.prototype.updateEquipmentDisplay = function() {
    // Find the hero entity
    const heroEntity = this.app.root.findByName('hero');
    if (!heroEntity || !heroEntity.script.inventorySystem) {
        return;
    }
    
    const inventorySystem = heroEntity.script.inventorySystem;
    const equippedItems = inventorySystem.getEquippedItems();
    
    // Update each equipment slot
    for (const slotId in this.equipmentSlots) {
        const slot = this.equipmentSlots[slotId];
        const item = equippedItems[slotId];
        
        if (item) {
            // Update slot with item info
            slot.nameText.element.text = item.name;
            
            // Set slot color based on item rarity
            if (item.rarity) {
                switch(item.rarity) {
                    case 'common':
                        slot.element.color = new pc.Color(0.2, 0.2, 0.2, 0.8);
                        break;
                    case 'uncommon':
                        slot.element.color = new pc.Color(0.2, 0.4, 0.2, 0.8);
                        break;
                    case 'rare':
                        slot.element.color = new pc.Color(0.2, 0.2, 0.4, 0.8);
                        break;
                    case 'epic':
                        slot.element.color = new pc.Color(0.4, 0.2, 0.4, 0.8);
                        break;
                    case 'legendary':
                        slot.element.color = new pc.Color(0.4, 0.3, 0.1, 0.8);
                        break;
                }
            } else {
                slot.element.color = new pc.Color(0.2, 0.2, 0.2, 0.8);
            }
        } else {
            // Empty slot
            slot.nameText.element.text = '';
            slot.element.color = new pc.Color(0.2, 0.2, 0.2, 0.8);
        }
    }
};

/**
 * Update the gold display
 */
InventoryUI.prototype.updateGoldDisplay = function() {
    // Find the hero entity
    const heroEntity = this.app.root.findByName('hero');
    if (!heroEntity || !heroEntity.script.inventorySystem) {
        return;
    }
    
    const inventorySystem = heroEntity.script.inventorySystem;
    this.goldDisplay.element.text = `Gold: ${inventorySystem.gold}`;
};

/**
 * Select an inventory slot
 * @param {number} slotIndex - The inventory slot index
 */
InventoryUI.prototype.selectInventorySlot = function(slotIndex) {
    // Find the hero entity
    const heroEntity = this.app.root.findByName('hero');
    if (!heroEntity || !heroEntity.script.inventorySystem) {
        return;
    }
    
    const inventorySystem = heroEntity.script.inventorySystem;
    const inventoryItems = inventorySystem.getInventoryContents();
    const item = inventoryItems[slotIndex];
    
    if (!item) {
        // Empty slot
        this.itemNameText.element.text = 'Empty slot';
        this.itemDescriptionText.element.text = '';
        this.itemStatsText.element.text = '';
        this.primaryActionButton.enabled = false;
        this.secondaryActionButton.enabled = false;
        return;
    }
    
    // Store selected item info
    this.selectedItem = {
        type: 'inventory',
        index: slotIndex,
        item: item
    };
    
    // Update item details
    this.itemNameText.element.text = item.name;
    
    if (item.rarity) {
        // Set name color based on rarity
        switch(item.rarity) {
            case 'common':
                this.itemNameText.element.color = new pc.Color(1, 1, 1);
                break;
            case 'uncommon':
                this.itemNameText.element.color = new pc.Color(0.3, 1, 0.3);
                break;
            case 'rare':
                this.itemNameText.element.color = new pc.Color(0.3, 0.3, 1);
                break;
            case 'epic':
                this.itemNameText.element.color = new pc.Color(0.8, 0.3, 0.8);
                break;
            case 'legendary':
                this.itemNameText.element.color = new pc.Color(1, 0.8, 0.2);
                break;
        }
    } else {
        this.itemNameText.element.color = new pc.Color(1, 1, 1);
    }
    
    this.itemDescriptionText.element.text = item.description || '';
    
    // Build stats text
    let statsText = '';
    
    if (item.type === 'weapon') {
        statsText += `Damage: ${item.damage || 0}\n`;
    }
    
    if (item.type === 'armor') {
        statsText += `Armor: ${item.armor || 0}\n`;
    }
    
    if (item.attributes) {
        for (const attr in item.attributes) {
            const value = item.attributes[attr];
            const sign = value >= 0 ? '+' : '';
            statsText += `${sign}${value} ${attr.charAt(0).toUpperCase() + attr.slice(1)}\n`;
        }
    }
    
    if (item.effect) {
        statsText += `Effect: ${item.effect.description || ''}\n`;
    }
    
    if (item.value) {
        statsText += `Value: ${item.value} gold\n`;
    }
    
    this.itemStatsText.element.text = statsText;
    
    // Update action buttons
    this.primaryActionButton.enabled = true;
    this.secondaryActionButton.enabled = true;
    
    if (item.type === 'consumable') {
        this.primaryActionText.element.text = 'Use';
        this.primaryActionButton.element.color = new pc.Color(0.2, 0.4, 0.2);
    } else if (item.type === 'weapon' || item.type === 'armor' || item.type === 'accessory') {
        this.primaryActionText.element.text = 'Equip';
        this.primaryActionButton.element.color = new pc.Color(0.2, 0.4, 0.2);
    } else {
        this.primaryActionButton.enabled = false;
    }
    
    this.secondaryActionText.element.text = 'Drop';
    this.secondaryActionButton.element.color = new pc.Color(0.4, 0.2, 0.2);
};

/**
 * Select an equipment slot
 * @param {string} slotId - The equipment slot ID
 */
InventoryUI.prototype.selectEquipmentSlot = function(slotId) {
    // Find the hero entity
    const heroEntity = this.app.root.findByName('hero');
    if (!heroEntity || !heroEntity.script.inventorySystem) {
        return;
    }
    
    const inventorySystem = heroEntity.script.inventorySystem;
    const equippedItems = inventorySystem.getEquippedItems();
    const item = equippedItems[slotId];
    
    if (!item) {
        // Empty slot
        this.itemNameText.element.text = 'Empty slot';
        this.itemDescriptionText.element.text = '';
        this.itemStatsText.element.text = '';
        this.primaryActionButton.enabled = false;
        this.secondaryActionButton.enabled = false;
        return;
    }
    
    // Store selected item info
    this.selectedItem = {
        type: 'equipment',
        slot: slotId,
        item: item
    };
    
    // Update item details
    this.itemNameText.element.text = item.name;
    
    if (item.rarity) {
        // Set name color based on rarity
        switch(item.rarity) {
            case 'common':
                this.itemNameText.element.color = new pc.Color(1, 1, 1);
                break;
            case 'uncommon':
                this.itemNameText.element.color = new pc.Color(0.3, 1, 0.3);
                break;
            case 'rare':
                this.itemNameText.element.color = new pc.Color(0.3, 0.3, 1);
                break;
            case 'epic':
                this.itemNameText.element.color = new pc.Color(0.8, 0.3, 0.8);
                break;
            case 'legendary':
                this.itemNameText.element.color = new pc.Color(1, 0.8, 0.2);
                break;
        }
    } else {
        this.itemNameText.element.color = new pc.Color(1, 1, 1);
    }
    
    this.itemDescriptionText.element.text = item.description || '';
    
    // Build stats text
    let statsText = '';
    
    if (item.type === 'weapon') {
        statsText += `Damage: ${item.damage || 0}\n`;
    }
    
    if (item.type === 'armor') {
        statsText += `Armor: ${item.armor || 0}\n`;
    }
    
    if (item.attributes) {
        for (const attr in item.attributes) {
            const value = item.attributes[attr];
            const sign = value >= 0 ? '+' : '';
            statsText += `${sign}${value} ${attr.charAt(0).toUpperCase() + attr.slice(1)}\n`;
        }
    }
    
    if (item.value) {
        statsText += `Value: ${item.value} gold\n`;
    }
    
    this.itemStatsText.element.text = statsText;
    
    // Update action buttons
    this.primaryActionButton.enabled = true;
    this.secondaryActionButton.enabled = false;
    
    this.primaryActionText.element.text = 'Unequip';
    this.primaryActionButton.element.color = new pc.Color(0.2, 0.4, 0.2);
};

/**
 * Perform the primary action on the selected item
 */
InventoryUI.prototype.performPrimaryAction = function() {
    if (!this.selectedItem) {
        return;
    }
    
    // Find the hero entity
    const heroEntity = this.app.root.findByName('hero');
    if (!heroEntity || !heroEntity.script.inventorySystem) {
        return;
    }
    
    const inventorySystem = heroEntity.script.inventorySystem;
    
    if (this.selectedItem.type === 'inventory') {
        const item = this.selectedItem.item;
        const slotIndex = this.selectedItem.index;
        
        if (item.type === 'consumable') {
            // Use the item
            inventorySystem.useItem(slotIndex);
        } else if (item.type === 'weapon' || item.type === 'armor' || item.type === 'accessory') {
            // Equip the item
            inventorySystem.equipItem(slotIndex);
        }
    } else if (this.selectedItem.type === 'equipment') {
        // Unequip the item
        inventorySystem.unequipItem(this.selectedItem.slot);
    }
    
    // Clear selection
    this.selectedItem = null;
    this.itemNameText.element.text = 'Select an item to view details';
    this.itemDescriptionText.element.text = '';
    this.itemStatsText.element.text = '';
    this.primaryActionButton.enabled = false;
    this.secondaryActionButton.enabled = false;
    
    // Update displays
    this.updateInventoryDisplay();
    this.updateEquipmentDisplay();
};

/**
 * Perform the secondary action on the selected item
 */
InventoryUI.prototype.performSecondaryAction = function() {
    if (!this.selectedItem || this.selectedItem.type !== 'inventory') {
        return;
    }
    
    // Find the hero entity
    const heroEntity = this.app.root.findByName('hero');
    if (!heroEntity || !heroEntity.script.inventorySystem) {
        return;
    }
    
    const inventorySystem = heroEntity.script.inventorySystem;
    const slotIndex = this.selectedItem.index;
    
    // Drop the item
    inventorySystem.removeItem(slotIndex);
    
    // Clear selection
    this.selectedItem = null;
    this.itemNameText.element.text = 'Select an item to view details';
    this.itemDescriptionText.element.text = '';
    this.itemStatsText.element.text = '';
    this.primaryActionButton.enabled = false;
    this.secondaryActionButton.enabled = false;
    
    // Update displays
    this.updateInventoryDisplay();
};

/**
 * Toggle the UI visibility
 * @param {boolean} visible - Whether the UI should be visible
 */
InventoryUI.prototype.toggleUI = function(visible) {
    if (this.screen) {
        if (visible === undefined) {
            visible = !this.screen.enabled;
        }
        
        this.screen.enabled = visible;
        
        if (visible) {
            // Update the UI when showing it
            this.updateInventoryDisplay();
            this.updateEquipmentDisplay();
            this.updateGoldDisplay();
            
            // Clear selection
            this.selectedItem = null;
            this.itemNameText.element.text = 'Select an item to view details';
            this.itemDescriptionText.element.text = '';
            this.itemStatsText.element.text = '';
            this.primaryActionButton.enabled = false;
            this.secondaryActionButton.enabled = false;
        }
    }
};