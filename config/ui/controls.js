/**
 * UI controls configuration
 */

const ControlsConfig = {
    // Keyboard controls
    keyboard: {
        movement: {
            forward: 'w',
            backward: 's',
            left: 'a',
            right: 'd',
            jump: ' ', // Space key
            fly: 'f'
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
        joystickSize: 80,        // Size of virtual joystick in pixels
        joystickPosition: {      // Position of joystick from bottom-left
            x: 100,
            y: 100
        },
        buttonSize: 80,          // Size of touch buttons
        buttonSpacing: 10,       // Spacing between buttons
        
        // Long press settings
        longPressThreshold: 300, // Time in ms to trigger long press
        longPressInterval: 100,  // Interval in ms for continuous action during long press
        
        // Double tap settings
        doubleTapThreshold: 300  // Time in ms between taps to count as double tap
    },
    
    // Button appearance
    buttons: {
        jump: {
            text: 'JUMP',
            color: 'rgba(76,175,80,0.8)',
            borderColor: '#999',
            textColor: 'white',
            size: 80
        },
        fly: {
            text: 'FLY',
            color: 'rgba(33,150,243,0.8)',
            borderColor: '#999',
            textColor: 'white',
            size: 80,
            
            // Text variations based on state
            textVariations: {
                flying: 'FLY DOWN',
                landing: 'LAND'
            }
        }
    }
};

// Export the configuration
if (typeof module !== 'undefined') {
    module.exports = ControlsConfig;
}