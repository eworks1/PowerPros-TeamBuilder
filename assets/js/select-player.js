/**
 * Update detail views.
 * @param {Player} player 
 */
function playerClicked(player) {
    // update all 3 detail views (just fielding for now)
    const detailBox = document.getElementById('detail-box');
    if (!detailBox) {
        console.error("Couldn't find #detail-box.")
        return;
    }

    // Update name box
    const playerNameBoxes = detailBox.querySelectorAll('.player-name-box');
    if (playerNameBoxes) {
        playerNameBoxes.forEach(playerNameBox => updatePlayerNameBox.apply(
            playerNameBox,
            [
                player.name,
                player.nameAbbr,
                player.positions
            ]
        ));
    }

    // Star points
    const starPointCounts = detailBox.querySelectorAll('.star-point-count');
    if (starPointCounts) {
        starPointCounts.forEach(starPointCount => starPointCount.textContent = player.starPoints);
    }

    // Jersey numbers
    const jerseyNumbers = detailBox.querySelectorAll('.jersey-number');
    if (jerseyNumbers) {
        jerseyNumbers.forEach(jerseyNumber => jerseyNumber.textContent = player.jerseyNum || '');
    }

    // Handedness
    const handednesses = detailBox.querySelectorAll('.handedness.info-box');
    if (handednesses) {
        handednesses.forEach(handedness => handedness.textContent = `Throws ${player.throwingHandedness}, Bats ${player.battingHandedness}`);
    }

    // Stats
    const trjTexts = detailBox.querySelectorAll('.detail-trj-num');
    const trjPaths = detailBox.querySelectorAll('.trj-arrow path[trj]');
    trjTexts.forEach(element => element.textContent = player.trajectory);

    trjPaths.forEach(path => {
        path.setAttribute(
            'trj',
            `${player.trajectory}`
        );
    });

    const hitSvgTexts = detailBox.querySelectorAll('.detail-hit.info-box .letter-rating .letter');
    updateDetailViewLetterRatings(hitSvgTexts, player.contact);

    const pwrSvgTexts = detailBox.querySelectorAll('.detail-pwr.info-box .letter-rating .letter');
    updateDetailViewLetterRatings(pwrSvgTexts, player.power);

    const runspdSvgTexts = detailBox.querySelectorAll('.detail-runspd.info-box .letter-rating .letter');
    updateDetailViewLetterRatings(runspdSvgTexts, player.runSpeed);

    const armstrSvgTexts = detailBox.querySelectorAll('.detail-armstr.info-box .letter-rating .letter');
    updateDetailViewLetterRatings(armstrSvgTexts, player.armStrength);

    // I think there won't be more than 1 of these, but just in case.
    const catchingSvgTexts = detailBox.querySelectorAll('.detail-catching.info-box .letter-rating .letter');
    updateDetailViewLetterRatings(catchingSvgTexts, player.catching);

    // I think there won't be more than 1 of these, but just in case.
    const fldSvgTexts = detailBox.querySelectorAll('.detail-fld.info-box .letter-rating .letter');
    updateDetailViewLetterRatings(fldSvgTexts, player.fielding);

    // Fielding Positions
    const fieldingPositionsLabel = detailBox.querySelector('#fielding-detail-positions-box .positions-label');
    if (fieldingPositionsLabel) {
        const primary_position = getPrimaryPosition(player);
        if (isPitcher(primary_position)) {
            fieldingPositionsLabel.textContent = 'P';
            fieldingPositionsLabel.setAttribute('title', 'Pitcher');
        } else {
            // TODO: should this be only the primary position or a joined string?
            fieldingPositionsLabel.textContent = primary_position;
            fieldingPositionsLabel.setAttribute('title', all_strings.hover_text.positions[primary_position]);
        }
    }
    
    // Fielding Box
    const fieldingChart = detailBox.querySelector('#fielding-detail #position-ratings-chart');
    if (fieldingChart) {
        updatePositionRatingsChart(fieldingChart, player.allFieldingRatings);
    }

    // Positions List (Batting Detail)
    const battingPositionList = document.getElementById('batting-detail-positions-list');
    if (battingPositionList) {
        let positions = player.positions;
        positions = positions.map(pos => {
            if (isPitcher(pos)) {
                return 'P';
            } else {
                return pos;
            }
        });
        positions = [...new Set(positions)];

        battingPositionList.innerHTML = '';
        positions.forEach((pos, i) => {
            const newPosition = document.createElement('span');
            if (i > 0) {
                newPosition.innerText = ' ' + pos;
            } else {
                newPosition.innerText = pos;
            }
            
            battingPositionList.appendChild(newPosition);
        });
    }

    // Top Speed (Pitching Detail)
    const topSpeed = detailBox.querySelector('#pitching-detail .detail-topspeed');
    if (topSpeed) {
        topSpeed.textContent = player.pitchingVelo;
        topSpeed.setAttribute('title', `${Math.round(player.pitchingVelo * 0.62137)} mph`);
    }

    // Pitching Form (Pitching Detail)
    const pitchingForm = detailBox.querySelector('.detail-pitching-form.info-box');
    if (pitchingForm) {
        if (pitchingForm != '–––––') {
            const formStr = player.pitchingForm
                .replace(/ \d+/, '')
                .replace('Three-Quarters', '3/4');
            const throwingStr = player.throwingHandedness
                .replace('L', 'Left')
                .replace('R', 'Right');
            pitchingForm.textContent = `${throwingStr} ${formStr}`;
        } else {
            pitchingForm.textContent = player.pitchingForm;
        }
    }

    // Pitch Control (Pitching Detail)
    // I think there won't be more than 1 of these, but just in case.
    const controlSvgTexts = detailBox.querySelectorAll('.detail-control.info-box .letter-rating .letter');
    updateDetailViewLetterRatings(controlSvgTexts, player.control);

    // Pitch Stamina (Pitching Detail)
    // I think there won't be more than 1 of these, but just in case.
    const staminaSvgTexts = detailBox.querySelectorAll('.detail-stamina.info-box .letter-rating .letter');
    updateDetailViewLetterRatings(staminaSvgTexts, player.stamina);

    // Pitching Role List (Pitching Detail)
    const pitchingRoles = document.querySelector('#pitching-detail-roles-box .pitching-roles');
    if (pitchingRoles) {
        const primary_position = getPrimaryPosition(player);
        if (isPitcher(primary_position)) {
            pitchingRoles.style.removeProperty('display');
            pitchingRoles.nextElementSibling.classList.add('hidden');

            ['SP', 'MR', 'CP'].forEach(role => {
                const span = pitchingRoles.querySelector(`[${role.toLowerCase()}]`);
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
            pitchingRoles.style.display = 'none';
            pitchingRoles.nextElementSibling.classList.remove('hidden');
        }
    }

    // Pitching Chart (Pitching Detail)
    const pitchingChartObj = document.getElementById('detail-pitching-chart');
    pitchingChartObj.setAttribute('pitches', JSON.stringify(player.breakingBalls));
    pitchingChartObj.setAttribute('lefty', player.throwingHandedness == 'L');

    if (pitchingChartObj) {
        updatePitchChart.apply(
            pitchingChartObj.contentDocument,
            [
                player.breakingBalls,
                player.throwingHandedness == 'L'
            ]
        );
    }
}

/**
 * 
 * @param {number} ratingNum 
 * @returns {string}
 */
function getLetterRatingFromNumber(ratingNum) {
    if (ratingNum >= 90 && ratingNum <= 100) {
        return "S";
    } else if (ratingNum >= 80 && ratingNum <= 89) {
        return "A";
    } else if (ratingNum >= 70 && ratingNum <= 79) {
        return "B";
    } else if (ratingNum >= 60 && ratingNum <= 69) {
        return "C";
    } else if (ratingNum >= 50 && ratingNum <= 59) {
        return "D";
    } else if (ratingNum >= 40 && ratingNum <= 49) {
        return "E";
    } else if (ratingNum >= 20 && ratingNum <= 39) {
        return "F";
    } else {
        return "G";
    }
}

/**
 * @param {string} position
 * @param {number} rating
 * @returns {string}
 */
function createPositionRatingTitle(position, rating) {
    return `${position}: ${rating}`
}

/**
 * @param {Element} chart
 * @param {Object.<string, number>} ratings
 */
function updatePositionRatingsChart(chart, ratings) {
    for (const element of chart.children) {
        // Changed to nodes so it's easily compatible with convenience function, won't be more than 1.
        const textNodes = element.querySelectorAll('text');
        let position = element.id.split('-')[0];
        if (['LF', 'CF', 'RF'].includes(position)) {
            position = 'OF';
        }

        if (Object.keys(ratings).includes(position)) {
            element.classList.remove('hidden');

            updateDetailViewLetterRatings(
                textNodes,
                ratings[position]
            );
        } else {
            element.classList.add('hidden');
        }
    }
}

/**
 * @param {NodeListOf<Element>} textElements Collection of SVG `<text>` elements.
 * @param {number} ratingValue
 */
function updateDetailViewLetterRatings(textElements, ratingValue) {
    textElements.forEach(element => {
        const rating = getLetterRatingFromNumber(ratingValue);
        element.setAttribute('rating', rating);
        element.textContent = rating;
        // <title> element for mouseover text
        element.previousElementSibling.textContent = `${ratingValue}`;
    });
}
