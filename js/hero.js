/**
 * Hero class and related functionality
 */

// Base Hero class
class Hero {
    constructor(name, type, scene) {
        this.name = name;
        this.type = type;
        this.scene = scene;
        
        // Stats
        this.stats = window.HeroesConfig.defaultStats;
        
        // Position and movement
        this.position = new THREE.Vector3(0, 0, 0);
        this.rotation = new THREE.Euler(0, 0, 0);
        this.targetPosition = null;
        this.isMoving = false;
        this.moveDirection = new THREE.Vector3();
        
        // Jump properties
        this.isJumping = false;
        this.jumpHeight = 0;
        this.jumpVelocity = 0;
        this.jumpStartTime = 0;
        this.jumpCount = 0;
        this.maxJumpCount = window.configLoader?.getConfig('jumpConfig')?.maxJumpCount || 2; // Double jump by default
        this.isHoldingJump = false;
        this.showWings = false;
        
        // Long press tracking for jump
        this.longPressActive = false;
        this.longPressInterval = null;
        
        // Combat state
        this.isAttacking = false;
        this.currentTarget = null;
        this.attackCooldown = 0;
        
        // Abilities (6 abilities using only number keys 1-6)
        this.abilities = {
            '1': null, // Primary ability
            '2': null, // Secondary ability
            '3': null, // Third ability
            '4': null, // Ultimate ability
            '5': null, // Extra ability 1
            '6': null  // Extra ability 2
        };
        
        // Model and animation
        this.model = null;
        this.mixer = null;
        this.animations = {};
        this.currentAnimation = null;
        
        Logger.log(`Hero ${name} created`);
    }
    
    // Initialize the hero with a model
    async init() {
        // Create a placeholder model (a colored box)
        const geometry = new THREE.BoxGeometry(1, 2, 1);
        const material = new THREE.MeshLambertMaterial({ color: this.getHeroColor() });
        this.model = new THREE.Mesh(geometry, material);
        this.model.position.set(0, 1, 0); // Position slightly above ground
        this.model.castShadow = true;
        this.model.receiveShadow = true;
        
        // Create wings (initially hidden)
        this.createWings();
        
        // Add to scene
        this.scene.add(this.model);
        
        // Set up abilities based on hero type
        this.setupAbilities();
        
        Logger.log(`Hero ${this.name} initialized`);
        
        return this;
    }
    
    // Create 3D wings for the hero
    createWings() {
        // Get wing configuration
        const flightConfig = window.configLoader?.getConfig('flightConfig') || {
            wingSize: 2,
            wingEffectColor: 0x66ccff,
            featherCount: 24,
            featherLayers: 3
        };
        
        // Create wing group to hold both wings
        this.wings = new THREE.Group();
        this.model.add(this.wings);
        
        // Position wings at the back of the hero
        this.wings.position.set(0, 0, -0.2);
        
        // Create left wing group
        this.leftWingGroup = new THREE.Group();
        this.leftWingGroup.position.set(-0.5, 0, 0);
        this.wings.add(this.leftWingGroup);
        
        // Create right wing group
        this.rightWingGroup = new THREE.Group();
        this.rightWingGroup.position.set(0.5, 0, 0);
        this.rightWingGroup.scale.x = -1; // Mirror along X axis
        this.wings.add(this.rightWingGroup);
        
        // Create feathers for each wing
        const featherCount = flightConfig.featherCount || 24;
        const featherLayers = flightConfig.featherLayers || 3;
        
        // Create feathers for left wing
        this.leftWingFeathers = [];
        for (let layer = 0; layer < featherLayers; layer++) {
            const layerFeathers = [];
            const layerOffset = layer * 0.05; // Slight z-offset between layers
            const layerScale = 1 - (layer * 0.15); // Smaller feathers for inner layers
            
            for (let i = 0; i < featherCount; i++) {
                const feather = this.createFeather(
                    flightConfig.wingSize * layerScale, 
                    flightConfig.wingEffectColor,
                    i / featherCount,
                    layer
                );
                
                // Position feather
                const angle = (i / featherCount) * Math.PI * 0.8; // 144 degrees arc
                const radius = flightConfig.wingSize * 0.5 * (1 - Math.pow(layer / featherLayers, 2));
                
                feather.position.set(
                    Math.cos(angle) * radius,
                    Math.sin(angle) * radius,
                    layerOffset
                );
                
                // Rotate feather to point outward
                feather.rotation.z = angle - Math.PI / 2;
                
                // Add to wing
                this.leftWingGroup.add(feather);
                layerFeathers.push(feather);
            }
            
            this.leftWingFeathers.push(layerFeathers);
        }
        
        // Create feathers for right wing (clone left wing)
        this.rightWingFeathers = [];
        for (let layer = 0; layer < featherLayers; layer++) {
            const layerFeathers = [];
            const layerOffset = layer * 0.05;
            const layerScale = 1 - (layer * 0.15);
            
            for (let i = 0; i < featherCount; i++) {
                const feather = this.createFeather(
                    flightConfig.wingSize * layerScale, 
                    flightConfig.wingEffectColor,
                    i / featherCount,
                    layer
                );
                
                // Position feather
                const angle = (i / featherCount) * Math.PI * 0.8;
                const radius = flightConfig.wingSize * 0.5 * (1 - Math.pow(layer / featherLayers, 2));
                
                feather.position.set(
                    Math.cos(angle) * radius,
                    Math.sin(angle) * radius,
                    layerOffset
                );
                
                // Rotate feather to point outward
                feather.rotation.z = angle - Math.PI / 2;
                
                // Add to wing
                this.rightWingGroup.add(feather);
                layerFeathers.push(feather);
            }
            
            this.rightWingFeathers.push(layerFeathers);
        }
        
        // Create wing bone structure (for visual effect)
        const boneStructure = this.createWingBoneStructure(flightConfig.wingSize, flightConfig.wingEffectColor);
        this.leftWingGroup.add(boneStructure);
        
        const rightBoneStructure = boneStructure.clone();
        this.rightWingGroup.add(rightBoneStructure);
        
        // Initially hide wings and set to closed position
        this.wings.visible = false;
        this.wingOpenState = 0; // 0 = closed, 1 = fully open
        this.setWingOpenState(0); // Initialize in closed position
        
        Logger.log(`Created wings with feathers for hero ${this.name}`);
    }
    
    // Create a single feather
    createFeather(size, color, position, layer) {
        // Create feather shape
        const featherShape = new THREE.Shape();
        
        // Feather base
        featherShape.moveTo(0, 0);
        
        // Feather tip
        featherShape.bezierCurveTo(
            size * 0.3, size * 0.4,
            size * 0.6, size * 0.7,
            size, size * 0.2
        );
        
        // Feather bottom curve
        featherShape.bezierCurveTo(
            size * 0.7, size * 0.1,
            size * 0.3, 0,
            0, 0
        );
        
        // Create geometry from shape
        const featherGeometry = new THREE.ShapeGeometry(featherShape, 8);
        
        // Create material with slight variation in color
        const hueShift = (Math.random() * 0.1) - 0.05; // Small random hue variation
        const featherColor = new THREE.Color(color);
        
        // Adjust hue slightly for variation
        const hsl = {};
        featherColor.getHSL(hsl);
        hsl.h += hueShift;
        hsl.s += (Math.random() * 0.2) - 0.1; // Saturation variation
        hsl.l += (Math.random() * 0.2) - 0.1; // Lightness variation
        featherColor.setHSL(hsl.h, hsl.s, hsl.l);
        
        // Create material
        const featherMaterial = new THREE.MeshPhongMaterial({
            color: featherColor,
            transparent: true,
            opacity: 0.7 - (layer * 0.1), // Inner layers slightly more transparent
            side: THREE.DoubleSide,
            emissive: featherColor,
            emissiveIntensity: 0.3,
            shininess: 50
        });
        
        // Create mesh
        const feather = new THREE.Mesh(featherGeometry, featherMaterial);
        
        // Add some random rotation for natural look
        feather.rotation.x = (Math.random() * 0.2) - 0.1;
        feather.rotation.y = (Math.random() * 0.2) - 0.1;
        
        return feather;
    }
    
    // Create wing bone structure
    createWingBoneStructure(size, color) {
        const group = new THREE.Group();
        
        // Main bone
        const mainBoneGeometry = new THREE.CylinderGeometry(0.03, 0.01, size, 8);
        const boneMaterial = new THREE.MeshPhongMaterial({
            color: color,
            transparent: true,
            opacity: 0.9,
            emissive: color,
            emissiveIntensity: 0.5
        });
        
        const mainBone = new THREE.Mesh(mainBoneGeometry, boneMaterial);
        mainBone.rotation.z = Math.PI / 2; // Rotate to horizontal
        mainBone.position.set(size/2, 0, 0.1); // Position along wing
        group.add(mainBone);
        
        // Secondary bones
        const secondaryBoneCount = 5;
        for (let i = 0; i < secondaryBoneCount; i++) {
            const length = size * 0.7 * (1 - (i / secondaryBoneCount));
            const secondaryBoneGeometry = new THREE.CylinderGeometry(0.02, 0.01, length, 6);
            const secondaryBone = new THREE.Mesh(secondaryBoneGeometry, boneMaterial);
            
            // Position and rotate
            const angle = (i / secondaryBoneCount) * Math.PI * 0.5; // 90 degrees arc
            secondaryBone.rotation.z = Math.PI / 2 + angle;
            secondaryBone.position.set(
                (size * 0.2) + Math.cos(angle) * (size * 0.1),
                Math.sin(angle) * (size * 0.1),
                0.05
            );
            
            group.add(secondaryBone);
        }
        
        return group;
    }
    
    // Set wing open state (0 = closed, 1 = fully open)
    setWingOpenState(openState) {
        if (!this.leftWingFeathers || !this.rightWingFeathers) return;
        
        // Clamp value between 0 and 1
        openState = Math.max(0, Math.min(1, openState));
        this.wingOpenState = openState;
        
        // Calculate wing fold angle based on open state
        // When closed, wings fold back, when open they spread out
        const foldAngle = (1 - openState) * Math.PI * 0.8; // 0 when fully open, 144 degrees when closed
        
        // Apply to left wing group
        this.leftWingGroup.rotation.y = foldAngle;
        
        // Apply to right wing group (mirrored)
        this.rightWingGroup.rotation.y = -foldAngle;
        
        // Also adjust individual feathers for a more natural look
        const featherLayers = this.leftWingFeathers.length;
        
        for (let layer = 0; layer < featherLayers; layer++) {
            const layerFeathers = this.leftWingFeathers[layer];
            const rightLayerFeathers = this.rightWingFeathers[layer];
            
            for (let i = 0; i < layerFeathers.length; i++) {
                const feather = layerFeathers[i];
                const rightFeather = rightLayerFeathers[i];
                
                // Calculate feather fold based on position and open state
                const featherPosition = i / layerFeathers.length;
                const featherFoldAngle = (1 - openState) * Math.PI * 0.5 * featherPosition;
                
                // Apply rotation to feathers
                feather.rotation.x = featherFoldAngle;
                rightFeather.rotation.x = featherFoldAngle;
                
                // Adjust opacity based on open state
                feather.material.opacity = 0.3 + (openState * 0.4);
                rightFeather.material.opacity = 0.3 + (openState * 0.4);
            }
        }
    }
    
    // Create a wing shape
    createWingShape(size) {
        const shape = new THREE.Shape();
        
        // Start at the wing base
        shape.moveTo(0, 0);
        
        // Draw the wing outline (curved shape)
        shape.bezierCurveTo(
            size * 0.2, size * 0.3,  // Control point 1
            size * 0.4, size * 0.8,  // Control point 2
            size * 0.5, size        // End point
        );
        
        // Draw the wing tip
        shape.bezierCurveTo(
            size * 0.7, size * 0.9,  // Control point 1
            size * 0.9, size * 0.5,  // Control point 2
            size, size * 0.2        // End point
        );
        
        // Draw the bottom edge back to the start
        shape.bezierCurveTo(
            size * 0.8, size * 0.1,  // Control point 1
            size * 0.3, -size * 0.1, // Control point 2
            0, 0                    // End point
        );
        
        return shape;
    }
    
    // Animate wings based on direction and intensity
    animateWings(direction, intensity) {
        if (!this.wings || !this.leftWingFeathers || !this.rightWingFeathers) return;
        
        // Get wing configuration
        const flightConfig = window.configLoader?.getConfig('flightConfig') || {
            wingFlapSpeed: 0.5,
            wingEffectColor: 0x66ccff,
            upwardEffectColor: 0x00ffff,
            downwardEffectColor: 0xff9900,
            wingOpenDuration: 0.8, // seconds to fully open wings
            wingFlapIntensity: 0.3  // base intensity for wing flapping
        };
        
        // Set wing color based on direction
        let wingColor;
        if (direction === 'hover') {
            // For hover state, use the default wing effect color
            wingColor = flightConfig.wingEffectColor;
        } else {
            // For up/down movement, use directional colors
            wingColor = direction === 'up' ? 
                flightConfig.upwardEffectColor : 
                flightConfig.downwardEffectColor;
        }
        
        // Update wing colors for all feathers
        const featherLayers = this.leftWingFeathers.length;
        for (let layer = 0; layer < featherLayers; layer++) {
            const layerFeathers = this.leftWingFeathers[layer];
            const rightLayerFeathers = this.rightWingFeathers[layer];
            
            for (let i = 0; i < layerFeathers.length; i++) {
                const feather = layerFeathers[i];
                const rightFeather = rightLayerFeathers[i];
                
                if (feather.material) {
                    // Add slight color variation for each feather
                    const featherColor = new THREE.Color(wingColor);
                    const hsl = {};
                    featherColor.getHSL(hsl);
                    hsl.h += (Math.random() * 0.05) - 0.025; // Small hue variation
                    hsl.s += (Math.random() * 0.1) - 0.05; // Saturation variation
                    featherColor.setHSL(hsl.h, hsl.s, hsl.l);
                    
                    // Apply color and glow
                    feather.material.color.copy(featherColor);
                    feather.material.emissive.copy(featherColor);
                    feather.material.emissiveIntensity = 0.3 + intensity * 0.7;
                    
                    // Apply same to right wing feather
                    rightFeather.material.color.copy(featherColor);
                    rightFeather.material.emissive.copy(featherColor);
                    rightFeather.material.emissiveIntensity = 0.3 + intensity * 0.7;
                    
                    // For hover state, add gentle oscillation to feathers
                    if (direction === 'hover') {
                        // Calculate a unique phase for each feather for natural movement
                        const featherPhase = (i / layerFeathers.length) * Math.PI * 2;
                        const layerPhase = layer * 0.5; // Different phase for each layer
                        
                        // Apply gentle oscillation based on time
                        const time = performance.now() / 1000; // Current time in seconds
                        const oscillation = Math.sin(time * flightConfig.wingFlapSpeed + featherPhase + layerPhase) * 0.1 * intensity;
                        
                        // Apply oscillation to rotation
                        feather.rotation.z = oscillation;
                        rightFeather.rotation.z = oscillation;
                    }
                }
            }
        }
        
        // For hover state, animate the entire wing with a gentle flapping motion
        if (direction === 'hover') {
            // Calculate wing flap based on time
            const time = performance.now() / 1000;
            const flapAngle = Math.sin(time * flightConfig.wingFlapSpeed) * 0.1 * intensity;
            
            // Apply to wing groups
            this.leftWingGroup.rotation.z = flapAngle;
            this.rightWingGroup.rotation.z = -flapAngle; // Mirror for right wing
        }
        
        // Determine target wing open state based on direction and intensity
        let targetOpenState = 0.3 + (intensity * 0.7); // More open with higher intensity
        
        // If wings are just appearing, start from closed position
        if (!this.wings.visible || this.wingOpenState === 0) {
            this.wings.visible = true;
            this.wingOpenState = 0;
            
            // Create opening effect
            this.animateWingOpenTransition(0, targetOpenState, flightConfig.wingOpenDuration);
        } else {
            // If wings are already visible, animate to new open state
            this.animateWingOpenTransition(this.wingOpenState, targetOpenState, flightConfig.wingOpenDuration / 2);
        }
        
        // Animate wing flapping
        const flapSpeed = flightConfig.wingFlapSpeed * (1 + intensity);
        const flapAmplitude = 0.1 + intensity * 0.2; // Flap more intensely with higher intensity
        
        // Clear any existing flap animation
        if (this.wingFlapAnimationId) {
            cancelAnimationFrame(this.wingFlapAnimationId);
        }
        
        // Start time for animation
        const startTime = performance.now();
        
        // Animate wing flapping
        const animateFlap = (time) => {
            const elapsed = (time - startTime) / 1000; // Convert to seconds
            const flapAngle = Math.sin(elapsed * flapSpeed * Math.PI * 2) * flapAmplitude;
            
            // Apply flap rotation to wing groups
            this.leftWingGroup.rotation.z = flapAngle;
            this.rightWingGroup.rotation.z = -flapAngle; // Mirror rotation for right wing
            
            // Also animate individual feathers for more natural movement
            for (let layer = 0; layer < featherLayers; layer++) {
                const layerFeathers = this.leftWingFeathers[layer];
                const rightLayerFeathers = this.rightWingFeathers[layer];
                
                for (let i = 0; i < layerFeathers.length; i++) {
                    const feather = layerFeathers[i];
                    const rightFeather = rightLayerFeathers[i];
                    
                    // Add slight individual feather movement
                    const featherPosition = i / layerFeathers.length;
                    const featherPhaseOffset = featherPosition * Math.PI; // Different phase for each feather
                    const featherFlapAngle = Math.sin((elapsed + featherPhaseOffset) * flapSpeed * Math.PI * 2) * (flapAmplitude * 0.3);
                    
                    // Apply additional rotation to individual feathers
                    feather.rotation.y = featherFlapAngle;
                    rightFeather.rotation.y = -featherFlapAngle;
                }
            }
            
            // Create occasional particle effects during flapping
            if (Math.random() < 0.02 * intensity) {
                this.createWingFlapEffect(wingColor, intensity);
            }
            
            // Continue animation
            this.wingFlapAnimationId = requestAnimationFrame(animateFlap);
        };
        
        // Start flap animation
        this.wingFlapAnimationId = requestAnimationFrame(animateFlap);
    }
    
    // Animate wing opening/closing transition
    animateWingOpenTransition(startOpenState, endOpenState, duration) {
        // Clear any existing transition animation
        if (this.wingTransitionAnimationId) {
            cancelAnimationFrame(this.wingTransitionAnimationId);
        }
        
        const startTime = performance.now();
        
        const animateTransition = (time) => {
            const elapsed = (time - startTime) / 1000; // Convert to seconds
            const progress = Math.min(1, elapsed / duration);
            
            // Use easeInOutCubic for smooth transition
            const easedProgress = progress < 0.5 
                ? 4 * progress * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            // Calculate current open state
            const currentOpenState = startOpenState + (endOpenState - startOpenState) * easedProgress;
            
            // Apply open state
            this.setWingOpenState(currentOpenState);
            
            // Continue animation if not complete
            if (progress < 1) {
                this.wingTransitionAnimationId = requestAnimationFrame(animateTransition);
            } else {
                this.wingTransitionAnimationId = null;
            }
        };
        
        // Start transition animation
        this.wingTransitionAnimationId = requestAnimationFrame(animateTransition);
    }
    
    // Create visual effect for wing flapping
    createWingFlapEffect(color, intensity) {
        // Skip if wings aren't visible
        if (!this.wings || !this.wings.visible || !this.leftWingGroup || !this.rightWingGroup) return;
        
        // Create particles at wing positions
        const particleCount = Math.floor(5 + intensity * 10); // More particles with higher intensity
        const particleSize = 0.05 + intensity * 0.1;
        const particleLifetime = 500 + intensity * 500; // Longer lifetime with higher intensity
        
        // Create particles for both wings
        this.createWingParticles(this.leftWingGroup.position, color, particleCount, particleSize, particleLifetime);
        this.createWingParticles(this.rightWingGroup.position, color, particleCount, particleSize, particleLifetime);
    }
    
    // Create a special effect when wings close during landing
    createWingClosingEffect(color) {
        // Skip if wings aren't visible
        if (!this.wings || !this.wings.visible || !this.leftWingGroup || !this.rightWingGroup) return;
        
        // Create a more dramatic effect for wing closing
        const particleCount = 30; // More particles for a dramatic effect
        const particleSize = 0.1;
        const particleLifetime = 1000; // Longer lifetime for the effect to be visible
        
        // Create a burst of particles from both wings
        this.createWingParticles(this.leftWingGroup.position, color, particleCount, particleSize, particleLifetime, true);
        this.createWingParticles(this.rightWingGroup.position, color, particleCount, particleSize, particleLifetime, true);
        
        // Create a ring effect at the hero's position to show impact
        this.createRingEffect(color, 1.5);
        
        Logger.log(`Created wing closing effect as hero landed`);
    }
    
    // Create a special effect when transitioning to slow flight mode
    createWingTransitionEffect(color) {
        // Skip if wings aren't visible
        if (!this.wings || !this.wings.visible || !this.leftWingGroup || !this.rightWingGroup) return;
        
        // Create a special effect for wing transition to slow flight
        const particleCount = 40; // More particles for a dramatic effect
        const particleSize = 0.08;
        const particleLifetime = 1500; // Longer lifetime for the effect to be visible
        
        // Create a spiral of particles from both wings
        this.createWingParticles(this.leftWingGroup.position, color, particleCount, particleSize, particleLifetime, false, true);
        this.createWingParticles(this.rightWingGroup.position, color, particleCount, particleSize, particleLifetime, false, true);
        
        // Create a glow effect around the hero
        this.createGlowEffect(color, 2.0, 1000);
        
        Logger.log(`Created wing transition effect for slow flight mode`);
    }
    
    // Create a pulse effect for wings when already in slow flight mode
    createWingPulseEffect(color) {
        // Skip if wings aren't visible
        if (!this.wings || !this.wings.visible || !this.leftWingGroup || !this.rightWingGroup) return;
        
        // Create a pulsing glow effect
        this.createGlowEffect(color, 1.5, 800);
        
        // Create subtle particles from wings
        const particleCount = 15;
        const particleSize = 0.05;
        const particleLifetime = 800;
        
        // Create particles with a gentle outward motion
        this.createWingParticles(this.leftWingGroup.position, color, particleCount, particleSize, particleLifetime);
        this.createWingParticles(this.rightWingGroup.position, color, particleCount, particleSize, particleLifetime);
        
        Logger.log(`Created wing pulse effect for slow flight mode`);
    }
    
    // Create a glow effect around the hero
    createGlowEffect(color, size = 1.0, duration = 1000) {
        // Create a sphere geometry for the glow
        const geometry = new THREE.SphereGeometry(this.radius * size, 16, 16);
        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        
        // Create the glow mesh
        const glow = new THREE.Mesh(geometry, material);
        glow.position.copy(this.model.position);
        
        // Add to scene
        this.scene.add(glow);
        
        // Animate the glow
        const startTime = performance.now();
        
        const animateGlow = (time) => {
            const elapsed = time - startTime;
            const progress = Math.min(1, elapsed / duration);
            
            if (progress < 1) {
                // Pulse the glow
                const scale = 1 + 0.2 * Math.sin(progress * Math.PI * 4);
                glow.scale.set(scale, scale, scale);
                
                // Fade out gradually
                glow.material.opacity = 0.3 * (1 - progress);
                
                // Continue animation
                requestAnimationFrame(animateGlow);
            } else {
                // Remove glow
                this.scene.remove(glow);
                glow.geometry.dispose();
                glow.material.dispose();
            }
        };
        
        // Start animation
        requestAnimationFrame(animateGlow);
    }
    
    // Create particles at wing position
    createWingParticles(wingPosition, color, count, size, lifetime, burstEffect = false, spiralEffect = false) {
        // Convert wing local position to world position
        const worldPosition = new THREE.Vector3();
        worldPosition.copy(wingPosition);
        this.model.localToWorld(worldPosition);
        
        // Create particles
        for (let i = 0; i < count; i++) {
            // Create particle geometry and material
            const geometry = new THREE.SphereGeometry(size * (0.5 + Math.random() * 0.5), 4, 4);
            const material = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.7
            });
            
            // Create particle mesh
            const particle = new THREE.Mesh(geometry, material);
            
            // Position at wing position with slight randomization
            particle.position.set(
                worldPosition.x + (Math.random() - 0.5) * 0.5,
                worldPosition.y + (Math.random() - 0.5) * 0.5,
                worldPosition.z + (Math.random() - 0.5) * 0.5
            );
            
            // Add to scene
            this.scene.add(particle);
            
            // Calculate initial velocity for different effects
            let velocityX = (Math.random() - 0.5) * 0.02;
            let velocityY = -0.01;
            let velocityZ = (Math.random() - 0.5) * 0.02;
            
            // If burst effect, give particles more initial velocity in all directions
            if (burstEffect) {
                velocityX = (Math.random() - 0.5) * 0.1;
                velocityY = (Math.random() - 0.5) * 0.1;
                velocityZ = (Math.random() - 0.5) * 0.1;
                
                // Add some downward bias for gravity effect
                velocityY -= 0.02;
            }
            
            // For spiral effect, set up initial parameters
            let spiralRadius = 0;
            let spiralAngle = Math.random() * Math.PI * 2;
            let spiralRiseRate = 0.01 + Math.random() * 0.02;
            let spiralGrowRate = 0.02 + Math.random() * 0.03;
            let spiralRotationRate = 0.1 + Math.random() * 0.2;
            
            // Animate and remove after lifetime
            const startTime = performance.now();
            
            const animate = (time) => {
                const elapsed = time - startTime;
                const progress = Math.min(1, elapsed / lifetime);
                
                if (progress < 1) {
                    if (spiralEffect) {
                        // Update spiral parameters
                        spiralRadius += spiralGrowRate;
                        spiralAngle += spiralRotationRate;
                        
                        // Calculate new position based on spiral
                        particle.position.x = worldPosition.x + Math.cos(spiralAngle) * spiralRadius;
                        particle.position.y = worldPosition.y + spiralRiseRate * elapsed / 16;
                        particle.position.z = worldPosition.z + Math.sin(spiralAngle) * spiralRadius;
                        
                        // Add some rotation to particles
                        particle.rotation.x += 0.03;
                        particle.rotation.y += 0.03;
                        
                        // Gradually change color based on height (optional effect)
                        if (elapsed > lifetime / 2) {
                            // Shift color towards white as it rises
                            const colorValue = new THREE.Color(color);
                            const whiteBlend = (elapsed - lifetime / 2) / (lifetime / 2);
                            colorValue.lerp(new THREE.Color(0xffffff), whiteBlend * 0.5);
                            particle.material.color = colorValue;
                        }
                    } else {
                        // Move particle based on velocity
                        particle.position.x += velocityX;
                        particle.position.y += velocityY;
                        particle.position.z += velocityZ;
                        
                        // Apply gravity effect
                        velocityY -= 0.001;
                        
                        // For burst effect, add some rotation to particles
                        if (burstEffect) {
                            particle.rotation.x += 0.05;
                            particle.rotation.y += 0.05;
                            particle.scale.multiplyScalar(0.99); // Gradually shrink
                        }
                    }
                    
                    // Fade out
                    particle.material.opacity = 0.7 * (1 - progress);
                    
                    // Continue animation
                    requestAnimationFrame(animate);
                } else {
                    // Remove particle
                    this.scene.remove(particle);
                    particle.geometry.dispose();
                    particle.material.dispose();
                }
            };
            
            // Start animation
            requestAnimationFrame(animate);
        }
    }
    
    // Get a color based on hero type
    getHeroColor() {
        switch (this.type) {
            case 'axe':
                return 0xcc0000; // Red
            case 'crystal-maiden':
                return 0x00ccff; // Light blue
            case 'lich':
                return 0x0000cc; // Dark blue
            case 'storm-spirit':
                return 0x00cc00; // Green
            default:
                return 0xcccccc; // Gray
        }
    }
    
    // Set up hero-specific abilities
    setupAbilities() {
        switch (this.type) {
            case 'axe':
                // Dota 1 Axe abilities
                this.abilities['1'] = new Ability('Berserker\'s Call', '1', 10, 8, this.berserkersCall.bind(this));
                this.abilities['2'] = new Ability('Battle Hunger', '2', 15, 5, this.battleHunger.bind(this));
                this.abilities['3'] = new Ability('Counter Helix', '3', 0, 0, this.counterHelix.bind(this), true); // Passive
                this.abilities['4'] = new Ability('Culling Blade', '4', 25, 10, this.cullingBlade.bind(this));
                this.abilities['5'] = new Ability('War Cry', '5', 15, 12, this.warCry.bind(this));
                this.abilities['6'] = new Ability('Taunt', '6', 5, 5, this.taunt.bind(this));
                break;
                
            case 'crystal-maiden':
                // Dota 1 Crystal Maiden abilities
                this.abilities['1'] = new Ability('Crystal Nova', '1', 15, 5, this.crystalNova.bind(this));
                this.abilities['2'] = new Ability('Frostbite', '2', 20, 6, this.frostbite.bind(this));
                this.abilities['3'] = new Ability('Brilliance Aura', '3', 0, 0, this.arcaneAura.bind(this), true); // Passive
                this.abilities['4'] = new Ability('Freezing Field', '4', 30, 12, this.freezingField.bind(this));
                this.abilities['5'] = new Ability('Frost Armor', '5', 18, 10, this.frostShield.bind(this));
                this.abilities['6'] = new Ability('Cold Snap', '6', 22, 8, this.icePath.bind(this));
                break;
                
            case 'lich':
                // Dota 1 Lich abilities
                this.abilities['1'] = new Ability('Frost Nova', '1', 15, 5, this.frostNova.bind(this));
                this.abilities['2'] = new Ability('Frost Armor', '2', 10, 8, this.frostArmor.bind(this));
                this.abilities['3'] = new Ability('Dark Ritual', '3', 5, 4, this.darkRitual.bind(this));
                this.abilities['4'] = new Ability('Chain Frost', '4', 30, 12, this.chainFrost.bind(this));
                this.abilities['5'] = new Ability('Frost Blast', '5', 20, 10, this.iceBlast.bind(this));
                this.abilities['6'] = new Ability('Ice Barrier', '6', 15, 8, this.frostShield.bind(this));
                break;
                
            case 'storm-spirit':
                // Dota 1 Storm Spirit abilities
                this.abilities['1'] = new Ability('Static Remnant', '1', 10, 4, this.staticRemnant.bind(this));
                this.abilities['2'] = new Ability('Electric Vortex', '2', 20, 6, this.electricVortex.bind(this));
                this.abilities['3'] = new Ability('Overload', '3', 0, 0, this.overload.bind(this), true); // Passive
                this.abilities['4'] = new Ability('Ball Lightning', '4', 15, 3, this.ballLightning.bind(this));
                this.abilities['5'] = new Ability('Electric Surge', '5', 12, 5, this.lightningBolt.bind(this));
                this.abilities['6'] = new Ability('Storm Gust', '6', 25, 15, this.energyField.bind(this));
                break;
                
            default:
                // Generic abilities if hero type is not recognized
                this.abilities['1'] = new Ability('Ability 1', '1', 10, 5, () => console.log('Ability 1 activated'));
                this.abilities['2'] = new Ability('Ability 2', '2', 15, 8, () => console.log('Ability 2 activated'));
                this.abilities['3'] = new Ability('Ability 3', '3', 20, 10, () => console.log('Ability 3 activated'));
                this.abilities['4'] = new Ability('Ultimate', '4', 30, 15, () => console.log('Ultimate activated'));
                this.abilities['5'] = new Ability('Ability 5', '5', 20, 12, () => console.log('Ability 5 activated'));
                this.abilities['6'] = new Ability('Ability 6', '6', 25, 14, () => console.log('Ability 6 activated'));
        }
        
        Logger.log(`6 abilities set up for ${this.name} using number keys 1-6`);
    }
    
    // Movement methods
    moveTo(targetPosition) {
        this.targetPosition = targetPosition.clone();
        this.isMoving = true;
        
        // Calculate direction to target
        this.moveDirection.subVectors(this.targetPosition, this.position).normalize();
        
        // Set rotation to face movement direction
        const angle = Math.atan2(this.moveDirection.x, this.moveDirection.z);
        this.rotation.y = angle;
        this.model.rotation.y = angle;
        
        // Play movement animation if available
        this.playAnimation('walk');
        
        Logger.log(`Hero ${this.name} moving to ${targetPosition.x.toFixed(2)}, ${targetPosition.z.toFixed(2)}`);
    }
    
    moveInDirection(direction) {
        // Normalize direction
        const normalizedDirection = direction.clone().normalize();
        
        // Set movement direction
        this.moveDirection.copy(normalizedDirection);
        this.isMoving = true;
        
        // Set rotation to face movement direction
        const angle = Math.atan2(this.moveDirection.x, this.moveDirection.z);
        this.rotation.y = angle;
        this.model.rotation.y = angle;
        
        // Clear target position when using directional movement
        this.targetPosition = null;
        
        // Play movement animation if available
        this.playAnimation('walk');
    }
    
    stopMovement() {
        this.isMoving = false;
        this.targetPosition = null;
        
        // Play idle animation if available
        this.playAnimation('idle');
        
        Logger.log(`Hero ${this.name} stopped moving`);
    }
    
    // Combat methods
    attack(target) {
        if (!target) return;
        
        this.currentTarget = target;
        this.isAttacking = true;
        
        // Face the target
        const direction = new THREE.Vector3().subVectors(target.position, this.position).normalize();
        const angle = Math.atan2(direction.x, direction.z);
        this.rotation.y = angle;
        this.model.rotation.y = angle;
        
        // Play attack animation if available
        this.playAnimation('attack');
        
        // Calculate damage
        const damage = this.calculateDamage();
        
        // Apply damage to target
        target.takeDamage(damage, this);
        
        // Set attack cooldown
        this.attackCooldown = 1 / this.stats.attackSpeed;
        
        // Emit attack event for UI
        Events.emit('abilityUsed', {
            abilityId: 'basic-attack',
            cooldownTime: this.attackCooldown
        });
        
        // Create attack effect
        if (window.game && window.game.combatSystem) {
            // Create a simple projectile or effect for the attack
            const attackType = this.getAttackType();
            window.game.combatSystem.createProjectile(
                this.position.clone().add(new THREE.Vector3(0, 1, 0)), // Start slightly above hero
                target.position.clone().add(new THREE.Vector3(0, 1, 0)), // Target slightly above enemy
                attackType,
                15, // Speed
                damage,
                this
            );
        }
        
        Logger.log(`Hero ${this.name} attacked ${target.name} for ${damage} damage`);
    }
    
    // Get attack type based on hero type
    getAttackType() {
        switch (this.type) {
            case 'axe':
                return 'melee'; // Red projectile
            case 'crystal-maiden':
                return 'ice'; // Ice projectile
            case 'lich':
                return 'ice'; // Ice projectile
            case 'storm-spirit':
                return 'lightning'; // Lightning projectile
            default:
                return 'melee';
        }
    }
    
    calculateDamage() {
        // Basic damage calculation
        const baseDamage = this.stats.attackDamage;
        const randomFactor = 0.8 + Math.random() * 0.4; // Random factor between 0.8 and 1.2
        return Math.floor(baseDamage * randomFactor);
    }
    
    takeDamage(amount, source) {
        // Reduce health by damage amount
        this.stats.health = Math.max(0, this.stats.health - amount);
        
        // Check if dead
        if (this.stats.health <= 0) {
            this.die();
        }
        
        // Emit damage taken event
        Events.emit('damageTaken', {
            target: this,
            amount: amount,
            source: source,
            remainingHealth: this.stats.health
        });
        
        Logger.log(`Hero ${this.name} took ${amount} damage from ${source ? source.name : 'unknown'}`);
    }
    
    die() {
        // Play death animation if available
        this.playAnimation('death');
        
        // Emit death event
        Events.emit('heroDeath', { hero: this });
        
        Logger.log(`Hero ${this.name} died`);
    }
    
    heal(amount) {
        // Increase health by heal amount, up to max health
        this.stats.health = Math.min(this.stats.maxHealth, this.stats.health + amount);
        
        // Emit heal event
        Events.emit('heroHealed', {
            hero: this,
            amount: amount,
            currentHealth: this.stats.health
        });
        
        Logger.log(`Hero ${this.name} healed for ${amount} health`);
    }
    
    useMana(amount) {
        if (this.stats.mana < amount) {
            return false; // Not enough mana
        }
        
        this.stats.mana -= amount;
        
        // Emit mana used event
        Events.emit('manaUsed', {
            hero: this,
            amount: amount,
            remainingMana: this.stats.mana
        });
        
        return true;
    }
    
    restoreMana(amount) {
        // Increase mana by restore amount, up to max mana
        this.stats.mana = Math.min(this.stats.maxMana, this.stats.mana + amount);
        
        // Emit mana restored event
        Events.emit('manaRestored', {
            hero: this,
            amount: amount,
            currentMana: this.stats.mana
        });
    }
    
    // Animation methods
    playAnimation(name) {
        if (!this.animations[name]) {
            // If we don't have the requested animation, do nothing
            return;
        }
        
        if (this.currentAnimation === name) {
            // Already playing this animation
            return;
        }
        
        // Stop current animation if any
        if (this.currentAnimation && this.animations[this.currentAnimation]) {
            this.animations[this.currentAnimation].stop();
        }
        
        // Play new animation
        this.animations[name].play();
        this.currentAnimation = name;
    }
    
    // Ability methods for Axe
    berserkersCall() {
        Logger.log(`${this.name} used Berserker's Call`);
        // Implementation would taunt nearby enemies and increase armor
        
        // Find all enemies within range
        const tauntRange = 5;
        const enemies = window.game.combatSystem.enemies.filter(enemy => 
            enemy.position.distanceTo(this.position) <= tauntRange
        );
        
        // Taunt them (make them target this hero)
        enemies.forEach(enemy => {
            enemy.currentTarget = this;
            enemy.moveTo(this.position);
        });
        
        // Visual effect
        this.createAOEEffect(this.position, tauntRange, 0xff0000, 1);
        
        // Increase armor temporarily
        const armorBonus = 10;
        this.stats.armor = (this.stats.armor || 0) + armorBonus;
        
        // Reset armor after duration
        setTimeout(() => {
            this.stats.armor = (this.stats.armor || 0) - armorBonus;
        }, 5000); // 5 seconds
        
        return true;
    }
    
    battleHunger() {
        Logger.log(`${this.name} used Battle Hunger`);
        // Implementation would apply a DoT to target
        
        // Find closest enemy
        const target = this.findClosestEnemy();
        if (!target) return false;
        
        // Apply damage over time effect
        const damagePerTick = 5;
        const duration = 10; // seconds
        const tickInterval = 1; // seconds
        
        // Visual effect - projectile to target
        window.game.combatSystem.createProjectile(
            this.position.clone().add(new THREE.Vector3(0, 1, 0)),
            target.position.clone().add(new THREE.Vector3(0, 1, 0)),
            'fire',
            10,
            damagePerTick,
            this
        );
        
        // Apply DoT effect
        const dotEffect = setInterval(() => {
            if (target.stats.health > 0) {
                target.takeDamage(damagePerTick, this);
            } else {
                clearInterval(dotEffect);
            }
        }, tickInterval * 1000);
        
        // Clear interval after duration
        setTimeout(() => {
            clearInterval(dotEffect);
        }, duration * 1000);
        
        return true;
    }
    
    counterHelix() {
        Logger.log(`${this.name} triggered Counter Helix`);
        // Implementation would deal damage to nearby enemies when attacked
        
        // Find all enemies within range
        const helixRange = 3;
        const enemies = window.game.combatSystem.enemies.filter(enemy => 
            enemy.position.distanceTo(this.position) <= helixRange
        );
        
        // Deal damage to each enemy
        const helixDamage = 15;
        enemies.forEach(enemy => {
            enemy.takeDamage(helixDamage, this);
        });
        
        // Visual effect
        this.createAOEEffect(this.position, helixRange, 0xff6600, 0.5);
        
        return true;
    }
    
    cullingBlade() {
        Logger.log(`${this.name} used Culling Blade`);
        // Implementation would execute low health targets
        
        // Find closest enemy
        const target = this.findClosestEnemy();
        if (!target) return false;
        
        // Check if target is below health threshold
        const executeThreshold = 30;
        const executeDamage = 250; // High damage to ensure kill
        const normalDamage = 50;
        
        // Visual effect - projectile to target
        window.game.combatSystem.createProjectile(
            this.position.clone().add(new THREE.Vector3(0, 1, 0)),
            target.position.clone().add(new THREE.Vector3(0, 1, 0)),
            'fire',
            15,
            target.stats.health <= executeThreshold ? executeDamage : normalDamage,
            this
        );
        
        // Apply damage
        if (target.stats.health <= executeThreshold) {
            // Execute
            target.takeDamage(executeDamage, this);
            Logger.log(`${this.name} executed ${target.name}!`);
            
            // Bonus effect on successful execute
            this.stats.movementSpeed += 2; // Temporary speed boost
            setTimeout(() => {
                this.stats.movementSpeed -= 2;
            }, 5000); // 5 seconds
        } else {
            // Normal damage
            target.takeDamage(normalDamage, this);
        }
        
        return true;
    }
    
    warCry() {
        Logger.log(`${this.name} used War Cry`);
        // Implementation would buff allies and self
        
        // Buff self
        const speedBonus = 2;
        const damageBonus = 10;
        
        this.stats.movementSpeed += speedBonus;
        this.stats.attackDamage += damageBonus;
        
        // Visual effect
        this.createAOEEffect(this.position, 3, 0xffff00, 1);
        
        // Reset buffs after duration
        setTimeout(() => {
            this.stats.movementSpeed -= speedBonus;
            this.stats.attackDamage -= damageBonus;
        }, 8000); // 8 seconds
        
        return true;
    }
    
    berserkersRage() {
        Logger.log(`${this.name} used Berserker's Rage`);
        // Implementation would increase attack speed but decrease defense
        
        // Apply buffs/debuffs
        const attackSpeedBonus = 0.5;
        const armorPenalty = 5;
        
        this.stats.attackSpeed += attackSpeedBonus;
        this.stats.armor = Math.max(0, (this.stats.armor || 0) - armorPenalty);
        
        // Visual effect - red glow
        const geometry = new THREE.SphereGeometry(1.5, 16, 16);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0xff0000,
            transparent: true,
            opacity: 0.5
        });
        const effect = new THREE.Mesh(geometry, material);
        effect.position.copy(this.position);
        effect.position.y = 1;
        this.scene.add(effect);
        
        // Reset after duration
        setTimeout(() => {
            this.stats.attackSpeed -= attackSpeedBonus;
            this.stats.armor = (this.stats.armor || 0) + armorPenalty;
            this.scene.remove(effect);
            effect.geometry.dispose();
            effect.material.dispose();
        }, 10000); // 10 seconds
        
        return true;
    }
    
    taunt() {
        Logger.log(`${this.name} used Taunt`);
        // Implementation would taunt nearby enemies and increase threat
        
        // Visual effect - character animation
        if (this.model && this.animations['attack']) {
            this.playAnimation('attack');
        }
        
        // Find all enemies within range
        const tauntRange = 8;
        const enemies = window.game.combatSystem.enemies.filter(enemy => 
            enemy.position.distanceTo(this.position) <= tauntRange
        );
        
        // Taunt them (make them target this hero)
        enemies.forEach(enemy => {
            enemy.currentTarget = this;
            enemy.moveTo(this.position);
        });
        
        // Visual effect
        const geometry = new THREE.RingGeometry(0.5, 1.5, 32);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0xff3300,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(geometry, material);
        ring.rotation.x = -Math.PI / 2; // Make it horizontal
        ring.position.copy(this.position);
        ring.position.y = 0.1; // Slightly above ground
        this.scene.add(ring);
        
        // Animate the ring expanding
        const duration = 1.5; // seconds
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            if (elapsed < duration) {
                const scale = 1 + (elapsed * 3);
                ring.scale.set(scale, scale, scale);
                ring.material.opacity = 0.7 - (elapsed * 0.5);
                requestAnimationFrame(animate);
            } else {
                this.scene.remove(ring);
                ring.geometry.dispose();
                ring.material.dispose();
            }
        };
        
        animate();
        
        // Increase threat level (for AI targeting)
        this.stats.threatLevel = (this.stats.threatLevel || 1) * 2;
        
        // Reset threat level after duration
        setTimeout(() => {
            this.stats.threatLevel = (this.stats.threatLevel || 2) / 2;
        }, 5000); // 5 seconds
        
        return true;
    }
    
    // Ability methods for Crystal Maiden
    crystalNova() {
        Logger.log(`${this.name} used Crystal Nova`);
        // Implementation would deal AoE damage and slow
        
        // Get target position (in front of hero)
        const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(this.model.quaternion);
        const targetPosition = this.position.clone().add(direction.multiplyScalar(5));
        
        // Find enemies in AoE
        const novaRange = 6;
        const enemies = window.game.combatSystem.enemies.filter(enemy => 
            enemy.position.distanceTo(targetPosition) <= novaRange
        );
        
        // Deal damage and apply slow
        const novaDamage = 20;
        enemies.forEach(enemy => {
            enemy.takeDamage(novaDamage, this);
            
            // Apply slow
            const originalSpeed = enemy.stats.movementSpeed;
            enemy.stats.movementSpeed *= 0.5; // 50% slow
            
            // Reset speed after duration
            setTimeout(() => {
                enemy.stats.movementSpeed = originalSpeed;
            }, 4000); // 4 seconds
        });
        
        // Visual effect
        this.createAOEEffect(targetPosition, novaRange, 0x00ffff, 1);
        
        return true;
    }
    
    frostbite() {
        Logger.log(`${this.name} used Frostbite`);
        // Implementation would root a target and deal damage over time
        
        // Find closest enemy
        const target = this.findClosestEnemy();
        if (!target) return false;
        
        // Apply root and DoT
        const rootDuration = 3; // seconds
        const damagePerTick = 8;
        const tickInterval = 0.5; // seconds
        
        // Root target (prevent movement)
        const originalSpeed = target.stats.movementSpeed;
        target.stats.movementSpeed = 0;
        target.stopMovement();
        
        // Visual effect - projectile to target
        window.game.combatSystem.createProjectile(
            this.position.clone().add(new THREE.Vector3(0, 1, 0)),
            target.position.clone().add(new THREE.Vector3(0, 1, 0)),
            'ice',
            10,
            damagePerTick,
            this
        );
        
        // Apply DoT effect
        const dotEffect = setInterval(() => {
            if (target.stats.health > 0) {
                target.takeDamage(damagePerTick, this);
            } else {
                clearInterval(dotEffect);
            }
        }, tickInterval * 1000);
        
        // Reset movement after duration
        setTimeout(() => {
            target.stats.movementSpeed = originalSpeed;
            clearInterval(dotEffect);
        }, rootDuration * 1000);
        
        return true;
    }
    
    arcaneAura() {
        Logger.log(`${this.name} passive Arcane Aura active`);
        // Implementation would provide mana regeneration
        
        // This is a passive ability that constantly regenerates mana
        const manaRegenAmount = 2;
        
        // Apply mana regeneration
        this.restoreMana(manaRegenAmount);
        
        return true;
    }
    
    freezingField() {
        Logger.log(`${this.name} used Freezing Field`);
        // Implementation would channel an AoE damage ability
        
        // Channel for duration
        const channelDuration = 5; // seconds
        const tickInterval = 0.5; // seconds
        const fieldRange = 8;
        const damagePerTick = 10;
        
        // Visual effect - continuous AoE
        const effect = this.createAOEEffect(this.position, fieldRange, 0x00ffff, channelDuration);
        
        // Apply damage ticks
        const damageEffect = setInterval(() => {
            // Find enemies in range
            const enemies = window.game.combatSystem.enemies.filter(enemy => 
                enemy.position.distanceTo(this.position) <= fieldRange
            );
            
            // Deal damage
            enemies.forEach(enemy => {
                enemy.takeDamage(damagePerTick, this);
            });
        }, tickInterval * 1000);
        
        // End channel after duration
        setTimeout(() => {
            clearInterval(damageEffect);
        }, channelDuration * 1000);
        
        return true;
    }
    
    frostShield() {
        Logger.log(`${this.name} used Frost Shield`);
        // Implementation would create a protective shield
        
        // Apply shield effect
        const shieldAmount = 30;
        const shieldDuration = 8; // seconds
        
        // Create temporary shield health
        this.stats.shield = (this.stats.shield || 0) + shieldAmount;
        
        // Visual effect
        const geometry = new THREE.SphereGeometry(1.5, 16, 16);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x00ffff,
            transparent: true,
            opacity: 0.5
        });
        const shield = new THREE.Mesh(geometry, material);
        shield.position.copy(this.position);
        shield.position.y = 1;
        this.scene.add(shield);
        
        // Remove shield after duration
        setTimeout(() => {
            this.stats.shield = Math.max(0, (this.stats.shield || 0) - shieldAmount);
            this.scene.remove(shield);
            shield.geometry.dispose();
            shield.material.dispose();
        }, shieldDuration * 1000);
        
        return true;
    }
    
    icePath() {
        Logger.log(`${this.name} used Ice Path`);
        // Implementation would create a line of ice that stuns enemies
        
        // Get direction
        const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(this.model.quaternion);
        const pathLength = 10;
        const pathEnd = this.position.clone().add(direction.multiplyScalar(pathLength));
        
        // Create visual effect - line from hero to end point
        const points = [];
        points.push(this.position.clone());
        points.push(pathEnd);
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 5 });
        const line = new THREE.Line(geometry, material);
        line.position.y = 0.1; // Slightly above ground
        this.scene.add(line);
        
        // Find enemies in path
        const pathWidth = 2;
        const enemies = window.game.combatSystem.enemies.filter(enemy => {
            // Calculate distance from enemy to line
            const heroToEnemy = new THREE.Vector3().subVectors(enemy.position, this.position);
            const projection = heroToEnemy.dot(direction) / direction.length();
            
            // Check if enemy is within path length
            if (projection < 0 || projection > pathLength) return false;
            
            // Calculate perpendicular distance to line
            const projectedPoint = this.position.clone().add(direction.clone().normalize().multiplyScalar(projection));
            const distance = enemy.position.distanceTo(projectedPoint);
            
            return distance <= pathWidth;
        });
        
        // Apply stun to enemies
        const stunDuration = 2; // seconds
        const stunDamage = 15;
        
        enemies.forEach(enemy => {
            // Deal damage
            enemy.takeDamage(stunDamage, this);
            
            // Apply stun
            const originalSpeed = enemy.stats.movementSpeed;
            enemy.stats.movementSpeed = 0;
            enemy.stopMovement();
            
            // Reset after duration
            setTimeout(() => {
                enemy.stats.movementSpeed = originalSpeed;
            }, stunDuration * 1000);
        });
        
        // Remove line after duration
        setTimeout(() => {
            this.scene.remove(line);
            line.geometry.dispose();
            line.material.dispose();
        }, 2000); // 2 seconds
        
        return true;
    }
    
    // Ability methods for Lich
    frostNova() {
        Logger.log(`${this.name} used Frost Nova`);
        // Implementation would deal AoE damage and slow
        
        // Get target position (in front of hero)
        const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(this.model.quaternion);
        const targetPosition = this.position.clone().add(direction.multiplyScalar(5));
        
        // Find enemies in AoE
        const novaRange = 5;
        const enemies = window.game.combatSystem.enemies.filter(enemy => 
            enemy.position.distanceTo(targetPosition) <= novaRange
        );
        
        // Deal damage and apply slow
        const novaDamage = 25;
        enemies.forEach(enemy => {
            enemy.takeDamage(novaDamage, this);
            
            // Apply slow
            const originalSpeed = enemy.stats.movementSpeed;
            enemy.stats.movementSpeed *= 0.6; // 40% slow
            
            // Reset speed after duration
            setTimeout(() => {
                enemy.stats.movementSpeed = originalSpeed;
            }, 3000); // 3 seconds
        });
        
        // Visual effect
        this.createAOEEffect(targetPosition, novaRange, 0x0000ff, 1);
        
        return true;
    }
    
    frostArmor() {
        Logger.log(`${this.name} used Frost Armor`);
        // Implementation would increase armor and slow attackers
        
        // Apply armor buff
        const armorBonus = 15;
        const duration = 10; // seconds
        
        this.stats.armor = (this.stats.armor || 0) + armorBonus;
        
        // Visual effect
        const geometry = new THREE.SphereGeometry(1.5, 16, 16);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x0088ff,
            transparent: true,
            opacity: 0.5
        });
        const effect = new THREE.Mesh(geometry, material);
        effect.position.copy(this.position);
        effect.position.y = 1;
        this.scene.add(effect);
        
        // Reset after duration
        setTimeout(() => {
            this.stats.armor = Math.max(0, (this.stats.armor || 0) - armorBonus);
            this.scene.remove(effect);
            effect.geometry.dispose();
            effect.material.dispose();
        }, duration * 1000);
        
        return true;
    }
    
    darkRitual() {
        Logger.log(`${this.name} used Dark Ritual`);
        // Implementation would sacrifice a unit to gain mana
        
        // Since we don't have allied units to sacrifice, just restore mana
        const manaRestored = 50;
        this.restoreMana(manaRestored);
        
        // Visual effect
        const geometry = new THREE.SphereGeometry(1, 16, 16);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x0000ff,
            transparent: true,
            opacity: 0.7
        });
        const effect = new THREE.Mesh(geometry, material);
        effect.position.copy(this.position);
        effect.position.y = 1;
        this.scene.add(effect);
        
        // Animation
        const duration = 1; // seconds
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            if (elapsed < duration) {
                effect.scale.set(1 + elapsed, 1 + elapsed, 1 + elapsed);
                effect.material.opacity = 0.7 - (elapsed * 0.7);
                requestAnimationFrame(animate);
            } else {
                this.scene.remove(effect);
                effect.geometry.dispose();
                effect.material.dispose();
            }
        };
        
        animate();
        
        return true;
    }
    
    chainFrost() {
        Logger.log(`${this.name} used Chain Frost`);
        // Implementation would fire a bouncing projectile
        
        // Find closest enemy
        const target = this.findClosestEnemy();
        if (!target) return false;
        
        // Chain frost parameters
        const damage = 40;
        const bounces = 4;
        const bounceRange = 8;
        
        // Function to create a bounce
        const createBounce = (from, to, bouncesLeft) => {
            // Create projectile
            const projectile = window.game.combatSystem.createProjectile(
                from.clone().add(new THREE.Vector3(0, 1, 0)),
                to.position.clone().add(new THREE.Vector3(0, 1, 0)),
                'ice',
                15,
                damage,
                this
            );
            
            // When projectile hits
            setTimeout(() => {
                // Deal damage
                to.takeDamage(damage, this);
                
                // Find next target if bounces remain
                if (bouncesLeft > 0) {
                    // Get all enemies in range except the current target
                    const nextTargets = window.game.combatSystem.enemies.filter(enemy => 
                        enemy !== to && 
                        enemy.stats.health > 0 && 
                        enemy.position.distanceTo(to.position) <= bounceRange
                    );
                    
                    // If there's a valid next target, bounce to it
                    if (nextTargets.length > 0) {
                        // Sort by distance and pick closest
                        nextTargets.sort((a, b) => 
                            a.position.distanceTo(to.position) - b.position.distanceTo(to.position)
                        );
                        
                        const nextTarget = nextTargets[0];
                        createBounce(to.position, nextTarget, bouncesLeft - 1);
                    }
                }
            }, 500); // Time for projectile to reach target
        };
        
        // Start the chain
        createBounce(this.position, target, bounces);
        
        return true;
    }
    
    iceBlast() {
        Logger.log(`${this.name} used Ice Blast`);
        // Implementation would fire a large ice projectile
        
        // Get target position (in front of hero)
        const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(this.model.quaternion);
        const targetPosition = this.position.clone().add(direction.multiplyScalar(10));
        
        // Create projectile
        const projectile = window.game.combatSystem.createProjectile(
            this.position.clone().add(new THREE.Vector3(0, 1, 0)),
            targetPosition.clone().add(new THREE.Vector3(0, 1, 0)),
            'ice',
            12,
            0, // No direct damage from projectile
            this
        );
        
        // When projectile reaches target position, explode
        setTimeout(() => {
            // Find enemies in blast radius
            const blastRadius = 7;
            const enemies = window.game.combatSystem.enemies.filter(enemy => 
                enemy.position.distanceTo(targetPosition) <= blastRadius
            );
            
            // Deal damage
            const blastDamage = 35;
            enemies.forEach(enemy => {
                enemy.takeDamage(blastDamage, this);
                
                // Apply slow
                const originalSpeed = enemy.stats.movementSpeed;
                enemy.stats.movementSpeed *= 0.5; // 50% slow
                
                // Reset speed after duration
                setTimeout(() => {
                    enemy.stats.movementSpeed = originalSpeed;
                }, 4000); // 4 seconds
            });
            
            // Visual effect
            this.createAOEEffect(targetPosition, blastRadius, 0x00ffff, 1);
        }, 800); // Time for projectile to reach target
        
        return true;
    }
    
    // Ability methods for Storm Spirit
    staticRemnant() {
        Logger.log(`${this.name} used Static Remnant`);
        // Implementation would create an explosive clone
        
        // Create remnant at current position
        const remnantDuration = 12; // seconds
        const remnantRadius = 3;
        const remnantDamage = 20;
        
        // Visual effect - create a clone
        const geometry = new THREE.SphereGeometry(0.8, 16, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const remnant = new THREE.Mesh(geometry, material);
        remnant.position.copy(this.position);
        remnant.position.y = 1;
        this.scene.add(remnant);
        
        // Check for enemies entering the remnant's radius
        const checkInterval = setInterval(() => {
            // Find enemies in range
            const enemies = window.game.combatSystem.enemies.filter(enemy => 
                enemy.position.distanceTo(remnant.position) <= remnantRadius && 
                enemy.stats.health > 0
            );
            
            if (enemies.length > 0) {
                // Explode the remnant
                enemies.forEach(enemy => {
                    enemy.takeDamage(remnantDamage, this);
                });
                
                // Visual effect
                this.createAOEEffect(remnant.position, remnantRadius, 0x00ff00, 0.5);
                
                // Remove remnant
                this.scene.remove(remnant);
                remnant.geometry.dispose();
                remnant.material.dispose();
                
                // Clear interval
                clearInterval(checkInterval);
            }
        }, 200); // Check every 200ms
        
        // Remove remnant after duration if not triggered
        setTimeout(() => {
            if (remnant.parent) {
                this.scene.remove(remnant);
                remnant.geometry.dispose();
                remnant.material.dispose();
                clearInterval(checkInterval);
            }
        }, remnantDuration * 1000);
        
        return true;
    }
    
    electricVortex() {
        Logger.log(`${this.name} used Electric Vortex`);
        // Implementation would pull enemies toward Storm Spirit
        
        // Find enemies in range
        const vortexRange = 8;
        const enemies = window.game.combatSystem.enemies.filter(enemy => 
            enemy.position.distanceTo(this.position) <= vortexRange
        );
        
        // Pull enemies toward hero
        const pullDuration = 2; // seconds
        const pullDamage = 15;
        
        enemies.forEach(enemy => {
            // Deal damage
            enemy.takeDamage(pullDamage, this);
            
            // Pull effect
            const startPosition = enemy.position.clone();
            const endPosition = this.position.clone().add(
                new THREE.Vector3().subVectors(enemy.position, this.position).normalize().multiplyScalar(2)
            );
            
            // Disable enemy movement during pull
            const originalSpeed = enemy.stats.movementSpeed;
            enemy.stats.movementSpeed = 0;
            enemy.stopMovement();
            
            // Animate pull
            const startTime = Date.now();
            
            const animatePull = () => {
                const elapsed = (Date.now() - startTime) / 1000;
                const progress = Math.min(elapsed / pullDuration, 1);
                
                // Interpolate position
                enemy.position.lerpVectors(startPosition, endPosition, progress);
                enemy.model.position.x = enemy.position.x;
                enemy.model.position.z = enemy.position.z;
                
                if (progress < 1) {
                    requestAnimationFrame(animatePull);
                } else {
                    // Restore movement
                    enemy.stats.movementSpeed = originalSpeed;
                }
            };
            
            animatePull();
        });
        
        // Visual effect
        this.createAOEEffect(this.position, vortexRange, 0x00ff00, 1);
        
        return true;
    }
    
    overload() {
        Logger.log(`${this.name} triggered Overload`);
        // Implementation would add bonus damage and slow after ability use
        
        // This is a passive that triggers after using other abilities
        // For simplicity, we'll just apply the effect directly
        
        // Apply bonus damage
        const damageBonus = 15;
        const duration = 5; // seconds
        
        this.stats.attackDamage += damageBonus;
        
        // Visual effect
        const geometry = new THREE.SphereGeometry(1.2, 16, 16);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x00ff00,
            transparent: true,
            opacity: 0.6
        });
        const effect = new THREE.Mesh(geometry, material);
        effect.position.copy(this.position);
        effect.position.y = 1;
        this.scene.add(effect);
        
        // Reset after duration
        setTimeout(() => {
            this.stats.attackDamage -= damageBonus;
            this.scene.remove(effect);
            effect.geometry.dispose();
            effect.material.dispose();
        }, duration * 1000);
        
        return true;
    }
    
    ballLightning() {
        Logger.log(`${this.name} used Ball Lightning`);
        // Implementation would allow rapid movement across the map
        
        // Get direction
        const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(this.model.quaternion);
        const distance = 15; // How far to travel
        const targetPosition = this.position.clone().add(direction.multiplyScalar(distance));
        
        // Check for valid position
        const validPosition = window.game.world.findValidPosition(targetPosition, 1);
        
        // Create trail effect
        const points = [];
        points.push(this.position.clone());
        points.push(validPosition);
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 3 });
        const trail = new THREE.Line(geometry, material);
        trail.position.y = 1; // At character height
        this.scene.add(trail);
        
        // Move hero to target position
        const startPosition = this.position.clone();
        const startTime = Date.now();
        const duration = 0.5; // seconds
        
        const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            const progress = Math.min(elapsed / duration, 1);
            
            // Interpolate position
            this.position.lerpVectors(startPosition, validPosition, progress);
            this.model.position.x = this.position.x;
            this.model.position.z = this.position.z;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Remove trail
                this.scene.remove(trail);
                trail.geometry.dispose();
                trail.material.dispose();
                
                // Damage enemies along the path
                const pathWidth = 2;
                const pathDamage = 25;
                
                window.game.combatSystem.enemies.forEach(enemy => {
                    // Calculate distance from enemy to line
                    const heroToEnemy = new THREE.Vector3().subVectors(enemy.position, startPosition);
                    const pathDirection = new THREE.Vector3().subVectors(validPosition, startPosition).normalize();
                    const projection = heroToEnemy.dot(pathDirection);
                    
                    // Check if enemy is within path length
                    if (projection < 0 || projection > distance) return;
                    
                    // Calculate perpendicular distance to line
                    const projectedPoint = startPosition.clone().add(pathDirection.clone().multiplyScalar(projection));
                    const perpDistance = enemy.position.distanceTo(projectedPoint);
                    
                    if (perpDistance <= pathWidth) {
                        enemy.takeDamage(pathDamage, this);
                    }
                });
                
                // Trigger Overload passive
                this.overload();
            }
        };
        
        animate();
        
        return true;
    }
    
    lightningBolt() {
        Logger.log(`${this.name} used Lightning Bolt`);
        // Implementation would fire a lightning bolt at a target
        
        // Find closest enemy
        const target = this.findClosestEnemy();
        if (!target) return false;
        
        // Create lightning bolt
        const boltDamage = 30;
        
        // Visual effect - projectile to target
        window.game.combatSystem.createProjectile(
            this.position.clone().add(new THREE.Vector3(0, 1, 0)),
            target.position.clone().add(new THREE.Vector3(0, 1, 0)),
            'lightning',
            20,
            boltDamage,
            this
        );
        
        // Apply mini-stun
        const stunDuration = 0.5; // seconds
        const originalSpeed = target.stats.movementSpeed;
        target.stats.movementSpeed = 0;
        target.stopMovement();
        
        // Reset after duration
        setTimeout(() => {
            target.stats.movementSpeed = originalSpeed;
        }, stunDuration * 1000);
        
        // Trigger Overload passive
        setTimeout(() => {
            this.overload();
        }, 100);
        
        return true;
    }
    
    energyField() {
        Logger.log(`${this.name} used Energy Field`);
        // Implementation would create an energy field that damages enemies
        
        // Create energy field
        const fieldRadius = 6;
        const fieldDuration = 6; // seconds
        const tickInterval = 0.5; // seconds
        const damagePerTick = 8;
        
        // Visual effect
        const geometry = new THREE.CircleGeometry(fieldRadius, 32);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x00ff00,
            transparent: true,
            opacity: 0.3
        });
        const field = new THREE.Mesh(geometry, material);
        field.rotation.x = -Math.PI / 2; // Make it horizontal
        field.position.copy(this.position);
        field.position.y = 0.1; // Slightly above ground
        this.scene.add(field);
        
        // Apply damage over time
        const damageInterval = setInterval(() => {
            // Find enemies in field
            const enemies = window.game.combatSystem.enemies.filter(enemy => 
                enemy.position.distanceTo(this.position) <= fieldRadius
            );
            
            // Deal damage
            enemies.forEach(enemy => {
                enemy.takeDamage(damagePerTick, this);
            });
            
            // Pulse effect
            const pulse = this.createAOEEffect(this.position, fieldRadius, 0x00ff00, 0.3);
        }, tickInterval * 1000);
        
        // Remove field after duration
        setTimeout(() => {
            clearInterval(damageInterval);
            this.scene.remove(field);
            field.geometry.dispose();
            field.material.dispose();
        }, fieldDuration * 1000);
        
        // Trigger Overload passive
        this.overload();
        
        return true;
    }
    
    // Helper method to find closest enemy
    findClosestEnemy() {
        if (!window.game || !window.game.combatSystem) return null;
        
        const enemies = window.game.combatSystem.enemies.filter(enemy => enemy.stats.health > 0);
        if (enemies.length === 0) return null;
        
        // Sort by distance
        enemies.sort((a, b) => 
            a.position.distanceTo(this.position) - b.position.distanceTo(this.position)
        );
        
        return enemies[0];
    }
    
    // Helper method to create AoE visual effect
    createAOEEffect(position, radius, color, duration) {
        const geometry = new THREE.CircleGeometry(radius, 32);
        const material = new THREE.MeshBasicMaterial({ 
            color: color,
            transparent: true,
            opacity: 0.5
        });
        const effect = new THREE.Mesh(geometry, material);
        effect.rotation.x = -Math.PI / 2; // Make it horizontal
        effect.position.copy(position);
        effect.position.y = 0.1; // Slightly above ground
        this.scene.add(effect);
        
        // Remove after duration
        setTimeout(() => {
            this.scene.remove(effect);
            effect.geometry.dispose();
            effect.material.dispose();
        }, duration * 1000);
        
        return effect;
    }
    
    // Use ability by number key (1-6)
    useAbility(key) {
        const ability = this.abilities[key];
        
        if (!ability) {
            Logger.log(`No ability assigned to key ${key}`);
            return false;
        }
        
        if (ability.cooldown > 0) {
            Logger.log(`${ability.name} is on cooldown: ${ability.cooldown.toFixed(1)}s remaining`);
            return false;
        }
        
        // Check if enough mana
        if (this.stats.mana < ability.manaCost) {
            Logger.log(`Not enough mana to cast ${ability.name}`);
            return false;
        }
        
        // Use mana
        this.stats.mana -= ability.manaCost;
        
        // Emit mana used event
        Events.emit('manaUsed', { hero: this, amount: ability.manaCost });
        
        // Execute ability function and set cooldown internally
        const result = ability.use();
        
        // Show skill name shout out
        this.showSkillShoutOut(ability.name);
        
        return result;
    }
    
    // Show a visual shout out when a skill is cast
    showSkillShoutOut(skillName) {
        try {
            // Check if font is available
            if (window.game && window.game.assets && window.game.assets.fonts && window.game.assets.fonts['default']) {
                // Create a 3D text above the hero
                const textGeometry = new THREE.TextGeometry(skillName, {
                    font: window.game.assets.fonts['default'],
                    size: 0.5,
                    height: 0.1,
                    curveSegments: 12,
                    bevelEnabled: false
                });
                
                // Center the text
                textGeometry.computeBoundingBox();
                const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
                textGeometry.translate(-textWidth / 2, 0, 0);
                
                // Create material and mesh
                const textMaterial = new THREE.MeshBasicMaterial({ 
                    color: this.getHeroColor(),
                    transparent: true
                });
                const textMesh = new THREE.Mesh(textGeometry, textMaterial);
                
                // Position above hero
                textMesh.position.copy(this.position);
                textMesh.position.y += 3; // Above the hero
                
                // Add to scene
                this.scene.add(textMesh);
                
                // Animate the text
                const startTime = Date.now();
                const duration = 1500; // 1.5 seconds
                
                const animate = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = elapsed / duration;
                    
                    if (progress < 1) {
                        // Move upward and fade out
                        textMesh.position.y += 0.01;
                        textMesh.material.opacity = 1 - progress;
                        
                        requestAnimationFrame(animate);
                    } else {
                        // Remove when animation is complete
                        this.scene.remove(textMesh);
                        textGeometry.dispose();
                        textMaterial.dispose();
                    }
                };
                
                animate();
            } else {
                // Fallback to 2D sprite text
                this.showSkillShoutOutSprite(skillName);
            }
        } catch (error) {
            console.error("Error creating 3D text:", error);
            // Fallback to 2D sprite text
            this.showSkillShoutOutSprite(skillName);
        }
        
        // Also show in UI for better visibility
        if (window.game && window.game.ui) {
            window.game.ui.showMessage(`${skillName}!`, 2000);
        }
    }
    
    // Fallback method using sprite instead of 3D text
    showSkillShoutOutSprite(skillName) {
        // Create a canvas for the text
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        
        // Draw background with hero color
        context.fillStyle = `#${this.getHeroColor().toString(16).padStart(6, '0')}`;
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw text
        context.fillStyle = 'white';
        context.font = 'bold 32px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(skillName, canvas.width / 2, canvas.height / 2);
        
        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);
        
        // Create sprite material
        const material = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true
        });
        
        // Create sprite
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(2, 0.5, 1);
        
        // Position above hero
        sprite.position.copy(this.position);
        sprite.position.y += 3; // Above the hero
        
        // Add to scene
        this.scene.add(sprite);
        
        // Animate the sprite
        const startTime = Date.now();
        const duration = 1500; // 1.5 seconds
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                // Move upward and fade out
                sprite.position.y += 0.01;
                sprite.material.opacity = 1 - progress;
                
                requestAnimationFrame(animate);
            } else {
                // Remove when animation is complete
                this.scene.remove(sprite);
                sprite.material.map.dispose();
                sprite.material.dispose();
            }
        };
        
        animate();
    }
    
    // Jump method
    jump() {
        // Get jump configuration
        const jumpConfig = window.configLoader?.getConfig('jumpConfig') || {
            initialVelocity: 10,
            gravity: 20,
            maxJumpCount: 2,
            multiJumpHeightIncrease: 1.5,
            maxJumpHeight: 15,
            holdJumpEnabled: true,
            holdJumpAcceleration: 5,
            holdJumpMaxVelocity: 15,
            holdJumpDecay: 0.8,
            jumpEffectColor: 0xffffff,
            doubleJumpEffectColor: 0x00ffff,
            holdJumpEffectColor: 0x66ccff,
            cameraFollowJump: true,
            cameraJumpOffset: 0.7,
            showWings: true,
            wingAppearThreshold: 5,
            wingOpenDuration: 0.8,
            flightTransitionThreshold: 5,
            flightTransitionEnabled: true
        };
        
        // Check if we can jump (either on ground or have double jump available)
        if (!this.isJumping || (this.isJumping && this.jumpCount < jumpConfig.maxJumpCount)) {
            // If already jumping, this is a multi-jump
            if (this.isJumping) {
                this.jumpCount++;
                
                // Increase jump velocity for consecutive jumps
                const multiplier = Math.min(
                    jumpConfig.multiJumpHeightIncrease * this.jumpCount,
                    jumpConfig.maxJumpHeight / jumpConfig.initialVelocity
                );
                this.jumpVelocity = jumpConfig.initialVelocity * multiplier;
                
                // Show multi-jump effect with different color
                this.createJumpEffect(jumpConfig.doubleJumpEffectColor);
            } else {
                this.jumpCount = 1;
                this.jumpVelocity = jumpConfig.initialVelocity;
                
                // Show regular jump effect
                this.createJumpEffect(jumpConfig.jumpEffectColor);
                
                // Hide wings if they were visible and we're starting a new jump
                if (this.wings && this.wings.visible) {
                    // Animate wings closing
                    this.animateWingOpenTransition(this.wingOpenState, 0, jumpConfig.wingOpenDuration);
                    
                    // Hide wings after animation completes
                    setTimeout(() => {
                        this.wings.visible = false;
                    }, jumpConfig.wingOpenDuration * 1000);
                }
            }
            
            // Set jump parameters
            this.isJumping = true;
            
            // Play jump animation if available
            this.playAnimation('jump');
            
            // Show message
            if (window.game && window.game.ui) {
                if (this.jumpCount > 1) {
                    window.game.ui.showMessage(`Jump #${this.jumpCount}!`);
                } else {
                    window.game.ui.showMessage("Jump!");
                }
            }
            
            // Notify camera to follow jump if configured
            if (jumpConfig.cameraFollowJump && window.game && window.game.camera) {
                window.game.camera.followJump(this, jumpConfig.cameraJumpOffset);
            }
            
            Logger.log(`Hero ${this.name} jumped (jump #${this.jumpCount}, velocity: ${this.jumpVelocity.toFixed(1)})`);
        }
    }
    
    // Start holding jump to increase height
    startHoldJump() {
        // Get jump configuration
        const jumpConfig = window.configLoader?.getConfig('jumpConfig') || {
            holdJumpEnabled: true,
            holdJumpAcceleration: 5,
            holdJumpMaxVelocity: 15,
            holdJumpEffectColor: 0x66ccff,
            showWings: true,
            wingAppearThreshold: 5,
            wingOpenDuration: 0.8,
            flightTransitionThreshold: 5,
            flightTransitionEnabled: true
        };
        
        // Only enable if hold jump is configured
        if (!jumpConfig.holdJumpEnabled) return;
        
        // Set holding jump state
        this.isHoldingJump = true;
        
        // Create hold jump effect
        this.createJumpEffect(jumpConfig.holdJumpEffectColor);
        
        // Show message
        if (window.game && window.game.ui) {
            window.game.ui.showMessage("Holding Jump!");
        }
        
        // Check if we need to show wings based on current height
        if (jumpConfig.showWings && this.jumpHeight >= jumpConfig.wingAppearThreshold) {
            if (!this.wings.visible) {
                // Show wings with opening animation
                this.wings.visible = true;
                this.wingOpenState = 0; // Start from closed position
                
                // Animate wings opening
                this.animateWingOpenTransition(0, 1, jumpConfig.wingOpenDuration);
                
                // Emit event for UI
                Events.emit('wingsVisibilityChanged', { visible: true });
                
                Logger.log(`Wings appeared at height ${this.jumpHeight.toFixed(1)}`);
            }
        }
        
        Logger.log(`Hero ${this.name} started holding jump`);
    }
    
    // Stop holding jump
    stopHoldJump() {
        // Get jump configuration
        const jumpConfig = window.configLoader?.getConfig('jumpConfig') || {
            holdJumpDecay: 0.8,
            showWings: true,
            wingAppearThreshold: 5,
            wingOpenDuration: 0.8
        };
        
        // Set holding jump state
        this.isHoldingJump = false;
        
        // Apply decay to velocity to create a natural arc
        if (this.isJumping && this.jumpVelocity > 0) {
            this.jumpVelocity *= jumpConfig.holdJumpDecay;
        }
        
        // If we're below the wing threshold and wings are visible, animate them closing
        if (jumpConfig.showWings && this.wings && this.wings.visible && this.jumpHeight < jumpConfig.wingAppearThreshold) {
            // Animate wings closing
            this.animateWingOpenTransition(this.wingOpenState, 0, jumpConfig.wingOpenDuration);
            
            // Hide wings after animation completes
            setTimeout(() => {
                if (this.jumpHeight < jumpConfig.wingAppearThreshold && !this.isFlying) {
                    this.wings.visible = false;
                    
                    // Emit event for UI
                    Events.emit('wingsVisibilityChanged', { visible: false });
                    
                    Logger.log(`Wings disappeared at height ${this.jumpHeight.toFixed(1)}`);
                }
            }, jumpConfig.wingOpenDuration * 1000);
        }
        
        Logger.log(`Hero ${this.name} stopped holding jump`);
    }
    
    // Flight jump - small jump while flying
    flightJump() {
        // Get jump configuration
        const jumpConfig = window.configLoader?.getConfig('jumpConfig') || {
            flightJumpVelocity: 3,
            flightJumpGravity: 10,
            flightJumpHeightIncrease: 0.5
        };
        
        // Create a small upward boost
        const startHeight = this.flightHeight;
        const startTime = performance.now();
        const jumpDuration = 500; // 0.5 seconds
        
        // Create jump effect
        this.createJumpEffect(0x66ccff);
        
        // Play jump animation if available
        this.playAnimation('jump');
        
        // Show message
        if (window.game && window.game.ui) {
            window.game.ui.showMessage("Boost!");
        }
        
        // Animate the flight jump
        const animate = (time) => {
            const elapsed = time - startTime;
            const progress = Math.min(1, elapsed / jumpDuration);
            
            if (progress < 1) {
                // Parabolic jump curve
                const jumpCurve = Math.sin(progress * Math.PI);
                const heightIncrease = jumpConfig.flightJumpHeightIncrease * jumpCurve;
                
                // Apply height increase
                this.flightTargetHeight = startHeight + heightIncrease;
                
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
        Logger.log(`Hero ${this.name} performed flight jump`);
    }
    
    // Create visual effect for jumping
    createJumpEffect(color) {
        // Create a ring effect at the hero's feet
        const geometry = new THREE.RingGeometry(0.5, 1, 32);
        const material = new THREE.MeshBasicMaterial({ 
            color: color,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
        });
        
        const ring = new THREE.Mesh(geometry, material);
        ring.rotation.x = Math.PI / 2; // Make it horizontal
        ring.position.copy(this.position);
        ring.position.y = 0.1; // Slightly above ground
        
        this.scene.add(ring);
        
        // Animate the ring expanding and fading
        const startTime = Date.now();
        const duration = 500; // 0.5 seconds
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                // Expand and fade
                ring.scale.set(1 + progress * 2, 1 + progress * 2, 1);
                ring.material.opacity = 0.7 * (1 - progress);
                
                requestAnimationFrame(animate);
            } else {
                // Remove when animation is complete
                this.scene.remove(ring);
                ring.geometry.dispose();
                ring.material.dispose();
            }
        };
        
        animate();
    }
    
    // Toggle flight mode
    toggleFlight() {
        // Get flight configuration
        const flightConfig = window.configLoader?.getConfig('flightConfig') || {
            initialHeight: 5,
            maxHeight: 20,
            minHeight: 1,
            heightChangeRate: {
                keyPress: 2,
                longPress: 1.5,
                mouseWheel: 1
            },
            cameraFollowFlight: true,
            cameraFlightOffset: 0.8,
            mouseLookSensitivity: 0.5,
            upwardEffectColor: 0x00ffff,
            downwardEffectColor: 0xff9900,
            wingEffectColor: 0x66ccff,
            showWings: true,
            wingSize: 2,
            wingFlapSpeed: 0.5
        };
        
        if (this.isFlying) {
            // Land
            this.isFlying = false;
            this.flightTargetHeight = 0;
            this.stopLongPress(); // Stop any ongoing long press
            
            // Play landing animation if available
            this.playAnimation('land');
            
            // Create landing effect
            this.createFlightEffect(flightConfig.downwardEffectColor, 'landing');
            
            // Show message
            if (window.game && window.game.ui) {
                window.game.ui.showMessage("Landing...");
            }
            
            // Play landing sound if configured
            if (flightConfig.landingSoundEffect) {
                const audio = new Audio(flightConfig.landingSoundEffect);
                audio.volume = 0.3;
                audio.play().catch(e => console.warn('Could not play landing sound:', e));
            }
            
            // Animate wings closing before hiding
            if (this.wings && this.wings.visible) {
                // Animate wings closing
                this.animateWingOpenTransition(this.wingOpenState, 0, flightConfig.wingOpenDuration);
                
                // Hide wings after animation completes
                setTimeout(() => {
                    this.wings.visible = false;
                    
                    // Clear any ongoing wing animations
                    if (this.wingFlapAnimationId) {
                        cancelAnimationFrame(this.wingFlapAnimationId);
                        this.wingFlapAnimationId = null;
                    }
                    
                    Logger.log(`Wings closed as hero landed`);
                }, flightConfig.wingOpenDuration * 1000);
            }
            
            // Update UI button
            if (window.game && window.game.ui && window.game.ui.flyAbility) {
                window.game.ui.flyAbility.textContent = "FLY";
            }
            
            // Emit flight state changed event for UI
            Events.emit('flightStateChanged', { isFlying: false });
            
            Logger.log(`Hero ${this.name} stopped flying`);
        } else {
            // Take off
            this.isFlying = true;
            this.isJumping = false; // Cancel any jump in progress
            this.flightTargetHeight = flightConfig.initialHeight; // Target height for flight
            
            // Play flight animation if available
            this.playAnimation('fly');
            
            // Create takeoff effect
            this.createFlightEffect(flightConfig.upwardEffectColor, 'takeoff');
            
            // Show message
            if (window.game && window.game.ui) {
                window.game.ui.showMessage("Taking Flight!");
            }
            
            // Play takeoff sound if configured
            if (flightConfig.takeoffSoundEffect) {
                const audio = new Audio(flightConfig.takeoffSoundEffect);
                audio.volume = 0.3;
                audio.play().catch(e => console.warn('Could not play takeoff sound:', e));
            }
            
            // Update UI button
            if (window.game && window.game.ui && window.game.ui.flyAbility) {
                window.game.ui.flyAbility.textContent = "FLY DOWN";
            }
            
            // Emit flight state changed event for UI
            Events.emit('flightStateChanged', { isFlying: true });
            
            Logger.log(`Hero ${this.name} started flying at height ${this.flightTargetHeight}`);
        }
    }
    
    // Fly higher (increase flight height)
    flyHigher() {
        if (!this.isFlying) return;
        
        // Get flight configuration
        const flightConfig = window.configLoader?.getConfig('flightConfig') || {
            maxHeight: 20,
            heightChangeRate: { keyPress: 2 },
            upwardEffectColor: 0x00ffff
        };
        
        // Increase target height up to a maximum
        const prevHeight = this.flightTargetHeight;
        this.flightTargetHeight = Math.min(
            flightConfig.maxHeight, 
            this.flightTargetHeight + flightConfig.heightChangeRate.keyPress
        );
        
        // Only create effect if height actually changed
        if (this.flightTargetHeight > prevHeight) {
            // Create a boost effect
            this.createFlightEffect(flightConfig.upwardEffectColor, 'ascend');
            
            // Show message for significant height changes
            if (this.flightTargetHeight >= flightConfig.maxHeight && window.game && window.game.ui) {
                window.game.ui.showMessage("Maximum altitude reached!");
            }
            
            Logger.log(`Hero ${this.name} flying higher: ${this.flightTargetHeight.toFixed(1)}`);
        }
    }
    
    // Fly lower (decrease flight height)
    flyLower() {
        if (!this.isFlying) return;
        
        // Get flight configuration
        const flightConfig = window.configLoader?.getConfig('flightConfig') || {
            minHeight: 1,
            heightChangeRate: { keyPress: 2 },
            downwardEffectColor: 0xff9900
        };
        
        // Decrease target height down to a minimum
        const prevHeight = this.flightTargetHeight;
        this.flightTargetHeight = Math.max(
            flightConfig.minHeight, 
            this.flightTargetHeight - flightConfig.heightChangeRate.keyPress
        );
        
        // Only create effect if height actually changed
        if (this.flightTargetHeight < prevHeight) {
            // Create a descent effect
            this.createFlightEffect(flightConfig.downwardEffectColor, 'descend');
            
            // Show message when close to ground
            if (this.flightTargetHeight <= flightConfig.minHeight && window.game && window.game.ui) {
                window.game.ui.showMessage("Minimum altitude reached!");
                
                // Update UI button
                if (window.game && window.game.ui && window.game.ui.flyAbility) {
                    window.game.ui.flyAbility.textContent = "LAND";
                }
            }
            
            Logger.log(`Hero ${this.name} flying lower: ${this.flightTargetHeight.toFixed(1)}`);
        }
    }
    
    // Start long press for continuous height change
    startLongPress(direction) {
        // Stop any existing long press
        this.stopLongPress();
        
        // Set direction (1 for up, -1 for down)
        this.longPressActive = true;
        this.longPressDirection = direction;
        
        // Get flight configuration
        const flightConfig = window.configLoader?.getConfig('flightConfig') || {
            heightChangeRate: { longPress: 1.5 }
        };
        const controlsConfig = window.configLoader?.getConfig('controlsConfig') || {
            touch: { longPressInterval: 100 }
        };
        
        // Start interval for continuous height change
        this.longPressInterval = setInterval(() => {
            if (this.longPressDirection > 0) {
                // Fly higher
                const prevHeight = this.flightTargetHeight;
                this.flyHigher();
                
                // Create continuous effect at intervals
                if (Math.floor(prevHeight) !== Math.floor(this.flightTargetHeight)) {
                    this.createFlightEffect(flightConfig.upwardEffectColor, 'continuous-ascend', 0.5);
                }
            } else {
                // Fly lower
                const prevHeight = this.flightTargetHeight;
                this.flyLower();
                
                // Create continuous effect at intervals
                if (Math.floor(prevHeight) !== Math.floor(this.flightTargetHeight)) {
                    this.createFlightEffect(flightConfig.downwardEffectColor, 'continuous-descend', 0.5);
                }
            }
        }, controlsConfig.touch.longPressInterval);
        
        Logger.log(`Hero ${this.name} started long press flight adjustment, direction: ${this.longPressDirection > 0 ? 'up' : 'down'}`);
    }
    
    // Stop long press
    stopLongPress() {
        if (this.longPressInterval) {
            clearInterval(this.longPressInterval);
            this.longPressInterval = null;
        }
        this.longPressActive = false;
    }
    
    // Create visual effect for flight changes
    createFlightEffect(color, type = 'default', scale = 1.0) {
        // Different effect based on type
        switch (type) {
            case 'takeoff':
                // Create a burst effect for takeoff
                this.createBurstEffect(color, 2.0 * scale);
                break;
                
            case 'landing':
                // Create a ring effect for landing
                this.createRingEffect(color, 2.0 * scale);
                break;
                
            case 'ascend':
                // Create upward particles
                this.createDirectionalParticles(color, 1.0 * scale, 'up');
                break;
                
            case 'descend':
                // Create downward particles
                this.createDirectionalParticles(color, 1.0 * scale, 'down');
                break;
                
            case 'continuous-ascend':
            case 'continuous-descend':
                // Smaller effect for continuous changes
                this.createDirectionalParticles(color, 0.5 * scale, 
                    type === 'continuous-ascend' ? 'up' : 'down');
                break;
                
            default:
                // Default simple effect
                this.createBurstEffect(color, 1.0 * scale);
        }
    }
    
    // Create burst effect (radial particles)
    createBurstEffect(color, scale = 1.0) {
        const particleCount = Math.floor(20 * scale);
        const particleSize = 0.1 * scale;
        const particleLifetime = 1000 * scale; // ms
        const particleSpeed = 0.05 * scale;
        
        // Create particles
        for (let i = 0; i < particleCount; i++) {
            // Create particle geometry and material
            const geometry = new THREE.SphereGeometry(particleSize, 8, 8);
            const material = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.8
            });
            
            // Create particle mesh
            const particle = new THREE.Mesh(geometry, material);
            
            // Position at hero's position
            particle.position.copy(this.position);
            particle.position.y = this.model.position.y;
            
            // Add to scene
            this.scene.add(particle);
            
            // Calculate direction (radial)
            const angle = (i / particleCount) * Math.PI * 2;
            const dirX = Math.cos(angle);
            const dirZ = Math.sin(angle);
            
            // Animate particle
            const startTime = performance.now();
            
            const animate = (time) => {
                const elapsed = time - startTime;
                const progress = Math.min(1, elapsed / particleLifetime);
                
                if (progress < 1) {
                    // Move outward
                    particle.position.x += dirX * particleSpeed;
                    particle.position.z += dirZ * particleSpeed;
                    
                    // Move upward with curve
                    particle.position.y += 0.02 * Math.sin(progress * Math.PI);
                    
                    // Fade out
                    particle.material.opacity = 0.8 * (1 - progress);
                    
                    requestAnimationFrame(animate);
                } else {
                    // Remove particle
                    this.scene.remove(particle);
                    particle.geometry.dispose();
                    particle.material.dispose();
                }
            };
            
            requestAnimationFrame(animate);
        }
    }
    
    // Create ring effect
    createRingEffect(color, scale = 1.0) {
        const ringCount = Math.floor(3 * scale);
        const ringSpacing = 0.2 * scale;
        const ringLifetime = 1000 * scale; // ms
        const ringExpansionRate = 0.05 * scale;
        
        // Create multiple expanding rings
        for (let i = 0; i < ringCount; i++) {
            // Delay each ring
            setTimeout(() => {
                // Create ring geometry and material
                const geometry = new THREE.RingGeometry(0.5, 0.6, 32);
                const material = new THREE.MeshBasicMaterial({
                    color: color,
                    transparent: true,
                    opacity: 0.7,
                    side: THREE.DoubleSide
                });
                
                // Create ring mesh
                const ring = new THREE.Mesh(geometry, material);
                
                // Position at hero's feet
                ring.position.copy(this.position);
                ring.position.y = 0.1;
                
                // Rotate to be horizontal
                ring.rotation.x = Math.PI / 2;
                
                // Add to scene
                this.scene.add(ring);
                
                // Animate ring
                const startTime = performance.now();
                
                const animate = (time) => {
                    const elapsed = time - startTime;
                    const progress = Math.min(1, elapsed / ringLifetime);
                    
                    if (progress < 1) {
                        // Expand ring
                        ring.scale.set(
                            1 + progress * 5 * ringExpansionRate,
                            1 + progress * 5 * ringExpansionRate,
                            1
                        );
                        
                        // Fade out
                        ring.material.opacity = 0.7 * (1 - progress);
                        
                        requestAnimationFrame(animate);
                    } else {
                        // Remove ring
                        this.scene.remove(ring);
                        ring.geometry.dispose();
                        ring.material.dispose();
                    }
                };
                
                requestAnimationFrame(animate);
            }, i * 200); // Stagger the rings
        }
    }
    
    // Create directional particles (up/down)
    createDirectionalParticles(color, scale = 1.0, direction = 'up') {
        const particleCount = Math.floor(10 * scale);
        const particleSize = 0.08 * scale;
        const particleLifetime = 800 * scale; // ms
        const particleSpeed = direction === 'up' ? 0.03 * scale : -0.03 * scale;
        
        // Create particles
        for (let i = 0; i < particleCount; i++) {
            // Create particle geometry and material
            const geometry = new THREE.SphereGeometry(particleSize, 8, 8);
            const material = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.7
            });
            
            // Create particle mesh
            const particle = new THREE.Mesh(geometry, material);
            
            // Position around hero
            const angle = (i / particleCount) * Math.PI * 2;
            const radius = 0.5 * scale;
            particle.position.set(
                this.position.x + Math.cos(angle) * radius,
                this.model.position.y,
                this.position.z + Math.sin(angle) * radius
            );
            
            // Add to scene
            this.scene.add(particle);
            
            // Animate particle
            const startTime = performance.now();
            
            const animate = (time) => {
                const elapsed = time - startTime;
                const progress = Math.min(1, elapsed / particleLifetime);
                
                if (progress < 1) {
                    // Move in direction
                    particle.position.y += particleSpeed;
                    
                    // Slight outward movement
                    particle.position.x += Math.cos(angle) * 0.01;
                    particle.position.z += Math.sin(angle) * 0.01;
                    
                    // Fade out
                    particle.material.opacity = 0.7 * (1 - progress);
                    
                    requestAnimationFrame(animate);
                } else {
                    // Remove particle
                    this.scene.remove(particle);
                    particle.geometry.dispose();
                    particle.material.dispose();
                }
            };
            
            requestAnimationFrame(animate);
        }
    }
    
    // Create visual effect for takeoff
    createTakeoffEffect() {
        // Create a spiral effect around the hero
        const points = [];
        const numPoints = 100;
        const radius = 1;
        const height = 3;
        
        for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * Math.PI * 6; // 3 full rotations
            const x = Math.cos(angle) * radius * (1 - i/numPoints);
            const y = (i / numPoints) * height;
            const z = Math.sin(angle) * radius * (1 - i/numPoints);
            
            points.push(new THREE.Vector3(x, y, z));
        }
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.PointsMaterial({ 
            color: 0x00ffff,
            size: 0.1,
            transparent: true,
            opacity: 0.8
        });
        
        const particles = new THREE.Points(geometry, material);
        particles.position.copy(this.position);
        
        this.scene.add(particles);
        
        // Animate the particles
        const startTime = Date.now();
        const duration = 1000; // 1 second
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                // Rotate and fade
                particles.rotation.y += 0.05;
                particles.material.opacity = 0.8 * (1 - progress);
                
                requestAnimationFrame(animate);
            } else {
                // Remove when animation is complete
                this.scene.remove(particles);
                particles.geometry.dispose();
                particles.material.dispose();
            }
        };
        
        animate();
    }
    
    // Update method called every frame
    update(deltaTime) {
        // Get jump configuration
        const jumpConfig = window.configLoader?.getConfig('jumpConfig') || {
            gravity: 20,
            holdJumpEnabled: true,
            holdJumpAcceleration: 5,
            holdJumpMaxVelocity: 15,
            showWings: true,
            wingAppearThreshold: 5,
            flightTransitionThreshold: 5,
            flightTransitionEnabled: true
        };
        
        // Get flight configuration
        const flightConfig = window.configLoader?.getConfig('flightConfig') || {
            initialHeight: 5,
            maxHeight: 20,
            minHeight: 1,
            heightChangeRate: {
                keyPress: 2,
                longPress: 1.5,
                mouseWheel: 1
            },
            showWings: true,
            wingSize: 2,
            wingFlapSpeed: 0.5,
            wingEffectColor: 0x66ccff,
            flightThreshold: 5,
            slowHeightChangeRate: 0.5
        };
        
        // Update jumping
        if (this.isJumping) {
            // If holding jump button, increase velocity up to a maximum
            if (this.isHoldingJump && jumpConfig.holdJumpEnabled) {
                // Check if we should transition to flight mode
                if (jumpConfig.flightTransitionEnabled && 
                    this.jumpHeight >= jumpConfig.flightTransitionThreshold && 
                    !this.isFlying) {
                    
                    // Transition to flight mode
                    this.isFlying = true;
                    this.isJumping = false;
                    this.flightTargetHeight = this.jumpHeight; // Start flight at current height
                    
                    // Play flight animation if available
                    this.playAnimation('fly');
                    
                    // Ensure wings are visible and fully open
                    if (this.wings) {
                        this.wings.visible = true;
                        this.animateWingOpenTransition(this.wingOpenState, 1, flightConfig.wingOpenDuration);
                    }
                    
                    // Emit flight state changed event for UI
                    Events.emit('flightStateChanged', { isFlying: true });
                    
                    // Show message
                    if (window.game && window.game.ui) {
                        window.game.ui.showMessage("Flying!");
                    }
                    
                    Logger.log(`Hero ${this.name} transitioned to flight mode at height ${this.jumpHeight.toFixed(1)}`);
                    
                    // Skip the rest of jump processing
                    return;
                }
                
                // Add upward acceleration when holding jump
                // If above threshold, use slower acceleration rate for "flying" effect
                let accelerationRate = jumpConfig.holdJumpAcceleration;
                let maxVelocity = jumpConfig.holdJumpMaxVelocity;
                
                // Check if we're above the slow flight threshold
                if (this.jumpHeight >= jumpConfig.slowFlightThreshold) {
                    // Use slow flight settings to create a "fighting gravity" effect
                    accelerationRate = jumpConfig.slowFlightAcceleration || 1.0;
                    maxVelocity = jumpConfig.slowFlightMaxVelocity || 5;
                    
                    // Log the transition to slow flight mode
                    if (!this.inSlowFlightMode) {
                        this.inSlowFlightMode = true;
                        Logger.log(`Entered slow flight mode at height ${this.jumpHeight.toFixed(1)}`);
                        
                        // Show a message to the player
                        if (window.game && window.game.ui) {
                            window.game.ui.showMessage("Slow Flight Mode");
                        }
                        
                        // Ensure wings are visible with a special transition effect
                        if (this.wings) {
                            // If wings aren't already visible, show them with an opening animation
                            if (!this.wings.visible) {
                                this.wings.visible = true;
                                this.wingOpenState = 0; // Start from closed position
                                
                                // Animate wings opening with a special effect
                                this.animateWingOpenTransition(0, 1, jumpConfig.wingOpenDuration);
                                this.createWingTransitionEffect(0x66ffff); // Special color for slow flight transition
                            } else {
                                // If wings are already visible, create a pulse effect to indicate mode change
                                this.createWingPulseEffect(0x66ffff);
                            }
                            
                            // Emit event for UI
                            Events.emit('slowFlightModeChanged', { active: true });
                        }
                    }
                } else if (this.inSlowFlightMode) {
                    // Reset slow flight mode when below threshold
                    this.inSlowFlightMode = false;
                    Logger.log(`Exited slow flight mode at height ${this.jumpHeight.toFixed(1)}`);
                }
                
                // Apply the appropriate acceleration and max velocity
                this.jumpVelocity = Math.min(
                    this.jumpVelocity + accelerationRate * deltaTime,
                    maxVelocity
                );
                
                // Create continuous effect for hold-jumping
                if (Math.random() < 0.1) { // Occasional effect for performance
                    this.createJumpEffect(jumpConfig.holdJumpEffectColor, 0.5);
                }
                
                // Show wings when holding jump and going up
                if (jumpConfig.showWings && this.jumpVelocity > 0) {
                    if (!this.showWings) {
                        this.showWings = true;
                        // Show 3D wings
                        if (this.wings) {
                            this.wings.visible = true;
                            this.animateWings('up', Math.min(1.0, this.jumpVelocity / jumpConfig.holdJumpMaxVelocity));
                        }
                        // Also emit event for UI wings (backward compatibility)
                        Events.emit('wingsVisibilityChanged', { 
                            visible: true,
                            direction: 'up',
                            intensity: Math.min(1.0, this.jumpVelocity / jumpConfig.holdJumpMaxVelocity)
                        });
                    }
                }
            } else {
                // Apply gravity to jump velocity when not holding jump
                this.jumpVelocity -= jumpConfig.gravity * deltaTime;
                
                // Update wing effect when falling
                if (this.showWings && this.jumpVelocity < 0) {
                    // Animate 3D wings
                    if (this.wings && this.wings.visible) {
                        this.animateWings('down', Math.min(1.0, Math.abs(this.jumpVelocity) / jumpConfig.holdJumpMaxVelocity));
                    }
                    // Also emit event for UI wings (backward compatibility)
                    Events.emit('wingsVisibilityChanged', { 
                        visible: true,
                        direction: 'down',
                        intensity: Math.min(1.0, Math.abs(this.jumpVelocity) / jumpConfig.holdJumpMaxVelocity)
                    });
                }
            }
            
            // Update jump height
            this.jumpHeight += this.jumpVelocity * deltaTime;
            
            // Update camera to follow jump height
            if (jumpConfig.cameraFollowJump && window.game && window.game.camera) {
                window.game.camera.followJump(this, jumpConfig.cameraJumpOffset);
            }
            
            // Check if landed
            if (this.jumpHeight <= 0) {
                this.jumpHeight = 0;
                this.isJumping = false;
                this.jumpVelocity = 0;
                this.isHoldingJump = false;
                
                // Reset jump count when landing
                this.jumpCount = 0;
                
                // Play landing animation if available
                this.playAnimation('land');
                setTimeout(() => this.playAnimation('idle'), 300);
                
                // Hide wings if they were showing
                if (this.showWings) {
                    this.showWings = false;
                    
                    // Animate wings closing before hiding
                    if (this.wings && this.wings.visible) {
                        // Get wing configuration
                        const flightConfig = window.configLoader?.getConfig('flightConfig') || {
                            wingOpenDuration: 0.8,
                            wingEffectColor: 0x66ccff
                        };
                        
                        // Create a special wing closing effect when landing
                        this.createWingClosingEffect(flightConfig.wingEffectColor);
                        
                        // Animate wings closing
                        this.animateWingOpenTransition(this.wingOpenState, 0, flightConfig.wingOpenDuration / 2);
                        
                        // Play a sound effect for wing closing
                        if (window.game && window.game.audio) {
                            window.game.audio.playSound('wingClose', 0.3);
                        }
                        
                        // Hide wings after animation completes
                        setTimeout(() => {
                            this.wings.visible = false;
                            
                            // Clear any ongoing wing animations
                            if (this.wingFlapAnimationId) {
                                cancelAnimationFrame(this.wingFlapAnimationId);
                                this.wingFlapAnimationId = null;
                            }
                            
                            Logger.log(`Wings closed as hero landed from jump`);
                        }, flightConfig.wingOpenDuration * 500); // Half the duration in milliseconds
                    }
                    
                    // Also emit event for UI wings (backward compatibility)
                    Events.emit('wingsVisibilityChanged', { 
                        visible: false,
                        action: 'landing'
                    });
                }
            }
            
            // Show/hide wings based on height
            if (jumpConfig.showWings) {
                const shouldShowWings = this.jumpHeight > jumpConfig.wingAppearThreshold;
                
                if (shouldShowWings !== this.showWings) {
                    this.showWings = shouldShowWings;
                    
                    // Update 3D wings visibility
                    if (this.wings) {
                        if (shouldShowWings) {
                            // Show and animate wings opening
                            const intensity = Math.min(1.0, Math.abs(this.jumpVelocity) / jumpConfig.holdJumpMaxVelocity);
                            this.animateWings(
                                this.jumpVelocity > 0 ? 'up' : 'down', 
                                intensity
                            );
                        } else {
                            // Animate wings closing before hiding
                            const flightConfig = window.configLoader?.getConfig('flightConfig') || {
                                wingOpenDuration: 0.8
                            };
                            
                            // Animate wings closing
                            this.animateWingOpenTransition(this.wingOpenState, 0, flightConfig.wingOpenDuration / 2);
                            
                            // Hide wings after animation completes
                            setTimeout(() => {
                                this.wings.visible = false;
                                
                                // Clear any ongoing wing animations
                                if (this.wingFlapAnimationId) {
                                    cancelAnimationFrame(this.wingFlapAnimationId);
                                    this.wingFlapAnimationId = null;
                                }
                            }, flightConfig.wingOpenDuration * 500); // Half the duration in milliseconds
                        }
                    }
                    
                    // Also emit event for UI wings (backward compatibility)
                    Events.emit('wingsVisibilityChanged', { 
                        visible: shouldShowWings,
                        direction: this.jumpVelocity > 0 ? 'up' : 'down',
                        intensity: Math.min(1.0, Math.abs(this.jumpVelocity) / jumpConfig.holdJumpMaxVelocity)
                    });
                } else if (shouldShowWings && this.wings && this.wings.visible) {
                    // Update wing animation if already visible
                    const intensity = Math.min(1.0, Math.abs(this.jumpVelocity) / jumpConfig.holdJumpMaxVelocity);
                    if (intensity > 0.1) { // Only update for significant movement
                        this.animateWings(
                            this.jumpVelocity > 0 ? 'up' : 'down', 
                            intensity
                        );
                    }
                }
            }
            
            // Update model height
            if (this.model) {
                this.model.position.y = this.jumpHeight + this.model.geometry.parameters.height / 2;
            }
        }
        
        // Update flight
        if (this.isFlying) {
            // Smoothly move towards target flight height
            const currentHeight = this.model.position.y - this.model.geometry.parameters.height / 2;
            const heightDifference = this.flightTargetHeight - currentHeight;
            
            // Apply smooth movement towards target height
            if (Math.abs(heightDifference) > 0.01) {
                // Use slow height change rate when above threshold
                let heightChangeMultiplier = 5;
                if (currentHeight >= flightConfig.flightThreshold) {
                    heightChangeMultiplier = flightConfig.slowHeightChangeRate * 5;
                }
                
                const heightStep = Math.sign(heightDifference) * Math.min(Math.abs(heightDifference), heightChangeMultiplier * deltaTime);
                const newHeight = currentHeight + heightStep;
                
                // Update model height
                if (this.model) {
                    this.model.position.y = newHeight + this.model.geometry.parameters.height / 2;
                }
                
                // Update camera to follow flight height
                if (flightConfig.cameraFollowFlight && window.game && window.game.camera) {
                    window.game.camera.followJump(this, flightConfig.cameraFlightOffset);
                }
                
                // Always ensure wings are visible during flight
                if (flightConfig.showWings) {
                    if (!this.showWings) {
                        this.showWings = true;
                    }
                    
                    // Update 3D wings
                    if (this.wings) {
                        // Ensure wings are visible
                        if (!this.wings.visible) {
                            this.wings.visible = true;
                            this.wingOpenState = 0; // Start from closed position
                            
                            // Animate wings opening
                            this.animateWingOpenTransition(0, 1, flightConfig.wingOpenDuration);
                        }
                        
                        // Calculate flap intensity based on height change
                        const baseIntensity = flightConfig.wingFlapIntensity || 0.3;
                        const movementIntensity = Math.min(1.0, Math.abs(heightStep) / (heightChangeMultiplier * deltaTime));
                        const totalIntensity = baseIntensity + (movementIntensity * 0.7);
                        
                        // Animate wings with direction and intensity
                        this.animateWings(
                            heightStep > 0 ? 'up' : 'down',
                            totalIntensity
                        );
                    }
                    
                    // Update wing effect based on direction (UI wings)
                    Events.emit('wingsVisibilityChanged', { 
                        visible: true,
                        direction: heightStep > 0 ? 'up' : 'down',
                        intensity: Math.min(1.0, Math.abs(heightStep) / (heightChangeMultiplier * deltaTime))
                    });
                    
                    // Create occasional particle effect for wing flapping
                    if (Math.random() < 0.05) {
                        const effectColor = heightStep > 0 ? 
                            flightConfig.upwardEffectColor : 
                            flightConfig.downwardEffectColor;
                        this.createWingFlapEffect(effectColor, Math.abs(heightStep) / (heightChangeMultiplier * deltaTime));
                    }
                }
            } else {
                // Even when not changing height, keep wings visible and animate them slightly
                if (flightConfig.showWings && this.wings) {
                    // Ensure wings are visible
                    if (!this.wings.visible) {
                        this.wings.visible = true;
                        this.wingOpenState = 0; // Start from closed position
                        
                        // Animate wings opening
                        this.animateWingOpenTransition(0, 1, flightConfig.wingOpenDuration);
                    }
                    
                    // Animate wings with a gentle flapping motion
                    const baseIntensity = flightConfig.wingFlapIntensity || 0.3;
                    this.animateWings('hover', baseIntensity);
                    
                    // Create occasional particle effect for wing flapping
                    if (Math.random() < 0.02) {
                        this.createWingFlapEffect(flightConfig.wingEffectColor, baseIntensity);
                    }
                }
            }
        }
        
        // Update position if moving
        if (this.isMoving) {
            // Calculate movement distance this frame
            const moveDistance = this.stats.movementSpeed * deltaTime;
            
            if (this.targetPosition) {
                // Calculate distance to target
                const distanceToTarget = this.position.distanceTo(this.targetPosition);
                
                if (distanceToTarget <= moveDistance) {
                    // Reached target position
                    this.position.copy(this.targetPosition);
                    this.stopMovement();
                } else {
                    // Move towards target
                    const movement = this.moveDirection.clone().multiplyScalar(moveDistance);
                    this.position.add(movement);
                }
            } else {
                // Move in the current direction
                const movement = this.moveDirection.clone().multiplyScalar(moveDistance);
                this.position.add(movement);
            }
            
            // Update model position (x and z only, y is handled by jump/flight)
            this.model.position.x = this.position.x;
            this.model.position.z = this.position.z;
        }
        
        // Update attack cooldown
        if (this.attackCooldown > 0) {
            this.attackCooldown -= deltaTime;
            
            if (this.attackCooldown <= 0 && this.isAttacking && this.currentTarget) {
                // Ready to attack again
                this.attack(this.currentTarget);
            }
        }
        
        // Update animation mixer if available
        if (this.mixer) {
            this.mixer.update(deltaTime);
        }
        
        // Update abilities cooldowns
        for (const key in this.abilities) {
            if (this.abilities[key]) {
                this.abilities[key].update(deltaTime);
            }
        }
    }
    
    // Fly higher (increase flight height)
    flyHigher() {
        if (!this.isFlying) return;
        
        // Increase target height up to a maximum
        const maxHeight = 20;
        this.flightTargetHeight = Math.min(maxHeight, this.flightTargetHeight + 2);
        
        // Create a small boost effect
        this.createFlightBoostEffect(0x00ffff);
        
        // Show message for significant height changes
        if (this.flightTargetHeight >= maxHeight && window.game && window.game.ui) {
            window.game.ui.showMessage("Maximum altitude reached!");
        }
        
        Logger.log(`Hero ${this.name} flying higher: ${this.flightTargetHeight.toFixed(1)}`);
    }
    
    // Fly lower (decrease flight height)
    flyLower() {
        if (!this.isFlying) return;
        
        // Decrease target height down to a minimum
        const minHeight = 1;
        this.flightTargetHeight = Math.max(minHeight, this.flightTargetHeight - 2);
        
        // Create a small descent effect
        this.createFlightBoostEffect(0xff9900);
        
        // Show message when close to ground
        if (this.flightTargetHeight <= minHeight && window.game && window.game.ui) {
            window.game.ui.showMessage("Minimum altitude reached!");
        }
        
        Logger.log(`Hero ${this.name} flying lower: ${this.flightTargetHeight.toFixed(1)}`);
    }
    
    // Create visual effect for flight boost
    createFlightBoostEffect(color) {
        // Create a small particle burst effect
        const particles = [];
        const particleCount = 10;
        const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const particleMaterial = new THREE.MeshBasicMaterial({ color: color, transparent: true });
        
        for (let i = 0; i < particleCount; i++) {
            const particle = new THREE.Mesh(particleGeometry, particleMaterial.clone());
            
            // Position around the hero
            const angle = (i / particleCount) * Math.PI * 2;
            const radius = 0.5;
            particle.position.set(
                this.position.x + Math.cos(angle) * radius,
                this.model.position.y,
                this.position.z + Math.sin(angle) * radius
            );
            
            // Add to scene
            this.scene.add(particle);
            particles.push(particle);
            
            // Animate and remove after a short time
            const startTime = performance.now();
            const duration = 500 + Math.random() * 500; // 0.5-1s duration
            
            const animate = (time) => {
                const elapsed = time - startTime;
                const progress = Math.min(1, elapsed / duration);
                
                // Move outward and upward/downward
                const direction = color === 0x00ffff ? 1 : -1; // Up for blue, down for orange
                particle.position.y += direction * 0.05;
                particle.position.x += Math.cos(angle) * 0.02;
                particle.position.z += Math.sin(angle) * 0.02;
                
                // Fade out
                particle.material.opacity = 1 - progress;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    // Remove particle
                    this.scene.remove(particle);
                    particle.geometry.dispose();
                    particle.material.dispose();
                }
            };
            
            requestAnimationFrame(animate);
        }
    }
    
    // Clean up resources when hero is removed
    dispose() {
        if (this.model) {
            this.scene.remove(this.model);
            
            // Dispose of geometries and materials
            if (this.model.geometry) this.model.geometry.dispose();
            if (this.model.material) {
                if (Array.isArray(this.model.material)) {
                    this.model.material.forEach(material => material.dispose());
                } else {
                    this.model.material.dispose();
                }
            }
        }
        
        // Clean up animations
        this.animations = {};
        this.currentAnimation = null;
        
        Logger.log(`Hero ${this.name} disposed`);
    }
}

// Ability class
class Ability {
    constructor(name, key, manaCost, cooldown, effect, isPassive = false) {
        this.name = name;
        this.key = key;
        this.manaCost = manaCost;
        this.cooldownMax = cooldown;
        this.cooldown = 0;
        this.effect = effect;
        this.isPassive = isPassive;
        this.level = 1;
        this.maxLevel = 4;
    }
    
    use(target) {
        if (this.isPassive) {
            console.log(`${this.name} is a passive ability`);
            return false;
        }
        
        if (this.cooldown > 0) {
            console.log(`${this.name} is on cooldown: ${this.cooldown.toFixed(1)}s remaining`);
            return false;
        }
        
        // Execute ability effect
        const success = this.effect(target);
        
        if (success !== false) {
            // Set cooldown
            this.cooldown = this.cooldownMax;
            
            // Emit ability used event
            Events.emit('abilityUsed', {
                ability: this,
                target: target
            });
            
            return true;
        }
        
        return false;
    }
    
    levelUp() {
        if (this.level < this.maxLevel) {
            this.level++;
            
            // Emit ability level up event
            Events.emit('abilityLevelUp', {
                ability: this,
                level: this.level
            });
            
            return true;
        }
        
        return false;
    }
    
    update(deltaTime) {
        if (this.cooldown > 0) {
            this.cooldown = Math.max(0, this.cooldown - deltaTime);
            
            // Emit cooldown update event
            if (this.cooldown === 0) {
                Events.emit('abilityCooldownComplete', {
                    ability: this
                });
            }
        }
    }
    
    getCooldownPercent() {
        if (this.cooldownMax === 0) return 0;
        return this.cooldown / this.cooldownMax;
    }
}

// Hero Factory to create different hero types
class HeroFactory {
    static createHero(type, scene) {
        switch (type) {
            case 'axe':
                return new Hero('Axe', type, scene);
            case 'crystal-maiden':
                return new Hero('Crystal Maiden', type, scene);
            case 'lich':
                return new Hero('Lich', type, scene);
            case 'storm-spirit':
                return new Hero('Storm Spirit', type, scene);
            default:
                console.error(`Unknown hero type: ${type}`);
                return null;
        }
    }
}

// Make Hero class available globally
window.Hero = Hero;
window.HeroFactory = HeroFactory;