/**
 * Crystal Maiden hero model in Ghibli style
 */

class CrystalMaidenModel {
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
        const skinColor = new THREE.Color(0xffeedd);
        const hairColor = new THREE.Color(0xffffcc); // Blonde
        const robeColor = new THREE.Color(0x88ccff); // Light blue
        const accentColor = new THREE.Color(0xddffff); // Ice blue
        
        // Head
        const head = new THREE.Mesh(
            new THREE.SphereGeometry(0.4, 16, 16),
            new THREE.MeshPhongMaterial({ color: skinColor })
        );
        head.position.y = 1.6;
        hero.add(head);
        
        // Hair (top part)
        const hairTop = new THREE.Mesh(
            new THREE.SphereGeometry(0.42, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
            new THREE.MeshPhongMaterial({ color: hairColor })
        );
        hairTop.position.y = 1.6;
        hairTop.position.z = 0.02;
        hero.add(hairTop);
        
        // Hair (back part)
        const hairBack = new THREE.Mesh(
            new THREE.CylinderGeometry(0.4, 0.2, 0.8, 16, 1, true),
            new THREE.MeshPhongMaterial({ color: hairColor, side: THREE.DoubleSide })
        );
        hairBack.position.y = 1.2;
        hairBack.position.z = -0.1;
        hero.add(hairBack);
        
        // Eyes
        const eyeGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0x3366ff });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.15, 1.6, 0.35);
        hero.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.15, 1.6, 0.35);
        hero.add(rightEye);
        
        // Eyebrows
        const eyebrowGeometry = new THREE.BoxGeometry(0.15, 0.03, 0.03);
        const eyebrowMaterial = new THREE.MeshPhongMaterial({ color: hairColor });
        
        const leftEyebrow = new THREE.Mesh(eyebrowGeometry, eyebrowMaterial);
        leftEyebrow.position.set(-0.15, 1.72, 0.35);
        leftEyebrow.rotation.z = -0.1;
        hero.add(leftEyebrow);
        
        const rightEyebrow = new THREE.Mesh(eyebrowGeometry, eyebrowMaterial);
        rightEyebrow.position.set(0.15, 1.72, 0.35);
        rightEyebrow.rotation.z = 0.1;
        hero.add(rightEyebrow);
        
        // Mouth
        const mouth = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.03, 0.03),
            new THREE.MeshPhongMaterial({ color: 0xff9999 })
        );
        mouth.position.set(0, 1.45, 0.35);
        hero.add(mouth);
        
        // Body (robe)
        const bodyUpper = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.5, 0.6, 16),
            new THREE.MeshPhongMaterial({ color: robeColor })
        );
        bodyUpper.position.y = 1.0;
        hero.add(bodyUpper);
        
        const bodyLower = new THREE.Mesh(
            new THREE.ConeGeometry(0.7, 0.8, 16),
            new THREE.MeshPhongMaterial({ color: robeColor })
        );
        bodyLower.position.y = 0.6;
        hero.add(bodyLower);
        
        // Cape
        const cape = new THREE.Mesh(
            new THREE.CylinderGeometry(0.4, 0.7, 1.2, 16, 1, true, Math.PI * 0.25, Math.PI * 1.5),
            new THREE.MeshPhongMaterial({ color: accentColor, side: THREE.DoubleSide })
        );
        cape.position.y = 0.9;
        cape.position.z = -0.1;
        hero.add(cape);
        
        // Hood
        const hood = new THREE.Mesh(
            new THREE.CylinderGeometry(0.45, 0.45, 0.3, 16, 1, true, Math.PI * 0.25, Math.PI * 1.5),
            new THREE.MeshPhongMaterial({ color: accentColor, side: THREE.DoubleSide })
        );
        hood.position.y = 1.6;
        hood.position.z = -0.1;
        hero.add(hood);
        
        // Arms
        const armGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.6, 8);
        const armMaterial = new THREE.MeshPhongMaterial({ color: robeColor });
        
        // Left arm
        const leftArm = new THREE.Group();
        const leftArmMesh = new THREE.Mesh(armGeometry, armMaterial);
        leftArmMesh.position.y = -0.3;
        leftArm.add(leftArmMesh);
        
        // Left hand
        const leftHand = new THREE.Mesh(
            new THREE.SphereGeometry(0.09, 8, 8),
            new THREE.MeshPhongMaterial({ color: skinColor })
        );
        leftHand.position.y = -0.6;
        leftArm.add(leftHand);
        
        leftArm.position.set(-0.5, 1.2, 0);
        leftArm.rotation.z = 0.3;
        hero.add(leftArm);
        
        // Right arm
        const rightArm = new THREE.Group();
        const rightArmMesh = new THREE.Mesh(armGeometry, armMaterial);
        rightArmMesh.position.y = -0.3;
        rightArm.add(rightArmMesh);
        
        // Right hand
        const rightHand = new THREE.Mesh(
            new THREE.SphereGeometry(0.09, 8, 8),
            new THREE.MeshPhongMaterial({ color: skinColor })
        );
        rightHand.position.y = -0.6;
        rightArm.add(rightHand);
        
        rightArm.position.set(0.5, 1.2, 0);
        rightArm.rotation.z = -0.3;
        hero.add(rightArm);
        
        // Staff
        const staffGroup = new THREE.Group();
        
        const staffRod = new THREE.Mesh(
            new THREE.CylinderGeometry(0.03, 0.03, 1.8, 8),
            new THREE.MeshPhongMaterial({ color: 0x885522 })
        );
        staffRod.position.y = -0.9;
        staffGroup.add(staffRod);
        
        // Staff crystal
        const crystal = new THREE.Mesh(
            new THREE.OctahedronGeometry(0.15, 1),
            new THREE.MeshPhongMaterial({ 
                color: 0x88ffff,
                transparent: true,
                opacity: 0.8,
                emissive: 0x88ffff,
                emissiveIntensity: 0.5
            })
        );
        crystal.position.y = 0;
        staffGroup.add(crystal);
        
        // Crystal glow
        const crystalGlow = new THREE.PointLight(0x88ffff, 1, 2);
        crystalGlow.position.y = 0;
        staffGroup.add(crystalGlow);
        
        // Position the staff in the right hand
        staffGroup.position.set(0.5, 0.6, 0);
        hero.add(staffGroup);
        
        // Legs (mostly hidden by robe, just feet visible)
        const footGeometry = new THREE.SphereGeometry(0.12, 8, 8);
        const footMaterial = new THREE.MeshPhongMaterial({ color: 0x333366 });
        
        const leftFoot = new THREE.Mesh(footGeometry, footMaterial);
        leftFoot.position.set(-0.2, 0.12, 0);
        leftFoot.scale.set(1, 0.5, 1.5);
        hero.add(leftFoot);
        
        const rightFoot = new THREE.Mesh(footGeometry, footMaterial);
        rightFoot.position.set(0.2, 0.12, 0);
        rightFoot.scale.set(1, 0.5, 1.5);
        hero.add(rightFoot);
        
        // Add frost particles around the character
        this.addFrostParticles(hero);
        
        // Store references for animation
        this.head = head;
        this.leftArm = leftArm;
        this.rightArm = rightArm;
        this.staffGroup = staffGroup;
        this.crystal = crystal;
        this.crystalGlow = crystalGlow;
        this.cape = cape;
        this.leftFoot = leftFoot;
        this.rightFoot = rightFoot;
        
        // Set up animations
        this.setupAnimations();
        
        // Set the model
        this.model = hero;
        
        return hero;
    }
    
    // Add frost particles floating around the character
    addFrostParticles(hero) {
        const particleCount = 20;
        const particles = new THREE.Group();
        
        for (let i = 0; i < particleCount; i++) {
            const size = 0.03 + Math.random() * 0.05;
            const particle = new THREE.Mesh(
                new THREE.OctahedronGeometry(size, 0),
                new THREE.MeshPhongMaterial({
                    color: 0xaaddff,
                    transparent: true,
                    opacity: 0.7,
                    emissive: 0xaaddff,
                    emissiveIntensity: 0.3
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
                
                // Gentle bobbing motion
                this.head.position.y = 1.6 + Math.sin(time) * 0.03;
                
                // Slight arm movement
                this.leftArm.rotation.z = 0.3 + Math.sin(time) * 0.05;
                this.rightArm.rotation.z = -0.3 + Math.sin(time) * 0.05;
                
                // Staff crystal pulsing
                this.crystal.scale.set(
                    1 + Math.sin(time * 2) * 0.1,
                    1 + Math.sin(time * 2) * 0.1,
                    1 + Math.sin(time * 2) * 0.1
                );
                
                // Crystal light intensity
                this.crystalGlow.intensity = 0.8 + Math.sin(time * 2) * 0.2;
                
                // Cape gentle movement
                this.cape.rotation.y = Math.sin(time * 0.5) * 0.05;
                
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
                this.head.position.y = 1.6 + Math.sin(time * 2) * 0.05;
                
                // Arms swing
                this.leftArm.rotation.z = 0.3 + Math.sin(time) * 0.2;
                this.rightArm.rotation.z = -0.3 - Math.sin(time) * 0.2;
                
                // Staff follows right arm
                this.staffGroup.rotation.z = Math.sin(time) * 0.1;
                
                // Cape movement
                this.cape.rotation.y = Math.sin(time) * 0.1;
                
                // Feet movement
                this.leftFoot.position.z = Math.sin(time) * 0.2;
                this.rightFoot.position.z = -Math.sin(time) * 0.2;
                
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
                
                // Crystal glows brighter during attack
                this.crystal.scale.set(
                    1 + forwardMotion * 0.3,
                    1 + forwardMotion * 0.3,
                    1 + forwardMotion * 0.3
                );
                
                // Crystal light intensity increases
                this.crystalGlow.intensity = 0.8 + forwardMotion * 1.2;
                
                // Frost particles become more agitated
                if (this.particles) {
                    for (let i = 0; i < this.particles.children.length; i++) {
                        const particle = this.particles.children[i];
                        
                        // Move particles toward the front during attack
                        particle.position.z += forwardMotion * 0.01;
                        
                        // Increase rotation speed
                        particle.rotation.x += 0.02 * forwardMotion;
                        particle.rotation.y += 0.02 * forwardMotion;
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
window.CrystalMaidenModel = CrystalMaidenModel;