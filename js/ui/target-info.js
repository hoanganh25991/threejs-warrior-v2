/**
 * Target Info UI
 * 
 * Displays information about the currently targeted enemy.
 */

const TargetInfo = pc.createScript('targetInfo');

// Initialize the target info UI
TargetInfo.prototype.initialize = function() {
    // Create UI elements
    this.createUI();
    
    // Listen for target changes
    this.app.on('target:selected', this.onTargetSelected, this);
    this.app.on('target:deselected', this.onTargetDeselected, this);
    
    // Hide UI initially
    this.toggleUI(false);
};

TargetInfo.prototype.update = function(dt) {
    // Update target info if we have a target
    if (this.currentTarget && this.currentTarget.script && this.currentTarget.script.enemy) {
        this.updateTargetInfo();
    }
};

/**
 * Create the target info UI
 */
TargetInfo.prototype.createUI = function() {
    // Create a screen entity for the UI
    this.screen = new pc.Entity('targetInfoScreen');
    this.screen.addComponent('screen', {
        resolution: new pc.Vec2(1280, 720),
        screenSpace: true
    });
    this.app.root.addChild(this.screen);
    
    // Create a panel for the target info
    this.panel = new pc.Entity('targetInfoPanel');
    this.panel.addComponent('element', {
        type: 'image',
        color: new pc.Color(0, 0, 0, 0.7),
        anchor: new pc.Vec4(1, 0, 1, 0),
        pivot: new pc.Vec2(1, 0),
        width: 300,
        height: 150,
        margin: new pc.Vec4(0, 10, 10, 0)
    });
    this.screen.addChild(this.panel);
    
    // Add target name
    this.targetName = new pc.Entity('targetName');
    this.targetName.addComponent('element', {
        type: 'text',
        text: 'Target Name',
        fontAsset: null,
        fontSize: 20,
        color: new pc.Color(1, 1, 1),
        width: 280,
        height: 30,
        anchor: new pc.Vec4(0.5, 0, 0.5, 0),
        pivot: new pc.Vec2(0.5, 0),
        margin: new pc.Vec4(0, 10, 0, 0)
    });
    this.panel.addChild(this.targetName);
    
    // Add target level and type
    this.targetLevel = new pc.Entity('targetLevel');
    this.targetLevel.addComponent('element', {
        type: 'text',
        text: 'Level 1 Normal',
        fontAsset: null,
        fontSize: 16,
        color: new pc.Color(0.8, 0.8, 0.8),
        width: 280,
        height: 20,
        anchor: new pc.Vec4(0.5, 0, 0.5, 0),
        pivot: new pc.Vec2(0.5, 0),
        margin: new pc.Vec4(0, 40, 0, 0)
    });
    this.panel.addChild(this.targetLevel);
    
    // Add target health
    this.targetHealth = new pc.Entity('targetHealth');
    this.targetHealth.addComponent('element', {
        type: 'text',
        text: 'Health: 100/100',
        fontAsset: null,
        fontSize: 16,
        color: new pc.Color(1, 0.5, 0.5),
        width: 280,
        height: 20,
        anchor: new pc.Vec4(0.5, 0, 0.5, 0),
        pivot: new pc.Vec2(0.5, 0),
        margin: new pc.Vec4(0, 70, 0, 0)
    });
    this.panel.addChild(this.targetHealth);
    
    // Add target damage
    this.targetDamage = new pc.Entity('targetDamage');
    this.targetDamage.addComponent('element', {
        type: 'text',
        text: 'Damage: 10',
        fontAsset: null,
        fontSize: 16,
        color: new pc.Color(1, 0.8, 0.5),
        width: 280,
        height: 20,
        anchor: new pc.Vec4(0.5, 0, 0.5, 0),
        pivot: new pc.Vec2(0.5, 0),
        margin: new pc.Vec4(0, 100, 0, 0)
    });
    this.panel.addChild(this.targetDamage);
};

/**
 * Update the target info display
 */
TargetInfo.prototype.updateTargetInfo = function() {
    const enemy = this.currentTarget.script.enemy;
    
    // Update name
    this.targetName.element.text = enemy.enemyName;
    
    // Update level and type
    const typeCapitalized = enemy.enemyType.charAt(0).toUpperCase() + enemy.enemyType.slice(1);
    this.targetLevel.element.text = `Level ${enemy.level} ${typeCapitalized}`;
    
    // Update health
    this.targetHealth.element.text = `Health: ${Math.floor(enemy.currentHealth)}/${enemy.maxHealth}`;
    
    // Update damage
    this.targetDamage.element.text = `Damage: ${enemy.physicalDamage}`;
};

/**
 * Handle target selection
 * @param {pc.Entity} target - The selected target
 */
TargetInfo.prototype.onTargetSelected = function(target) {
    this.currentTarget = target;
    this.toggleUI(true);
    this.updateTargetInfo();
};

/**
 * Handle target deselection
 */
TargetInfo.prototype.onTargetDeselected = function() {
    this.currentTarget = null;
    this.toggleUI(false);
};

/**
 * Toggle the UI visibility
 * @param {boolean} visible - Whether the UI should be visible
 */
TargetInfo.prototype.toggleUI = function(visible) {
    if (this.screen) {
        this.screen.enabled = visible;
    }
};