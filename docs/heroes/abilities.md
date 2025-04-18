# Abilities

## Ability System Overview

### Core Mechanics

#### Ability Components
- **Cooldown**: Time before ability can be used again
- **Resource Cost**: Mana, energy, rage, or other resource required
- **Targeting Type**: Self, target, direction, area, or global
- **Effect**: Damage, healing, crowd control, or utility
- **Scaling**: How the ability improves with attributes or level

#### Resource Types
- **Mana**: Traditional magic resource with large pool and slow regeneration
  - Used by: Crystal Maiden, Lich, Storm Spirit
  - Characteristics: Large pool, moderate regeneration, management over long fights
  
- **Rage**: Combat-generated resource that builds during battle
  - Used by: Axe, future warriors
  - Characteristics: Starts low, builds through combat, decays when out of combat
  
- **Energy**: Fast-regenerating resource with lower maximum
  - Used by: Future assassin heroes
  - Characteristics: Quick regeneration, lower maximum, burst usage
  
- **Specialty Resources**: Unique to specific heroes
  - Examples: Charges, combo points, transformation states
  - Characteristics: Unique mechanics that define hero playstyle

#### Targeting Systems
- **Point Target**: Ability is aimed at a specific location
- **Unit Target**: Ability is cast on a specific unit (ally or enemy)
- **Direction Target**: Ability is cast in a direction from the hero
- **Area Target**: Ability affects all units in a defined area
- **Self Cast**: Ability is automatically cast on the hero
- **Global**: Ability can target anywhere on the map

#### Ability Interactions
- **Ability Combos**: Specific sequences that create enhanced effects
- **Environmental Interactions**: Abilities affecting or affected by terrain
- **Status Effect Interactions**: Abilities that have special effects on debuffed targets
- **Hero Synergies**: Abilities from different heroes that work particularly well together

### Ability Advancement

#### Advancement System
- Each ability has three tiers of advancement
- Ability points earned through leveling (1 per level)
- Additional points from special quests and rare items
- Points can be redistributed at special locations for a cost

#### Tier Structure
- **Tier 1 (1 Point)**
  - Base functionality of the ability
  - Moderate damage/effect
  - Standard cooldown and resource cost

- **Tier 2 (2 Additional Points)**
  - Enhanced damage/effect (approximately +50%)
  - Reduced cooldown (approximately -20%)
  - Additional minor effect (e.g., slow, brief stun)
  - Improved area of effect or range

- **Tier 3 (3 Additional Points)**
  - Significantly enhanced damage/effect (approximately +100% from base)
  - Further reduced cooldown (approximately -40% from base)
  - Additional major effect (e.g., piercing damage, longer stun)
  - Fundamental improvement to ability functionality

#### Ability Modifications
- **Items**: Special equipment can modify ability effects
- **Talents**: Talent choices can fundamentally change how abilities work
- **Environmental Factors**: Certain areas can enhance specific ability types
- **Temporary Buffs**: Potions, scrolls, and ally abilities can enhance abilities
- **Permanent Upgrades**: Special quests can unlock hidden potential in abilities

## Axe (Mogul Khan) Abilities

### Passive: Counter Helix

#### Mechanics
- **Trigger**: 20% chance when Axe is attacked by an enemy
- **Damage**: 60/90/120 physical damage (scales with tier)
- **Area**: 300 unit radius around Axe
- **Affected Targets**: All enemy units in range
- **Special Properties**: Cannot be triggered more than once per 0.6 seconds

#### Tier Advancement
- **Tier 1**: Base functionality
- **Tier 2**: Increased proc chance to 25% and damage to 90
- **Tier 3**: Increased proc chance to 30%, damage to 120, and adds a 20% movement slow

#### Strategic Use
- Position to maximize number of enemies hit
- Use Berserker's Call to force enemies to attack and trigger Counter Helix
- Effective against groups of melee attackers
- Core damage source when building tanky

#### Visual Effects
- Axe performs a rapid 360° spin with his axe extended
- Red energy trail follows the axe blade
- Hit enemies display impact effects and damage numbers
- Distinctive "whoosh" sound followed by impact sounds

### Q: Berserker's Call

#### Mechanics
- **Type**: Area of Effect Taunt
- **Cooldown**: 16/14/12 seconds (scales with tier)
- **Resource Cost**: 80 rage
- **Cast Time**: Instant
- **Area**: 300 unit radius around Axe
- **Duration**: 2/2.5/3 seconds (scales with tier)
- **Effects**: 
  - Forces all enemies in range to attack Axe
  - Grants 30/40/50 bonus armor to Axe for the duration

#### Tier Advancement
- **Tier 1**: Base functionality
- **Tier 2**: Increased duration to 2.5 seconds, armor bonus to 40, reduced cooldown to 14 seconds
- **Tier 3**: Increased duration to 3 seconds, armor bonus to 50, reduced cooldown to 12 seconds, adds 20% damage reduction

#### Strategic Use
- Primary initiation tool for team fights
- Interrupt enemy actions by forcing them to attack Axe
- Set up multiple Counter Helix procs
- Protect allies by drawing enemy attention
- Create opportunities for allies to attack distracted enemies

#### Visual Effects
- Axe stomps the ground and roars with a visible shockwave
- Red energy pulses outward from Axe
- Affected enemies glow red and have small arrow indicators pointing toward Axe
- Axe gains a visible armor aura for the duration

### W: Battle Hunger

#### Mechanics
- **Type**: Single Target Damage Over Time/Buff
- **Cooldown**: 20/18/16 seconds (scales with tier)
- **Resource Cost**: 60 rage
- **Cast Time**: Instant
- **Range**: 750 units
- **Duration**: 10 seconds
- **Effects**:
  - Deals 15/25/35 damage per second to target enemy
  - Slows target movement speed by 10/15/20%
  - Target can remove the effect by killing any unit
  - Grants Axe 10/15/20% movement speed for the duration

#### Tier Advancement
- **Tier 1**: Base functionality
- **Tier 2**: Increased damage to 25 per second, slow to 15%, speed boost to 15%, reduced cooldown to 18 seconds
- **Tier 3**: Increased damage to 35 per second, slow to 20%, speed boost to 20%, reduced cooldown to 16 seconds, adds 10% attack speed boost

#### Strategic Use
- Harass enemies in the early game
- Slow fleeing enemies during pursuit
- Maintain rage generation during lulls in combat
- Force enemies to focus on killing units to remove the effect
- Use speed boost to reposition or chase

#### Visual Effects
- Axe points at the target with a threatening gesture
- Target is surrounded by swirling red energy
- Periodic damage pulses with small blood splatter effects
- Axe leaves brief red footprints when moving with the speed boost

### E: Culling Blade

#### Mechanics
- **Type**: Single Target Execution
- **Cooldown**: 75/65/55 seconds (scales with tier)
- **Resource Cost**: 120 rage
- **Cast Time**: 0.3 second cast animation
- **Range**: 150 units (melee)
- **Effects**:
  - If target is below 250/350/450 health threshold, instantly kills them
  - If target is above threshold, deals 150/200/250 damage
  - On successful execution, grants Axe and nearby allies 30% movement speed for 6 seconds
  - Successful execution refunds 60 rage

#### Tier Advancement
- **Tier 1**: Base functionality
- **Tier 2**: Increased threshold to 350 health, damage to 200, reduced cooldown to 65 seconds
- **Tier 3**: Increased threshold to 450 health, damage to 250, reduced cooldown to 55 seconds, successful execution reduces other ability cooldowns by 3 seconds

#### Strategic Use
- Secure kills on low-health enemies
- Execute priority targets in team fights
- Use speed boost to reposition team after a kill
- Psychological impact of execution animation can intimidate players
- Time usage for maximum rage efficiency with refund mechanic

#### Visual Effects
- Axe leaps toward the target with an overhead swing
- Successful execution causes a dramatic blood splash and unique kill animation
- Failed attempt shows a standard impact effect
- Allies affected by the speed boost gain a red aura
- Distinctive execution sound that can be heard across a wide area

### R: Bloodthirst (Ultimate)

#### Mechanics
- **Type**: Self Buff/Transformation
- **Cooldown**: 90/80/70 seconds (scales with tier)
- **Resource Cost**: 150 rage
- **Cast Time**: 0.5 second transformation animation
- **Duration**: 8/10/12 seconds (scales with tier)
- **Effects**:
  - Increases attack speed by 40/60/80%
  - Increases movement speed by 20/25/30%
  - Attacks cleave to hit all enemies in a 300 unit arc
  - Generates 50% more rage from all sources
  - Grants immunity to movement slowing effects

#### Tier Advancement
- **Tier 1**: Base functionality
- **Tier 2**: Increased duration to 10 seconds, attack speed bonus to 60%, movement speed to 25%, reduced cooldown to 80 seconds
- **Tier 3**: Increased duration to 12 seconds, attack speed bonus to 80%, movement speed to 30%, reduced cooldown to 70 seconds, adds 15% damage reduction

#### Strategic Use
- Activate before major engagements for maximum impact
- Use cleaving attacks to damage grouped enemies
- Combine with Berserker's Call to force enemies to group up
- Take advantage of slow immunity to chase fleeing targets
- Use increased rage generation to chain multiple abilities

#### Visual Effects
- Axe grows slightly larger with a pulsing red aura
- Eyes glow bright red during the effect
- Attacks show extended cleave animations with energy trails
- Footsteps leave brief burning marks on the ground
- Heavy, rapid heartbeat sound plays during the effect

## Crystal Maiden (Rylai) Abilities

### Passive: Arcane Aura

#### Mechanics
- **Effect**: Provides mana regeneration to Crystal Maiden and nearby allies
- **Self Regeneration**: 1.5/2/2.5 mana per second (scales with tier)
- **Ally Regeneration**: 0.75/1/1.25 mana per second (scales with tier)
- **Area**: 900 unit radius around Crystal Maiden
- **Special Properties**: Effect persists for 5 seconds after allies leave the aura radius

#### Tier Advancement
- **Tier 1**: Base functionality
- **Tier 2**: Increased self regeneration to 2 mana per second, ally regeneration to 1 mana per second
- **Tier 3**: Increased self regeneration to 2.5 mana per second, ally regeneration to 1.25 mana per second, adds 5% cooldown reduction for all affected allies

#### Strategic Use
- Position to maximize ally coverage while staying safe
- Core support ability for mana-intensive team compositions
- Allows more liberal use of abilities during extended engagements
- Reduces downtime between fights due to mana constraints
- Particularly valuable in the early game when mana pools are limited

#### Visual Effects
- Subtle blue energy wisps circling affected allies
- Faint snowflake particles floating around Crystal Maiden
- Pulsing blue glow on Crystal Maiden's staff
- Gentle chiming sound when allies enter the aura radius

### Q: Crystal Nova

#### Mechanics
- **Type**: Area of Effect Damage/Slow
- **Cooldown**: 9/8/7 seconds (scales with tier)
- **Resource Cost**: 100/115/130 mana (scales with tier)
- **Cast Time**: 0.3 second cast animation
- **Range**: 700 units
- **Area**: 400 unit radius circle
- **Effects**:
  - Deals 100/150/200 magical damage to all enemies in the area
  - Slows movement speed by 20/30/40% for 3/3.5/4 seconds
  - Slows attack speed by 20% for 3/3.5/4 seconds
  - Reveals invisible units in the area

#### Tier Advancement
- **Tier 1**: Base functionality
- **Tier 2**: Increased damage to 150, slow to 30%, duration to 3.5 seconds, reduced cooldown to 8 seconds
- **Tier 3**: Increased damage to 200, slow to 40%, duration to 4 seconds, reduced cooldown to 7 seconds, adds a 20% magic resistance reduction

#### Strategic Use
- Area control during team fights
- Slowing enemy advances or retreats
- Revealing invisible units or checking bushes
- Setting up for other abilities that are easier to land on slowed targets
- Interrupting channeled abilities with the damage component

#### Visual Effects
- Burst of ice crystals and snow erupting from the ground
- Affected area briefly covered in frost
- Slowed enemies have ice particles clinging to them
- Distinctive crystalline sound on cast followed by a freezing wind sound

### W: Frostbite

#### Mechanics
- **Type**: Single Target Disable
- **Cooldown**: 10/9/8 seconds (scales with tier)
- **Resource Cost**: 125/140/155 mana (scales with tier)
- **Cast Time**: 0.3 second cast animation
- **Range**: 500 units
- **Duration**: 2/2.5/3 seconds (scales with tier)
- **Effects**:
  - Encases an enemy in ice, preventing movement and attack
  - Deals 50 magical damage per second
  - Interrupts channeled abilities
  - Prevents certain movement abilities from being used

#### Tier Advancement
- **Tier 1**: Base functionality
- **Tier 2**: Increased duration to 2.5 seconds, reduced cooldown to 9 seconds
- **Tier 3**: Increased duration to 3 seconds, reduced cooldown to 8 seconds, adds a 150 damage burst when the effect ends

#### Strategic Use
- Interrupting enemy abilities or attacks
- Securing kills on fleeing targets
- Protecting allies from dangerous melee attackers
- Setting up precision skill shots for allies
- Primary single-target control ability

#### Visual Effects
- Target is surrounded by growing ice crystals that encase them
- Frozen enemies have a blue-white tint and frost particles
- Ice occasionally cracks and reforms during the effect
- Freezing sound on cast followed by ice cracking sounds

### E: Glacial Path

#### Mechanics
- **Type**: Mobility/Utility
- **Cooldown**: 15/13/11 seconds (scales with tier)
- **Resource Cost**: 75/85/95 mana (scales with tier)
- **Cast Time**: 0.3 second cast animation
- **Range**: 800 units
- **Width**: 300 units
- **Duration**: 5/6/7 seconds (scales with tier)
- **Effects**:
  - Creates a path of ice in a target direction
  - Allies moving on the path gain 20/30/40% movement speed
  - Enemies moving on the path are slowed by 20/30/40%
  - Path can cross otherwise impassable terrain

#### Tier Advancement
- **Tier 1**: Base functionality
- **Tier 2**: Increased duration to 6 seconds, speed modification to 30%, reduced cooldown to 13 seconds
- **Tier 3**: Increased duration to 7 seconds, speed modification to 40%, reduced cooldown to 11 seconds, allies on the path gain 15% damage reduction

#### Strategic Use
- Creating escape routes for allies
- Pursuing fleeing enemies
- Crossing terrain obstacles
- Setting up positional advantages in team fights
- Controlling chokepoints by creating favorable movement conditions

#### Visual Effects
- Trail of crystalline ice forming along the ground
- Snowflake particles rising from the path
- Allies on the path leave glowing blue footprints
- Enemies on the path leave cracked ice behind them
- Gentle wind chime sound as the path forms

### R: Freezing Field (Ultimate)

#### Mechanics
- **Type**: Channeled Area of Effect Damage
- **Cooldown**: 90/80/70 seconds (scales with tier)
- **Resource Cost**: 200/250/300 mana (scales with tier)
- **Cast Time**: Channeled for up to 10 seconds
- **Area**: 600 unit radius around Crystal Maiden
- **Effects**:
  - Summons a blizzard that deals 150/200/250 magical damage per second
  - Slows enemy movement by 30/35/40% within the area
  - Damage is applied in random explosions within the area
  - Channel can be interrupted by stuns, silences, or other disabling effects
  - Crystal Maiden is slowed by 20% while channeling

#### Tier Advancement
- **Tier 1**: Base functionality
- **Tier 2**: Increased damage to 200 per second, slow to 35%, reduced cooldown to 80 seconds
- **Tier 3**: Increased damage to 250 per second, slow to 40%, reduced cooldown to 70 seconds, adds 20% magic resistance to Crystal Maiden while channeling

#### Strategic Use
- Massive area control during team fights
- Zoning enemies away from objectives
- Combining with ally crowd control for maximum effect
- Using from fog of war or bushes to surprise enemies
- Requires protection from allies to channel effectively

#### Visual Effects
- Massive swirling snowstorm with ice shards
- Crystal Maiden levitates slightly off the ground while channeling
- Random explosions of ice within the area
- Screen edge frost effects for players within the blizzard
- Howling wind sound increasing in intensity during the channel

## Lich (Kel'Thuzad) Abilities

### Passive: Frost Armor

#### Mechanics
- **Trigger**: Activates when Lich is attacked
- **Cooldown**: 6/5/4 seconds between activations (scales with tier)
- **Duration**: 4/5/6 seconds (scales with tier)
- **Effects**:
  - Provides 15/25/35 bonus armor
  - Attackers are slowed by 20/25/30% for 2 seconds
  - Melee attackers take 20/30/40 cold damage

#### Tier Advancement
- **Tier 1**: Base functionality
- **Tier 2**: Increased armor to 25, slow to 25%, damage to 30, duration to 5 seconds, reduced cooldown to 5 seconds
- **Tier 3**: Increased armor to 35, slow to 30%, damage to 40, duration to 6 seconds, reduced cooldown to 4 seconds, adds 15% magic resistance

#### Strategic Use
- Trading attacks advantageously with the armor bonus
- Deterring melee attackers with the slow and damage
- Core defensive ability against physical damage
- Particularly effective against fast-attacking enemies
- Allows Lich to position more aggressively than other mages

#### Visual Effects
- Ice crystals forming around Lich's body when activated
- Flash of cold energy when struck during the effect
- Attackers are briefly covered in frost particles
- Crackling ice sound when the armor activates

### Q: Frost Nova

#### Mechanics
- **Type**: Area of Effect Damage/Slow
- **Cooldown**: 8/7/6 seconds (scales with tier)
- **Resource Cost**: 125/140/155 mana (scales with tier)
- **Cast Time**: 0.3 second cast animation
- **Range**: 600 units
- **Area**: 350 unit radius circle
- **Effects**:
  - Deals 120/180/240 magical damage to all enemies in the area
  - Slows movement speed by 30/40/50% for 3 seconds
  - Slows attack speed by 20/25/30% for 3 seconds

#### Tier Advancement
- **Tier 1**: Base functionality
- **Tier 2**: Increased damage to 180, movement slow to 40%, attack slow to 25%, reduced cooldown to 7 seconds
- **Tier 3**: Increased damage to 240, movement slow to 50%, attack slow to 30%, reduced cooldown to 6 seconds, adds a 2-second magic resistance reduction of 20%

#### Strategic Use
- Area control during team fights
- Slowing enemy advances or retreats
- Setting up for Chain Frost by grouping slowed enemies
- Interrupting channeled abilities with the damage component
- Effective wave clear against groups of weaker enemies

#### Visual Effects
- Explosion of ice crystals from the ground with a frost shockwave
- Affected area briefly covered in frost with ice spikes
- Slowed enemies have ice particles clinging to them
- Deep freezing sound followed by cracking ice

### W: Dark Ritual

#### Mechanics
- **Type**: Resource Management/Sacrifice
- **Cooldown**: 45/40/35 seconds (scales with tier)
- **Resource Cost**: 20% current health
- **Cast Time**: 0.5 second cast animation
- **Effects**:
  - Sacrifices 20% of Lich's current health
  - Restores 150/225/300 mana (scales with tier)
  - Grants 10/15/20% spell damage for 10 seconds

#### Tier Advancement
- **Tier 1**: Base functionality
- **Tier 2**: Increased mana restored to 225, spell damage to 15%, reduced cooldown to 40 seconds
- **Tier 3**: Increased mana restored to 300, spell damage to 20%, reduced cooldown to 35 seconds, reduces health cost to 15% of current health

#### Strategic Use
- Maintaining mana in extended fights
- Emergency resource generation when out of mana
- Trading health for increased damage potential
- Core ability for Lich's sustainability
- Timing usage to maximize the spell damage bonus

#### Visual Effects
- Dark energy transferring from Lich's body to his staff
- Brief skeletal glow visible through Lich's robes
- Staff glows with absorbed energy during the damage buff
- Eerie draining sound followed by a power surge sound

### E: Ice Chains

#### Mechanics
- **Type**: Single Target Control/Damage
- **Cooldown**: 12/10/8 seconds (scales with tier)
- **Resource Cost**: 100/115/130 mana (scales with tier)
- **Cast Time**: 0.3 second cast animation
- **Range**: 550 units
- **Duration**: 2/2.5/3 seconds (scales with tier)
- **Effects**:
  - Binds an enemy in chains of ice, rooting them
  - Deals 40/60/80 magical damage per second
  - Interrupts channeled abilities
  - Prevents certain movement abilities from being used

#### Tier Advancement
- **Tier 1**: Base functionality
- **Tier 2**: Increased duration to 2.5 seconds, damage to 60 per second, reduced cooldown to 10 seconds
- **Tier 3**: Increased duration to 3 seconds, damage to 80 per second, reduced cooldown to 8 seconds, chains can spread to a nearby enemy if they come within 200 units

#### Strategic Use
- Locking down priority targets
- Interrupting channeled abilities
- Securing kills on fleeing targets
- Setting up skill shots for allies
- Controlling dangerous melee attackers

#### Visual Effects
- Spectral chains of ice emerging from the ground to bind target
- Target is surrounded by swirling frost energy
- Chains occasionally tighten with pulses of damage
- Rattling chain sound combined with freezing effects

### R: Chain Frost (Ultimate)

#### Mechanics
- **Type**: Bouncing Area Damage
- **Cooldown**: 120/100/80 seconds (scales with tier)
- **Resource Cost**: 200/250/300 mana (scales with tier)
- **Cast Time**: 0.4 second cast animation
- **Range**: 750 units
- **Effects**:
  - Launches a ball of frost that bounces between enemies
  - Each bounce deals 200/275/350 magical damage and slows by 30/40/50% for 2 seconds
  - Can bounce 7/9/11 times (scales with tier)
  - Maximum bounce range of 575 units between targets
  - Each bounce increases damage by 5/7/10%

#### Tier Advancement
- **Tier 1**: Base functionality
- **Tier 2**: Increased damage to 275, slow to 40%, bounces to 9, damage increase to 7%, reduced cooldown to 100 seconds
- **Tier 3**: Increased damage to 350, slow to 50%, bounces to 11, damage increase to 10%, reduced cooldown to 80 seconds, final bounce creates a Frost Nova at that location

#### Strategic Use
- Maximum damage against grouped enemies
- Initiating team fights with the slow effect
- Following up crowd control that has grouped enemies
- Zoning enemies away from objectives
- Clearing groups of weaker enemies

#### Visual Effects
- Massive ice orb that leaves frost trails as it bounces
- Each impact creates a small explosion of ice
- Orb grows slightly with each bounce
- Affected enemies are briefly encased in a thin layer of ice
- Distinctive whooshing sound as the orb travels with impact sounds on hits

## Storm Spirit (Raijin Thunderkeg) Abilities

### Passive: Overload

#### Mechanics
- **Trigger**: Activates after Storm Spirit uses any ability
- **Duration**: Until next attack is used
- **Effects**:
  - Next attack deals 40/60/80 bonus magical damage (scales with tier)
  - Slows target by 30/40/50% for 0.6 seconds
  - Attack has 30% increased range
  - Hits all enemies in a small radius around the primary target

#### Tier Advancement
- **Tier 1**: Base functionality
- **Tier 2**: Increased damage to 60, slow to 40%, adds mana restoration equal to 1% of maximum mana
- **Tier 3**: Increased damage to 80, slow to 50%, mana restoration to 2% of maximum mana, adds a mini-stun effect of 0.3 seconds

#### Strategic Use
- Weaving attacks between abilities for maximum damage
- Using the slow effect to keep enemies within range
- Core damage source in Storm Spirit's combo
- Managing the buff for optimal timing
- Using the AoE effect to damage grouped enemies

#### Visual Effects
- Storm Spirit glows with intense blue electricity
- Crackling energy surrounds his hands
- Empowered attack sends a visible surge of lightning
- Distinctive charging sound when buff is active

### Q: Static Remnant

#### Mechanics
- **Type**: Area Trap/Damage
- **Cooldown**: 3.5/3/2.5 seconds (scales with tier)
- **Resource Cost**: 70/80/90 mana (scales with tier)
- **Cast Time**: Instant
- **Duration**: 12 seconds
- **Area**: 260 unit trigger radius
- **Effects**:
  - Creates an electrical duplicate that lasts for 12 seconds
  - Explodes when enemies come within 260 units, dealing 120/160/200 magical damage
  - Provides vision in a 600 unit radius
  - Maximum of 3 remnants can exist simultaneously

#### Tier Advancement
- **Tier 1**: Base functionality
- **Tier 2**: Increased damage to 160, reduced cooldown to 3 seconds, adds a 20% slow for 1 second
- **Tier 3**: Increased damage to 200, reduced cooldown to 2.5 seconds, slow to 30% for 1.5 seconds, remnants last 18 seconds

#### Strategic Use
- Area control during fights
- Checking bushes and providing vision
- Setting traps along escape routes
- Triggering Overload for additional damage
- Zoning enemies away from objectives

#### Visual Effects
- Crackling blue copy of Storm Spirit appears
- Copy occasionally makes small movements and gestures
- Explosion effect with lightning arcs when triggered
- Electrical humming sound from remnants with a thunder crack on explosion

### W: Electric Vortex

#### Mechanics
- **Type**: Single Target Control
- **Cooldown**: 18/16/14 seconds (scales with tier)
- **Resource Cost**: 85/100/115 mana (scales with tier)
- **Cast Time**: 0.3 second cast animation
- **Range**: 300 units
- **Duration**: 1/1.5/2 seconds (scales with tier)
- **Effects**:
  - Creates a vortex that pulls an enemy toward Storm Spirit
  - Target is unable to act during the pull
  - Interrupts channeled abilities
  - Pull speed is constant regardless of distance

#### Tier Advancement
- **Tier 1**: Base functionality
- **Tier 2**: Increased duration to 1.5 seconds, reduced cooldown to 16 seconds, range increased to 350 units
- **Tier 3**: Increased duration to 2 seconds, reduced cooldown to 14 seconds, range increased to 400 units, affects all enemies in a 250 unit radius around the target

#### Strategic Use
- Isolating targets for focused damage
- Interrupting channeled abilities
- Positioning enemies for Static Remnant explosions
- Setting up Overload-empowered attacks
- Pulling enemies away from allies

#### Visual Effects
- Swirling electrical currents that drag the target
- Lightning connects Storm Spirit to the affected enemy
- Target is surrounded by a spiral of electricity during the pull
- Electrical crackling sound increasing in pitch during the pull

### E: Lightning Dash

#### Mechanics
- **Type**: Mobility/Damage
- **Cooldown**: 6/5/4 seconds (scales with tier)
- **Resource Cost**: 60/70/80 mana (scales with tier)
- **Cast Time**: Instant
- **Range**: 600/700/800 units (scales with tier)
- **Effects**:
  - Storm Spirit dashes forward in a surge of lightning
  - Deals 70/100/130 magical damage to enemies he passes through
  - Can pass through terrain obstacles
  - Activates Overload upon completion

#### Tier Advancement
- **Tier 1**: Base functionality
- **Tier 2**: Increased damage to 100, range to 700 units, reduced cooldown to 5 seconds
- **Tier 3**: Increased damage to 130, range to 800 units, reduced cooldown to 4 seconds, adds a 30% slow to enemies passed through

#### Strategic Use
- Repositioning in combat
- Escaping danger
- Chasing fleeing enemies
- Passing through terrain for shortcuts
- Setting up Overload by dashing through an enemy then attacking

#### Visual Effects
- Blue lightning streak with Storm Spirit reforming at the end point
- Small electrical discharges left in the dash path
- Enemies hit have electricity briefly arcing across their bodies
- Zip sound effect with a thunder crack at the end

### R: Ball Lightning (Ultimate)

#### Mechanics
- **Type**: Global Mobility/Damage
- **Cooldown**: 12/10/8 seconds (scales with tier)
- **Resource Cost**: 30/25/20 + 8/7/6% of maximum mana per 100 units traveled (scales with tier)
- **Cast Time**: 0.3 second cast animation
- **Range**: Global (limited by mana pool)
- **Effects**:
  - Storm Spirit transforms into a ball of lightning that travels to a target location
  - Deals 150/200/250 magical damage to enemies along the path
  - Invulnerable during travel
  - Travel speed is 1600/1800/2000 units per second
  - Activates Overload upon arrival

#### Tier Advancement
- **Tier 1**: Base functionality
- **Tier 2**: Increased damage to 200, travel speed to 1800, reduced initial cost to 25 and travel cost to 7% per 100 units, reduced cooldown to 10 seconds
- **Tier 3**: Increased damage to 250, travel speed to 2000, reduced initial cost to 20 and travel cost to 6% per 100 units, reduced cooldown to 8 seconds, creates a Static Remnant at the arrival point

#### Strategic Use
- Long-distance travel across the map
- Dramatic repositioning in fights
- Escaping dangerous situations
- Initiating on unsuspecting enemies
- Chasing down fleeing targets

#### Visual Effects
- Massive lightning ball with Storm Spirit visible inside
- Electrical discharge trail left behind
- Lightning arcs to nearby enemies along the path
- Thunderous roaring sound during travel with a crash on landing