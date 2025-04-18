/**
 * Experience System
 * 
 * Handles experience gain, leveling, and level-up rewards.
 * Based on the requirements in docs/gameplay/progression.md
 */

const ExperienceSystem = pc.createScript('experienceSystem');

// Initialize the experience system
ExperienceSystem.prototype.initialize = function() {
    // Current level and experience
    this.level = 1;
    this.experience = 0;
    this.experienceToNextLevel = 1000; // Level 1-10: 1,000 XP per level
    
    // Ability and talent points
    this.abilityPoints = 0;
    this.talentPoints = 0;
    
    // Experience sources tracking (for statistics)
    this.experienceSources = {
        enemyDefeat: 0,
        questCompletion: 0,
        areaDiscovery: 0,
        loreCollection: 0,
        bossDefeat: 0,
        crafting: 0
    };
    
    // Register for level up events
    this.entity.on('level:up', this.onLevelUp, this);
    
    console.log("Experience system initialized");
};

ExperienceSystem.prototype.update = function(dt) {
    // Nothing to update continuously
};

/**
 * Add experience points and handle level-ups
 * @param {number} amount - Amount of experience to add
 * @param {string} source - Source of the experience (for tracking)
 */
ExperienceSystem.prototype.addExperience = function(amount, source = 'enemyDefeat') {
    // Add to total experience
    this.experience += amount;
    
    // Track the source
    if (this.experienceSources.hasOwnProperty(source)) {
        this.experienceSources[source] += amount;
    }
    
    console.log(`Gained ${amount} experience from ${source}. Total: ${this.experience}`);
    
    // Check for level up
    while (this.experience >= this.experienceToNextLevel && this.level < 30) {
        this.levelUp();
    }
};

/**
 * Handle level up logic
 */
ExperienceSystem.prototype.levelUp = function() {
    // Subtract required XP
    this.experience -= this.experienceToNextLevel;
    
    // Increase level
    this.level++;
    
    // Update XP required for next level
    if (this.level <= 10) {
        this.experienceToNextLevel = 1000;
    } else if (this.level <= 20) {
        this.experienceToNextLevel = 2000;
    } else {
        this.experienceToNextLevel = 3000;
    }
    
    console.log(`Level up! Now level ${this.level}`);
    
    // Determine rewards based on level
    this.grantLevelUpRewards();
    
    // Fire level up event
    this.entity.fire('level:up', this.level);
};

/**
 * Grant appropriate rewards based on current level
 */
ExperienceSystem.prototype.grantLevelUpRewards = function() {
    // Always grant 1 ability point per level
    this.abilityPoints++;
    console.log("Gained 1 Ability Point");
    
    // Grant talent points at specific levels
    if ([5, 10, 15, 20, 25].includes(this.level)) {
        this.talentPoints++;
        console.log("Gained 1 Talent Point");
    }
    
    // Update ability system if it exists
    if (this.entity.script.abilitySystem) {
        this.entity.script.abilitySystem.addAbilityPoints(1);
    }
};

/**
 * Get experience for defeating an enemy
 * @param {number} enemyLevel - Level of the defeated enemy
 * @param {string} enemyType - Type of enemy ('normal', 'elite', 'boss')
 * @returns {number} - Amount of experience gained
 */
ExperienceSystem.prototype.getEnemyExperience = function(enemyLevel, enemyType = 'normal') {
    let baseXP;
    
    // Base XP depends on enemy type
    switch(enemyType) {
        case 'normal':
            baseXP = 10;
            break;
        case 'elite':
            baseXP = 50;
            break;
        case 'boss':
            baseXP = 200;
            break;
        default:
            baseXP = 10;
    }
    
    // Scale by enemy level
    const scaledXP = baseXP * enemyLevel;
    
    // Cap at reasonable values
    const cappedXP = Math.min(scaledXP, enemyType === 'boss' ? 5000 : 500);
    
    return cappedXP;
};

/**
 * Get experience for completing a quest
 * @param {string} questDifficulty - Difficulty of the quest ('easy', 'medium', 'hard', 'epic')
 * @returns {number} - Amount of experience gained
 */
ExperienceSystem.prototype.getQuestExperience = function(questDifficulty = 'medium') {
    switch(questDifficulty) {
        case 'easy':
            return 100;
        case 'medium':
            return 500;
        case 'hard':
            return 1000;
        case 'epic':
            return 2000;
        default:
            return 500;
    }
};

/**
 * Get experience for discovering a new area
 * @param {string} areaType - Type of area ('minor', 'major', 'secret')
 * @returns {number} - Amount of experience gained
 */
ExperienceSystem.prototype.getAreaDiscoveryExperience = function(areaType = 'minor') {
    switch(areaType) {
        case 'minor':
            return 50;
        case 'major':
            return 100;
        case 'secret':
            return 200;
        default:
            return 50;
    }
};

/**
 * Get experience for collecting a lore item
 * @param {string} loreRarity - Rarity of the lore item ('common', 'uncommon', 'rare', 'legendary')
 * @returns {number} - Amount of experience gained
 */
ExperienceSystem.prototype.getLoreExperience = function(loreRarity = 'common') {
    switch(loreRarity) {
        case 'common':
            return 25;
        case 'uncommon':
            return 50;
        case 'rare':
            return 75;
        case 'legendary':
            return 100;
        default:
            return 25;
    }
};

/**
 * Log experience statistics
 */
ExperienceSystem.prototype.logExperienceStats = function() {
    console.log("=== Experience Statistics ===");
    console.log(`Level: ${this.level}`);
    console.log(`Experience: ${this.experience}/${this.experienceToNextLevel}`);
    console.log(`Ability Points: ${this.abilityPoints}`);
    console.log(`Talent Points: ${this.talentPoints}`);
    console.log("\nExperience Sources:");
    
    let totalXP = 0;
    for (const source in this.experienceSources) {
        const amount = this.experienceSources[source];
        totalXP += amount;
        console.log(`- ${source}: ${amount} XP`);
    }
    
    console.log(`\nTotal XP Earned: ${totalXP}`);
};