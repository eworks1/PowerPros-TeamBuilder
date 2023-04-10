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
    
    directions.slice(1).forEach(d => {
        const directionFills = this.querySelectorAll(`#${d.toLowerCase()} .fill`);
        const doubleGroup = this.querySelector(`#${d.toLowerCase()} .double-group`);
        if (doubleGroup && directionFills.length > 0) {
            directionFills.forEach(fill => {
                if (directionsUsed.includes(d)) {
                    // Make sure fills of directions that are used are shown.
                    fill.classList.remove('hidden');
                    doubleGroup.classList.remove('hidden');
                } else {
                    // Hide fills of directions not being used.
                    fill.classList.add('hidden');
                    doubleGroup.classList.add('hidden');
                }
            });
        }
    }, this);

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

    // Figure out directions that are doubled-up
    /** @type {string[]} */
    const doubledDirections = directionsUsed.reduce((prev, current, i, arr) => {
        let temp = prev;
        if (arr.lastIndexOf(current) > i) {
            temp.push(current);
        }
        return temp;
    }, new Array());

    // For each breaking ball, change gradient fill end
    pitches.forEach((p, i, arr) => {
        /** @type {{Name: string, Abbreviation: string, Direction: string}} */
        const fullPitch = all_pitches[p.id];
        const dir = fullPitch.Direction;
        
        const directionDoubleGroup = this.querySelector(`#${dir.toLowerCase()} .double-group`);
        const directionSingleGroup = this.querySelector(`#${dir.toLowerCase()} .single-group`);
        
        let groupClass = '';
        /** @type {number} */
        let barMinY;
        /** @type {number} */
        let barH;

        // If a single direction...
        if (!doubledDirections.includes(dir)) {
            if (directionSingleGroup && directionDoubleGroup) {
                directionSingleGroup.classList.remove('hidden');
                directionDoubleGroup.classList.add('hidden');
            }

            groupClass = '.single-group';
            barMinY = 82;
            barH = 40;
        } else {
            if (directionSingleGroup && directionDoubleGroup) {
                directionSingleGroup.classList.add('hidden');
                directionDoubleGroup.classList.remove('hidden');
            }

            // If there is another pitch coming up in the sequence with the same dir
            // in other words, returns true if this is the first of a double-direction
            if (arr.some((v, j) => all_pitches[v.id].Direction == all_pitches[p.id].Direction && j > i)) {
                groupClass = '.double-group .pitch-1-group';
            } else {
                groupClass = '.double-group .pitch-2-group';
            }

            barMinY = 92;
            barH = 20;
        }

        const directionFill = this.querySelector(`#${dir.toLowerCase()} ${groupClass} .fill`);
        if (directionFill) {
            if (p.level && p.level < 7) {
                const pitchLevelLength = 422 + p.level * 40;
                const partialBarPath = `M 422 ${barMinY} H ${pitchLevelLength} v ${barH} H 422 z`;
                directionFill.setAttribute('d', partialBarPath);
            } else {
                const fullBarPath = `M 422 ${barMinY} H 702 l ${barH / 2} ${barH / 2} l -${barH / 2} ${barH / 2} H 422 z`;
                directionFill.setAttribute('d', fullBarPath);
            }
        }
    }, this);
}
