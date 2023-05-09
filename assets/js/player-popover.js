/**
 * @param {Event} event 
 */
function hidePopover(event) {
    if (event.target.id == 'popover-wrapper') {
        event.target.classList.add('hidden');
    }
}

/**
 * @param {HTMLElement} tabElement 
 */
function updateSelectedPopoverTab(tabElement) {
    // If the tab selected was already selected, do nothing.
    if (tabElement.classList.contains('selected')) { return; }

    // Find selected element and remove the .selected class
    const alreadySelectedTab = Array.from(tabElement.parentElement.children).find(el => el.classList.contains('selected'));
    if (alreadySelectedTab) {
        alreadySelectedTab.classList.remove('selected');
    }

    // Add .selected class
    tabElement.classList.add('selected');

    // Update border color to background color newly-selected tab
    const popoverBody = document.getElementById('popover-body');
    if (popoverBody) {
        popoverBody.style.borderColor = tabElement.style.backgroundColor;
    }

    // Update viewable content
    let index = Array.prototype.slice.call(tabElement.parentElement.children).indexOf(tabElement);
    if (index == 0) {
        index = popoverIsPitcher ? 1 : 2;
    }

    tabElement.parentElement.setAttribute('current-tab', popoverTabIDs[index]);
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
 * Update all parts of popover.
 * @param {Player} player 
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

    // --- Update Info

    // Update Player Name Box
    const playerNameBox = popover.querySelector('#popover-name-section .player-name-box');
    updatePlayerNameBox.apply(
        playerNameBox,
        [
            player.name,
            player.nameAbbr,
            player.positions
        ]
    );

    // -- Popover Name Section
    const popoverNameSection = document.getElementById('popover-name-section');
    if (popoverNameSection) {
        // Jersey Number
        const jerseyNumber = popoverNameSection.querySelector('.jersey-number');
        if (jerseyNumber) {
            jerseyNumber.textContent = `${player.jerseyNum}`;
        }

        // Star Points
        const starPointCount = popoverNameSection.querySelector('.star-point-count');
        if (starPointCount) {
            starPointCount.textContent = `${player.starPoints}`;
        }

        // Cost Span
        const costSpan = popoverNameSection.querySelector('.cost-span');
        if (costSpan) {
            costSpan.textContent = `${player.cost}`;
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
                        if (player.positions.includes(role)) {
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
            let positions = player.positions;
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
            pfpImg.setAttribute('src', `https://www.mlbppworld.com/wiki/images/${player.pfpFileName}`);
        }

        // Pitching Form (Pitching Tabs)
        const pitchingForm = popoverFormSection.querySelector('.info-row #pitching-form.content');
        if (pitchingForm) {
            pitchingForm.textContent = player.pitchingForm;
        }

        // Batting Form (Fielding Tabs)
        const battingForm = popoverFormSection.querySelector('.info-row #batting-form.content');
        if (battingForm) {
            battingForm.textContent = player.battingForm;
        }

        // Handedness
        const handedness = popoverFormSection.querySelector('.info-row[handedness] .content');
        if (handedness) {
            handedness.textContent = `Throws ${player.throwingHandedness}, Bats ${player.battingHandedness}`;
        }
    }

    // -- Pitching Ratings
    const popoverPitchingRatingsSection = document.getElementById('popover-pitching-ratings-section');
    if (popoverPitchingRatingsSection) {
        // Pitch Velo
        const pitchVelo = popoverPitchingRatingsSection.querySelector('.info-row .pitch-speed');
        if (pitchVelo) {
            pitchVelo.textContent = `${player.pitchingVelo}`;
            pitchVelo.setAttribute('title', `${Math.round(player.pitchingVelo * 0.62137)} mph`);
        }

        // Control
        updatePopoverLetterRatingInfoRow(
            popoverPitchingRatingsSection,
            'control',
            player.control
        );

        // Stamina
        updatePopoverLetterRatingInfoRow(
            popoverPitchingRatingsSection,
            'stamina',
            player.stamina
        );
    }

    // Pitching Chart
    const pitchingChartObj = document.getElementById('popover-pitching-chart');
    if (pitchingChartObj) {
        pitchingChartObj.setAttribute('pitches', JSON.stringify(player.breakingBalls));
        pitchingChartObj.setAttribute('lefty', `${player.throwingHandedness == 'L'}`);
    }

    // Signature Pitch
    const signaturePitchSpan = document.getElementById('popover-signature-pitch');
    if (signaturePitchSpan) {
        const signaturePitch = player.breakingBalls.find(p => p.id.includes('SP'));
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
            trjText.textContent = player.trajectory;
            trjPath.setAttribute(
                'trj',
                `${player.trajectory}`
            );
        }

        // Hit
        updatePopoverLetterRatingInfoRow(
            popoverBattingRatingsSection,
            'hit',
            player.contact
        );

        // Power
        updatePopoverLetterRatingInfoRow(
            popoverBattingRatingsSection,
            'power',
            player.power
        );

        // Speed
        updatePopoverLetterRatingInfoRow(
            popoverBattingRatingsSection,
            'speed',
            player.runSpeed
        );

        // Strength
        updatePopoverLetterRatingInfoRow(
            popoverBattingRatingsSection,
            'strength',
            player.armStrength
        );

        // Fielding
        updatePopoverLetterRatingInfoRow(
            popoverBattingRatingsSection,
            'fielding',
            player.fielding
        );

        // Catching
        updatePopoverLetterRatingInfoRow(
            popoverBattingRatingsSection,
            'catching',
            player.catching
        );
    }

    // -- Position Ratings
    const popoverPositionsRatingsSection = document.getElementById('popover-positions-ratings-section');
    if (popoverPositionsRatingsSection) {
        // Speed
        updatePopoverLetterRatingInfoRow(
            popoverPositionsRatingsSection,
            'speed',
            player.runSpeed
        );

        // Strength
        updatePopoverLetterRatingInfoRow(
            popoverPositionsRatingsSection,
            'strength',
            player.armStrength
        );

        // Catching
        updatePopoverLetterRatingInfoRow(
            popoverPositionsRatingsSection,
            'catching',
            player.catching
        );

        // Position Ratings
        const positionRatingsGrid = popoverPositionsRatingsSection.querySelector('#position-ratings-grid');
        if (positionRatingsGrid) {
            const items = positionRatingsGrid.querySelectorAll('.position-ratings-item');
            items.forEach(item => {
                const position = item.getAttribute('pos').toUpperCase();
                /** @type {number | undefined} */
                const rating = player.allFieldingRatings?.[position];
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
    // Pitcher and Fielder tabs' Skills
    /** @type {['pitcher', 'fielder']} */
    const tabKeys = ['pitcher', 'fielder'];
    
    for (const key of tabKeys) {
        const popoverAbilitySection = document.getElementById(`${key}-skills`);
        if (popoverAbilitySection) {
            const cells = Array.from(popoverAbilitySection.querySelectorAll('.skill-cell'));

            // Traits (first 8 cells)
            cells.slice(0, 8).forEach(cell => {
                const descSpan = cell.querySelector('.skill-desc');
                const ratingSpan = cell.querySelector('.skill-rating');

                if (descSpan && ratingSpan) {
                    const traitAbbr = descSpan.getAttribute('traitAbbr');
                    // Check if it's the catcher trait
                    if (key == 'fielder' && traitAbbr == 'Catcher') {
                        if (player.positions.includes('C')) {
                            cell.classList.remove('blank');
                        } else {
                            cell.classList.add('blank');
                        }
                    }

                    // this checks if it's an empty string
                    if (traitAbbr) {
                        const trait = all_abilities.traits[key]?.[traitAbbr];
                        if (trait && trait.fullName) {
                            cell.title = `(${trait.fullName}) - ${trait.description}`;
                        } else {
                            cell.title = trait.description;
                        }

                        const traitRating = player.traits?.[traitAbbr];
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
            const abilities = player.abilities[key]
                .map(a => all_abilities.abilities[a]);
            updateAbilityCells(cells.slice(8), abilities);
        }
    }

    // Position Assignment Tab (Skills)
    const popoverPositionAbilitiesSection = document.getElementById('posasgmt-skills');
    if (popoverPositionAbilitiesSection) {
        const cells = Array.from(popoverPositionAbilitiesSection.querySelectorAll('.skill-cell'));
        const abilities = player.abilities.positionAssignment
            .map(a => all_abilities.abilities[a]);
        const rules = abilities
            .filter(a => a.category.includes('Assignment Rules'));
        const posAsgmtAbils = abilities
            .filter(a => !a.category.includes('Assignment Rules'));

        // Assignment Rules (first 7 cells)
        updateAbilityCells(cells.slice(0, 7), rules);

        // Abilities (remaining 24 cells, from 8th on)
        updateAbilityCells(cells.slice(7), posAsgmtAbils);
    }

    // Profile Tab (Skills/Info)
    const popoverProfileInfoSection = document.getElementById('profile-tab-skills');
    if (popoverProfileInfoSection) {
        // Full Name
        const fullNameSpan = popoverProfileInfoSection.querySelector('.info-row[fullname] .content');
        if (fullNameSpan) {
            fullNameSpan.textContent = player.name;
        }

        // Uniform Name
        const uniformNameSpan = popoverProfileInfoSection.querySelector('.info-row[uniformname] .content');
        if (uniformNameSpan) {
            uniformNameSpan.textContent = player.uniformName.toUpperCase();
        }
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

/**
 * 
 * @param {Element[]} cells 
 * @param {Ability[]} abilities 
 */
function updateAbilityCells(cells, abilities) {
    cells.forEach((cell, i) => {
        // Check if the current index is within the range of the player's abilities
        if (i < abilities.length) {
            cell.classList.remove('blank');
            const ability = abilities[i];
            cell.firstElementChild.textContent = ability.abbr;
                
            cell.setAttribute('rating', ability.effectType);
            if (ability.fullName) {
                cell.title = `(${ability.fullName}) - ${ability.description}`;
            } else {
                cell.title = ability.description;
            }
        } else {
            cell.classList.add('blank');
            cell.firstElementChild.textContent = '';
                
            cell.removeAttribute('rating');
            cell.title = ''; // clear hover text
        }
    });
}
