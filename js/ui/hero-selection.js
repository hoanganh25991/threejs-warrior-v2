/**
 * Hero Selection UI
 * 
 * Provides a UI for selecting and switching between different heroes.
 */

const HeroSelection = pc.createScript('heroSelection');

// Initialize the hero selection UI
HeroSelection.prototype.initialize = function() {
    // Available heroes
    this.heroes = [
        {
            id: 'axe',
            name: 'Axe (Mogul Khan)',
            faction: 'scourge',
            type: 'warrior',
            description: 'A bloodthirsty warrior who thrives in the chaos of battle.',
            color: new pc.Color(0.8, 0.2, 0.2) // Red
        },
        {
            id: 'crystalMaiden',
            name: 'Crystal Maiden (Rylai)',
            faction: 'sentinel',
            type: 'support',
            description: 'An ice sorceress with a gentle heart and frosty powers.',
            color: new pc.Color(0.6, 0.8, 0.9) // Light blue
        },
        {
            id: 'lich',
            name: 'Lich (Kel\'Thuzad)',
            faction: 'scourge',
            type: 'specialist',
            description: 'An undead sorcerer who commands the chilling power of frost.',
            color: new pc.Color(0.2, 0.3, 0.7) // Dark blue
        },
        {
            id: 'stormSpirit',
            name: 'Storm Spirit (Raijin Thunderkeg)',
            faction: 'scourge',
            type: 'mage',
            description: 'A jovial elemental spirit who rides the storm with electrifying speed.',
            color: new pc.Color(0.4, 0.3, 0.8) // Purple
        }
    ];
    
    // Currently selected hero
    this.selectedHero = 'axe'; // Default to Axe
    
    // Create UI elements
    this.createUI();
    
    // Listen for key press to toggle UI if keyboard is available
    if (this.app.keyboard) {
        this.app.keyboard.on(pc.EVENT_KEYDOWN, this.onKeyDown, this);
    } else {
        console.warn("Keyboard input is not available for hero selection");
    }
    
    // Hide UI initially
    this.toggleUI(false);
};

HeroSelection.prototype.update = function(dt) {
    // Nothing to update continuously
};

/**
 * Create the hero selection UI
 */
HeroSelection.prototype.createUI = function() {
    // Create a screen entity for the UI
    this.screen = new pc.Entity('heroSelectionScreen');
    this.screen.addComponent('screen', {
        resolution: new pc.Vec2(1280, 720),
        screenSpace: true
    });
    this.app.root.addChild(this.screen);
    
    // Create a panel for the hero selection UI
    this.panel = new pc.Entity('heroSelectionPanel');
    this.panel.addComponent('element', {
        type: 'image',
        color: new pc.Color(0, 0, 0, 0.8),
        anchor: new pc.Vec4(0.5, 0.5, 0.5, 0.5),
        pivot: new pc.Vec2(0.5, 0.5),
        width: 800,
        height: 500
    });
    this.screen.addChild(this.panel);
    
    // Add title
    const title = new pc.Entity('title');
    title.addComponent('element', {
        type: 'text',
        text: 'Hero Selection',
        fontAsset: null, // We'll use the default font
        fontSize: 32,
        color: new pc.Color(1, 1, 1),
        width: 800,
        height: 50,
        anchor: new pc.Vec4(0.5, 0, 0.5, 0),
        pivot: new pc.Vec2(0.5, 0),
        margin: new pc.Vec4(0, 20, 0, 0)
    });
    this.panel.addChild(title);
    
    // Create hero buttons
    this.createHeroButtons();
    
    // Create hero info panel
    this.createHeroInfoPanel();
    
    // Create select button
    this.createSelectButton();
};

/**
 * Create buttons for each hero
 */
HeroSelection.prototype.createHeroButtons = function() {
    const buttonContainer = new pc.Entity('buttonContainer');
    buttonContainer.addComponent('element', {
        type: 'element',
        anchor: new pc.Vec4(0, 0, 1, 0.7),
        pivot: new pc.Vec2(0.5, 0),
        margin: new pc.Vec4(0, 80, 0, 0)
    });
    this.panel.addChild(buttonContainer);
    
    // Create a button for each hero
    const buttonWidth = 180;
    const buttonHeight = 80;
    const spacing = 20;
    const totalWidth = (buttonWidth + spacing) * this.heroes.length - spacing;
    let startX = -totalWidth / 2 + buttonWidth / 2;
    
    this.heroButtons = {};
    
    for (let i = 0; i < this.heroes.length; i++) {
        const hero = this.heroes[i];
        const button = new pc.Entity(hero.id + 'Button');
        
        button.addComponent('element', {
            type: 'image',
            color: hero.color,
            anchor: new pc.Vec4(0, 0, 0, 0),
            pivot: new pc.Vec2(0.5, 0.5),
            width: buttonWidth,
            height: buttonHeight,
            margin: new pc.Vec4(startX + (buttonWidth + spacing) * i, 0, 0, 0)
        });
        
        // Add hero name text
        const buttonText = new pc.Entity(hero.id + 'ButtonText');
        buttonText.addComponent('element', {
            type: 'text',
            text: hero.name.split(' ')[0], // Just the first name
            fontAsset: null,
            fontSize: 20,
            color: new pc.Color(1, 1, 1),
            width: buttonWidth,
            height: buttonHeight,
            anchor: new pc.Vec4(0, 0, 1, 1),
            pivot: new pc.Vec2(0.5, 0.5)
        });
        button.addChild(buttonText);
        
        // Add faction text
        const factionText = new pc.Entity(hero.id + 'FactionText');
        factionText.addComponent('element', {
            type: 'text',
            text: hero.faction.charAt(0).toUpperCase() + hero.faction.slice(1),
            fontAsset: null,
            fontSize: 14,
            color: new pc.Color(0.8, 0.8, 0.8),
            width: buttonWidth,
            height: 20,
            anchor: new pc.Vec4(0, 0, 1, 0),
            pivot: new pc.Vec2(0.5, 0),
            margin: new pc.Vec4(0, -buttonHeight/2 - 10, 0, 0)
        });
        button.addChild(factionText);
        
        // Store reference to button
        this.heroButtons[hero.id] = button;
        
        // Add button to container
        buttonContainer.addChild(button);
        
        // Add click event
        button.element.on('click', function(heroId) {
            return function() {
                this.selectHero(heroId);
            };
        }(hero.id).bind(this));
    }
    
    // Highlight the initially selected hero
    this.updateButtonHighlights();
};

/**
 * Create the hero info panel
 */
HeroSelection.prototype.createHeroInfoPanel = function() {
    const infoPanel = new pc.Entity('heroInfoPanel');
    infoPanel.addComponent('element', {
        type: 'image',
        color: new pc.Color(0.1, 0.1, 0.1, 0.7),
        anchor: new pc.Vec4(0, 0.7, 1, 0.9),
        pivot: new pc.Vec2(0.5, 0),
        margin: new pc.Vec4(50, 10, 50, 0)
    });
    this.panel.addChild(infoPanel);
    
    // Hero description text
    this.heroDescription = new pc.Entity('heroDescription');
    this.heroDescription.addComponent('element', {
        type: 'text',
        text: 'Select a hero to view details',
        fontAsset: null,
        fontSize: 16,
        color: new pc.Color(1, 1, 1),
        width: 700,
        height: 100,
        anchor: new pc.Vec4(0, 0, 1, 1),
        pivot: new pc.Vec2(0.5, 0.5)
    });
    infoPanel.addChild(this.heroDescription);
    
    // Update with initial hero
    this.updateHeroInfo();
};

/**
 * Create the select button
 */
HeroSelection.prototype.createSelectButton = function() {
    const selectButton = new pc.Entity('selectButton');
    selectButton.addComponent('element', {
        type: 'image',
        color: new pc.Color(0.2, 0.6, 0.2),
        anchor: new pc.Vec4(0.5, 0.9, 0.5, 0.9),
        pivot: new pc.Vec2(0.5, 0),
        width: 200,
        height: 50,
        margin: new pc.Vec4(0, 20, 0, 0)
    });
    
    // Button text
    const buttonText = new pc.Entity('selectButtonText');
    buttonText.addComponent('element', {
        type: 'text',
        text: 'Select Hero',
        fontAsset: null,
        fontSize: 20,
        color: new pc.Color(1, 1, 1),
        width: 200,
        height: 50,
        anchor: new pc.Vec4(0, 0, 1, 1),
        pivot: new pc.Vec2(0.5, 0.5)
    });
    selectButton.addChild(buttonText);
    
    // Add click event
    selectButton.element.on('click', function() {
        this.switchToHero(this.selectedHero);
        this.toggleUI(false);
    }.bind(this));
    
    this.panel.addChild(selectButton);
};

/**
 * Select a hero in the UI
 * @param {string} heroId - ID of the hero to select
 */
HeroSelection.prototype.selectHero = function(heroId) {
    this.selectedHero = heroId;
    this.updateButtonHighlights();
    this.updateHeroInfo();
};

/**
 * Update the button highlights based on selection
 */
HeroSelection.prototype.updateButtonHighlights = function() {
    // Reset all buttons
    for (const heroId in this.heroButtons) {
        const button = this.heroButtons[heroId];
        button.element.opacity = 0.7;
    }
    
    // Highlight selected button
    if (this.heroButtons[this.selectedHero]) {
        this.heroButtons[this.selectedHero].element.opacity = 1;
    }
};

/**
 * Update the hero info panel
 */
HeroSelection.prototype.updateHeroInfo = function() {
    const hero = this.heroes.find(h => h.id === this.selectedHero);
    if (hero) {
        this.heroDescription.element.text = `${hero.name}\nFaction: ${hero.faction.charAt(0).toUpperCase() + hero.faction.slice(1)}\nType: ${hero.type.charAt(0).toUpperCase() + hero.type.slice(1)}\n\n${hero.description}`;
    }
};

/**
 * Toggle the UI visibility
 * @param {boolean} visible - Whether the UI should be visible
 */
HeroSelection.prototype.toggleUI = function(visible) {
    if (this.screen) {
        this.screen.enabled = visible;
    }
};

/**
 * Handle key press to toggle UI
 */
HeroSelection.prototype.onKeyDown = function(event) {
    // Press Tab to toggle hero selection UI
    if (event.key === pc.KEY_TAB) {
        this.toggleUI(!this.screen.enabled);
    }
};

/**
 * Switch to the selected hero
 * @param {string} heroId - ID of the hero to switch to
 */
HeroSelection.prototype.switchToHero = function(heroId) {
    // Get the current hero entity
    const heroEntity = this.app.root.findByName('hero');
    if (!heroEntity) {
        console.error("Hero entity not found");
        return;
    }
    
    // Get the hero data
    const heroData = this.heroes.find(h => h.id === heroId);
    if (!heroData) {
        console.error(`Hero data not found for ID: ${heroId}`);
        return;
    }
    
    // Remove current hero script
    for (const scriptName in heroEntity.script._scripts) {
        if (['axe', 'crystalMaiden', 'lich', 'stormSpirit'].includes(scriptName)) {
            heroEntity.script[scriptName].enabled = false;
            heroEntity.script.destroy(scriptName);
        }
    }
    
    // Add the new hero script
    heroEntity.script.create(heroId);
    
    // Update the hero's appearance
    if (heroEntity.render) {
        heroEntity.render.material.diffuse.copy(heroData.color);
        heroEntity.render.material.update();
    }
    
    console.log(`Switched to ${heroData.name}`);
};