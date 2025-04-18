/**
 * UI controls configuration
 */

const ControlsConfig = {
    // Keyboard controls
    keyboard: {
        movement: {
            forward: 'ArrowUp',
            backward: 'ArrowDown',
            left: 'ArrowLeft',
            right: 'ArrowRight',
            jump: ' ', // Space key
            fly: 'f'
        },
        combat: {
            basicAttack: 'a',
            autoTarget: true,
            autoTargetRange: 10
        },
        abilities: {
            ability1: '1',
            ability2: '2',
            ability3: '3',
            ability4: '4',
            ability5: '5',
            ability6: '6',
            quickAbility1: 'q',
            quickAbility2: 'e',
            quickAbility3: 'r',
            quickAbility4: 't'
        },
        camera: {
            rotateLeft: 'q',
            rotateRight: 'e',
            zoomIn: 'z',
            zoomOut: 'x'
        },
        interaction: {
            interact: 'f',
            inventory: 'i',
            character: 'c',
            map: 'm',
            pause: 'Escape'
        }
    },
    
    // Mouse controls
    mouse: {
        primary: 'left',         // Primary action (attack, select)
        secondary: 'right',      // Secondary action (move)
        tertiary: 'middle',      // Tertiary action (camera)
        
        // Flight controls
        flightControls: {
            enabled: true,       // Enable mouse look during flight
            lookButton: 'right', // Button to hold for looking around
            ascendButton: 'left', // Button to ascend
            descendButton: 'right', // Button to descend
            sensitivity: 0.5     // Mouse sensitivity
        }
    },
    
    // Touch controls
    touch: {
        enabled: true,
        
        // Joystick configuration
        joystick: {
            size: 120,              // Size of virtual joystick base in pixels
            innerSize: 60,          // Size of the movable joystick handle
            position: {             // Position of joystick from bottom-left
                x: 150,
                y: 150
            },
            alpha: 0.7,             // Opacity of joystick
            baseColor: 'rgba(50, 50, 50, 0.5)',
            handleColor: 'rgba(150, 150, 150, 0.8)',
            borderColor: 'rgba(200, 200, 200, 0.8)',
            borderWidth: 2,
            
            // Visual feedback
            showDirection: true,    // Show direction indicator
            directionColor: 'rgba(255, 255, 255, 0.4)',
            
            // Dynamic joystick (appears where touch starts)
            dynamic: true,
            dynamicOpacity: 0.9,
            
            // Movement settings
            deadZone: 0.1,          // Minimum movement to register (0-1)
            maxZone: 0.9,           // Zone for maximum speed (0-1)
            followFinger: true      // Joystick follows finger beyond bounds
        },
        
        // Skill activation
        skillActivation: {
            tapToActivate: true,    // Tap to activate skill
            dragToAim: true,        // Drag to aim directional skills
            showAimIndicator: true, // Show aiming indicator
            aimIndicatorColor: 'rgba(255, 255, 255, 0.5)',
            vibrationFeedback: true // Vibrate on activation
        },
        
        buttonSize: 80,             // Size of touch buttons
        buttonSpacing: 10,          // Spacing between buttons
        
        // Long press settings
        longPressThreshold: 300,    // Time in ms to trigger long press
        longPressInterval: 100,     // Interval in ms for continuous action during long press
        
        // Double tap settings
        doubleTapThreshold: 300,    // Time in ms between taps to count as double tap
        
        // Auto-targeting for basic attacks
        autoTargeting: {
            enabled: true,
            range: 10,
            preferClosest: true,
            showTargetIndicator: true,
            targetIndicatorColor: 'rgba(255, 0, 0, 0.5)'
        }
    },
    
    // Button appearance
    buttons: {
        jump: {
            text: 'JUMP',
            color: 'rgba(76,175,80,0.8)',
            borderColor: '#999',
            textColor: 'white',
            size: 80,
            keyHint: 'SPACE',
            keyHintSize: 16,
            keyHintColor: 'rgba(255,255,255,0.7)',
            keyHintBgColor: 'rgba(0,0,0,0.5)'
        },
        fly: {
            text: 'FLY',
            color: 'rgba(33,150,243,0.8)',
            borderColor: '#999',
            textColor: 'white',
            size: 80,
            keyHint: 'F',
            keyHintSize: 16,
            keyHintColor: 'rgba(255,255,255,0.7)',
            keyHintBgColor: 'rgba(0,0,0,0.5)',
            
            // Text variations based on state
            textVariations: {
                flying: 'FLY DOWN',
                landing: 'LAND'
            }
        },
        attack: {
            text: 'A',
            color: 'rgba(255,59,59,0.8)',
            borderColor: '#ff3333',
            textColor: 'white',
            size: 100,
            keyHint: 'A',
            keyHintSize: 18,
            keyHintColor: 'rgba(255,255,255,0.8)',
            keyHintBgColor: 'rgba(0,0,0,0.5)',
            
            // Cooldown visualization
            cooldown: {
                color: 'rgba(0,0,0,0.6)',
                borderColor: '#333',
                textColor: 'white',
                showText: true
            },
            
            // Auto-targeting
            autoTarget: true,
            targetIndicator: {
                color: 'rgba(255,0,0,0.5)',
                size: 30
            }
        }
    }
};

// Export the configuration
if (typeof module !== 'undefined') {
    module.exports = ControlsConfig;
}