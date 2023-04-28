/**
 * @param {Event} event 
 */
function hidePopover(event) {
    if (event.target.id == 'popover-wrapper') {
        event.target.classList.add('hidden');
    }
}

/**
 * @param {HTMLElement} element 
 */
function updateSelectedPopoverTab(element) {
    // If the tab selected was already selected, do nothing.
    if (element.classList.contains('selected')) { return; }

    // Find selected element and remove the .selected class
    const alreadySelectedTab = Array.from(element.parentElement.children).find(el => el.classList.contains('selected'));
    if (alreadySelectedTab) {
        alreadySelectedTab.classList.remove('selected');
    }

    // Add .selected class
    element.classList.add('selected');

    // Update border color to background color newly-selected tab
    const popoverBody = document.getElementById('popover-body');
    if (popoverBody) {
        popoverBody.style.borderColor = element.style.backgroundColor;
    }

    // Update viewable content
    let index = Array.prototype.slice.call(element.parentElement.children).indexOf(element);
    if (index == 0) {
        index = popoverIsPitcher ? 1 : 2;
    }

    element.parentElement.setAttribute('current-tab', popoverTabIDs[index]);
}

/** Defines whether the first tab should show pitcher or batter data */
let popoverIsPitcher = false;

/** Popover tab IDs */
const popoverTabIDs = [
    "default",
    "pitching",
    "batting",
    "position",
    "profile"
];

/**
 * Update all parts of popover
 * @param {Object} player 
 */
function playerDoubleClicked(player) {
    const popover = document.getElementById('popover-wrapper');
    if (!popover) { console.error('Could not find #popover-wrapper.'); return; }

    popoverIsPitcher = isPitcher(player);
    popover.setAttribute(
        'primary-pos',
        popoverIsPitcher ? 'pitcher' : 'fielder'
    );
    
    const tabbar = document.getElementById('popover-tabbar');
    if (tabbar) {
        updateSelectedPopoverTab(tabbar.firstElementChild);
    }

    // TODO: update all info

    // Update Player Name Box
    const playerNameBox = popover.querySelector('#popover-name-section .player-name-box');
    updatePlayerNameBox.apply(
        playerNameBox,
        [
            player.Name,
            player["Name Abbreviation"],
            player["Field Position"]
        ]
    );

    // -- Popover Name Section
    const popoverNameSection = document.getElementById('popover-name-section');
    if (popoverNameSection) {
        // Jersey Number
        const jerseyNumber = popoverNameSection.querySelector('.jersey-number');
        if (jerseyNumber) {
            jerseyNumber.textContent = `${player["Jersey Number"]}`;
        }

        // Star Points
        const starPointCount = popoverNameSection.querySelector('.star-point-count');
        if (starPointCount) {
            starPointCount.textContent = `${player["Star Point"]}`;
        }

        // Cost Span
        const costSpan = popoverNameSection.querySelector('.cost-span');
        if (costSpan) {
            costSpan.textContent = `${player["Point Cost"]}`;
        }

        // Pitching Aptitude (Pitching Tabs)
        const pitchingApt = popoverNameSection.querySelector('#popover-pitching-roles .pitching-roles');
        if (pitchingApt) {
            const primary_position = getPrimaryPosition(player);
            if (isPitcher(primary_position)) {
                pitchingApt.style.removeProperty('display');
                pitchingApt.nextElementSibling.classList.add('hidden');

                ['SP', 'MR', 'CP'].forEach(role => {
                    const span = pitchingApt.querySelector(`[${role.toLowerCase()}]`);
                    if (span) {
                        if (player["Field Position"].includes(role)) {
                            span.classList.add('has-pitching-role');
                            span.classList.remove('does-not-have-pitching-role');
                        } else {
                            span.classList.remove('has-pitching-role');
                            span.classList.add('does-not-have-pitching-role');
                        }
                    }
                });
            } else {
                pitchingApt.style.display = 'none';
                pitchingApt.nextElementSibling.classList.remove('hidden');
            }
        }

        // Field Positions (Fielding Tabs)
        const fieldPositionsSpan = popoverNameSection.querySelector('#popover-fielding-positions .content');
        if (fieldPositionsSpan) {
            let positions = player["Field Position"];
            if (positions.some(pos => ['SP', 'MR', 'CP'].includes(pos))) {
                positions[positions.findIndex(pos => ['SP', 'MR', 'CP'].includes(pos))] = 'P';
                positions = positions
                    .filter(pos => !['SP', 'MR', 'CP'].includes(pos));
            }
            fieldPositionsSpan.textContent = positions.join(' ');
        }
    }

    // -- Popover Form Section
    const popoverFormSection = document.getElementById('popover-form-section');
    if (popoverFormSection) {
        // Picture
        const pfpImg = popoverFormSection.querySelector('.info-row[pfp] img');
        if (pfpImg) {
            const shortenedName = player["Name Abbreviation"].split('.').slice(-1);
            pfpImg.setAttribute('src', `https://www.mlbppworld.com/wiki/images/Pfp_${shortenedName}.jpg`);
        }

        // Pitching Form (Pitching Tabs)
        const pitchingForm = popoverFormSection.querySelector('.info-row #pitching-form.content');
        if (pitchingForm) {
            pitchingForm.textContent = player["Pitching Form"];
        }

        // Batting Form (Fielding Tabs)
        const battingForm = popoverFormSection.querySelector('.info-row #batting-form.content');
        if (battingForm) {
            battingForm.textContent = player["Batting Form"];
        }

        // Handedness
        const handedness = popoverFormSection.querySelector('.info-row[handedness] .content');
        if (handedness) {
            handedness.textContent = `Throws ${player.Throws}, Bats ${player.Bats}`;
        }
    }

    // -- Pitching Ratings
    const popoverPitchingRatingsSection = document.getElementById('popover-pitching-ratings-section');
    if (popoverPitchingRatingsSection) {
        // Pitch Velo
        const pitchVelo = popoverPitchingRatingsSection.querySelector('.info-row .pitch-speed');
        if (pitchVelo) {
            pitchVelo.textContent = `${player["Top Speed"]}`;
        }

        // Control
        updatePopoverLetterRating(
            popoverPitchingRatingsSection,
            '.info-row[control] .content .letter-rating text',
            '.info-row[control] .content:last-child',
            player.Control
        );
        // const controlSvgText = popoverPitchingRatingsSection.querySelector('.info-row[control] .content .letter-rating text');
        // const controlNumberSpan = popoverPitchingRatingsSection.querySelector('.info-row[control] .content:last-child');
        // if (controlSvgText && controlNumberSpan) {
        //     const rating = getLetterRatingFromNumber(player.Control);
        //     controlSvgText.setAttribute('rating', rating);
        //     controlSvgText.textContent = rating;
        //     controlNumberSpan.textContent = `${player.Control}`
        // }

        // Stamina
        const staminaSvgText = popoverPitchingRatingsSection.querySelector('.info-row[stamina] .content .letter-rating text');
        const staminaNumberSpan = popoverPitchingRatingsSection.querySelector('.info-row[stamina] .content:last-child');
        if (staminaSvgText && staminaNumberSpan) {
            const rating = getLetterRatingFromNumber(player.Stamina);
            staminaSvgText.setAttribute('rating', rating);
            staminaSvgText.textContent = rating;
            staminaNumberSpan.textContent = `${player.Stamina}`
        }
    }

    // Pitching Chart
    const pitchingChartObj = document.getElementById('popover-pitching-chart');
    if (pitchingChartObj) {
        pitchingChartObj.setAttribute('pitches', JSON.stringify(player["Breaking Balls"]));
        pitchingChartObj.setAttribute('lefty', `${player.Throws == 'L'}`);
    }

    // Signature Pitch
    const signaturePitch = player["Breaking Balls"].find(p => p.id.includes('SP'));
    const signaturePitchSpan = document.getElementById('popover-signature-pitch');
    if (signaturePitchSpan) {
        if (signaturePitch) {
            signaturePitchSpan.textContent = signaturePitch.id;
        } else {
            signaturePitchSpan.textContent = '';
        }
    }

    // -- Batting Ratings

    // Show popover once all info is updated
    popover.classList.remove('hidden');
}

/**
 * @param {HTMLElement} parentElement
 * @param {string} svgTextSelector 
 * @param {string} numberSpanSelector 
 * @param {number} ratingValue 
 */
function updatePopoverLetterRating(parentElement, svgTextSelector, numberSpanSelector, ratingValue) {
    const rating = getLetterRatingFromNumber(ratingValue);

    const svgText = parentElement.querySelector(svgTextSelector);
    if (svgText) {
        svgText.setAttribute('rating', rating);
        svgText.textContent = rating;
        svgText.previousElementSibling.textContent = `${ratingValue}`;
    }

    const numberSpan = parentElement.querySelector(numberSpanSelector);
    if (numberSpan) {
        numberSpan.textContent = `${ratingValue}`;
    }
}
