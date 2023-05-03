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

            fieldPositionsSpan.title = positions
                .map(p => all_strings.hover_text.positions[p])
                .join(', ');
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
        updatePopoverLetterRatingInfoRow(
            popoverPitchingRatingsSection,
            'control',
            player.Control
        );

        // Stamina
        updatePopoverLetterRatingInfoRow(
            popoverPitchingRatingsSection,
            'stamina',
            player.Stamina
        );
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
    const popoverBattingRatingsSection = document.getElementById('popover-batting-ratings-section');
    if (popoverBattingRatingsSection) {
        // Trajectory
        const trjText = popoverBattingRatingsSection.querySelector('.info-row[trj] .content:last-child');
        const trjPath = popoverBattingRatingsSection.querySelector('.info-row[trj] path[trj]');
        if (trjText && trjPath) {
            trjText.textContent = player.Trajectory;
            trjPath.setAttribute(
                'trj',
                `${player.Trajectory}`
            );
        }

        // Hit
        updatePopoverLetterRatingInfoRow(
            popoverBattingRatingsSection,
            'hit',
            player.Contact
        );

        // Power
        updatePopoverLetterRatingInfoRow(
            popoverBattingRatingsSection,
            'power',
            player.Power
        );

        // Speed
        updatePopoverLetterRatingInfoRow(
            popoverBattingRatingsSection,
            'speed',
            player["Run Speed"]
        );

        // Strength
        updatePopoverLetterRatingInfoRow(
            popoverBattingRatingsSection,
            'strength',
            player["Arm Strength"]
        );

        // Fielding
        updatePopoverLetterRatingInfoRow(
            popoverBattingRatingsSection,
            'fielding',
            player.Fielding
        );

        // Catching
        updatePopoverLetterRatingInfoRow(
            popoverBattingRatingsSection,
            'catching',
            player["Error Resistance"]
        );
    }

    // -- Position Ratings
    const popoverPositionsRatingsSection = document.getElementById('popover-positions-ratings-section');
    if (popoverPositionsRatingsSection) {
        // Speed
        updatePopoverLetterRatingInfoRow(
            popoverPositionsRatingsSection,
            'speed',
            player["Run Speed"]
        );

        // Strength
        updatePopoverLetterRatingInfoRow(
            popoverPositionsRatingsSection,
            'strength',
            player["Arm Strength"]
        );

        // Catching
        updatePopoverLetterRatingInfoRow(
            popoverPositionsRatingsSection,
            'catching',
            player["Error Resistance"]
        );

        // Position Ratings
        const positionRatingsGrid = popoverPositionsRatingsSection.querySelector('#position-ratings-grid');
        if (positionRatingsGrid) {
            const items = positionRatingsGrid.querySelectorAll('.position-ratings-item');
            items.forEach(item => {
                const position = item.getAttribute('pos').toUpperCase();
                /** @type {number | undefined} */
                const rating = player["All Fielding Ratings"]?.[position];
                if (rating) {
                    item.classList.remove('blank');

                    updatePopoverLetterRating(
                        item,
                        '.content .letter-rating text',
                        '.content:last-child',
                        rating
                    );
                } else {
                    item.classList.add('blank');
                    const itemTextSpan = item.querySelector('.content:last-child')
                    if (itemTextSpan) {
                        itemTextSpan.textContent = '——';
                    }
                }
            });
        }
    }

    // -- Abilities
    
    // Pitching Traits
    const popoverAbilitiesSection = document.getElementById('pitching-skills');
    if (popoverAbilitiesSection) {
        const cells = Array.from(popoverAbilitiesSection.querySelectorAll('.skill-cell'));
        
        // Traits (first 8 cells)
        cells.slice(0, 8).forEach(cell => {
            const descSpan = cell.querySelector('.skill-desc');
            const ratingSpan = cell.querySelector('.skill-rating');

            if (descSpan && ratingSpan) {
                const traitAbbr = descSpan.getAttribute('traitAbbr');
                if (traitAbbr) { // this checks if it's an empty string
                    const trait = all_abilities.traits.pitcher?.[traitAbbr];
                    if (trait && trait.fullName) {
                        cell.title = `${trait.fullName}: ${trait.Description}`;
                    } else {
                        cell.title = trait.Description;
                    }

                    const traitRating = player.Traits?.[traitAbbr];
                    if (traitRating) {
                        cell.setAttribute('rating', traitRating);
                        ratingSpan.textContent = traitRating;
                    } else {
                        cell.setAttribute('rating', 'D');
                        ratingSpan.textContent = 'D';
                    }
                } else {
                    cell.textContent = '';
                    cell.title = ''; // clear hover text
                    cell.removeAttribute('rating');
                }
            }
        });

        // Abilities (remaining 24 cells, from 9th on)
        cells.slice(8).forEach((cell, i) => {
            // Check if the current index is within the range of the player's abilities
            if (i < player.Abilities.pitching.length) {
                cell.classList.remove('blank');
                const ability = all_abilities.abilities[player.Abilities.pitcher[i]];
                cell.firstElementChild.textContent = ability.Abbr;
                
                cell.setAttribute('rating', ability.Effect);
                cell.title = `${ability.FullName}: ${ability.Description}`;
            } else {
                cell.classList.add('blank');
                cell.firstElementChild.innerHTML = '&nbsp;';
                
                cell.removeAttribute('rating');
                cell.title = ''; // clear hover text
            }
        });
    }

    // Show popover once all info is updated
    popover.classList.remove('hidden');
}

/**
 * @param {HTMLElement} parentElement
 * @param {string} selectorAttr 
 * @param {number} ratingValue 
 */
function updatePopoverLetterRatingInfoRow(parentElement, selectorAttr, ratingValue) {
    updatePopoverLetterRating(
        parentElement,
        `.info-row[${selectorAttr}] .content .letter-rating text`,
        `.info-row[${selectorAttr}] .content:last-child`,
        ratingValue
    );
}

/**
 * @param {HTMLElement} parentElement
 * @param {string} svgTextSelector 
 * @param {string} numberSpanSelector 
 * @param {number} ratingValue 
 */
function updatePopoverLetterRating(parentElement, svgTextSelector, numberSpanSelector, ratingValue) {
    const svgText = parentElement.querySelector(svgTextSelector);
    updateLetterRating(svgText, ratingValue)

    const numberSpan = parentElement.querySelector(numberSpanSelector);
    if (numberSpan) {
        numberSpan.textContent = `${ratingValue}`;
    }
}

/**
 * @param {Element | undefined} svgTextElement
 * @param {number} ratingValue 
 */
function updateLetterRating(svgTextElement, ratingValue) {
    if (svgTextElement) {
        const rating = getLetterRatingFromNumber(ratingValue);

        svgTextElement.setAttribute('rating', rating);
        svgTextElement.textContent = rating;
        svgTextElement.previousElementSibling.textContent = `${ratingValue}`;
    }
}
