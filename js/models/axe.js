/**
 * Axe hero model in Ghibli style
 */

class AxeModel {
    constructor(scene) {
        this.scene = scene;
        this.model = new THREE.Group();
        this.animations = {};
        this.mixer = null;
    }

    async create() {
        // Create a group to hold all parts
        const hero = new THREE.Group();
        
        // Colors
        const skinColor = new THREE.Color(0xcc6644); // Reddish skin
        const armorColor = new THREE.Color(0x880000); // Dark red armor
        const metalColor = new THREE.Color(0xcccccc); // Silver metal
        const leatherColor = new THREE.Color(0x664422); // Brown leather
        
        // Head
        const head = new THREE.Mesh(
            new THREE.SphereGeometry(0.4, 16, 16),
            new THREE.MeshPhongMaterial({ color: skinColor })
        );
        head.position.y = 1.7;
        hero.add(head);
        
        // Helmet
        const helmet = new THREE.Mesh(
            new THREE.CylinderGeometry(0.45, 0.4, 0.3, 16, 1, true),
            new THREE.MeshPhongMaterial({ color: armorColor, metalness: 0.5 })
        );
        helmet.position.y = 1.75;
        hero.add(helmet);
        
        // Helmet crest
        const crest = new THREE.Mesh(
            new THREE.BoxGeometry(0.05, 0.3, 0.6),
            new THREE.MeshPhongMaterial({ color: armorColor, metalness: 0.5 })
        );
        crest.position.set(0, 2.0, 0);
        crest.rotation.x = Math.PI / 8; // Tilt slightly forward
        hero.add(crest);
        
        // Face
        // Eyes (angry expression)
        const eyeGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.15, 1.7, 0.35);
        leftEye.scale.set(1, 0.5, 1); // Squint
        hero.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.15, 1.7, 0.35);
        rightEye.scale.set(1, 0.5, 1); // Squint
        hero.add(rightEye);
        
        // Pupils
        const pupilGeometry = new THREE.SphereGeometry(0.04, 8, 8);
        const pupilMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
        
        const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        leftPupil.position.set(-0.15, 1.7, 0.42);
        hero.add(leftPupil);
        
        const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        rightPupil.position.set(0.15, 1.7, 0.42);
        hero.add(rightPupil);
        
        // Eyebrows (angry)
        const eyebrowGeometry = new THREE.BoxGeometry(0.2, 0.05, 0.05);
        const eyebrowMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
        
        const leftEyebrow = new THREE.Mesh(eyebrowGeometry, eyebrowMaterial);
        leftEyebrow.position.set(-0.15, 1.8, 0.35);
        leftEyebrow.rotation.z = 0.3; // Angry angle
        hero.add(leftEyebrow);
        
        const rightEyebrow = new THREE.Mesh(eyebrowGeometry, eyebrowMaterial);
        rightEyebrow.position.set(0.15, 1.8, 0.35);
        rightEyebrow.rotation.z = -0.3; // Angry angle
        hero.add(rightEyebrow);
        
        // Mouth (grimace)
        const mouth = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.05, 0.05),
            new THREE.MeshPhongMaterial({ color: 0x000000 })
        );
        mouth.position.set(0, 1.5, 0.35);
        hero.add(mouth);
        
        // Neck
        const neck = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.25, 0.2, 16),
            new THREE.MeshPhongMaterial({ color: skinColor })
        );
        neck.position.y = 1.4;
        hero.add(neck);
        
        // Torso (muscular)
        const torsoUpper = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.6, 0.4),
            new THREE.MeshPhongMaterial({ color: armorColor, metalness: 0.5 })
        );
        torsoUpper.position.y = 1.1;
        hero.add(torsoUpper);
        
        // Chest plate
        const chestPlate = new THREE.Mesh(
            new THREE.BoxGeometry(0.7, 0.5, 0.2),
            new THREE.MeshPhongMaterial({ color: metalColor, metalness: 0.8 })
        );
        chestPlate.position.set(0, 1.1, 0.3);
        hero.add(chestPlate);
        
        // Lower torso
        const torsoLower = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 0.4, 0.3),
            new THREE.MeshPhongMaterial({ color: armorColor, metalness: 0.5 })
        );
        torsoLower.position.y = 0.7;
        hero.add(torsoLower);
        
        // Belt
        const belt = new THREE.Mesh(
            new THREE.BoxGeometry(0.65, 0.1, 0.35),
            new THREE.MeshPhongMaterial({ color: leatherColor })
        );
        belt.position.y = 0.5;
        hero.add(belt);
        
        // Legs
        const legGeometry = new THREE.CylinderGeometry(0.15, 0.12, 0.5, 8);
        const legMaterial = new THREE.MeshPhongMaterial({ color: armorColor });
        
        // Left leg
        const leftLeg = new THREE.Group();
        const leftLegUpper = new THREE.Mesh(legGeometry, legMaterial);
        leftLegUpper.position.y = -0.25;
        leftLeg.add(leftLegUpper);
        
        // Left boot
        const leftBoot = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.15, 0.3),
            new THREE.MeshPhongMaterial({ color: leatherColor })
        );
        leftBoot.position.set(0, -0.5, 0.05);
        leftLeg.add(leftBoot);
        
        leftLeg.position.set(-0.2, 0.25, 0);
        hero.add(leftLeg);
        
        // Right leg
        const rightLeg = new THREE.Group();
        const rightLegUpper = new THREE.Mesh(legGeometry, legMaterial);
        rightLegUpper.position.y = -0.25;
        rightLeg.add(rightLegUpper);
        
        // Right boot
        const rightBoot = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.15, 0.3),
            new THREE.MeshPhongMaterial({ color: leatherColor })
        );
        rightBoot.position.set(0, -0.5, 0.05);
        rightLeg.add(rightBoot);
        
        rightLeg.position.set(0.2, 0.25, 0);
        hero.add(rightLeg);
        
        // Arms
        const armGeometry = new THREE.CylinderGeometry(0.15, 0.12, 0.6, 8);
        const armMaterial = new THREE.MeshPhongMaterial({ color: skinColor });
        
        // Left arm
        const leftArm = new THREE.Group();
        const leftArmUpper = new THREE.Mesh(armGeometry, armMaterial);
        leftArmUpper.position.y = -0.3;
        leftArm.add(leftArmUpper);
        
        // Left shoulder pad
        const leftShoulder = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 8, 8, 0, Math.PI),
            new THREE.MeshPhongMaterial({ color: armorColor, metalness: 0.5 })
        );
        leftShoulder.rotation.x = -Math.PI / 2;
        leftShoulder.position.y = 0;
        leftArm.add(leftShoulder);
        
        // Left hand
        const leftHand = new THREE.Mesh(
            new THREE.BoxGeometry(0.15, 0.15, 0.15),
            new THREE.MeshPhongMaterial({ color: skinColor })
        );
        leftHand.position.y = -0.6;
        leftArm.add(leftHand);
        
        leftArm.position.set(-0.5, 1.1, 0);
        leftArm.rotation.z = 0.3;
        hero.add(leftArm);
        
        // Right arm
        const rightArm = new THREE.Group();
        const rightArmUpper = new THREE.Mesh(armGeometry, armMaterial);
        rightArmUpper.position.y = -0.3;
        rightArm.add(rightArmUpper);
        
        // Right shoulder pad
        const rightShoulder = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 8, 8, 0, Math.PI),
            new THREE.MeshPhongMaterial({ color: armorColor, metalness: 0.5 })
        );
        rightShoulder.rotation.x = -Math.PI / 2;
        rightShoulder.position.y = 0;
        rightArm.add(rightShoulder);
        
        // Right hand
        const rightHand = new THREE.Mesh(
            new THREE.BoxGeometry(0.15, 0.15, 0.15),
            new THREE.MeshPhongMaterial({ color: skinColor })
        );
        rightHand.position.y = -0.6;
        rightArm.add(rightHand);
        
        rightArm.position.set(0.5, 1.1, 0);
        rightArm.rotation.z = -0.3;
        hero.add(rightArm);
        
        // Axe weapon
        const axeGroup = new THREE.Group();
        
        // Axe handle
        const axeHandle = new THREE.Mesh(
            new THREE.CylinderGeometry(0.04, 0.04, 1.5, 8),
            new THREE.MeshPhongMaterial({ color: leatherColor })
        );
        axeHandle.position.y = -0.75;
        axeGroup.add(axeHandle);
        
        // Axe blade
        const axeBlade = new THREE.Mesh(
            new THREE.ConeGeometry(0.3, 0.6, 4),
            new THREE.MeshPhongMaterial({ 
                color: metalColor,
                metalness: 0.8,
                roughness: 0.2
            })
        );
        axeBlade.rotation.z = Math.PI / 2;
        axeBlade.position.set(0, 0, 0);
        axeGroup.add(axeBlade);
        
        // Axe blade edge (sharper looking)
        const axeEdge = new THREE.Mesh(
            new THREE.BoxGeometry(0.05, 0.5, 0.05),
            new THREE.MeshPhongMaterial({ 
                color: 0xffffff,
                metalness: 1.0,
                roughness: 0.1
            })
        );
        axeEdge.position.set(0.25, 0, 0);
        axeGroup.add(axeEdge);
        
        // Position the axe in the right hand
        axeGroup.position.set(0.5, 0.5, 0.3);
        axeGroup.rotation.x = Math.PI / 4; // Tilt forward
        hero.add(axeGroup);
        
        // Add rage particles around the character
        this.addRageParticles(hero);
        
        // Store references for animation
        this.head = head;
        this.leftArm = leftArm;
        this.rightArm = rightArm;
        this.axeGroup = axeGroup;
        this.leftLeg = leftLeg;
        this.rightLeg = rightLeg;
        this.leftEyebrow = leftEyebrow;
        this.rightEyebrow = rightEyebrow;
        this.mouth = mouth;
        
        // Set up animations
        this.setupAnimations();
        
        // Set the model
        this.model = hero;
        
        return hero;
    }
    
    // Add rage particles around the character
    addRageParticles(hero) {
        const particleCount = 15;
        const particles = new THREE.Group();
        
        for (let i = 0; i < particleCount; i++) {
            const size = 0.03 + Math.random() * 0.05;
            const particle = new THREE.Mesh(
                new THREE.OctahedronGeometry(size, 0),
                new THREE.MeshPhongMaterial({
                    color: 0xff3300,
                    transparent: true,
                    opacity: 0.7,
                    emissive: 0xff3300,
                    emissiveIntensity: 0.5
                })
            );
            
            // Random position around the character
            const radius = 0.5 + Math.random() * 0.5;
            const angle = Math.random() * Math.PI * 2;
            const height = Math.random() * 1.8;
            
            particle.position.set(
                Math.cos(angle) * radius,
                height,
                Math.sin(angle) * radius
            );
            
            // Store original position for animation
            particle.userData.originalPos = particle.position.clone();
            particle.userData.speed = 0.01 + Math.random() * 0.02;
            particle.userData.offset = Math.random() * Math.PI * 2;
            
            particles.add(particle);
        }
        
        hero.add(particles);
        this.particles = particles;
    }
    
    // Set up animations for the model
    setupAnimations() {
        // Idle animation
        const idleAnimation = {
            name: 'idle',
            duration: 3000,
            loop: true,
            update: (progress) => {
                const time = progress * Math.PI * 2;
                
                // Breathing motion
                this.head.position.y = 1.7 + Math.sin(time) * 0.02;
                
                // Slight arm movement
                this.leftArm.rotation.z = 0.3 + Math.sin(time) * 0.05;
                this.rightArm.rotation.z = -0.3 + Math.sin(time) * 0.05;
                
                // Axe slight movement
                this.axeGroup.rotation.y = Math.sin(time * 0.5) * 0.05;
                
                // Eyebrows twitching occasionally
                if (Math.sin(time * 3) > 0.9) {
                    this.leftEyebrow.rotation.z = 0.3 + Math.sin(time * 10) * 0.1;
                    this.rightEyebrow.rotation.z = -0.3 + Math.sin(time * 10) * 0.1;
                }
                
                // Animate rage particles
                if (this.particles) {
                    for (let i = 0; i < this.particles.children.length; i++) {
                        const particle = this.particles.children[i];
                        const originalPos = particle.userData.originalPos;
                        const speed = particle.userData.speed;
                        const offset = particle.userData.offset;
                        
                        particle.position.x = originalPos.x + Math.sin(time + offset) * 0.1;
                        particle.position.y = originalPos.y + Math.cos(time + offset) * 0.1;
                        particle.position.z = originalPos.z + Math.sin(time * 0.7 + offset) * 0.1;
                        
                        particle.rotation.x += speed;
                        particle.rotation.y += speed * 0.8;
                    }
                }
            }
        };
        
        // Walking animation
        const walkAnimation = {
            name: 'walk',
            duration: 1000,
            loop: true,
            update: (progress) => {
                const time = progress * Math.PI * 2;
                
                // Body bob
                this.head.position.y = 1.7 + Math.sin(time * 2) * 0.05;
                
                // Arms swing
                this.leftArm.rotation.z = 0.3 + Math.sin(time) * 0.3;
                this.rightArm.rotation.z = -0.3 - Math.sin(time) * 0.3;
                
                // Axe follows right arm
                this.axeGroup.rotation.z = Math.sin(time) * 0.1;
                
                // Legs movement
                this.leftLeg.position.z = Math.sin(time) * 0.2;
                this.rightLeg.position.z = -Math.sin(time) * 0.2;
                
                // Rage particles follow with slight delay
                if (this.particles) {
                    for (let i = 0; i < this.particles.children.length; i++) {
                        const particle = this.particles.children[i];
                        const originalPos = particle.userData.originalPos;
                        const speed = particle.userData.speed;
                        const offset = particle.userData.offset;
                        
                        particle.position.x = originalPos.x + Math.sin(time * 0.8 + offset) * 0.15;
                        particle.position.y = originalPos.y + Math.cos(time * 0.5 + offset) * 0.1;
                        particle.position.z = originalPos.z + Math.sin(time * 0.7 + offset) * 0.15;
                        
                        particle.rotation.x += speed * 1.5;
                        particle.rotation.y += speed * 1.2;
                    }
                }
            }
        };
        
        // Attack animation
        const attackAnimation = {
            name: 'attack',
            duration: 800,
            loop: false,
            update: (progress) => {
                // Ease in and out for smooth animation
                let easedProgress;
                if (progress < 0.5) {
                    // Ease in (accelerate)
                    easedProgress = 2 * progress * progress;
                } else {
                    // Ease out (decelerate)
                    easedProgress = -1 + (4 - 2 * progress) * progress;
                }
                
                // Forward motion for first half, return for second half
                const forwardMotion = progress < 0.5 ? easedProgress * 2 : (1 - (progress - 0.5) * 2);
                
                // Axe swing
                this.rightArm.rotation.z = -0.3 - forwardMotion * 1.2;
                this.rightArm.rotation.x = forwardMotion * 0.5;
                this.axeGroup.rotation.z = -forwardMotion * 1.5;
                
                // Body twist
                this.head.rotation.y = forwardMotion * 0.3;
                
                // Angry expression intensifies
                this.leftEyebrow.rotation.z = 0.3 + forwardMotion * 0.2;
                this.rightEyebrow.rotation.z = -0.3 - forwardMotion * 0.2;
                
                // Mouth opens in battle cry
                this.mouth.scale.y = 1 + forwardMotion * 2;
                
                // Rage particles become more agitated
                if (this.particles) {
                    for (let i = 0; i < this.particles.children.length; i++) {
                        const particle = this.particles.children[i];
                        
                        // Move particles toward the front during attack
                        particle.position.z += forwardMotion * 0.02;
                        
                        // Increase rotation speed
                        particle.rotation.x += 0.03 * forwardMotion;
                        particle.rotation.y += 0.03 * forwardMotion;
                        
                        // Make particles more intense
                        particle.material.emissiveIntensity = 0.5 + forwardMotion * 0.5;
                    }
                }
            }
        };
        
        // Store animations
        this.animations = {
            idle: idleAnimation,
            walk: walkAnimation,
            attack: attackAnimation
        };
    }
    
    // Play a specific animation
    playAnimation(name) {
        this.currentAnimation = this.animations[name];
        this.animationStartTime = performance.now();
        
        // If the animation doesn't loop, we'll need to return to idle after it completes
        if (!this.currentAnimation.loop) {
            setTimeout(() => {
                this.playAnimation('idle');
            }, this.currentAnimation.duration);
        }
    }
    
    // Update the model animation
    update() {
        if (this.currentAnimation) {
            const now = performance.now();
            const elapsed = now - this.animationStartTime;
            const progress = (elapsed % this.currentAnimation.duration) / this.currentAnimation.duration;
            
            this.currentAnimation.update(progress);
        }
    }
}

// Export the model class
window.AxeModel = AxeModel;