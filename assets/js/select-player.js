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
                player.Name,
                player['Name Abbreviation'],
                player['Field Position']
            ]
        ));
    }

    // Star points
    const starPointCounts = detailBox.querySelectorAll('.star-point-count');
    if (starPointCounts) {
        starPointCounts.forEach(starPointCount => starPointCount.textContent = player["Star Point"]);
    }

    // Jersey numbers
    const jerseyNumbers = detailBox.querySelectorAll('.jersey-number');
    if (jerseyNumbers) {
        jerseyNumbers.forEach(jerseyNumber => jerseyNumber.textContent = player["Jersey Number"] || '');
    }

    // Handedness
    const handednesses = detailBox.querySelectorAll('.handedness.info-box');
    if (handednesses) {
        handednesses.forEach(handedness => handedness.textContent = `Throws ${player.Throws}, Bats ${player.Bats}`);
    }

    // Stats
    const trjTexts = detailBox.querySelectorAll('.detail-trj-num');
    const trjPaths = detailBox.querySelectorAll('.trj-arrow path[trj]');
    trjTexts.forEach(element => element.textContent = player.Trajectory);

    trjPaths.forEach(path => {
        path.setAttribute(
            'trj',
            `${player.Trajectory}`
        );
    });

    const hitSvgTexts = detailBox.querySelectorAll('.detail-hit.info-box .letter-rating .letter');
    updateDetailViewLetterRatings(hitSvgTexts, player.Contact);

    const pwrSvgTexts = detailBox.querySelectorAll('.detail-pwr.info-box .letter-rating .letter');
    updateDetailViewLetterRatings(pwrSvgTexts, player.Power);

    const runspdSvgTexts = detailBox.querySelectorAll('.detail-runspd.info-box .letter-rating .letter');
    updateDetailViewLetterRatings(runspdSvgTexts, player["Run Speed"]);

    const armstrSvgTexts = detailBox.querySelectorAll('.detail-armstr.info-box .letter-rating .letter');
    updateDetailViewLetterRatings(armstrSvgTexts, player["Arm Strength"]);

    // I think there won't be more than 1 of these, but just in case.
    const catchingSvgTexts = detailBox.querySelectorAll('.detail-catching.info-box .letter-rating .letter');
    updateDetailViewLetterRatings(catchingSvgTexts, player["Error Resistance"]);

    // I think there won't be more than 1 of these, but just in case.
    const fldSvgTexts = detailBox.querySelectorAll('.detail-fld.info-box .letter-rating .letter');
    updateDetailViewLetterRatings(fldSvgTexts, player.Fielding);

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
        updatePositionRatingsChart(fieldingChart, player["All Fielding Ratings"]);
    }

    // Positions List (Batting Detail)
    const battingPositionList = document.getElementById('batting-detail-positions-list');
    if (battingPositionList) {
        let positions = player["Field Position"];
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
        topSpeed.textContent = player["Top Speed"];
        topSpeed.setAttribute('title', `${Math.round(player["Top Speed"] * 0.62137)} mph`);
    }

    // Pitching Form (Pitching Detail)
    const pitchingForm = detailBox.querySelector('.detail-pitching-form.info-box');
    if (pitchingForm) {
        const formStr = player["Pitching Form"]
            .replace(/ \d+/, '')
            .replace('Three-Quarters', '3/4');
        const throwingStr = player.Throws
            .replace('L', 'Left')
            .replace('R', 'Right');
        pitchingForm.textContent = `${throwingStr} ${formStr}`;
    }

    // Pitch Control (Pitching Detail)
    // I think there won't be more than 1 of these, but just in case.
    const controlSvgTexts = detailBox.querySelectorAll('.detail-control.info-box .letter-rating .letter');
    updateDetailViewLetterRatings(controlSvgTexts, player.Control);

    // Pitch Stamina (Pitching Detail)
    // I think there won't be more than 1 of these, but just in case.
    const staminaSvgTexts = detailBox.querySelectorAll('.detail-stamina.info-box .letter-rating .letter');
    updateDetailViewLetterRatings(staminaSvgTexts, player.Stamina);

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
            pitchingRoles.style.display = 'none';
            pitchingRoles.nextElementSibling.classList.remove('hidden');
        }
    }

    // Pitching Chart (Pitching Detail)
    const pitchingChartObj = document.getElementById('detail-pitching-chart');
    pitchingChartObj.setAttribute('pitches', JSON.stringify(player["Breaking Balls"]));
    pitchingChartObj.setAttribute('lefty', player.Throws == 'L');

    if (pitchingChartObj) {
        updatePitchChart.apply(
            pitchingChartObj.contentDocument,
            [
                player["Breaking Balls"],
                player.Throws == 'L'
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
        return "S"
    } else if (ratingNum >= 80 && ratingNum <= 89) {
        return "A"
    } else if (ratingNum >= 70 && ratingNum <= 79) {
        return "B"
    } else if (ratingNum >= 60 && ratingNum <= 69) {
        return "C"
    } else if (ratingNum >= 50 && ratingNum <= 59) {
        return "D"
    } else if (ratingNum >= 40 && ratingNum <= 49) {
        return "E"
    } else if (ratingNum >= 20 && ratingNum <= 39) {
        return "F"
    } else {
        return "G"
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
        // Changed to nodeS so it's easily compatible with convenience function, won't be more than 1.
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
