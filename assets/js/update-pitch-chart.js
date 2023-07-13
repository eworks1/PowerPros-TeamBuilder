// assume right is inside, left is outside, if pitcher throws L => mirror horizontally 

const directions = [
    'Inside',
    'Down-Inside',
    'Down',
    'Down-Outside',
    'Outside'
];

/**
 * @this {Document}
 * @param {{id: string, level: number | null}[]} pitches 
 * @param {boolean | string} leftHandedInput
 */
function updatePitchChart(pitches, leftHandedInput) {
    /** @type {string[]} */
    let directionsUsed = pitches.map(p => all_pitches[p.id].Direction);
    
    let leftHanded = ((typeof leftHandedInput == 'boolean' && leftHandedInput)
        || (typeof leftHandedInput == 'string' && leftHandedInput === 'true'));

    // Mirror horizontally if left-handed
    const bodyGroup = this.getElementById('pitching-chart-body');
    if (bodyGroup) {
        if (leftHanded) {
            bodyGroup.classList.add('left-handed')
        } else {
            bodyGroup.classList.remove('left-handed')
        }
    }
    
    // Update base showing/hiding of fills in directions not covered by pitches later
    directions.forEach(d => {
        const directionFills = this.querySelectorAll(`#${d.toLowerCase()} .fill`);
        const singleGroup = this.querySelector(`#${d.toLowerCase()} .single-group`);
        const doubleGroup = this.querySelector(`#${d.toLowerCase()} .double-group`);
        if (singleGroup && doubleGroup && directionFills.length > 0) {
            for (const fill of directionFills) {
                if (directionsUsed.includes(d)) {
                    // Make sure fills of directions that are used are shown.
                    fill.classList.remove('hidden');
                    doubleGroup.classList.remove('hidden');
                } else {
                    // Hide fills of directions not being used.
                    fill.classList.add('hidden');
                    singleGroup.classList.remove('hidden');
                    doubleGroup.classList.add('hidden');
                }
            }
        }

        // Hide all directional labels in prep for showing the used ones later
        const labelID = `${relativeDirToAbsolute(d.toLowerCase(), leftHanded)}-label`;
        const label1 = this.getElementById(`${labelID}-1`);
        const label2 = this.getElementById(`${labelID}-2`);
        if (label1 && label2) {
            label1.classList.add('hidden');
            label2.classList.add('hidden');
        }
    }, this);

    // Show/hide up arrows
    const singleUp = this.getElementById('single-up');
    const doubleUpGroup = this.getElementById('double-up-group');
    if (singleUp && doubleUpGroup) {
        if (directionsUsed.includes('Up 2')) {
            // If there is an Up breaking ball, hide single-up and show double-up
            singleUp.classList.add('hidden');
            doubleUpGroup.classList.remove('hidden');

            // Hide single up label
            const singleUpLabel = this.getElementById('up-label-0');
            if (singleUpLabel) {
                singleUpLabel.classList.add('hidden');
            }
            
            // Show double up labels
            const doubleUpLabel1 = this.getElementById('up-label-1');
            const doubleUpLabel2 = this.getElementById('up-label-2');
            if (doubleUpLabel1 && doubleUpLabel2) {
                doubleUpLabel1.classList.remove('hidden');
                doubleUpLabel2.classList.remove('hidden');
            }
        } else {
            // Otherwise show single-up and hide double-up
            singleUp.classList.remove('hidden');
            doubleUpGroup.classList.add('hidden');

            // Show single up label
            const singleUpLabel = this.getElementById('up-label-0');
            if (singleUpLabel) {
                singleUpLabel.classList.remove('hidden');
            }
            
            // Hide double up labels
            const doubleUpLabel1 = this.getElementById('up-label-1');
            const doubleUpLabel2 = this.getElementById('up-label-2');
            if (doubleUpLabel1 && doubleUpLabel2) {
                doubleUpLabel1.classList.add('hidden');
                doubleUpLabel2.classList.add('hidden');
            }
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

    // TODO: Refactor this into the code below
    // If there is no special pitch Up, reset Up-0 text
    const containsUp0SPPitch = pitches.some((p) => {
        /** @type {{Name: string, Abbreviation: string, Direction: string}} */
        const fullPitch = all_pitches[p.id];
        return fullPitch.Direction == 'Up 1'
            && fullPitch.Name.includes('SP');
    });
    if (!containsUp0SPPitch) {
        const singleUpLabel = this.getElementById('up-label-0');
        if (singleUpLabel) {
            singleUpLabel.innerHTML = createInnerHTML('Four-Seam Fastball', '4SFB');
        }
    }

    // For each breaking ball, change gradient fill end
    pitches.forEach((p, i, arr) => {
        /** @type {{Name: string, Abbreviation: string, Direction: string}} */
        const fullPitch = all_pitches[p.id];
        const dir = fullPitch.Direction
            .replace(/ \d/, '');
        
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

            // Show label
            let labelNum = 1;
            if (dir.toLowerCase().includes('down-')) {
                labelNum = 2;
            } else if (fullPitch.Direction == 'Up 1') {
                labelNum = 0;
            } else if (fullPitch.Direction == 'Up 2') {
                labelNum = 2;
                // Reset `Up 1` label to 4SFB
                const label1 = this.getElementById(`up-label-1`);
                if (label1) {
                    label1.innerHTML = createInnerHTML('Four-Seam Fastball', '4SFB');
                }
            }
            const label = this.getElementById(`${relativeDirToAbsolute(dir.toLowerCase(), leftHanded)}-label-${labelNum}`);
            if (label) {
                label.classList.remove('hidden');
                label.innerHTML = createInnerHTML(fullPitch.Name, p.id);
            }
        } else {
            // If a double direction...
            if (directionSingleGroup && directionDoubleGroup) {
                directionSingleGroup.classList.add('hidden');
                directionDoubleGroup.classList.remove('hidden');
            }

            // If there is another pitch coming up in the sequence with the same dir
            // in other words, returns true if this is the first of a double-direction
            let labelNum = 0; // set label num at the same time
            if (arr.some((v, j) => all_pitches[v.id].Direction == all_pitches[p.id].Direction && j > i)) {
                groupClass = '.double-group .pitch-1-group';
                labelNum = dir.toLowerCase().includes('down-') ? 2 : 1;
            } else {
                groupClass = '.double-group .pitch-2-group';
                labelNum = dir.toLowerCase().includes('down-') ? 1 : 2;
            }

            barMinY = 92;
            barH = 20;

            // Show label
            const label = this.getElementById(`${relativeDirToAbsolute(dir.toLowerCase(), leftHanded)}-label-${labelNum}`);
            if (label) {
                label.classList.remove('hidden');
                label.innerHTML = createInnerHTML(fullPitch.Name, p.id);
            }
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

/**
 * @param {string} direction 
 * @param {boolean} leftHanded
 * @returns {string}
 */
function relativeDirToAbsolute(direction, leftHanded) {
    return direction.toLowerCase()
        .replace('inside', leftHanded ? 'left' : 'right')
        .replace('outside', leftHanded ? 'right' : 'left');
}

/**
 * @param {string} pitchName
 * @param {string} pitchID
 * @returns {string}
 */
function createInnerHTML(pitchName, pitchID) {
    return `<title>${pitchName}</title>${pitchID}`
}
