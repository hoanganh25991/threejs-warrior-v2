/**
 * UI configuration for skills display and interaction
 */

const SkillUIConfig = {
    // Skill button layout
    layout: {
        // Main attack button in the center
        mainAttack: {
            position: 'center',
            size: 100,
            color: 'rgba(255, 0, 0, 0.7)',
            borderColor: '#ff3333',
            textColor: 'white',
            text: 'A',
            keyHint: 'a',
            keyHintPosition: {
                x: 15,
                y: 15
            },
            keyHintSize: 20,
            keyHintColor: 'rgba(255, 255, 255, 0.8)',
            keyHintBgColor: 'rgba(0, 0, 0, 0.5)',
            autoTarget: true,
            autoTargetRange: 10
        },
        
        // Skill buttons arranged in a circle around the main attack
        skillButtons: {
            radius: 150,      // Distance from center to skill buttons
            buttonSize: 70,   // Size of each skill button
            startAngle: 0,    // Starting angle for first skill (in degrees)
            
            // Visual settings for skill buttons
            buttonStyle: {
                borderWidth: 3,
                borderColor: '#999',
                textColor: 'white',
                fontSize: 24,
                fontWeight: 'bold'
            },
            
            // Key hint display
            keyHint: {
                show: true,
                size: 18,
                position: {
                    x: 10,
                    y: 10
                },
                bgColor: 'rgba(0, 0, 0, 0.6)',
                textColor: 'white',
                borderRadius: 10,
                padding: 3
            }
        }
    },
    
    // Cooldown visualization
    cooldown: {
        type: 'radial',       // 'radial' or 'vertical'
        color: 'rgba(0, 0, 0, 0.7)',
        borderColor: '#333',
        textColor: 'white',
        showText: true,       // Show remaining cooldown time
        pulseOnReady: true,   // Pulse effect when cooldown completes
        readyEffect: {
            duration: 0.5,    // Duration of ready effect in seconds
            scale: 1.1,       // Max scale during pulse
            color: 'rgba(255, 255, 255, 0.3)'
        }
    },
    
    // Visual effects for different skill types
    effectColors: {
        physical: '#ff3333',
        magical: '#3399ff',
        pure: '#ffcc00',
        heal: '#33cc33',
        buff: '#cc99ff',
        debuff: '#cc3300'
    },
    
    // Touch interaction settings
    touch: {
        tapToActivate: true,
        dragToAim: true,      // For directional skills
        doubleTapForSelfCast: true,
        holdForInfo: true,    // Hold to see skill description
        holdThreshold: 500,   // Time in ms to trigger hold
        vibrationFeedback: true
    },
    
    // Skill letter display (first character of skill name)
    skillLetters: {
        show: true,
        position: 'center',
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        shadow: true,
        shadowColor: 'rgba(0, 0, 0, 0.7)',
        shadowBlur: 3
    }
};

// Export the configuration
if (typeof module !== 'undefined') {
    module.exports = SkillUIConfig;
}