/**
 * Quest system for the game
 */

class Quest {
    constructor(id, title, description, type, rewards) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.type = type; // 'main', 'side', 'hero', 'repeatable'
        this.rewards = rewards || {
            experience: 0,
            gold: 0,
            items: []
        };
        
        // Quest state
        this.isActive = false;
        this.isCompleted = false;
        this.objectives = [];
        this.currentObjectiveIndex = 0;
        
        Logger.log(`Quest created: ${this.title}`);
    }
    
    addObjective(objective) {
        this.objectives.push(objective);
        return this;
    }
    
    activate() {
        this.isActive = true;
        this.currentObjectiveIndex = 0;
        
        // Activate the first objective
        if (this.objectives.length > 0) {
            this.objectives[0].activate();
        }
        
        // Emit quest activated event
        Events.emit('questActivated', { quest: this });
        
        Logger.log(`Quest activated: ${this.title}`);
        return this;
    }
    
    deactivate() {
        this.isActive = false;
        
        // Deactivate all objectives
        this.objectives.forEach(objective => objective.deactivate());
        
        // Emit quest deactivated event
        Events.emit('questDeactivated', { quest: this });
        
        Logger.log(`Quest deactivated: ${this.title}`);
        return this;
    }
    
    complete() {
        if (!this.isActive) return false;
        
        this.isActive = false;
        this.isCompleted = true;
        
        // Emit quest completed event
        Events.emit('questCompleted', { quest: this });
        
        // Apply rewards
        this.applyRewards();
        
        Logger.log(`Quest completed: ${this.title}`);
        return true;
    }
    
    applyRewards() {
        if (!window.game || !window.game.hero) return;
        
        const hero = window.game.hero;
        
        // Apply experience
        if (this.rewards.experience) {
            hero.gainExperience(this.rewards.experience);
            Logger.log(`Gained ${this.rewards.experience} experience from quest: ${this.title}`);
        }
        
        // Apply gold
        if (this.rewards.gold) {
            hero.gold = (hero.gold || 0) + this.rewards.gold;
            Logger.log(`Gained ${this.rewards.gold} gold from quest: ${this.title}`);
        }
        
        // Apply items
        if (this.rewards.items && this.rewards.items.length > 0) {
            this.rewards.items.forEach(item => {
                if (window.game.inventory) {
                    window.game.inventory.addItem(item);
                    Logger.log(`Gained item: ${item.name} from quest: ${this.title}`);
                }
            });
        }
    }
    
    updateObjectiveProgress(objectiveId, progress) {
        // Find the objective
        const objective = this.objectives.find(obj => obj.id === objectiveId);
        if (!objective) return false;
        
        // Update progress
        objective.updateProgress(progress);
        
        // Check if objective is completed
        if (objective.isCompleted) {
            // Check if this was the current objective
            if (this.objectives[this.currentObjectiveIndex].id === objectiveId) {
                // Move to next objective
                this.currentObjectiveIndex++;
                
                // If there are more objectives, activate the next one
                if (this.currentObjectiveIndex < this.objectives.length) {
                    this.objectives[this.currentObjectiveIndex].activate();
                } else {
                    // All objectives completed, complete the quest
                    this.complete();
                }
            }
        }
        
        // Emit objective updated event
        Events.emit('objectiveUpdated', { 
            quest: this, 
            objective: objective 
        });
        
        return true;
    }
    
    getCurrentObjective() {
        if (this.currentObjectiveIndex < this.objectives.length) {
            return this.objectives[this.currentObjectiveIndex];
        }
        return null;
    }
    
    getProgress() {
        if (this.objectives.length === 0) return 1;
        
        // Calculate overall progress
        let totalProgress = 0;
        this.objectives.forEach(objective => {
            totalProgress += objective.getProgress();
        });
        
        return totalProgress / this.objectives.length;
    }
}

class QuestObjective {
    constructor(id, description, requiredProgress, type) {
        this.id = id;
        this.description = description;
        this.requiredProgress = requiredProgress;
        this.type = type; // 'kill', 'collect', 'talk', 'explore', etc.
        
        // Objective state
        this.isActive = false;
        this.isCompleted = false;
        this.currentProgress = 0;
        
        Logger.log(`Quest objective created: ${this.description}`);
    }
    
    activate() {
        this.isActive = true;
        
        // Emit objective activated event
        Events.emit('objectiveActivated', { objective: this });
        
        Logger.log(`Quest objective activated: ${this.description}`);
        return this;
    }
    
    deactivate() {
        this.isActive = false;
        
        // Emit objective deactivated event
        Events.emit('objectiveDeactivated', { objective: this });
        
        Logger.log(`Quest objective deactivated: ${this.description}`);
        return this;
    }
    
    updateProgress(progress) {
        if (!this.isActive || this.isCompleted) return false;
        
        // Update progress
        this.currentProgress = Math.min(this.requiredProgress, this.currentProgress + progress);
        
        // Check if objective is completed
        if (this.currentProgress >= this.requiredProgress) {
            this.complete();
        }
        
        // Emit objective progress event
        Events.emit('objectiveProgress', { 
            objective: this, 
            progress: this.currentProgress, 
            required: this.requiredProgress 
        });
        
        Logger.log(`Quest objective progress: ${this.currentProgress}/${this.requiredProgress} - ${this.description}`);
        return true;
    }
    
    complete() {
        if (this.isCompleted) return false;
        
        this.isActive = false;
        this.isCompleted = true;
        this.currentProgress = this.requiredProgress;
        
        // Emit objective completed event
        Events.emit('objectiveCompleted', { objective: this });
        
        Logger.log(`Quest objective completed: ${this.description}`);
        return true;
    }
    
    getProgress() {
        return this.currentProgress / this.requiredProgress;
    }
}

class QuestManager {
    constructor() {
        this.quests = [];
        this.activeQuests = [];
        this.completedQuests = [];
        
        // Quest markers
        this.questMarkers = [];
        
        Logger.log('Quest manager initialized');
    }
    
    init() {
        // Load quest data
        this.loadQuests();
        
        // Set up event listeners
        this.setupEventListeners();
        
        Logger.log('Quest manager initialized with quests');
        return this;
    }
    
    loadQuests() {
        // Create some sample quests
        this.createSampleQuests();
    }
    
    createSampleQuests() {
        // Main quest
        const mainQuest = new Quest(
            'main_quest_1',
            'The Ancient Threat',
            'Investigate the rumors of an ancient evil awakening in the forest.',
            'main',
            { experience: 500, gold: 100 }
        );
        
        mainQuest.addObjective(
            new QuestObjective(
                'main_quest_1_obj_1',
                'Explore the ancient ruins',
                1,
                'explore'
            )
        );
        
        mainQuest.addObjective(
            new QuestObjective(
                'main_quest_1_obj_2',
                'Defeat the guardian',
                1,
                'kill'
            )
        );
        
        mainQuest.addObjective(
            new QuestObjective(
                'main_quest_1_obj_3',
                'Retrieve the ancient artifact',
                1,
                'collect'
            )
        );
        
        this.quests.push(mainQuest);
        
        // Side quest
        const sideQuest = new Quest(
            'side_quest_1',
            'Lost in the Woods',
            'Help the lost traveler find his way back to the village.',
            'side',
            { experience: 200, gold: 50 }
        );
        
        sideQuest.addObjective(
            new QuestObjective(
                'side_quest_1_obj_1',
                'Find the traveler\'s belongings',
                3,
                'collect'
            )
        );
        
        sideQuest.addObjective(
            new QuestObjective(
                'side_quest_1_obj_2',
                'Escort the traveler back to the village',
                1,
                'escort'
            )
        );
        
        this.quests.push(sideQuest);
        
        // Hero-specific quest
        const heroQuest = new Quest(
            'hero_quest_axe_1',
            'The Berserker\'s Challenge',
            'Prove your worth as a warrior by defeating powerful enemies.',
            'hero',
            { experience: 300, gold: 75 }
        );
        
        heroQuest.addObjective(
            new QuestObjective(
                'hero_quest_axe_1_obj_1',
                'Defeat 5 enemies using Berserker\'s Call',
                5,
                'kill'
            )
        );
        
        heroQuest.addObjective(
            new QuestObjective(
                'hero_quest_axe_1_obj_2',
                'Execute 3 enemies with Culling Blade',
                3,
                'kill'
            )
        );
        
        this.quests.push(heroQuest);
        
        Logger.log(`Created ${this.quests.length} sample quests`);
    }
    
    setupEventListeners() {
        // Listen for enemy death events
        Events.on('enemyDeath', this.handleEnemyDeath.bind(this));
        
        // Listen for item collection events
        Events.on('itemCollected', this.handleItemCollected.bind(this));
        
        // Listen for area exploration events
        Events.on('areaExplored', this.handleAreaExplored.bind(this));
        
        // Listen for NPC interaction events
        Events.on('npcInteraction', this.handleNpcInteraction.bind(this));
        
        // Listen for ability use events
        Events.on('abilityUsed', this.handleAbilityUsed.bind(this));
    }
    
    handleEnemyDeath(data) {
        const { enemy, killedBy } = data;
        
        // Update kill objectives
        this.activeQuests.forEach(quest => {
            const currentObjective = quest.getCurrentObjective();
            if (currentObjective && currentObjective.type === 'kill') {
                quest.updateObjectiveProgress(currentObjective.id, 1);
            }
        });
    }
    
    handleItemCollected(data) {
        const { item } = data;
        
        // Update collection objectives
        this.activeQuests.forEach(quest => {
            const currentObjective = quest.getCurrentObjective();
            if (currentObjective && currentObjective.type === 'collect') {
                quest.updateObjectiveProgress(currentObjective.id, 1);
            }
        });
    }
    
    handleAreaExplored(data) {
        const { areaId } = data;
        
        // Update exploration objectives
        this.activeQuests.forEach(quest => {
            const currentObjective = quest.getCurrentObjective();
            if (currentObjective && currentObjective.type === 'explore' && 
                currentObjective.targetAreaId === areaId) {
                quest.updateObjectiveProgress(currentObjective.id, 1);
            }
        });
    }
    
    handleNpcInteraction(data) {
        const { npcId } = data;
        
        // Update talk objectives
        this.activeQuests.forEach(quest => {
            const currentObjective = quest.getCurrentObjective();
            if (currentObjective && currentObjective.type === 'talk' && 
                currentObjective.targetNpcId === npcId) {
                quest.updateObjectiveProgress(currentObjective.id, 1);
            }
        });
    }
    
    handleAbilityUsed(data) {
        const { abilityId, targetId } = data;
        
        // Update ability use objectives
        this.activeQuests.forEach(quest => {
            const currentObjective = quest.getCurrentObjective();
            if (currentObjective && currentObjective.type === 'ability' && 
                currentObjective.targetAbilityId === abilityId) {
                quest.updateObjectiveProgress(currentObjective.id, 1);
            }
        });
    }
    
    activateQuest(questId) {
        // Find the quest
        const quest = this.quests.find(q => q.id === questId);
        if (!quest) return false;
        
        // Check if quest is already active
        if (this.activeQuests.some(q => q.id === questId)) {
            Logger.log(`Quest already active: ${quest.title}`);
            return false;
        }
        
        // Activate the quest
        quest.activate();
        
        // Add to active quests
        this.activeQuests.push(quest);
        
        // Create quest marker
        this.createQuestMarker(quest);
        
        Logger.log(`Activated quest: ${quest.title}`);
        return true;
    }
    
    completeQuest(questId) {
        // Find the quest
        const questIndex = this.activeQuests.findIndex(q => q.id === questId);
        if (questIndex === -1) return false;
        
        const quest = this.activeQuests[questIndex];
        
        // Complete the quest
        if (quest.complete()) {
            // Remove from active quests
            this.activeQuests.splice(questIndex, 1);
            
            // Add to completed quests
            this.completedQuests.push(quest);
            
            // Remove quest marker
            this.removeQuestMarker(quest.id);
            
            Logger.log(`Completed quest: ${quest.title}`);
            return true;
        }
        
        return false;
    }
    
    abandonQuest(questId) {
        // Find the quest
        const questIndex = this.activeQuests.findIndex(q => q.id === questId);
        if (questIndex === -1) return false;
        
        const quest = this.activeQuests[questIndex];
        
        // Deactivate the quest
        quest.deactivate();
        
        // Remove from active quests
        this.activeQuests.splice(questIndex, 1);
        
        // Remove quest marker
        this.removeQuestMarker(quest.id);
        
        Logger.log(`Abandoned quest: ${quest.title}`);
        return true;
    }
    
    getQuest(questId) {
        return this.quests.find(q => q.id === questId);
    }
    
    getActiveQuests() {
        return this.activeQuests;
    }
    
    getCompletedQuests() {
        return this.completedQuests;
    }
    
    getAvailableQuests() {
        return this.quests.filter(quest => 
            !this.activeQuests.some(q => q.id === quest.id) && 
            !this.completedQuests.some(q => q.id === quest.id)
        );
    }
    
    createQuestMarker(quest) {
        if (!window.game || !window.game.scene) return;
        
        // Get the current objective
        const objective = quest.getCurrentObjective();
        if (!objective) return;
        
        // Create a marker based on objective type
        let position;
        
        switch (objective.type) {
            case 'explore':
                // Position at the exploration area
                position = this.getExplorationAreaPosition(objective);
                break;
                
            case 'kill':
                // Position at the enemy spawn area
                position = this.getEnemySpawnPosition(objective);
                break;
                
            case 'collect':
                // Position at the item location
                position = this.getItemPosition(objective);
                break;
                
            case 'talk':
                // Position at the NPC location
                position = this.getNpcPosition(objective);
                break;
                
            default:
                // Default position
                position = new THREE.Vector3(0, 0, 0);
        }
        
        // Create marker geometry
        const geometry = new THREE.ConeGeometry(0.5, 1.5, 4);
        const material = new THREE.MeshBasicMaterial({ 
            color: this.getQuestMarkerColor(quest.type),
            transparent: true,
            opacity: 0.8
        });
        
        const marker = new THREE.Mesh(geometry, material);
        marker.position.copy(position);
        marker.position.y = 3; // Float above ground
        marker.userData = { questId: quest.id };
        
        // Add to scene
        window.game.scene.add(marker);
        
        // Store reference to marker
        this.questMarkers.push({
            questId: quest.id,
            marker: marker
        });
        
        // Animate the marker
        this.animateQuestMarker(marker);
        
        Logger.log(`Created quest marker for: ${quest.title}`);
    }
    
    removeQuestMarker(questId) {
        // Find the marker
        const markerIndex = this.questMarkers.findIndex(m => m.questId === questId);
        if (markerIndex === -1) return;
        
        const marker = this.questMarkers[markerIndex];
        
        // Remove from scene
        if (window.game && window.game.scene) {
            window.game.scene.remove(marker.marker);
        }
        
        // Dispose of resources
        marker.marker.geometry.dispose();
        marker.marker.material.dispose();
        
        // Remove from array
        this.questMarkers.splice(markerIndex, 1);
        
        Logger.log(`Removed quest marker for quest ID: ${questId}`);
    }
    
    animateQuestMarker(marker) {
        const startY = marker.position.y;
        const amplitude = 0.3;
        const frequency = 1.5;
        
        const animate = () => {
            if (!marker.parent) return; // Stop if marker was removed
            
            const time = Date.now() / 1000;
            marker.position.y = startY + Math.sin(time * frequency) * amplitude;
            marker.rotation.y += 0.02;
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    getQuestMarkerColor(questType) {
        switch (questType) {
            case 'main':
                return 0xffcc00; // Gold
            case 'side':
                return 0x00ccff; // Light blue
            case 'hero':
                return 0xff00cc; // Pink
            case 'repeatable':
                return 0x00ff00; // Green
            default:
                return 0xffffff; // White
        }
    }
    
    // Helper methods to get positions for different objective types
    getExplorationAreaPosition(objective) {
        // In a real implementation, this would get the position from a data source
        // For now, return a random position
        return new THREE.Vector3(
            Math.random() * 20 - 10,
            0,
            Math.random() * 20 - 10
        );
    }
    
    getEnemySpawnPosition(objective) {
        // In a real implementation, this would get the position from a data source
        // For now, return a random position
        return new THREE.Vector3(
            Math.random() * 20 - 10,
            0,
            Math.random() * 20 - 10
        );
    }
    
    getItemPosition(objective) {
        // In a real implementation, this would get the position from a data source
        // For now, return a random position
        return new THREE.Vector3(
            Math.random() * 20 - 10,
            0,
            Math.random() * 20 - 10
        );
    }
    
    getNpcPosition(objective) {
        // In a real implementation, this would get the position from a data source
        // For now, return a random position
        return new THREE.Vector3(
            Math.random() * 20 - 10,
            0,
            Math.random() * 20 - 10
        );
    }
    
    update(deltaTime) {
        // Update quest markers
        this.updateQuestMarkers();
    }
    
    updateQuestMarkers() {
        // Update marker positions if needed
        // For example, if the target moves
    }
}