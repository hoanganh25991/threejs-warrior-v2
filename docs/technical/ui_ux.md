# UI/UX Design

## Design Philosophy

### Core Principles

#### Clarity First
- **Information Hierarchy**: Most important information most visible
- **Visual Distinction**: Clear differentiation between interactive and non-interactive elements
- **Consistent Language**: Uniform terminology and iconography
- **Purposeful Design**: Every UI element serves a specific function
- **Minimized Cognitive Load**: Information presented in digestible chunks

#### Player-Centric Design
- **Context Sensitivity**: UI adapts to current player situation
- **Progressive Disclosure**: Complex information revealed as needed
- **Customization Options**: Player control over UI configuration
- **Accessibility Focus**: Designed for players of all abilities
- **Feedback Loops**: Clear response to all player actions

#### Immersive Integration
- **Diegetic Elements**: UI elements that exist within the game world
- **Thematic Consistency**: Visual style matches game aesthetic
- **Minimal Intrusion**: Non-critical elements remain unobtrusive
- **Seamless Transitions**: Smooth movement between UI states
- **Environmental Awareness**: UI adapts to visual context

### Visual Style

#### Aesthetic Direction
- **Stylized Fantasy**: Clean, readable design with fantasy elements
- **Faction Theming**: Sentinel UI uses light, organic shapes; Scourge UI uses dark, angular forms
- **Color Palette**:
  - Primary: Deep blue (#1A3C5A) and warm gold (#D4AF37)
  - Sentinel: Emerald green (#1E8449) and silver (#C0C0C0)
  - Scourge: Crimson (#B71C1C) and bronze (#CD7F32)
  - Neutral: Stone gray (#707070) and parchment (#F5F5DC)
  
- **Typography**:
  - Headers: "Ancient" font (serif with fantasy elements)
  - Body Text: "Clarity" font (sans-serif optimized for readability)
  - Emphasis: Italics and weight variation rather than color
  - Minimum Size: 16px for standard resolution, scalable

#### Visual Hierarchy
- **Size Relationship**: Larger elements have higher importance
- **Color Coding**:
  - White/Gold: Primary information
  - Green: Positive effects/buffs
  - Red: Negative effects/debuffs
  - Blue: Magic/mana related
  - Yellow: Warnings/notifications
  
- **Contrast Principles**: 4.5:1 minimum contrast ratio for text
- **Grouping Logic**: Related elements visually connected
- **Negative Space**: Strategic use of emptiness to direct attention

## HUD Elements

### Combat Interface

#### Health and Resource Display
- **Health Bar**:
  - Position: Top-left of screen
  - Visualization: Horizontal bar with clear segmentation
  - Color: Green to red gradient based on percentage
  - Features: Numeric display, recent damage indication, regeneration prediction
  - Special States: Pulsing when critical, shield overlay when protected
  
- **Resource Bar**:
  - Position: Below health bar
  - Visualization: Varies by hero type
    - Mana: Blue bar with ripple effect
    - Rage: Red bar that builds from empty
    - Energy: Yellow segmented bar with rapid regeneration
  - Features: Numeric display, cost indicators for abilities
  - Special States: Flashing when ability can be used but resource is low

#### Ability Display
- **Ability Bar**:
  - Position: Bottom-center of screen
  - Layout: 4 primary abilities with clear Q,W,E,R indicators
  - Visual State: Available, on cooldown, insufficient resources
  - Cooldown Display: Circular overlay with remaining time
  - Resource Cost: Small indicator showing required resource
  
- **Passive Ability**:
  - Position: Left of ability bar
  - Visualization: Smaller icon with passive indicator
  - States: Active, inactive (if togglable)
  - Information: Tooltip with detailed explanation
  
- **Ultimate Ability**:
  - Position: Larger icon at right of ability bar
  - Visualization: Distinctive frame with dramatic activation effect
  - Cooldown: More prominent timer display
  - Availability: Clear indication when newly available

#### Target Information
- **Target Frame**:
  - Position: Top-right of screen when target selected
  - Content: Portrait, name, level, health/resource bars
  - Enemy Info: Armor type, resistance indicators, active effects
  - Ally Info: Class icon, status effects, current action
  - Interactive Elements: Target-specific action buttons
  
- **Target Indicators**:
  - Selected Target: Prominent outline around targeted unit
  - Hostile/Friendly: Color-coded selection rings
  - Status Display: Icons showing crowd control or buffs
  - Threat Level: Visual indicator of enemy danger level

#### Minimap
- **Map Display**:
  - Position: Bottom-right corner
  - Size: Approximately 1/8 of screen, resizable
  - Zoom Levels: Adjustable detail level
  - Orientation: Rotates with camera or fixed north (player choice)
  
- **Map Elements**:
  - Player: Distinctive arrow showing position and facing
  - Allies: Blue dots or icons
  - Enemies: Red dots or icons (when detected)
  - Objectives: Yellow markers with distinctive icons
  - Points of Interest: White markers for discoveries
  
- **Map Interactions**:
  - Click to Set Waypoint: Personal navigation marker
  - Ping System: Contextual markers for communication
  - Area Highlighting: Mission-relevant zones
  - Fog of War: Unexplored areas darkened

### Information Displays

#### Status Effects
- **Buff Display**:
  - Position: Below health bar or top-right corner
  - Visualization: Small icons with duration timers
  - Categorization: Beneficial effects separated from harmful
  - Stacking: Numerical indicator for multiple instances
  - Priority: Critical effects shown first/larger
  
- **Debuff Display**:
  - Position: Separate from buffs for clear distinction
  - Visualization: Red-bordered icons with countdown
  - Severity Indicator: Border color or thickness
  - Cleansable Indication: Special highlight for removable effects
  - Character Effect: Visual effect on character model

#### Notifications
- **Alert System**:
  - Position: Center-top for critical, right side for standard
  - Duration: Based on importance (3-10 seconds)
  - Animation: Slide in, fade out
  - Stacking: Queue system for multiple notifications
  - Dismissal: Click to acknowledge important alerts
  
- **Achievement Notifications**:
  - Position: Top-right corner
  - Style: Distinctive banner with icon and text
  - Animation: More celebratory than standard notifications
  - Reward Display: Clear indication of any rewards earned
  - Collection: Added to achievement log for later review

#### Combat Text
- **Damage Numbers**:
  - Position: Above affected character
  - Color Coding: Player damage (bright), received damage (red), critical hits (larger/yellow)
  - Movement: Slight upward float and fade
  - Grouping: Rapid hits combined with count indicator
  - Size Scaling: Based on damage relative to max health
  
- **Combat Alerts**:
  - Position: Center screen for player, above units for others
  - Types: "Stunned", "Silenced", "Critical", "Dodged", etc.
  - Animation: Attention-grabbing but not distracting
  - Duration: Matches the effect duration
  - Audio Sync: Paired with appropriate sound effect

#### Quest Tracker
- **Active Quest Display**:
  - Position: Top-right of screen
  - Content: Current objective with progress indicator
  - Capacity: Up to 3 tracked quests simultaneously
  - Interaction: Click to open full quest details
  - Proximity Alert: Highlight when near objective
  
- **Objective Markers**:
  - World Indicators: Directional arrows or beacons
  - Distance Display: Approximate distance to objective
  - Multi-level Indication: Different icons for above/below
  - Contextual Information: Interaction type icon
  - Minimap Integration: Synchronized with minimap markers

## Menu Systems

### Main Menu Structure

#### Game Menus
- **Inventory (I)**:
  - Layout: Grid-based with equipment slots on character model
  - Categorization: Tabs for different item types
  - Item Display: Icon, name, basic stats at glance
  - Comparison: Hover comparison with equipped items
  - Interaction: Right-click menu for use/equip/drop
  
- **Character Sheet (C)**:
  - Layout: Character model with attribute panels
  - Content: Base stats, derived stats, resistances
  - Progression: Experience bar and level information
  - Reputation: Standing with various factions
  - Biography: Character background and story progress
  
- **Abilities (K)**:
  - Layout: Visual tree showing ability relationships
  - Advancement: Clear indication of upgrade paths
  - Point System: Available points and allocation
  - Preview: Effect changes from potential upgrades
  - Loadout: Ability configuration options
  
- **Talents (N)**:
  - Layout: Three columns representing specialization paths
  - Tier System: Horizontal rows unlocked at level milestones
  - Selection: One talent per tier, visual connection between choices
  - Effects: Clear description of gameplay impact
  - Respec Option: Cost and confirmation for resetting

#### System Menus
- **Options Menu**:
  - Categories: Gameplay, Graphics, Audio, Controls, UI, Accessibility
  - Layout: Left navigation, right content panel
  - Presets: Quick configuration options for common setups
  - Search: Filter option for finding specific settings
  - Tooltips: Detailed explanation of each setting
  
- **Social Menu**:
  - Friends List: Online status and activity
  - Recent Players: Recently encountered players
  - Block List: Managed list of blocked users
  - Profile: Personal statistics and achievements
  - Sharing: Screenshot and story moment sharing
  
- **Help System**:
  - Tutorial Access: Replay available tutorials
  - Controls Reference: Visual keyboard/controller layout
  - Glossary: Game terms and mechanics explained
  - FAQ: Common questions and answers
  - Support: Issue reporting and assistance

### Menu Navigation

#### Navigation Patterns
- **Hierarchical Structure**: Clear parent-child relationship between menus
- **Breadcrumb Navigation**: Path display showing menu location
- **Consistent Controls**: Back button always returns to previous screen
- **Shortcut System**: Hotkeys for frequently accessed menus
- **Menu Memory**: Returns to last position when reopening menu

#### Transition Effects
- **Opening Animation**: Quick but visible transition (150ms)
- **State Preservation**: Maintain scroll position and selections
- **Loading Indicators**: Progress display for data-heavy menus
- **Focus Management**: Clear highlighting of current selection
- **Modal Contexts**: Dimmed background for focused attention

### Inventory System

#### Item Management
- **Grid Layout**:
  - Organization: 6×10 grid of inventory slots
  - Visual Grouping: Optional auto-sort by type
  - Size Variation: Some items occupy multiple slots
  - Weight System: Capacity limit with encumbrance effects
  - Expansion: Unlockable additional space
  
- **Item Interaction**:
  - Drag and Drop: Intuitive movement between slots
  - Stack Management: Split and combine stackable items
  - Quick Actions: Right-click menu for common functions
  - Comparison: Side-by-side stat comparison
  - Bulk Operations: Multi-select for mass actions

#### Equipment Interface
- **Paper Doll System**:
  - Character Model: Visual representation of equipped items
  - Slot Highlighting: Clear indication of compatible slots
  - Set Visualization: Indicators for item set pieces
  - Visual Effects: Preview of special item effects
  - Rotation: 360° view of equipped character
  
- **Equipment Slots**:
  - Head, Chest, Hands, Legs, Feet, Shoulders, Back
  - Weapon (Main-hand, Off-hand or Two-handed)
  - Accessories (2 Ring slots, 1 Amulet, 1 Trinket)
  - Quick Access (5 consumable slots)
  - Visual Slots (cosmetic overrides)

## Interaction Design

### Selection and Targeting

#### Target Selection
- **Click Selection**:
  - Precision: Accurate hitbox detection
  - Prioritization: Intelligent selection in crowded areas
  - Feedback: Clear visual and audio confirmation
  - Toggle: Double-click to lock selection
  - Deselection: Click empty space or Escape key
  
- **Tab Targeting**:
  - Cycling: Press Tab to cycle through nearby targets
  - Priority: Enemies > Interactive Objects > NPCs
  - Distance Sorting: Nearest targets first
  - Direction Bias: Preference for targets in facing direction
  - Visual Indicator: Highlight current tab selection

#### Ability Targeting
- **Target Types**:
  - Direct Target: Requires specific unit selection
  - Ground Target: Area-based targeting with radius indicator
  - Direction Target: Linear effect in specified direction
  - Self Cast: Automatically targets the player
  - Smart Cast: Context-sensitive automatic targeting
  
- **Targeting UI**:
  - Range Indicators: Clear display of maximum range
  - Area Preview: Highlighted effect zone
  - Line of Sight: Indication of targeting obstructions
  - Valid/Invalid Feedback: Color change for illegal targets
  - Quick Cast Option: Immediate activation on key press

### Feedback Systems

#### Visual Feedback
- **Interaction States**:
  - Hover: Subtle highlight on mouseover
  - Selected: Clear outline or effect
  - Active: Animation or effect during interaction
  - Disabled: Grayed out appearance
  - Cooldown: Visual timer representation
  
- **Progress Indicators**:
  - Loading Bars: Clear percentage display
  - Circular Timers: Radial fill for durations
  - Completion Markers: Checkmarks or similar indicators
  - Staged Progress: Multi-step process visualization
  - Thresholds: Important points marked on progress bars

#### Audio Feedback
- **Interaction Sounds**:
  - Button Clicks: Subtle but satisfying response
  - Success/Failure: Distinct sounds for outcomes
  - Alerts: Attention-grabbing for important notifications
  - Ambient UI: Background sounds for different menu contexts
  - Volume Hierarchy: Critical feedback louder than routine
  
- **Voice Feedback**:
  - Character Responses: Verbal confirmation of commands
  - System Announcements: Important game state changes
  - Contextual Comments: Situation-appropriate remarks
  - Tutorial Guidance: Instructional voice prompts
  - Frequency Control: Prevents repetitive voice lines

#### Haptic Feedback
- **Controller Vibration**:
  - Intensity Variation: Matched to event significance
  - Pattern Language: Different patterns for different events
  - Directional Hints: Indicates direction of off-screen events
  - Contextual Effects: Environmental feedback (terrain, weather)
  - Adaptive Triggers: Resistance changes based on action (supported controllers)

### Error Prevention and Recovery

#### Preventative Design
- **Confirmation Dialogs**: Verification for significant actions
- **Predictive Input**: Suggestions based on partial entry
- **Input Validation**: Real-time feedback on invalid entries
- **Undo Functionality**: Immediate reversal of recent actions
- **Preview Effects**: Show outcomes before confirming actions

#### Error Handling
- **Clear Error Messages**: Plain language explanation of issues
- **Recovery Suggestions**: Recommended actions to resolve errors
- **Graceful Degradation**: Partial functionality when complete operation fails
- **State Preservation**: Maintain input during error recovery
- **Error Logging**: Background recording for support purposes

## Onboarding Experience

### Tutorial Systems

#### Initial Tutorial
- **Guided Introduction**: Step-by-step introduction to core mechanics
- **Contextual Learning**: Teaching mechanics as they become relevant
- **Interactive Demonstrations**: Player performs actions after instruction
- **Pacing Control**: Player determines when to advance
- **Minimal Restriction**: Only essential limitations during learning

#### Ongoing Guidance
- **Just-in-Time Instructions**: New mechanics explained upon first encounter
- **Hint System**: Optional tips for current situation
- **Skill Challenges**: Optional practice scenarios for specific abilities
- **Refresher Access**: Ability to replay tutorials for forgotten mechanics
- **Progressive Complexity**: Advanced techniques introduced after mastery of basics

### Help Resources

#### In-Game Documentation
- **Codex System**: Encyclopedic reference of game mechanics
- **Contextual Help**: Right-click "What's This?" functionality
- **Search Functionality**: Keyword search across all help content
- **Visual Guides**: Illustrated explanations of complex systems
- **Video Tutorials**: Short clips demonstrating techniques

#### UI Assistance
- **Tooltips**: Hover information for all interactive elements
- **Extended Tooltips**: Hold Shift for detailed information
- **Guided Tours**: Optional walkthrough of new interfaces
- **Contextual Buttons**: Help buttons in specific interfaces
- **Status Explanations**: Clear descriptions of effects and conditions

## Accessibility Features

### Visual Accessibility

#### Text Customization
- **Text Scaling**: Adjustable size from 100-200%
- **Font Options**: Alternative typefaces for readability
- **Contrast Settings**: Enhanced contrast modes
- **Text Background**: Toggle for improved text visibility
- **Line Spacing**: Adjustable for easier reading

#### Color Modifications
- **Colorblind Modes**:
  - Protanopia (red-blind)
  - Deuteranopia (green-blind)
  - Tritanopia (blue-blind)
  - Monochromacy (complete color blindness)
  
- **Custom Color Remapping**: User-defined color substitutions
- **High Contrast UI**: Bold outlines and enhanced separation
- **Pattern Differentiation**: Using patterns in addition to colors
- **Brightness/Contrast Controls**: Fine-tuning of visual presentation

### Audio Accessibility

#### Sound Options
- **Volume Mixing**: Individual control for different sound types
  - Voice Volume
  - Effect Volume
  - Ambient Volume
  - UI Sound Volume
  - Music Volume
  
- **Audio Processing**:
  - Dynamic Range Compression: Reduces difference between loud and soft sounds
  - Frequency Shifting: Moves sounds to more audible ranges
  - Mono Audio: Single-channel option for hearing impairment
  - Background Reduction: Lowers ambient noise during dialogue

#### Text Alternatives
- **Subtitles**:
  - Speaker Identification
  - Customizable Size and Background
  - Positioning Options
  - Timing Control
  
- **Closed Captions**:
  - Sound Effect Descriptions
  - Musical Cues Noted
  - Environmental Sound Information
  - Directional Indicators

### Cognitive Accessibility

#### Information Management
- **Simplified Mode**: Reduced information density
- **Focus Assistance**: Highlighting of critical elements
- **Reminder System**: Optional prompts for learned mechanics
- **Task Tracking**: Clear checklist of current objectives
- **Progress Visualization**: Visual representation of advancement

#### Customizable Complexity
- **Difficulty Layers**: Separate settings for different game aspects
  - Combat Difficulty
  - Puzzle Complexity
  - Navigation Assistance
  - Timing Requirements
  - Resource Management
  
- **Automation Options**: Optional automatic handling of routine tasks
- **Pace Control**: Adjustable game speed for certain elements
- **Practice Mode**: Consequence-free environment for learning
- **Cognitive Aids**: Memory assistance for complex sequences