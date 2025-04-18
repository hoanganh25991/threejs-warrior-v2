/**
 * Enemy Spawner
 * 
 * Handles spawning enemies in the game world.
 */

const EnemySpawner = pc.createScript('enemySpawner');

// Spawner properties
EnemySpawner.attributes.add('spawnRadius', { type: 'number', default: 20 });
EnemySpawner.attributes.add('maxEnemies', { type: 'number', default: 5 });
EnemySpawner.attributes.add('spawnInterval', { type: 'number', default: 10 });
EnemySpawner.attributes.add('enemyTypes', { type: 'json', default: [
    {
        name: 'Goblin',
        type: 'normal',
        level: 1,
        health: 50,
        damage: 5,
        color: [0.2, 0.7, 0.2]
    },
    {
        name: 'Orc',
        type: 'normal',
        level: 2,
        health: 100,
        damage: 10,
        color: [0.1, 0.5, 0.1]
    },
    {
        name: 'Troll',
        type: 'elite',
        level: 3,
        health: 200,
        damage: 15,
        color: [0.5, 0.2, 0.5]
    }
] });

// Initialize the spawner
EnemySpawner.prototype.initialize = function() {
    // Keep track of spawned enemies
    this.spawnedEnemies = [];
    
    // Timer for spawning
    this.spawnTimer = 0;
    
    // Spawn initial enemies
    this.spawnInitialEnemies();
    
    console.log("Enemy spawner initialized");
};

EnemySpawner.prototype.update = function(dt) {
    // Update spawn timer
    this.spawnTimer += dt;
    
    // Spawn new enemies if needed
    if (this.spawnTimer >= this.spawnInterval) {
        this.spawnTimer = 0;
        this.spawnEnemy();
    }
    
    // Clean up dead enemies
    this.cleanupDeadEnemies();
};

/**
 * Spawn initial enemies
 */
EnemySpawner.prototype.spawnInitialEnemies = function() {
    // Spawn half of max enemies initially
    const initialCount = Math.floor(this.maxEnemies / 2);
    
    for (let i = 0; i < initialCount; i++) {
        this.spawnEnemy();
    }
};

/**
 * Spawn a single enemy
 */
EnemySpawner.prototype.spawnEnemy = function() {
    // Check if we've reached the maximum
    if (this.spawnedEnemies.length >= this.maxEnemies) {
        return;
    }
    
    // Choose a random enemy type
    const enemyTypeIndex = Math.floor(Math.random() * this.enemyTypes.length);
    const enemyType = this.enemyTypes[enemyTypeIndex];
    
    // Choose a random position within spawn radius
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * this.spawnRadius;
    
    const x = Math.cos(angle) * distance;
    const z = Math.sin(angle) * distance;
    
    // Create the enemy entity
    const enemy = new pc.Entity(enemyType.name);
    
    // Add render component
    enemy.addComponent('render', {
        type: 'box',
        material: new pc.StandardMaterial()
    });
    
    // Set appearance based on enemy type
    enemy.setLocalScale(1, 2, 1);
    enemy.render.material.diffuse = new pc.Color(
        enemyType.color[0],
        enemyType.color[1],
        enemyType.color[2]
    );
    enemy.render.material.update();
    
    // Add physics
    enemy.addComponent('collision', {
        type: 'capsule',
        radius: 0.5,
        height: 2
    });
    enemy.addComponent('rigidbody', {
        type: 'dynamic',
        mass: 50,
        linearDamping: 0.9,
        angularDamping: 0.9,
        linearFactor: new pc.Vec3(1, 1, 1),
        angularFactor: new pc.Vec3(0, 1, 0)
    });
    
    // Set position
    enemy.setPosition(x, 1, z);
    
    // Add enemy script
    enemy.addComponent('script');
    enemy.script.create('enemy');
    
    // Configure enemy properties
    const enemyScript = enemy.script.enemy;
    enemyScript.enemyName = enemyType.name;
    enemyScript.enemyType = enemyType.type;
    enemyScript.level = enemyType.level;
    enemyScript.maxHealth = enemyType.health;
    enemyScript.physicalDamage = enemyType.damage;
    enemyScript.experienceValue = enemyType.level * 50;
    
    // Add to scene
    this.app.root.addChild(enemy);
    
    // Add to spawned enemies list
    this.spawnedEnemies.push(enemy);
    
    console.log(`Spawned ${enemyType.name} at position (${x.toFixed(1)}, ${z.toFixed(1)})`);
};

/**
 * Clean up dead enemies
 */
EnemySpawner.prototype.cleanupDeadEnemies = function() {
    // Filter out enemies that are no longer enabled
    this.spawnedEnemies = this.spawnedEnemies.filter(enemy => {
        return enemy.enabled;
    });
};