/**
 * World class and related functionality
 */

class World {
    constructor(scene) {
        this.scene = scene;
        this.objects = [];
        this.ground = null;
        this.gridSize = 1;
        this.worldSize = 200; // Increased size of the world in grid units
        this.visibleRange = 100; // How far the player can see
        
        // Lighting
        this.ambientLight = null;
        this.directionalLight = null;
        
        // Environment
        this.skybox = null;
        
        // Infinite terrain tracking
        this.currentChunk = { x: 0, z: 0 };
        this.chunkSize = 50; // Size of each terrain chunk
        this.loadedChunks = {};
        
        Logger.log('World created with infinite terrain support');
    }
    
    init() {
        // Create ground
        this.createGround();
        
        // Set up lighting
        this.setupLighting();
        
        // Create environment
        this.createEnvironment();
        
        Logger.log('World initialized');
        
        return this;
    }
    
    createGround() {
        // Create a large plane for the ground
        const groundGeometry = new THREE.PlaneGeometry(this.worldSize * this.gridSize, this.worldSize * this.gridSize, this.worldSize, this.worldSize);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x3a7e4f, // Green color for grass
            roughness: 0.8,
            metalness: 0.2
        });
        
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.rotation.x = -Math.PI / 2; // Rotate to be horizontal
        this.ground.position.y = 0;
        this.ground.receiveShadow = true;
        
        // Add ground to scene
        this.scene.add(this.ground);
        
        // Add grid helper for development
        const gridHelper = new THREE.GridHelper(this.worldSize * this.gridSize, this.worldSize, 0x000000, 0x444444);
        gridHelper.position.y = 0.01; // Slightly above ground to avoid z-fighting
        this.scene.add(gridHelper);
        
        Logger.log('Ground created');
    }
    
    setupLighting() {
        // Ambient light
        this.ambientLight = new THREE.AmbientLight(0x404040, 0.5); // Soft white light
        this.scene.add(this.ambientLight);
        
        // Directional light (sun)
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        this.directionalLight.position.set(50, 50, 50);
        this.directionalLight.castShadow = true;
        
        // Configure shadow properties
        this.directionalLight.shadow.mapSize.width = 2048;
        this.directionalLight.shadow.mapSize.height = 2048;
        this.directionalLight.shadow.camera.near = 0.5;
        this.directionalLight.shadow.camera.far = 500;
        
        // Set up shadow camera frustum
        const shadowSize = 100;
        this.directionalLight.shadow.camera.left = -shadowSize / 2;
        this.directionalLight.shadow.camera.right = shadowSize / 2;
        this.directionalLight.shadow.camera.top = shadowSize / 2;
        this.directionalLight.shadow.camera.bottom = -shadowSize / 2;
        
        this.scene.add(this.directionalLight);
        
        // Add a helper for the directional light (for development)
        const directionalLightHelper = new THREE.DirectionalLightHelper(this.directionalLight, 10);
        this.scene.add(directionalLightHelper);
        
        Logger.log('Lighting set up');
    }
    
    createEnvironment() {
        // Create a simple skybox
        const skyGeometry = new THREE.BoxGeometry(1000, 1000, 1000);
        const skyMaterials = [
            new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.BackSide }), // Right
            new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.BackSide }), // Left
            new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.BackSide }), // Top
            new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.BackSide }), // Bottom
            new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.BackSide }), // Front
            new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.BackSide })  // Back
        ];
        
        this.skybox = new THREE.Mesh(skyGeometry, skyMaterials);
        this.scene.add(this.skybox);
        
        // Add some simple decorative elements
        this.addDecorations();
        
        Logger.log('Environment created');
    }
    
    addDecorations() {
        // Add some trees
        for (let i = 0; i < 20; i++) {
            const treePosition = this.getRandomPosition();
            this.createTree(treePosition.x, treePosition.z);
        }
        
        // Add some rocks
        for (let i = 0; i < 15; i++) {
            const rockPosition = this.getRandomPosition();
            this.createRock(rockPosition.x, rockPosition.z);
        }
        
        Logger.log('Decorations added');
    }
    
    getRandomPosition() {
        // Get a random position within the world bounds
        const halfSize = (this.worldSize * this.gridSize) / 2;
        return {
            x: Math.random() * this.worldSize * this.gridSize - halfSize,
            z: Math.random() * this.worldSize * this.gridSize - halfSize
        };
    }
    
    createTree(x, z) {
        // Create a simple tree with trunk and foliage
        const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.4, 2, 8);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 }); // Brown
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.set(x, 1, z);
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        
        const foliageGeometry = new THREE.ConeGeometry(1.5, 3, 8);
        const foliageMaterial = new THREE.MeshLambertMaterial({ color: 0x2E8B57 }); // Dark green
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.set(x, 3.5, z);
        foliage.castShadow = true;
        
        this.scene.add(trunk);
        this.scene.add(foliage);
        
        // Add to objects array for collision detection
        this.objects.push({
            type: 'tree',
            position: new THREE.Vector3(x, 0, z),
            radius: 1.5, // Collision radius
            meshes: [trunk, foliage]
        });
    }
    
    createRock(x, z) {
        // Create a simple rock
        const rockGeometry = new THREE.DodecahedronGeometry(Math.random() * 0.5 + 0.5, 0);
        const rockMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 }); // Gray
        const rock = new THREE.Mesh(rockGeometry, rockMaterial);
        
        // Randomize position slightly
        const posX = x + Math.random() * 0.4 - 0.2;
        const posZ = z + Math.random() * 0.4 - 0.2;
        
        rock.position.set(posX, 0.5, posZ);
        rock.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        rock.scale.set(
            Math.random() * 0.4 + 0.8,
            Math.random() * 0.4 + 0.8,
            Math.random() * 0.4 + 0.8
        );
        rock.castShadow = true;
        rock.receiveShadow = true;
        
        this.scene.add(rock);
        
        // Add to objects array for collision detection
        this.objects.push({
            type: 'rock',
            position: new THREE.Vector3(posX, 0, posZ),
            radius: rock.scale.x * 0.5, // Collision radius
            meshes: [rock]
        });
    }
    
    // Check if a position is valid (not colliding with objects)
    isValidPosition(position, radius = 1) {
        for (const object of this.objects) {
            const distance = position.distanceTo(object.position);
            if (distance < radius + object.radius) {
                return false; // Collision detected
            }
        }
        
        return true;
    }
    
    // Find a valid position near the target position
    findValidPosition(targetPosition, radius = 1, maxAttempts = 10) {
        if (this.isValidPosition(targetPosition, radius)) {
            return targetPosition.clone();
        }
        
        // Try to find a valid position nearby
        for (let i = 0; i < maxAttempts; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 3 + radius;
            const offsetX = Math.cos(angle) * distance;
            const offsetZ = Math.sin(angle) * distance;
            
            const newPosition = new THREE.Vector3(
                targetPosition.x + offsetX,
                targetPosition.y,
                targetPosition.z + offsetZ
            );
            
            if (this.isValidPosition(newPosition, radius)) {
                return newPosition;
            }
        }
        
        // If no valid position found, return the original but with a warning
        console.warn('Could not find valid position, returning original position');
        return targetPosition.clone();
    }
    
    // Get height at position (for terrain with varying height)
    getHeightAt(x, z) {
        // For now, return 0 as we have flat terrain
        // This would be replaced with actual height sampling for terrain with elevation
        return 0;
    }
    
    // Ray cast to find intersection with ground
    raycastGround(raycaster) {
        const intersects = raycaster.intersectObject(this.ground);
        if (intersects.length > 0) {
            return intersects[0].point;
        }
        return null;
    }
    
    // Update method called every frame
    update(deltaTime) {
        // Update any dynamic elements in the world
        
        // Update skybox to follow camera
        if (this.skybox && window.camera) {
            this.skybox.position.copy(window.camera.position);
        }
        
        // Check if we need to update terrain for infinite scrolling
        if (window.game && window.game.hero) {
            this.updateInfiniteTerrain(window.game.hero.position);
        }
    }
    
    // Handle infinite terrain by wrapping player position
    updateInfiniteTerrain(playerPosition) {
        // Calculate which chunk the player is in
        const chunkX = Math.floor(playerPosition.x / this.chunkSize);
        const chunkZ = Math.floor(playerPosition.z / this.chunkSize);
        
        // If player has moved to a new chunk, update the world
        if (chunkX !== this.currentChunk.x || chunkZ !== this.currentChunk.z) {
            this.currentChunk = { x: chunkX, z: chunkZ };
            
            // If player is getting close to the edge of the world, wrap them around
            const halfWorldSize = this.worldSize / 2;
            
            if (Math.abs(playerPosition.x) > halfWorldSize - 20) {
                // Wrap X position
                if (playerPosition.x > 0) {
                    window.game.hero.position.x = -halfWorldSize + 10;
                } else {
                    window.game.hero.position.x = halfWorldSize - 10;
                }
                window.game.hero.model.position.x = window.game.hero.position.x;
            }
            
            if (Math.abs(playerPosition.z) > halfWorldSize - 20) {
                // Wrap Z position
                if (playerPosition.z > 0) {
                    window.game.hero.position.z = -halfWorldSize + 10;
                } else {
                    window.game.hero.position.z = halfWorldSize - 10;
                }
                window.game.hero.model.position.z = window.game.hero.position.z;
            }
            
            // Log the chunk transition
            Logger.log(`Player moved to chunk (${chunkX}, ${chunkZ})`);
        }
    }
    
    // Clean up resources when world is destroyed
    dispose() {
        // Remove and dispose of ground
        if (this.ground) {
            this.scene.remove(this.ground);
            this.ground.geometry.dispose();
            this.ground.material.dispose();
        }
        
        // Remove and dispose of all objects
        for (const object of this.objects) {
            for (const mesh of object.meshes) {
                this.scene.remove(mesh);
                if (mesh.geometry) mesh.geometry.dispose();
                if (mesh.material) {
                    if (Array.isArray(mesh.material)) {
                        mesh.material.forEach(material => material.dispose());
                    } else {
                        mesh.material.dispose();
                    }
                }
            }
        }
        
        // Clear objects array
        this.objects = [];
        
        // Remove lights
        if (this.ambientLight) this.scene.remove(this.ambientLight);
        if (this.directionalLight) this.scene.remove(this.directionalLight);
        
        // Remove skybox
        if (this.skybox) {
            this.scene.remove(this.skybox);
            this.skybox.geometry.dispose();
            if (Array.isArray(this.skybox.material)) {
                this.skybox.material.forEach(material => material.dispose());
            } else {
                this.skybox.material.dispose();
            }
        }
        
        Logger.log('World disposed');
    }
}