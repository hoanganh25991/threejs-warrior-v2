- [x] Each hero MUST have unique skills different from other. Update current 4 heros with their own skill set and effect
- [x] Hero has basic attack:
    - Basic attach is main circle
    - Other skills around this basic attack
    - Apply to default skill: jump, fly
    - Reference to Diablo Immortal for skills arrangment
- [x] Beside w,a,s,d keys to move, add joy stick on left hand side
    - to allow move in direction
    - single circle for joy stick
    - when user touch move, should another small circle on where it touched, where it drag to
    - direction change by that drag direction
    - reference to Diablo Immortal for joy stick move
- [x] Help me reflect all detail things we implementation into documents:
    - Select hero
    - Hero skills
    - Hero skills position
    - Hero health bar position
    - Enemy health bar position
    - Hero jump
    - Hero fly
    - Hero move by right lick, with effect on position clicked
    - Hero control: physical keyboard, virtual on screen
    - Develop for mobile landscape view can play
    - Develop for mobile touch can play
    - "config" folder, where we define everything about the game: hero size, skills, enemy health, hero health, skill cooldown, jump how far on press,...
When reflect details things, keep it organized with what layout in "docs" folder
- [x] Remove fly, only has JUMP button, if JUMP hold pressed, we increase increase and key increase height like take off fly, the gravity keep us down automatically when remove jump hold pressed
- [x] remove mouse left/right click/press to change height also
- [x] key press with "f" for jump, allow hold press as touch hold
- [x] Help me generate ghibli 'axe','crystal-maiden','lich','storm-spirit'
- [x] Add wings effect when hero fly (keep hold jump)
- [x] wings show up on the back of the hero
- [x] wings must have a lot of feathers
- [x] wings must keept on fly
- [x] wings effect from close to open, when user change from normal to fly (jump hold press)

- [] wing effect from open to close, when user hit back to the ground
- [] Jump hold press change hero height fly slowly: define threshold height, when pass that means fly -> show wings close to open effect, then jump on hold press now change height really SLOWLY, like just to fight against the gravity
- [] On jump, the camera view change with the hero's height
- [] Add avatar image to hero on selection by image under assets/images/heros

- [x] Fix: error_handler.js:1 [2025-04-18T20:23:03.883Z] ERROR: Error loading configuration files: Config not found in global scope: controlsConfig
- [x] hero.js:2024 Uncaught TypeError: ability.startCooldown is not a function
    at Hero.useAbility (hero.js:2024:17)
    at InputManager.handleAbilityKeyPress (input.js:76:34)
    at InputManager.handleKeyDown (input.js:53:18)
- [] Uncaught TypeError: Cannot read properties of undefined (reading 'key')
    at UIManager.updateAbilityCooldown (ui.js:305:75)
    at utils.js:225:13
    at Array.forEach (<anonymous>)
    at EventSystem.emit (utils.js:224:32)
    at Hero.attack (hero.js:789:16)
    at Hero.update (hero.js:3314:22)
    at Game.update (game.js:422:23)
- [] ui.js:305 Uncaught TypeError: Cannot read properties of undefined (reading 'key')
    at UIManager.updateAbilityCooldown (ui.js:305:75)
    at utils.js:225:13
    at Array.forEach (<anonymous>)
    at EventSystem.emit (utils.js:224:32)
    at Hero.attack (hero.js:789:16)
    at Hero.update (hero.js:3314:22)
    at Game.update (game.js:422:23)
    at Game.animate (game.js:453:14)

- [] skills when touch no trigger
- [] remove effect when hover skill with mouse
- [] skills show cool down effect
- [] Give first character of skill name as what shown on the skill button, give small number key to inform the user how to cast the skill as small circle on skill circle on the right, really small
- [] Remove moving by a,w,s,d, replace with arrow keys
- [] Same as basic attack button, i can press "a" to trigger basic attack
- [] Basic attack can auto choose any near by enemy to fight



