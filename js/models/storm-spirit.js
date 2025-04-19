/**
 * Storm Spirit hero model in Ghibli style
 */

class StormSpiritModel {
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
        const skinColor = new THREE.Color(0xddbb99); // Tan skin
        const clothColor = new THREE.Color(0x0066aa); // Blue clothing
        const accentColor = new THREE.Color(0x00ccff); // Light blue accents
        const hairColor = new THREE.Color(0x111111); // Black hair
        
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
        
        // Mustache
        const mustache = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 0.05, 0.1),
            new THREE.MeshPhongMaterial({ color: hairColor })
        );
        mustache.position.set(0, 1.45, 0.35);
        hero.add(mustache);
        
        // Eyes (jovial expression)
        const eyeGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.15, 1.6, 0.35);
        hero.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.15, 1.6, 0.35);
        hero.add(rightEye);
        
        // Pupils
        const pupilGeometry = new THREE.SphereGeometry(0.04, 8, 8);
        const pupilMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
        
        const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        leftPupil.position.set(-0.15, 1.6, 0.42);
        hero.add(leftPupil);
        
        const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        rightPupil.position.set(0.15, 1.6, 0.42);
        hero.add(rightPupil);
        
        // Eyebrows (expressive)
        const eyebrowGeometry = new THREE.BoxGeometry(0.15, 0.03, 0.03);
        const eyebrowMaterial = new THREE.MeshPhongMaterial({ color: hairColor });
        
        const leftEyebrow = new THREE.Mesh(eyebrowGeometry, eyebrowMaterial);
        leftEyebrow.position.set(-0.15, 1.72, 0.35);
        leftEyebrow.rotation.z = -0.2; // Expressive angle
        hero.add(leftEyebrow);
        
        const rightEyebrow = new THREE.Mesh(eyebrowGeometry, eyebrowMaterial);
        rightEyebrow.position.set(0.15, 1.72, 0.35);
        rightEyebrow.rotation.z = 0.2; // Expressive angle
        hero.add(rightEyebrow);
        
        // Mouth (smile)
        const mouth = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.03, 0.03),
            new THREE.MeshPhongMaterial({ color: 0xff6666 })
        );
        mouth.position.set(0, 1.4, 0.35);
        mouth.rotation.z = Math.PI / 12; // Slight smile
        hero.add(mouth);
        
        // Body (round and jovial)
        const bodyUpper = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 16, 16),
            new THREE.MeshPhongMaterial({ color: clothColor })
        );
        bodyUpper.position.y = 1.0;
        bodyUpper.scale.set(1, 0.8, 0.8); // Slightly squashed
        hero.add(bodyUpper);
        
        // Belt
        const belt = new THREE.Mesh(
            new THREE.CylinderGeometry(0.5, 0.5, 0.1, 16),
            new THREE.MeshPhongMaterial({ color: 0xddcc88 }) // Gold belt
        );
        belt.position.y = 0.7;
        hero.add(belt);
        
        // Lower body
        const bodyLower = new THREE.Mesh(
            new THREE.SphereGeometry(0.45, 16, 16),
            new THREE.MeshPhongMaterial({ color: clothColor })
        );
        bodyLower.position.y = 0.4;
        bodyLower.scale.set(1, 0.7, 0.8); // Slightly squashed
        hero.add(bodyLower);
        
        // Legs
        const legGeometry = new THREE.CylinderGeometry(0.12, 0.1, 0.4, 8);
        const legMaterial = new THREE.MeshPhongMaterial({ color: clothColor });
        
        // Left leg
        const leftLeg = new THREE.Group();
        const leftLegMesh = new THREE.Mesh(legGeometry, legMaterial);
        leftLegMesh.position.y = -0.2;
        leftLeg.add(leftLegMesh);
        
        // Left foot
        const leftFoot = new THREE.Mesh(
            new THREE.SphereGeometry(0.12, 8, 8),
            new THREE.MeshPhongMaterial({ color: 0x333366 })
        );
        leftFoot.position.y = -0.4;
        leftFoot.scale.set(1, 0.5, 1.5);
        leftLeg.add(leftFoot);
        
        leftLeg.position.set(-0.2, 0.2, 0);
        hero.add(leftLeg);
        
        // Right leg
        const rightLeg = new THREE.Group();
        const rightLegMesh = new THREE.Mesh(legGeometry, legMaterial);
        rightLegMesh.position.y = -0.2;
        rightLeg.add(rightLegMesh);
        
        // Right foot
        const rightFoot = new THREE.Mesh(
            new THREE.SphereGeometry(0.12, 8, 8),
            new THREE.MeshPhongMaterial({ color: 0x333366 })
        );
        rightFoot.position.y = -0.4;
        rightFoot.scale.set(1, 0.5, 1.5);
        rightLeg.add(rightFoot);
        
        rightLeg.position.set(0.2, 0.2, 0);
        hero.add(rightLeg);
        
        // Arms
        const armGeometry = new THREE.CylinderGeometry(0.1, 0.08, 0.5, 8);
        const armMaterial = new THREE.MeshPhongMaterial({ color: clothColor });
        
        // Left arm
        const leftArm = new THREE.Group();
        const leftArmMesh = new THREE.Mesh(armGeometry, armMaterial);
        leftArmMesh.position.y = -0.25;
        leftArm.add(leftArmMesh);
        
        // Left hand
        const leftHand = new THREE.Mesh(
            new THREE.SphereGeometry(0.09, 8, 8),
            new THREE.MeshPhongMaterial({ color: skinColor })
        );
        leftHand.position.y = -0.5;
        leftArm.add(leftHand);
        
        leftArm.position.set(-0.5, 1.1, 0);
        leftArm.rotation.z = 0.3;
        hero.add(leftArm);
        
        // Right arm
        const rightArm = new THREE.Group();
        const rightArmMesh = new THREE.Mesh(armGeometry, armMaterial);
        rightArmMesh.position.y = -0.25;
        rightArm.add(rightArmMesh);
        
        // Right hand
        const rightHand = new THREE.Mesh(
            new THREE.SphereGeometry(0.09, 8, 8),
            new THREE.MeshPhongMaterial({ color: skinColor })
        );
        rightHand.position.y = -0.5;
        rightArm.add(rightHand);
        
        rightArm.position.set(0.5, 1.1, 0);
        rightArm.rotation.z = -0.3;
        hero.add(rightArm);
        
        // Lightning orb
        const lightningOrb = new THREE.Group();
        
        // Core sphere
        const orbCore = new THREE.Mesh(
            new THREE.SphereGeometry(0.15, 16, 16),
            new THREE.MeshPhongMaterial({ 
                color: accentColor,
                transparent: true,
                opacity: 0.8,
                emissive: accentColor,
                emissiveIntensity: 0.5
            })
        );
        lightningOrb.add(orbCore);
        
        // Lightning bolts around the orb
        const boltCount = 8;
        for (let i = 0; i < boltCount; i++) {
            const angle = (i / boltCount) * Math.PI * 2;
            const bolt = this.createLightningBolt(0.15, accentColor);
            bolt.position.set(
                Math.cos(angle) * 0.2,
                Math.sin(angle) * 0.2,
                0
            );
            bolt.rotation.z = angle;
            lightningOrb.add(bolt);
        }
        
        // Orb light
        const orbLight = new THREE.PointLight(accentColor, 1, 2);
        lightningOrb.add(orbLight);
        
        // Position the orb in the right hand
        lightningOrb.position.set(0.5, 0.6, 0.1);
        hero.add(lightningOrb);
        
        // Add lightning particles around the character
        this.addLightningParticles(hero);
        
        // Store references for animation
        this.head = head;
        this.leftArm = leftArm;
        this.rightArm = rightArm;
        this.lightningOrb = lightningOrb;
        this.orbCore = orbCore;
        this.orbLight = orbLight;
        this.leftLeg = leftLeg;
        this.rightLeg = rightLeg;
        this.leftEyebrow = leftEyebrow;
        this.rightEyebrow = rightEyebrow;
        this.mouth = mouth;
        this.bodyUpper = bodyUpper;
        
        // Set up animations
        this.setupAnimations();
        
        // Set the model
        this.model = hero;
        
        return hero;
    }
    
    // Create a lightning bolt shape
    createLightningBolt(size, color) {
        const points = [];
        const segments = 5;
        const zigzagAmount = 0.1;
        
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const x = (i % 2) * zigzagAmount - zigzagAmount/2;
            const y = t * size;
            points.push(new THREE.Vector3(x, y, 0));
        }
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ 
            color: color,
            transparent: true,
            opacity: 0.8,
            emissive: color,
            emissiveIntensity: 0.5,
            linewidth: 3
        });
        
        return new THREE.Line(geometry, material);
    }
    
    // Add lightning particles around the character
    addLightningParticles(hero) {
        const particleCount = 20;
        const particles = new THREE.Group();
        
        for (let i = 0; i < particleCount; i++) {
            const size = 0.02 + Math.random() * 0.04;
            
            // Create either a small sphere or a lightning bolt
            let particle;
            if (Math.random() > 0.7) {
                // Lightning bolt
                particle = this.createLightningBolt(0.1, 0x00ccff);
                particle.rotation.z = Math.random() * Math.PI * 2;
            } else {
                // Sphere
                particle = new THREE.Mesh(
                    new THREE.SphereGeometry(size, 8, 8),
                    new THREE.MeshPhongMaterial({
                        color: 0x00ccff,
                        transparent: true,
                        opacity: 0.7,
                        emissive: 0x00ccff,
                        emissiveIntensity: 0.5
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
                
                // Floating motion
                this.model.position.y = Math.sin(time) * 0.05;
                
                // Gentle bobbing motion
                this.head.position.y = 1.6 + Math.sin(time) * 0.03;
                
                // Slight arm movement
                this.leftArm.rotation.z = 0.3 + Math.sin(time) * 0.1;
                this.rightArm.rotation.z = -0.3 + Math.sin(time) * 0.1;
                
                // Lightning orb pulsing
                this.orbCore.scale.set(
                    1 + Math.sin(time * 3) * 0.2,
                    1 + Math.sin(time * 3) * 0.2,
                    1 + Math.sin(time * 3) * 0.2
                );
                
                // Orb light intensity
                this.orbLight.intensity = 0.8 + Math.sin(time * 3) * 0.4;
                
                // Eyebrows and mouth for expressive face
                this.leftEyebrow.rotation.z = -0.2 + Math.sin(time * 0.5) * 0.1;
                this.rightEyebrow.rotation.z = 0.2 + Math.sin(time * 0.5) * 0.1;
                this.mouth.scale.x = 1 + Math.sin(time * 0.5) * 0.1;
                
                // Body slight rotation
                this.bodyUpper.rotation.y = Math.sin(time * 0.5) * 0.05;
                
                // Animate lightning particles
                if (this.particles) {
                    for (let i = 0; i < this.particles.children.length; i++) {
                        const particle = this.particles.children[i];
                        const originalPos = particle.userData.originalPos;
                        const speed = particle.userData.speed;
                        const offset = particle.userData.offset;
                        
                        particle.position.x = originalPos.x + Math.sin(time * 2 + offset) * 0.1;
                        particle.position.y = originalPos.y + Math.cos(time * 1.5 + offset) * 0.1;
                        particle.position.z = originalPos.z + Math.sin(time * 1.7 + offset) * 0.1;
                        
                        particle.rotation.x += speed;
                        particle.rotation.y += speed * 0.8;
                        particle.rotation.z += speed * 1.2;
                        
                        // Randomly make particles appear and disappear
                        if (Math.random() > 0.99) {
                            particle.visible = !particle.visible;
                        }
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
                
                // Floating motion (Storm Spirit hovers slightly)
                this.model.position.y = 0.1 + Math.sin(time * 2) * 0.05;
                
                // Body bob
                this.head.position.y = 1.6 + Math.sin(time * 2) * 0.05;
                
                // Arms swing
                this.leftArm.rotation.z = 0.3 + Math.sin(time) * 0.3;
                this.rightArm.rotation.z = -0.3 - Math.sin(time) * 0.3;
                
                // Lightning orb follows right arm
                this.lightningOrb.rotation.z = Math.sin(time) * 0.2;
                
                // Legs movement (slight, as he's hovering)
                this.leftLeg.position.z = Math.sin(time) * 0.1;
                this.rightLeg.position.z = -Math.sin(time) * 0.1;
                
                // Body rotation
                this.bodyUpper.rotation.y = Math.sin(time) * 0.1;
                
                // Lightning particles follow with slight delay
                if (this.particles) {
                    for (let i = 0; i < this.particles.children.length; i++) {
                        const particle = this.particles.children[i];
                        const originalPos = particle.userData.originalPos;
                        const speed = particle.userData.speed;
                        const offset = particle.userData.offset;
                        
                        particle.position.x = originalPos.x + Math.sin(time * 0.8 + offset) * 0.2;
                        particle.position.y = originalPos.y + Math.cos(time * 0.5 + offset) * 0.15;
                        particle.position.z = originalPos.z + Math.sin(time * 0.7 + offset) * 0.2;
                        
                        particle.rotation.x += speed * 1.5;
                        particle.rotation.y += speed * 1.2;
                        particle.rotation.z += speed * 1.8;
                        
                        // Create trail effect
                        if (Math.random() > 0.95) {
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
                
                // Lightning orb thrust forward
                this.rightArm.rotation.z = -0.3 - forwardMotion * 0.5;
                this.rightArm.rotation.x = forwardMotion * 0.8;
                this.lightningOrb.position.z = 0.1 + forwardMotion * 0.5;
                
                // Orb grows and intensifies during attack
                this.orbCore.scale.set(
                    1 + forwardMotion * 0.5,
                    1 + forwardMotion * 0.5,
                    1 + forwardMotion * 0.5
                );
                
                // Orb light intensity increases
                this.orbLight.intensity = 0.8 + forwardMotion * 2.0;
                
                // Expressive face during attack
                this.leftEyebrow.rotation.z = -0.2 - forwardMotion * 0.2;
                this.rightEyebrow.rotation.z = 0.2 + forwardMotion * 0.2;
                this.mouth.scale.x = 1 + forwardMotion * 0.5;
                
                // Body twist
                this.bodyUpper.rotation.y = forwardMotion * 0.3;
                
                // Lightning particles become more agitated
                if (this.particles) {
                    for (let i = 0; i < this.particles.children.length; i++) {
                        const particle = this.particles.children[i];
                        
                        // Move particles toward the front during attack
                        particle.position.z += forwardMotion * 0.03;
                        
                        // Increase rotation speed
                        particle.rotation.x += 0.04 * forwardMotion;
                        particle.rotation.y += 0.04 * forwardMotion;
                        particle.rotation.z += 0.04 * forwardMotion;
                        
                        // Make particles more intense
                        if (particle.material) {
                            particle.material.emissiveIntensity = 0.5 + forwardMotion * 0.8;
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
window.StormSpiritModel = StormSpiritModel;