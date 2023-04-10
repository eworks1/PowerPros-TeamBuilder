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
    const trjImgs = detailBox.querySelectorAll('.detail-trj-img');
    if (trjTexts && trjImgs) {
        trjTexts.forEach(element => element.textContent = player.Trajectory);
        
        trjImgs.forEach(element => element.setAttribute(
            'src',
            `https://www.mlbppworld.com/wiki/images/TRJ${player.Trajectory}.png`
        ));
    }

    const hitImgs = detailBox.querySelectorAll('.detail-hit.info-box .letter-rating');
    if (hitImgs) {
        hitImgs.forEach(element => element.setAttribute(
            'src',
            letterRatingUrl(player.Contact)
        ));
    }

    const pwrImgs = detailBox.querySelectorAll('.detail-pwr.info-box .letter-rating');
    if (pwrImgs) {
        pwrImgs.forEach(pwrImg => pwrImg.setAttribute(
            'src',
            letterRatingUrl(player.Power)
        ));
    }

    const runspdImgs = detailBox.querySelectorAll('.detail-runspd.info-box .letter-rating');
    if (runspdImgs) {
        runspdImgs.forEach(runspdImg => runspdImg.setAttribute(
            'src',
            letterRatingUrl(player["Run Speed"])
        ));
    }

    const armstrImgs = detailBox.querySelectorAll('.detail-armstr.info-box .letter-rating');
    if (armstrImgs) {
        armstrImgs.forEach(armstrImg => armstrImg.setAttribute(
            'src',
            letterRatingUrl(player["Arm Strength"])
        ));
    }

    // I think there won't be more than 1 of these, but just in case.
    const catchingImgs = detailBox.querySelectorAll('.detail-catching.info-box .letter-rating');
    if (catchingImgs) {
        catchingImgs.forEach(catchingImg => catchingImg.setAttribute(
            'src',
            letterRatingUrl(player["Error Resistance"])
        ));
    }

    // Fielding Positions
    const fieldingPositionsLabel = detailBox.querySelector('#fielding-detail-positions-box .positions-label');
    if (fieldingPositionsLabel) {
        const primary_position = getPrimaryPosition(player);
        if (isPitcher(primary_position)) {
            fieldingPositionsLabel.textContent = 'P';
        } else {
            fieldingPositionsLabel.textContent = primary_position;
        }
    }
    
    // Fielding Box
    // const fieldingImg = detailBox.querySelector('#detail-fielding .letter-rating');
    // if (fieldingImg) {
    //     fieldingImg.setAttribute(
    //         'src',
    //         letterRatingUrl(player["Error Resistance"])
    //     );
    // }

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
    }

    // Pitching Form (Pitching Detail)
    const pitchingForm = detailBox.querySelector('.detail-pitching-form.info-box');
    if (pitchingForm) {
        pitchingForm.textContent = player["Pitching Form"] || 'Form';
    }

    // Pitch Control (Pitching Detail)
    // I think there won't be more than 1 of these, but just in case.
    const controlImgs = detailBox.querySelectorAll('.detail-control.info-box .letter-rating');
    if (controlImgs) {
        controlImgs.forEach(controlImg => controlImg.setAttribute(
            'src',
            letterRatingUrl(player.Control)
        ));
    }

    // Pitch Stamina (Pitching Detail)
    // I think there won't be more than 1 of these, but just in case.
    const staminaImgs = detailBox.querySelectorAll('.detail-stamina.info-box .letter-rating');
    if (staminaImgs) {
        staminaImgs.forEach(staminaImg => staminaImg.setAttribute(
            'src',
            letterRatingUrl(player.Stamina)
        ));
    }

    // Pitching Role List (Pitching Detail)
    const pitchingRoleBox = document.getElementById('pitching-detail-roles-box');
    if (pitchingRoleBox) {
        pitchingRoleBox.innerHTML = '';

        const label = document.createElement('span');
        label.classList.add('info-label');
        label.textContent = 'APT';
        pitchingRoleBox.appendChild(label);

        const roles = ['SP', 'MR', 'CP'];

        const primary_position = getPrimaryPosition(player);
        if (isPitcher(primary_position)) {
            const list = document.createElement('span');
            list.id = 'pitching-detail-roles-list';
            pitchingRoleBox.appendChild(list);
            
            roles.forEach(role => {
                let className = '';
                if (player["Field Position"].includes(role)) {
                    className = 'has-pitching-role';
                } else {
                    className = 'does-not-have-pitching-role';
                }

                const newRole = document.createElement('span');
                newRole.classList.add(className);
                newRole.innerText = role;
                
                list.appendChild(newRole);
            });
        } else {
            const newRole = document.createElement('span');
            newRole.innerText = '–––';
            newRole.classList.add('dash-content');
            pitchingRoleBox.appendChild(newRole);
        }
    }

    // Pitching Chart (Pitching Detail)
    const pitchingChartObj = document.getElementById('pitching-chart');
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
 * 
 * @param {string} ratingLetter
 * @returns {string}
 */
function letterRatingUrl(ratingLetter) {
    return `https://www.mlbppworld.com/wiki/images/Rank_${ratingLetter}.png`
}

/**
 * 
 * @param {number} ratingNum
 * @returns {string}
 */
function letterRatingUrl(ratingNum) {
    const ratingLetter = getLetterRatingFromNumber(ratingNum);
    return `https://www.mlbppworld.com/wiki/images/Rank_${ratingLetter}.png`
}