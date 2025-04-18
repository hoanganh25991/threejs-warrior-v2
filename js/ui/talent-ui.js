/**
 * Talent UI
 * 
 * Provides a UI for viewing and selecting hero talents.
 */

const TalentUI = pc.createScript('talentUI');

// Initialize the talent UI
TalentUI.prototype.initialize = function() {
    // Create UI elements
    this.createUI();
    
    // Listen for key press to toggle UI
    this.app.keyboard.on(pc.EVENT_KEYDOWN, this.onKeyDown, this);
    
    // Hide UI initially
    this.toggleUI(false);
};

TalentUI.prototype.update = function(dt) {
    // Update UI if visible
    if (this.screen && this.screen.enabled) {
        this.updateTalentPointsDisplay();
    }
};

/**
 * Create the talent UI
 */
TalentUI.prototype.createUI = function() {
    // Create a screen entity for the UI
    this.screen = new pc.Entity('talentScreen');
    this.screen.addComponent('screen', {
        resolution: new pc.Vec2(1280, 720),
        screenSpace: true
    });
    this.app.root.addChild(this.screen);
    
    // Create a panel for the talent UI
    this.panel = new pc.Entity('talentPanel');
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
        text: 'Talent Specialization',
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
    
    // Add talent points display
    this.talentPointsDisplay = new pc.Entity('talentPointsDisplay');
    this.talentPointsDisplay.addComponent('element', {
        type: 'text',
        text: 'Available Talent Points: 0',
        fontAsset: null,
        fontSize: 20,
        color: new pc.Color(1, 0.8, 0.2),
        width: 300,
        height: 30,
        anchor: new pc.Vec4(1, 0, 1, 0),
        pivot: new pc.Vec2(1, 0),
        margin: new pc.Vec4(0, 30, 20, 0)
    });
    this.panel.addChild(this.talentPointsDisplay);
    
    // Create path headers
    this.createPathHeaders();
    
    // Create talent tiers
    this.createTalentTiers();
    
    // Create close button
    this.createCloseButton();
};

/**
 * Create the path headers
 */
TalentUI.prototype.createPathHeaders = function() {
    const pathContainer = new pc.Entity('pathContainer');
    pathContainer.addComponent('element', {
        type: 'element',
        anchor: new pc.Vec4(0, 0, 1, 0),
        pivot: new pc.Vec2(0.5, 0),
        margin: new pc.Vec4(0, 80, 0, 0)
    });
    this.panel.addChild(pathContainer);
    
    const paths = [
        { id: 'offensive', name: 'Offensive', color: new pc.Color(0.8, 0.2, 0.2) },
        { id: 'defensive', name: 'Defensive', color: new pc.Color(0.2, 0.6, 0.2) },
        { id: 'utility', name: 'Utility', color: new pc.Color(0.2, 0.4, 0.8) }
    ];
    
    const headerWidth = 250;
    const spacing = 50;
    const totalWidth = (headerWidth + spacing) * paths.length - spacing;
    let startX = -totalWidth / 2 + headerWidth / 2;
    
    for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        const header = new pc.Entity(path.id + 'Header');
        
        header.addComponent('element', {
            type: 'image',
            color: path.color,
            anchor: new pc.Vec4(0, 0, 0, 0),
            pivot: new pc.Vec2(0.5, 0.5),
            width: headerWidth,
            height: 40,
            margin: new pc.Vec4(startX + (headerWidth + spacing) * i, 0, 0, 0)
        });
        
        // Add path name text
        const headerText = new pc.Entity(path.id + 'HeaderText');
        headerText.addComponent('element', {
            type: 'text',
            text: path.name + ' Path',
            fontAsset: null,
            fontSize: 18,
            color: new pc.Color(1, 1, 1),
            width: headerWidth,
            height: 40,
            anchor: new pc.Vec4(0, 0, 1, 1),
            pivot: new pc.Vec2(0.5, 0.5)
        });
        header.addChild(headerText);
        
        pathContainer.addChild(header);
    }
};

/**
 * Create the talent tiers
 */
TalentUI.prototype.createTalentTiers = function() {
    const tierContainer = new pc.Entity('tierContainer');
    tierContainer.addComponent('element', {
        type: 'element',
        anchor: new pc.Vec4(0, 0, 1, 1),
        pivot: new pc.Vec2(0.5, 0),
        margin: new pc.Vec4(0, 130, 0, 80)
    });
    this.panel.addChild(tierContainer);
    
    const tiers = [
        { id: 'tier1', name: 'Tier 1', level: 5 },
        { id: 'tier2', name: 'Tier 2', level: 10 },
        { id: 'tier3', name: 'Tier 3', level: 15 },
        { id: 'tier4', name: 'Tier 4', level: 20 },
        { id: 'tier5', name: 'Tier 5', level: 25 }
    ];
    
    const paths = ['offensive', 'defensive', 'utility'];
    
    const talentWidth = 250;
    const talentHeight = 80;
    const horizontalSpacing = 50;
    const verticalSpacing = 20;
    const totalWidth = (talentWidth + horizontalSpacing) * paths.length - horizontalSpacing;
    let startX = -totalWidth / 2 + talentWidth / 2;
    
    this.talentButtons = {};
    
    for (let i = 0; i < tiers.length; i++) {
        const tier = tiers[i];
        
        // Create tier label
        const tierLabel = new pc.Entity(tier.id + 'Label');
        tierLabel.addComponent('element', {
            type: 'text',
            text: `${tier.name} (Level ${tier.level})`,
            fontAsset: null,
            fontSize: 16,
            color: new pc.Color(0.8, 0.8, 0.8),
            width: 200,
            height: 30,
            anchor: new pc.Vec4(0, 0, 0, 0),
            pivot: new pc.Vec2(0, 0.5),
            margin: new pc.Vec4(-totalWidth / 2 - 100, (talentHeight + verticalSpacing) * i + talentHeight / 2, 0, 0)
        });
        tierContainer.addChild(tierLabel);
        
        // Create talent buttons for each path in this tier
        for (let j = 0; j < paths.length; j++) {
            const path = paths[j];
            const buttonId = `${tier.id}_${path}`;
            const button = new pc.Entity(buttonId);
            
            // Set button color based on path
            let buttonColor;
            switch(path) {
                case 'offensive':
                    buttonColor = new pc.Color(0.6, 0.2, 0.2);
                    break;
                case 'defensive':
                    buttonColor = new pc.Color(0.2, 0.5, 0.2);
                    break;
                case 'utility':
                    buttonColor = new pc.Color(0.2, 0.3, 0.6);
                    break;
            }
            
            button.addComponent('element', {
                type: 'image',
                color: buttonColor,
                anchor: new pc.Vec4(0, 0, 0, 0),
                pivot: new pc.Vec2(0.5, 0.5),
                width: talentWidth,
                height: talentHeight,
                margin: new pc.Vec4(
                    startX + (talentWidth + horizontalSpacing) * j,
                    (talentHeight + verticalSpacing) * i,
                    0,
                    0
                ),
                opacity: 0.7
            });
            
            // Add talent name text (placeholder)
            const buttonText = new pc.Entity(buttonId + 'Text');
            buttonText.addComponent('element', {
                type: 'text',
                text: 'Talent Name',
                fontAsset: null,
                fontSize: 16,
                color: new pc.Color(1, 1, 1),
                width: talentWidth,
                height: 20,
                anchor: new pc.Vec4(0, 0, 1, 0),
                pivot: new pc.Vec2(0.5, 0),
                margin: new pc.Vec4(0, 10, 0, 0)
            });
            button.addChild(buttonText);
            
            // Add talent description text (placeholder)
            const descriptionText = new pc.Entity(buttonId + 'Description');
            descriptionText.addComponent('element', {
                type: 'text',
                text: 'Talent description will appear here.',
                fontAsset: null,
                fontSize: 12,
                color: new pc.Color(0.9, 0.9, 0.9),
                width: talentWidth - 20,
                height: 40,
                anchor: new pc.Vec4(0, 0, 1, 1),
                pivot: new pc.Vec2(0.5, 0),
                margin: new pc.Vec4(0, 35, 0, 0)
            });
            button.addChild(descriptionText);
            
            // Store reference to text elements
            button.nameText = buttonText;
            button.descriptionText = descriptionText;
            
            // Add click event
            button.element.on('click', function(tierId, pathId) {
                return function() {
                    this.selectTalent(tierId, pathId);
                };
            }(tier.id, path).bind(this));
            
            // Store reference to button
            if (!this.talentButtons[tier.id]) {
                this.talentButtons[tier.id] = {};
            }
            this.talentButtons[tier.id][path] = button;
            
            tierContainer.addChild(button);
        }
    }
};

/**
 * Create the close button
 */
TalentUI.prototype.createCloseButton = function() {
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
 * Update the talent UI with current hero's talents
 */
TalentUI.prototype.updateTalentUI = function() {
    // Find the hero entity
    const heroEntity = this.app.root.findByName('hero');
    if (!heroEntity || !heroEntity.script.talentSystem) {
        console.error("Hero entity or talent system not found");
        return;
    }
    
    const talentSystem = heroEntity.script.talentSystem;
    const availableTalents = talentSystem.getAvailableTalents();
    const selectedTalents = talentSystem.getSelectedTalents();
    
    // Update talent buttons with actual talent data
    for (const tierId in this.talentButtons) {
        for (const pathId in this.talentButtons[tierId]) {
            const button = this.talentButtons[tierId][pathId];
            const talent = availableTalents[pathId].tiers[tierId];
            
            if (talent) {
                // Update talent name and description
                button.nameText.element.text = talent.name;
                button.descriptionText.element.text = talent.description;
                
                // Update button appearance based on selection state
                if (selectedTalents[tierId] && selectedTalents[tierId].path === pathId) {
                    // This talent is selected
                    button.element.opacity = 1;
                    button.element.outlineColor = new pc.Color(1, 1, 0);
                    button.element.outlineThickness = 2;
                } else {
                    // Not selected
                    button.element.opacity = 0.7;
                    button.element.outlineThickness = 0;
                }
            } else {
                // No talent defined for this path/tier
                button.nameText.element.text = "No Talent Available";
                button.descriptionText.element.text = "This talent path does not have an option for this tier.";
                button.element.opacity = 0.3;
            }
        }
    }
    
    // Update talent points display
    this.updateTalentPointsDisplay();
};

/**
 * Update the talent points display
 */
TalentUI.prototype.updateTalentPointsDisplay = function() {
    // Find the hero entity
    const heroEntity = this.app.root.findByName('hero');
    if (!heroEntity || !heroEntity.script.talentSystem) {
        return;
    }
    
    const talentSystem = heroEntity.script.talentSystem;
    this.talentPointsDisplay.element.text = `Available Talent Points: ${talentSystem.talentPoints}`;
};

/**
 * Select a talent
 * @param {string} tierId - The tier ID (tier1, tier2, etc.)
 * @param {string} pathId - The path ID (offensive, defensive, utility)
 */
TalentUI.prototype.selectTalent = function(tierId, pathId) {
    // Find the hero entity
    const heroEntity = this.app.root.findByName('hero');
    if (!heroEntity || !heroEntity.script.talentSystem) {
        console.error("Hero entity or talent system not found");
        return;
    }
    
    const talentSystem = heroEntity.script.talentSystem;
    
    // Try to select the talent
    const success = talentSystem.selectTalent(tierId, pathId);
    
    if (success) {
        // Update the UI to reflect the selection
        this.updateTalentUI();
    }
};

/**
 * Toggle the UI visibility
 * @param {boolean} visible - Whether the UI should be visible
 */
TalentUI.prototype.toggleUI = function(visible) {
    if (this.screen) {
        this.screen.enabled = visible;
        
        if (visible) {
            // Update the UI when showing it
            this.updateTalentUI();
        }
    }
};

/**
 * Handle key press to toggle UI
 */
TalentUI.prototype.onKeyDown = function(event) {
    // Press T to toggle talent UI
    if (event.key === pc.KEY_T) {
        this.toggleUI(!this.screen.enabled);
    }
};