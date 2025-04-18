# Enhanced Camera During Jump and Flight

## Issue Description
The camera needed to be enhanced during jump and flight to provide a better view of the game world when the hero is at a high position. The goal was to make the camera move in a way that allows players to see a larger area and more of the sky when they are at high positions.

## Implementation Details

### Camera Field of View Adjustment
- Added dynamic field of view (FOV) adjustment based on hero's height
- As the hero jumps higher, the FOV gradually increases to show more of the surrounding area
- The FOV adjustment is proportional to the normalized height (relative to maximum jump height)
- Added `cameraFovIncrease` parameter to control the maximum FOV increase at maximum height

### Camera Position Adjustments
- Implemented camera backing away as the hero gains altitude
- This creates a more expansive view of the area below and around the hero
- Added `cameraBackOffset` parameter to control how much the camera moves back
- The camera movement is proportional to the hero's height

### Sky View Enhancement
- Modified the camera's look target to show more of the sky at higher altitudes
- At low heights, the camera looks more downward (as before)
- At high heights, the camera adjusts to look more toward the horizon
- Added `cameraSkyViewFactor` parameter to control this adjustment

### Smooth Transitions
- Implemented gradual transitions for all camera adjustments
- FOV changes only occur when the difference is significant (to avoid constant small updates)
- All adjustments are proportional to normalized height for smooth transitions

## Configuration Parameters
Added new parameters to the jump configuration in `config/movement/jump.js`:
```javascript
// Camera settings during jump
cameraBackOffset: 0.5,      // How much to move camera back as height increases
cameraFovIncrease: 10,      // How much to increase field of view at max height
cameraSkyViewFactor: 0.4,   // How much to adjust camera to see more sky (0-1)
```

## Technical Implementation
The implementation enhances the `followJump` method in the camera object:
1. Calculates normalized height based on current height and maximum jump height
2. Adjusts camera position based on height and configuration parameters
3. Modifies field of view based on height
4. Adjusts look target to show more sky at higher altitudes
5. Maintains smooth transitions between different heights

## Visual Effect
- At low heights: Camera behaves similarly to before, with a focus on the ground below
- At medium heights: Camera begins to back away and show more of the surrounding area
- At high heights: Camera provides a more expansive view with increased FOV and more sky visibility
- The overall effect creates a more dynamic and immersive experience during jumps and flight

## Files Modified
- `/js/game.js`: Enhanced the camera's `followJump` method
- `/config/movement/jump.js`: Added new camera configuration parameters