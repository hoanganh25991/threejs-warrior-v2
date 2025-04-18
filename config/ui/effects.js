/**
 * Visual effects configuration for skills and abilities
 */

const EffectsConfig = {
    // Skill visual effects
    skills: {
        // Cooldown visualization
        cooldown: {
            type: 'radial',           // 'radial' or 'overlay'
            color: 'rgba(0, 0, 0, 0.7)',
            borderColor: '#333',
            textColor: 'white',
            fontSize: 16,
            fontWeight: 'bold',
            showText: true,           // Show remaining cooldown time
            textPrecision: 1,         // Decimal places for cooldown text
            
            // Ready effect when cooldown completes
            readyEffect: {
                enabled: true,
                type: 'pulse',        // 'pulse', 'flash', or 'glow'
                duration: 0.5,        // Duration in seconds
                color: 'rgba(255, 255, 255, 0.5)',
                scale: 1.1,           // Max scale during pulse
                repeat: 2             // Number of pulses
            }
        },
        
        // Skill activation effects
        activation: {
            // Flash effect when skill is activated
            flash: {
                enabled: true,
                color: 'rgba(255, 255, 255, 0.7)',
                duration: 0.2         // Duration in seconds
            },
            
            // Sound effect
            sound: {
                enabled: true,
                volume: 0.7
            },
            
            // Screen effects
            screenEffect: {
                enabled: true,
                intensity: 0.3,       // 0-1 scale
                duration: 0.3         // Duration in seconds
            }
        },
        
        // Skill targeting indicators
        targeting: {
            // Ground targeting
            ground: {
                color: 'rgba(0, 255, 0, 0.3)',
                borderColor: 'rgba(0, 255, 0, 0.7)',
                borderWidth: 2,
                pulseEffect: true
            },
            
            // Line targeting
            line: {
                color: 'rgba(0, 150, 255, 0.3)',
                borderColor: 'rgba(0, 150, 255, 0.7)',
                borderWidth: 2,
                arrowHead: true
            },
            
            // Cone targeting
            cone: {
                color: 'rgba(255, 150, 0, 0.3)',
                borderColor: 'rgba(255, 150, 0, 0.7)',
                borderWidth: 2
            }
        }
    },
    
    // Hero-specific effects
    heroEffects: {
        'axe': {
            primaryColor: '#ff3300',
            secondaryColor: '#cc0000',
            particleColor: 0xff3300,
            soundVolume: 1.0
        },
        'crystal-maiden': {
            primaryColor: '#99ccff',
            secondaryColor: '#0099ff',
            particleColor: 0x80e5ff,
            soundVolume: 0.8
        },
        'lich': {
            primaryColor: '#0066cc',
            secondaryColor: '#003399',
            particleColor: 0x0066cc,
            soundVolume: 0.9
        },
        'storm-spirit': {
            primaryColor: '#00cc66',
            secondaryColor: '#009933',
            particleColor: 0x00ff99,
            soundVolume: 1.0
        }
    },
    
    // Skill type effects
    skillTypeEffects: {
        'attack': {
            color: '#ff3333',
            particleColor: 0xff3333,
            soundType: 'impact'
        },
        'aoe': {
            color: '#ff9900',
            particleColor: 0xff9900,
            soundType: 'explosion'
        },
        'buff': {
            color: '#33cc33',
            particleColor: 0x33cc33,
            soundType: 'buff'
        },
        'debuff': {
            color: '#cc3300',
            particleColor: 0xcc3300,
            soundType: 'debuff'
        },
        'movement': {
            color: '#3399ff',
            particleColor: 0x3399ff,
            soundType: 'movement'
        },
        'utility': {
            color: '#cc99ff',
            particleColor: 0xcc99ff,
            soundType: 'utility'
        }
    },
    
    // First letter display on skill buttons
    skillLetterDisplay: {
        enabled: true,
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        shadow: true,
        shadowColor: 'rgba(0, 0, 0, 0.7)',
        shadowBlur: 3,
        position: 'center'
    },
    
    // Key hint display on skill buttons
    keyHintDisplay: {
        enabled: true,
        position: 'top-right',
        size: 18,
        padding: 4,
        borderRadius: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        textColor: 'white',
        fontWeight: 'bold'
    }
};

// Export the configuration
if (typeof module !== 'undefined') {
    module.exports = EffectsConfig;
}