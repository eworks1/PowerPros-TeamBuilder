// assume right is inside, left is outside, if pitcher throws L => mirror horizontally 

const directions = [
    'Up',
    'Inside',
    'Down-Inside',
    'Down',
    'Down-Outside',
    'Outside'
];

/**
 * @this {Document}
 * @param {{id: string, level: number | null}[]} pitches 
 */
function updatePitchChart(pitches) {
    /** @type {string[]} */
    let directionsUsed = pitches.map(p => all_pitches[p.id].Direction);
    let missingDirections = directions
        .filter(d => !directionsUsed.includes(d));
    
    // Hide fills of directions not being used.
    missingDirections.forEach(d => {
        const directionFill = this.querySelector(`#${d.toLowerCase()} .fill`);

        if (directionFill) {
            directionFill.classList.add('hidden');
        }
    });

    // Make sure fills of directions that are used are shown.
    directionsUsed.forEach(d => {
        const directionFill = this.querySelector(`#${d.toLowerCase()} .fill`);
        if (directionFill) {
            directionFill.classList.remove('hidden');
        }
    });

    // TODO: add code for pitches that use Up, but are in place of 4SFB+ (SP Fastball?)

    // Show/hide up arrows
    const singleUp = this.getElementById('single-up');
    const doubleUpGroup = this.getElementById('double-up-group');
    if (singleUp && doubleUpGroup) {
        // If there is an Up breaking ball, hide single-up and show double-up
        if (directionsUsed.includes('Up')) {
            singleUp.classList.add('hidden');
            doubleUpGroup.classList.remove('hidden');
        } else { // Otherwise show single-up and hide double-up
            singleUp.classList.remove('hidden');
            doubleUpGroup.classList.add('hidden');
        }
    }

    // For each breaking ball, change gradient fill end
    pitches.forEach(p => {
        /** @type {{Name: string, Abbreviation: string, Direction: string}} */
        const fullPitch = all_pitches[p.id];
        
        const directionFill = this.querySelector(`#${fullPitch.Direction.toLowerCase()} .fill`);
        if (directionFill) {
            if (p.level && p.level < 7) {
                const pitchLevelLength = 422 + p.level * 40;
                const partialBarPath = `M 422 82 H ${pitchLevelLength} v 40 H 422 z`;
                directionFill.setAttribute('d', partialBarPath);
            } else {
                const fullBarPath = 'M 422 82 H 702 l 20 20 l -20 20 H 422 z';
                directionFill.setAttribute('d', fullBarPath);
            }
        }
    });
}
