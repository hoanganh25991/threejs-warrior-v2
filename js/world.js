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
        // Create a more detailed skybox
        this.createSkybox();
        
        // Add water to the environment
        this.createWater();
        
        // Add some simple decorative elements
        this.addDecorations();
        
        // Add environmental effects
        this.createEnvironmentalEffects();
        
        Logger.log('Enhanced environment created');
    }
    
    createSkybox() {
        // Create a more detailed skybox with gradient
        const skyGeometry = new THREE.BoxGeometry(1000, 1000, 1000);
        
        // Create gradient materials for a more realistic sky
        const topColor = new THREE.Color(0x0077ff); // Blue
        const bottomColor = new THREE.Color(0xffffff); // White/Light blue at horizon
        
        const skyMaterials = [];
        
        // Create materials for each side with appropriate gradients
        for (let i = 0; i < 6; i++) {
            // Create canvas for gradient
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 512;
            const context = canvas.getContext('2d');
            
            // Create gradient
            let gradient;
            if (i === 2) { // Top
                gradient = context.createLinearGradient(0, 0, 0, 512);
                gradient.addColorStop(0, topColor.getStyle());
                gradient.addColorStop(1, bottomColor.getStyle());
            } else if (i === 3) { // Bottom
                gradient = context.createLinearGradient(0, 0, 0, 512);
                gradient.addColorStop(0, bottomColor.getStyle());
                gradient.addColorStop(1, bottomColor.getStyle());
            } else { // Sides
                gradient = context.createLinearGradient(0, 0, 0, 512);
                gradient.addColorStop(0, bottomColor.getStyle());
                gradient.addColorStop(0.5, topColor.getStyle());
                gradient.addColorStop(1, topColor.getStyle());
            }
            
            context.fillStyle = gradient;
            context.fillRect(0, 0, 512, 512);
            
            // Create texture from canvas
            const texture = new THREE.CanvasTexture(canvas);
            
            // Create material with texture
            const material = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.BackSide
            });
            
            skyMaterials.push(material);
        }
        
        this.skybox = new THREE.Mesh(skyGeometry, skyMaterials);
        this.scene.add(this.skybox);
        
        // Add sun
        this.createSun();
        
        // Add clouds
        this.createClouds();
        
        Logger.log('Enhanced skybox created');
    }
    
    createSun() {
        // Create a sun in the sky
        const sunGeometry = new THREE.SphereGeometry(30, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            transparent: true,
            opacity: 0.8
        });
        
        this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.sun.position.set(200, 200, -200);
        this.scene.add(this.sun);
        
        // Add sun glow
        const sunGlowGeometry = new THREE.SphereGeometry(40, 32, 32);
        const sunGlowMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            transparent: true,
            opacity: 0.2
        });
        
        this.sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
        this.sunGlow.position.copy(this.sun.position);
        this.scene.add(this.sunGlow);
        
        Logger.log('Sun created');
    }
    
    createClouds() {
        // Create a cloud system
        this.clouds = new THREE.Group();
        this.scene.add(this.clouds);
        
        // Create several cloud clusters
        for (let i = 0; i < 20; i++) {
            const cloudCluster = this.createCloudCluster();
            
            // Position randomly in the sky
            const x = Math.random() * 800 - 400;
            const y = 100 + Math.random() * 50;
            const z = Math.random() * 800 - 400;
            
            cloudCluster.position.set(x, y, z);
            
            // Add to cloud group
            this.clouds.add(cloudCluster);
        }
        
        Logger.log('Cloud system created');
    }
    
    createCloudCluster() {
        // Create a cluster of cloud puffs
        const cluster = new THREE.Group();
        
        // Number of puffs in this cluster
        const puffCount = 3 + Math.floor(Math.random() * 5);
        
        for (let i = 0; i < puffCount; i++) {
            // Create a cloud puff
            const puffGeometry = new THREE.SphereGeometry(
                10 + Math.random() * 15, // Size
                8, 8
            );
            
            const puffMaterial = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.7 + Math.random() * 0.2
            });
            
            const puff = new THREE.Mesh(puffGeometry, puffMaterial);
            
            // Position within cluster
            const x = Math.random() * 30 - 15;
            const y = Math.random() * 10 - 5;
            const z = Math.random() * 30 - 15;
            
            puff.position.set(x, y, z);
            
            // Add to cluster
            cluster.add(puff);
        }
        
        return cluster;
    }
    
    createWater() {
        // Create a water plane
        const waterGeometry = new THREE.PlaneGeometry(this.worldSize * this.gridSize * 2, this.worldSize * this.gridSize * 2);
        
        // Create a simple water material with color
        const waterMaterial = new THREE.MeshStandardMaterial({
            color: 0x0077be,
            transparent: true,
            opacity: 0.8,
            metalness: 0.1,
            roughness: 0.2
        });
        
        this.water = new THREE.Mesh(waterGeometry, waterMaterial);
        this.water.rotation.x = -Math.PI / 2; // Rotate to be horizontal
        this.water.position.y = -5; // Position below ground level
        this.water.receiveShadow = true;
        
        this.scene.add(this.water);
        
        // Store the initial water position for animation
        this.waterInitialY = this.water.position.y;
        
        Logger.log('Water created');
    }
    
    createEnvironmentalEffects() {
        // Create particle systems for environmental effects
        this.createParticleSystems();
        
        // Add ambient sounds
        this.setupAmbientSounds();
        
        Logger.log('Environmental effects created');
    }
    
    createParticleSystems() {
        // Create particle container
        this.particles = {
            systems: [],
            container: new THREE.Group()
        };
        
        this.scene.add(this.particles.container);
        
        // Create different particle systems
        this.createLeafParticles();
        this.createDustParticles();
        
        Logger.log('Particle systems created');
    }
    
    createLeafParticles() {
        // Create falling leaves particle system
        const particleCount = 100;
        const particleGeometry = new THREE.BufferGeometry();
        const particleMaterial = new THREE.PointsMaterial({
            color: 0x00ff00,
            size: 0.5,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        // Create positions for particles
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];
        
        for (let i = 0; i < particleCount; i++) {
            // Random position within world bounds
            const x = Math.random() * this.worldSize * this.gridSize - (this.worldSize * this.gridSize / 2);
            const y = 20 + Math.random() * 30; // Start above ground
            const z = Math.random() * this.worldSize * this.gridSize - (this.worldSize * this.gridSize / 2);
            
            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
            
            // Random velocity
            velocities.push({
                x: (Math.random() - 0.5) * 0.1,
                y: -0.05 - Math.random() * 0.1,
                z: (Math.random() - 0.5) * 0.1,
                rotationSpeed: Math.random() * 0.02
            });
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        // Create particle system
        const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
        
        // Add to container
        this.particles.container.add(particleSystem);
        
        // Store in systems array with update function
        this.particles.systems.push({
            system: particleSystem,
            velocities: velocities,
            update: (deltaTime) => {
                const positions = particleSystem.geometry.attributes.position.array;
                
                for (let i = 0; i < particleCount; i++) {
                    // Update position based on velocity
                    positions[i * 3] += velocities[i].x;
                    positions[i * 3 + 1] += velocities[i].y;
                    positions[i * 3 + 2] += velocities[i].z;
                    
                    // Add some swaying motion
                    positions[i * 3] += Math.sin(Date.now() * 0.001 + i) * 0.01;
                    
                    // Reset if below ground
                    if (positions[i * 3 + 1] < 0) {
                        positions[i * 3] = Math.random() * this.worldSize * this.gridSize - (this.worldSize * this.gridSize / 2);
                        positions[i * 3 + 1] = 20 + Math.random() * 30;
                        positions[i * 3 + 2] = Math.random() * this.worldSize * this.gridSize - (this.worldSize * this.gridSize / 2);
                    }
                }
                
                particleSystem.geometry.attributes.position.needsUpdate = true;
            }
        });
        
        Logger.log('Leaf particle system created');
    }
    
    createDustParticles() {
        // Create dust particle system
        const particleCount = 200;
        const particleGeometry = new THREE.BufferGeometry();
        const particleMaterial = new THREE.PointsMaterial({
            color: 0xcccccc,
            size: 0.2,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        
        // Create positions for particles
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];
        
        for (let i = 0; i < particleCount; i++) {
            // Random position near ground
            const x = Math.random() * this.worldSize * this.gridSize - (this.worldSize * this.gridSize / 2);
            const y = Math.random() * 5; // Near ground
            const z = Math.random() * this.worldSize * this.gridSize - (this.worldSize * this.gridSize / 2);
            
            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
            
            // Random velocity (slower than leaves)
            velocities.push({
                x: (Math.random() - 0.5) * 0.05,
                y: 0.01 + Math.random() * 0.02,
                z: (Math.random() - 0.5) * 0.05,
                life: Math.random() * 5 + 5 // Lifetime in seconds
            });
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        // Create particle system
        const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
        
        // Add to container
        this.particles.container.add(particleSystem);
        
        // Store in systems array with update function
        this.particles.systems.push({
            system: particleSystem,
            velocities: velocities,
            update: (deltaTime) => {
                const positions = particleSystem.geometry.attributes.position.array;
                
                for (let i = 0; i < particleCount; i++) {
                    // Update position based on velocity
                    positions[i * 3] += velocities[i].x;
                    positions[i * 3 + 1] += velocities[i].y;
                    positions[i * 3 + 2] += velocities[i].z;
                    
                    // Add some random movement
                    positions[i * 3] += (Math.random() - 0.5) * 0.01;
                    positions[i * 3 + 2] += (Math.random() - 0.5) * 0.01;
                    
                    // Update lifetime
                    velocities[i].life -= deltaTime;
                    
                    // Reset if lifetime expired or too high
                    if (velocities[i].life <= 0 || positions[i * 3 + 1] > 10) {
                        positions[i * 3] = Math.random() * this.worldSize * this.gridSize - (this.worldSize * this.gridSize / 2);
                        positions[i * 3 + 1] = Math.random() * 2; // Near ground
                        positions[i * 3 + 2] = Math.random() * this.worldSize * this.gridSize - (this.worldSize * this.gridSize / 2);
                        velocities[i].life = Math.random() * 5 + 5;
                    }
                }
                
                particleSystem.geometry.attributes.position.needsUpdate = true;
            }
        });
        
        Logger.log('Dust particle system created');
    }
    
    setupAmbientSounds() {
        // Set up ambient sounds if audio manager exists
        if (window.game && window.game.audio) {
            // Add ambient background sounds
            window.game.audio.playAmbientSound('wind', 0.2, true);
            window.game.audio.playAmbientSound('birds', 0.1, true);
            
            Logger.log('Ambient sounds set up');
        }
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
    
    // Create a move indicator at the specified position
    createMoveIndicator(position) {
        // Remove any existing move indicator
        this.removeMoveIndicator();
        
        // Create a circle geometry for the indicator
        const geometry = new THREE.RingGeometry(0.5, 0.7, 32);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0xffff00, 
            transparent: true, 
            opacity: 0.7,
            side: THREE.DoubleSide
        });
        
        // Create the mesh and position it
        const indicator = new THREE.Mesh(geometry, material);
        indicator.rotation.x = -Math.PI / 2; // Make it horizontal
        indicator.position.copy(position);
        indicator.position.y = 0.1; // Slightly above ground to avoid z-fighting
        indicator.name = 'moveIndicator';
        
        // Add to scene
        this.scene.add(indicator);
        
        // Store reference to the indicator
        this.moveIndicator = indicator;
        
        // Animate the indicator
        this.animateMoveIndicator();
        
        // Remove after a short duration
        setTimeout(() => {
            this.removeMoveIndicator();
        }, 1000);
    }
    
    // Remove the move indicator if it exists
    removeMoveIndicator() {
        if (this.moveIndicator && this.moveIndicator.parent) {
            this.scene.remove(this.moveIndicator);
            this.moveIndicator.geometry.dispose();
            this.moveIndicator.material.dispose();
            this.moveIndicator = null;
        }
    }
    
    // Animate the move indicator
    animateMoveIndicator() {
        if (!this.moveIndicator) return;
        
        const startTime = Date.now();
        const duration = 1000; // 1 second
        
        const animate = () => {
            if (!this.moveIndicator) return;
            
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                // Scale up and fade out
                const scale = 1 + progress;
                this.moveIndicator.scale.set(scale, scale, scale);
                this.moveIndicator.material.opacity = 0.7 * (1 - progress);
                
                requestAnimationFrame(animate);
            } else {
                this.removeMoveIndicator();
            }
        };
        
        animate();
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
        
        // Update sun and clouds
        this.updateSkyElements(deltaTime);
        
        // Update water animation
        this.updateWater(deltaTime);
        
        // Update particle systems
        this.updateParticleSystems(deltaTime);
        
        // Check if we need to update terrain for infinite scrolling
        if (window.game && window.game.hero) {
            this.updateInfiniteTerrain(window.game.hero.position);
        }
    }
    
    updateSkyElements(deltaTime) {
        // Animate clouds
        if (this.clouds) {
            // Slowly move clouds
            this.clouds.children.forEach(cloud => {
                cloud.position.x += 0.05 * deltaTime;
                
                // Wrap around when out of bounds
                if (cloud.position.x > 400) {
                    cloud.position.x = -400;
                }
            });
        }
        
        // Animate sun glow
        if (this.sunGlow) {
            // Pulse the sun glow
            const scale = 1 + 0.05 * Math.sin(Date.now() * 0.001);
            this.sunGlow.scale.set(scale, scale, scale);
        }
    }
    
    updateWater(deltaTime) {
        if (this.water) {
            // Create gentle wave motion
            const time = Date.now() * 0.001;
            this.water.position.y = this.waterInitialY + Math.sin(time * 0.2) * 0.1;
            
            // Could add more complex water effects here
        }
    }
    
    updateParticleSystems(deltaTime) {
        // Update all particle systems
        if (this.particles && this.particles.systems) {
            this.particles.systems.forEach(system => {
                if (system.update) {
                    system.update(deltaTime);
                }
            });
        }
    }
    
    // Handle infinite terrain by wrapping player position
    updateInfiniteTerrain(playerPosition) {
        // Check if player position is valid
        if (!playerPosition || isNaN(playerPosition.x) || isNaN(playerPosition.z)) {
            Logger.error('Invalid player position detected:', playerPosition);
            return;
        }
        
        // Calculate which chunk the player is in
        const chunkX = Math.floor(playerPosition.x / this.chunkSize);
        const chunkZ = Math.floor(playerPosition.z / this.chunkSize);
        
        // Validate chunk coordinates
        if (isNaN(chunkX) || isNaN(chunkZ)) {
            Logger.error(`Invalid chunk coordinates calculated: (${chunkX}, ${chunkZ}) from position:`, playerPosition);
            return;
        }
        
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