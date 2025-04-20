/**
 * UI controls configuration
 */

// Define the ControlsConfig in the global scope (window)
window.ControlsConfig = {
    // Keyboard controls - WASD for movement, F for jump/fly
    keyboard: {
        movement: {
            forward: 'w',
            backward: 's',
            left: 'a',
            right: 'd',
            jump: 'f'
            // Arrow keys removed as per requirements
        },
        combat: {
            basicAttack: 'h',
            autoTarget: true,
            autoTargetRange: 10
        },
        abilities: {
            ability1: 'h',
            ability2: 'j',
            ability3: 'k',
            ability4: 'l'
        },
        camera: {
            // Camera controls removed as per requirements
        },
        interaction: {
            interact: 'f',
            inventory: 'i',
            character: 'c',
            map: 'm',
            pause: 'Escape'
        }
    },
    
    // Mouse controls - disabled as per requirements
    mouse: {
        enabled: false
    },
    
    // Touch controls - disabled as per requirements
    touch: {
        enabled: false
    },
    
    // Button appearance - updated for keyboard-only controls
    buttons: {
        jump: {
            text: 'JUMP',
            color: 'rgba(76,175,80,0.8)',
            borderColor: '#999',
            textColor: 'white',
            size: 80,
            keyHint: 'F',
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
            text: 'H',
            color: 'rgba(255,59,59,0.8)',
            borderColor: '#ff3333',
            textColor: 'white',
            size: 100,
            keyHint: 'H',
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
        },
        ability1: {
            text: 'H',
            keyHint: 'H'
        },
        ability2: {
            text: 'J',
            keyHint: 'J'
        },
        ability3: {
            text: 'K',
            keyHint: 'K'
        },
        ability4: {
            text: 'L',
            keyHint: 'L'
        }
    }
};

// For module compatibility
if (typeof module !== 'undefined') {
    module.exports = window.ControlsConfig;
}