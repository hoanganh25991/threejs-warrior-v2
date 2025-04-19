/**
 * Lich hero model in Ghibli style
 */

class LichModel {
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
        const boneColor = new THREE.Color(0xdddddd); // Pale bone
        const robeColor = new THREE.Color(0x1a1a66); // Dark blue robe
        const accentColor = new THREE.Color(0x00aaff); // Ice blue accents
        const energyColor = new THREE.Color(0x00ccff); // Frost energy
        
        // Skull head
        const skull = new THREE.Group();
        
        // Main skull
        const skullMain = new THREE.Mesh(
            new THREE.SphereGeometry(0.4, 16, 16),
            new THREE.MeshPhongMaterial({ 
                color: boneColor,
                roughness: 0.7,
                metalness: 0.2
            })
        );
        skull.add(skullMain);
        
        // Jaw
        const jaw = new THREE.Mesh(
            new THREE.SphereGeometry(0.3, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
            new THREE.MeshPhongMaterial({ 
                color: boneColor,
                roughness: 0.7,
                metalness: 0.2
            })
        );
        jaw.scale.set(1, 0.5, 1);
        jaw.position.y = -0.15;
        jaw.rotation.x = Math.PI;
        skull.add(jaw);
        
        // Eye sockets
        const eyeSocketGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const eyeSocketMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x000000,
            transparent: true,
            opacity: 0.8
        });
        
        const leftEyeSocket = new THREE.Mesh(eyeSocketGeometry, eyeSocketMaterial);
        leftEyeSocket.position.set(-0.15, 0, 0.3);
        skull.add(leftEyeSocket);
        
        const rightEyeSocket = new THREE.Mesh(eyeSocketGeometry, eyeSocketMaterial);
        rightEyeSocket.position.set(0.15, 0, 0.3);
        skull.add(rightEyeSocket);
        
        // Glowing eyes
        const eyeGeometry = new THREE.SphereGeometry(0.06, 8, 8);
        const eyeMaterial = new THREE.MeshPhongMaterial({ 
            color: energyColor,
            emissive: energyColor,
            emissiveIntensity: 0.8
        });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.15, 0, 0.32);
        skull.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.15, 0, 0.32);
        skull.add(rightEye);
        
        // Eye lights
        const leftEyeLight = new THREE.PointLight(energyColor, 0.5, 0.5);
        leftEyeLight.position.set(-0.15, 0, 0.35);
        skull.add(leftEyeLight);
        
        const rightEyeLight = new THREE.PointLight(energyColor, 0.5, 0.5);
        rightEyeLight.position.set(0.15, 0, 0.35);
        skull.add(rightEyeLight);
        
        // Position the skull
        skull.position.y = 1.7;
        hero.add(skull);
        
        // Neck (spine)
        const neck = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.15, 0.2, 8),
            new THREE.MeshPhongMaterial({ color: boneColor })
        );
        neck.position.y = 1.5;
        hero.add(neck);
        
        // Torso (robe)
        const torsoUpper = new THREE.Mesh(
            new THREE.ConeGeometry(0.6, 0.8, 16, 1, true),
            new THREE.MeshPhongMaterial({ 
                color: robeColor,
                side: THREE.DoubleSide
            })
        );
        torsoUpper.position.y = 1.1;
        torsoUpper.rotation.x = Math.PI;
        hero.add(torsoUpper);
        
        // Lower robe
        const torsoLower = new THREE.Mesh(
            new THREE.ConeGeometry(0.8, 1.2, 16, 1, true),
            new THREE.MeshPhongMaterial({ 
                color: robeColor,
                side: THREE.DoubleSide
            })
        );
        torsoLower.position.y = 0.5;
        torsoLower.rotation.x = Math.PI;
        hero.add(torsoLower);
        
        // Shoulder pads
        const shoulderPadGeometry = new THREE.SphereGeometry(0.25, 16, 8, 0, Math.PI);
        const shoulderPadMaterial = new THREE.MeshPhongMaterial({ 
            color: robeColor,
            metalness: 0.3,
            roughness: 0.7
        });
        
        const leftShoulderPad = new THREE.Mesh(shoulderPadGeometry, shoulderPadMaterial);
        leftShoulderPad.rotation.z = -Math.PI / 2;
        leftShoulderPad.position.set(-0.4, 1.3, 0);
        hero.add(leftShoulderPad);
        
        const rightShoulderPad = new THREE.Mesh(shoulderPadGeometry, shoulderPadMaterial);
        rightShoulderPad.rotation.z = Math.PI / 2;
        rightShoulderPad.position.set(0.4, 1.3, 0);
        hero.add(rightShoulderPad);
        
        // Arms (skeletal)
        const armGeometry = new THREE.CylinderGeometry(0.08, 0.06, 0.6, 8);
        const armMaterial = new THREE.MeshPhongMaterial({ color: boneColor });
        
        // Left arm
        const leftArm = new THREE.Group();
        const leftArmMesh = new THREE.Mesh(armGeometry, armMaterial);
        leftArmMesh.position.y = -0.3;
        leftArm.add(leftArmMesh);
        
        // Left hand (skeletal)
        const leftHand = new THREE.Mesh(
            new THREE.BoxGeometry(0.12, 0.12, 0.04),
            new THREE.MeshPhongMaterial({ color: boneColor })
        );
        leftHand.position.y = -0.6;
        
        // Fingers
        for (let i = 0; i < 3; i++) {
            const finger = new THREE.Mesh(
                new THREE.CylinderGeometry(0.02, 0.01, 0.15, 4),
                new THREE.MeshPhongMaterial({ color: boneColor })
            );
            finger.rotation.x = Math.PI / 2;
            finger.position.set(
                (i - 1) * 0.04,
                -0.08,
                0.05
            );
            leftHand.add(finger);
        }
        
        leftArm.add(leftHand);
        leftArm.position.set(-0.4, 1.3, 0);
        leftArm.rotation.z = 0.3;
        hero.add(leftArm);
        
        // Right arm
        const rightArm = new THREE.Group();
        const rightArmMesh = new THREE.Mesh(armGeometry, armMaterial);
        rightArmMesh.position.y = -0.3;
        rightArm.add(rightArmMesh);
        
        // Right hand (skeletal)
        const rightHand = new THREE.Mesh(
            new THREE.BoxGeometry(0.12, 0.12, 0.04),
            new THREE.MeshPhongMaterial({ color: boneColor })
        );
        rightHand.position.y = -0.6;
        
        // Fingers
        for (let i = 0; i < 3; i++) {
            const finger = new THREE.Mesh(
                new THREE.CylinderGeometry(0.02, 0.01, 0.15, 4),
                new THREE.MeshPhongMaterial({ color: boneColor })
            );
            finger.rotation.x = Math.PI / 2;
            finger.position.set(
                (i - 1) * 0.04,
                -0.08,
                0.05
            );
            rightHand.add(finger);
        }
        
        rightArm.add(rightHand);
        rightArm.position.set(0.4, 1.3, 0);
        rightArm.rotation.z = -0.3;
        hero.add(rightArm);
        
        // Staff
        const staffGroup = new THREE.Group();
        
        // Staff rod
        const staffRod = new THREE.Mesh(
            new THREE.CylinderGeometry(0.03, 0.03, 1.8, 8),
            new THREE.MeshPhongMaterial({ color: 0x222222 })
        );
        staffRod.position.y = -0.9;
        staffGroup.add(staffRod);
        
        // Staff skull
        const staffSkull = new THREE.Mesh(
            new THREE.SphereGeometry(0.12, 12, 12),
            new THREE.MeshPhongMaterial({ color: boneColor })
        );
        staffSkull.position.y = 0.05;
        staffGroup.add(staffSkull);
        
        // Staff skull eye sockets
        const staffEyeSocketGeometry = new THREE.SphereGeometry(0.03, 8, 8);
        
        const staffLeftEyeSocket = new THREE.Mesh(staffEyeSocketGeometry, eyeSocketMaterial);
        staffLeftEyeSocket.position.set(-0.05, 0.05, 0.08);
        staffGroup.add(staffLeftEyeSocket);
        
        const staffRightEyeSocket = new THREE.Mesh(staffEyeSocketGeometry, eyeSocketMaterial);
        staffRightEyeSocket.position.set(0.05, 0.05, 0.08);
        staffGroup.add(staffRightEyeSocket);
        
        // Staff skull glowing eyes
        const staffEyeGeometry = new THREE.SphereGeometry(0.02, 8, 8);
        
        const staffLeftEye = new THREE.Mesh(staffEyeGeometry, eyeMaterial);
        staffLeftEye.position.set(-0.05, 0.05, 0.09);
        staffGroup.add(staffLeftEye);
        
        const staffRightEye = new THREE.Mesh(staffEyeGeometry, eyeMaterial);
        staffRightEye.position.set(0.05, 0.05, 0.09);
        staffGroup.add(staffRightEye);
        
        // Frost orb above staff
        const frostOrb = new THREE.Mesh(
            new THREE.SphereGeometry(0.15, 16, 16),
            new THREE.MeshPhongMaterial({ 
                color: energyColor,
                transparent: true,
                opacity: 0.7,
                emissive: energyColor,
                emissiveIntensity: 0.5
            })
        );
        frostOrb.position.y = 0.3;
        staffGroup.add(frostOrb);
        
        // Frost orb light
        const frostLight = new THREE.PointLight(energyColor, 1, 2);
        frostLight.position.y = 0.3;
        staffGroup.add(frostLight);
        
        // Position the staff in the right hand
        staffGroup.position.set(0.4, 0.7, 0);
        hero.add(staffGroup);
        
        // Add frost particles around the character
        this.addFrostParticles(hero);
        
        // Store references for animation
        this.skull = skull;
        this.jaw = jaw;
        this.leftArm = leftArm;
        this.rightArm = rightArm;
        this.staffGroup = staffGroup;
        this.frostOrb = frostOrb;
        this.frostLight = frostLight;
        this.leftEye = leftEye;
        this.rightEye = rightEye;
        this.leftEyeLight = leftEyeLight;
        this.rightEyeLight = rightEyeLight;
        
        // Set up animations
        this.setupAnimations();
        
        // Set the model
        this.model = hero;
        
        return hero;
    }
    
    // Add frost particles around the character
    addFrostParticles(hero) {
        const particleCount = 25;
        const particles = new THREE.Group();
        
        for (let i = 0; i < particleCount; i++) {
            const size = 0.02 + Math.random() * 0.04;
            
            // Create either a small sphere or a snowflake
            let particle;
            if (Math.random() > 0.7) {
                // Snowflake (simple cross shape)
                particle = new THREE.Group();
                
                const h1 = new THREE.Mesh(
                    new THREE.BoxGeometry(size * 4, size / 2, size / 2),
                    new THREE.MeshPhongMaterial({
                        color: 0xaaddff,
                        transparent: true,
                        opacity: 0.7,
                        emissive: 0xaaddff,
                        emissiveIntensity: 0.3
                    })
                );
                particle.add(h1);
                
                const h2 = new THREE.Mesh(
                    new THREE.BoxGeometry(size / 2, size * 4, size / 2),
                    new THREE.MeshPhongMaterial({
                        color: 0xaaddff,
                        transparent: true,
                        opacity: 0.7,
                        emissive: 0xaaddff,
                        emissiveIntensity: 0.3
                    })
                );
                particle.add(h2);
                
                const h3 = new THREE.Mesh(
                    new THREE.BoxGeometry(size / 2, size / 2, size * 4),
                    new THREE.MeshPhongMaterial({
                        color: 0xaaddff,
                        transparent: true,
                        opacity: 0.7,
                        emissive: 0xaaddff,
                        emissiveIntensity: 0.3
                    })
                );
                particle.add(h3);
            } else {
                // Ice crystal
                particle = new THREE.Mesh(
                    new THREE.OctahedronGeometry(size, 0),
                    new THREE.MeshPhongMaterial({
                        color: 0xaaddff,
                        transparent: true,
                        opacity: 0.7,
                        emissive: 0xaaddff,
                        emissiveIntensity: 0.3
                    })
                );
            }
            
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
            particle.userData.speed = 0.005 + Math.random() * 0.01;
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
                
                // Floating motion (Lich hovers slightly)
                this.model.position.y = 0.1 + Math.sin(time) * 0.05;
                
                // Gentle skull movement
                this.skull.rotation.y = Math.sin(time * 0.5) * 0.1;
                
                // Jaw movement (occasional)
                if (Math.sin(time * 0.2) > 0.7) {
                    this.jaw.position.y = -0.15 + Math.sin(time * 5) * 0.03;
                }
                
                // Eye pulsing
                const eyeScale = 1 + Math.sin(time * 2) * 0.2;
                this.leftEye.scale.set(eyeScale, eyeScale, eyeScale);
                this.rightEye.scale.set(eyeScale, eyeScale, eyeScale);
                
                // Eye light intensity
                this.leftEyeLight.intensity = 0.5 + Math.sin(time * 2) * 0.2;
                this.rightEyeLight.intensity = 0.5 + Math.sin(time * 2) * 0.2;
                
                // Slight arm movement
                this.leftArm.rotation.z = 0.3 + Math.sin(time) * 0.05;
                this.rightArm.rotation.z = -0.3 + Math.sin(time) * 0.05;
                
                // Staff frost orb pulsing
                this.frostOrb.scale.set(
                    1 + Math.sin(time * 3) * 0.2,
                    1 + Math.sin(time * 3) * 0.2,
                    1 + Math.sin(time * 3) * 0.2
                );
                
                // Frost orb light intensity
                this.frostLight.intensity = 0.8 + Math.sin(time * 3) * 0.4;
                
                // Animate frost particles
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
                        particle.rotation.z += speed * 0.6;
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
                
                // Floating motion (Lich hovers)
                this.model.position.y = 0.15 + Math.sin(time * 2) * 0.08;
                
                // Skull movement
                this.skull.rotation.y = Math.sin(time) * 0.15;
                
                // Arms movement (subtle, as he's floating)
                this.leftArm.rotation.z = 0.3 + Math.sin(time) * 0.2;
                this.rightArm.rotation.z = -0.3 - Math.sin(time) * 0.2;
                
                // Staff follows right arm
                this.staffGroup.rotation.z = Math.sin(time) * 0.1;
                
                // Robe sway effect (by moving the whole model slightly)
                this.model.rotation.z = Math.sin(time) * 0.03;
                
                // Frost particles follow with slight delay
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
                        
                        // Create trail effect
                        if (Math.random() > 0.98) {
                            particle.visible = !particle.visible;
                        }
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
                
                // Staff thrust forward
                this.rightArm.rotation.z = -0.3 - forwardMotion * 0.5;
                this.rightArm.rotation.x = forwardMotion * 0.8;
                this.staffGroup.rotation.x = forwardMotion * 0.5;
                
                // Frost orb grows and intensifies during attack
                this.frostOrb.scale.set(
                    1 + forwardMotion * 0.5,
                    1 + forwardMotion * 0.5,
                    1 + forwardMotion * 0.5
                );
                
                // Frost orb light intensity increases
                this.frostLight.intensity = 0.8 + forwardMotion * 2.0;
                
                // Skull turns to face attack direction
                this.skull.rotation.y = forwardMotion * 0.3;
                
                // Jaw opens for spell casting
                this.jaw.position.y = -0.15 - forwardMotion * 0.05;
                
                // Eyes glow more intensely
                this.leftEye.scale.set(
                    1 + forwardMotion * 0.3,
                    1 + forwardMotion * 0.3,
                    1 + forwardMotion * 0.3
                );
                this.rightEye.scale.set(
                    1 + forwardMotion * 0.3,
                    1 + forwardMotion * 0.3,
                    1 + forwardMotion * 0.3
                );
                
                this.leftEyeLight.intensity = 0.5 + forwardMotion * 1.0;
                this.rightEyeLight.intensity = 0.5 + forwardMotion * 1.0;
                
                // Frost particles become more agitated
                if (this.particles) {
                    for (let i = 0; i < this.particles.children.length; i++) {
                        const particle = this.particles.children[i];
                        
                        // Move particles toward the front during attack
                        particle.position.z += forwardMotion * 0.02;
                        
                        // Increase rotation speed
                        particle.rotation.x += 0.03 * forwardMotion;
                        particle.rotation.y += 0.03 * forwardMotion;
                        
                        // Make particles more intense
                        if (particle.material) {
                            particle.material.emissiveIntensity = 0.3 + forwardMotion * 0.7;
                        } else if (particle.children && particle.children.length > 0) {
                            // For snowflake group
                            particle.children.forEach(part => {
                                part.material.emissiveIntensity = 0.3 + forwardMotion * 0.7;
                            });
                        }
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
window.LichModel = LichModel;