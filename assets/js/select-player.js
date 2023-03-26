function playerClicked(player) {
    // update all 3 detail views (just fielding for now)
    const fieldingDetailView = document.getElementById('fielding-detail-view');
    if (!fieldingDetailView) { 
        console.error("Couldn't find #field-detail-view.")
        return;
    }

    // Update name box
    const playerNameBox = fieldingDetailView.getElementsByClassName('player-name-box').item(0);
    if (playerNameBox) {
        updatePlayerNameBox.apply(
            playerNameBox,
            [
                player['Name Abbreviation'],
                player['Field Position']
            ]
        );
    }

    // Star points
    const starPointCount = fieldingDetailView.getElementsByClassName('star-point-count').item(0);
    if (starPointCount) {
        starPointCount.textContent = player["Star Point"];
    }

    // Jersey numbers
    const jerseyNumber = fieldingDetailView.getElementsByClassName('jersey-number').item(0);
    if (jerseyNumber) {
        jerseyNumber.textContent = player["Jersey Number"] || 100;
    }

    // Handedness
    const handedness = fieldingDetailView.getElementsByClassName('info-box').item(0);
    if (handedness) {
        handedness.textContent = `Throws ${player.Throws}, Bats ${player.Bats}`;
    }

    // Stats
    const trjText = document.getElementById('detail-trj-num');
    const trjImg = document.getElementById('detail-trj-img');
    if (trjText && trjImg) {
        trjText.textContent = player.Trajectory;
        trjImg.setAttribute(
            'src',
            `https://www.mlbppworld.com/wiki/images/TRJ${player.Trajectory}.png`
        );
    }

    const hitImg = fieldingDetailView.querySelectorAll('#detail-hit.info-box .letter-rating').item(0);
    if (hitImg) {
        hitImg.setAttribute(
            'src',
            letterRatingUrl(player.Contact)
        );
    }

    const pwrImg = fieldingDetailView.querySelectorAll('#detail-pwr.info-box .letter-rating').item(0);
    if (pwrImg) {
        pwrImg.setAttribute(
            'src',
            letterRatingUrl(player.Power)
        );
    }

    const runspdImg = fieldingDetailView.querySelectorAll('#detail-runspd.info-box .letter-rating').item(0);
    if (runspdImg) {
        runspdImg.setAttribute(
            'src',
            letterRatingUrl(player["Run Speed"])
        );
    }

    const armstrImg = fieldingDetailView.querySelectorAll('#detail-armstr.info-box .letter-rating').item(0);
    if (armstrImg) {
        armstrImg.setAttribute(
            'src',
            letterRatingUrl(player["Arm Strength"])
        );
    }

    const catchingImg = fieldingDetailView.querySelectorAll('#detail-catching.info-box .letter-rating').item(0);
    if (catchingImg) {
        catchingImg.setAttribute(
            'src',
            letterRatingUrl(player["Error Resistance"])
        );
    }

    // Fielding Positions
    const positions = fieldingDetailView.querySelectorAll('#detail-fielding-box .positions-label').item(0);
    if (positions) {
        positions.textContent = player["Field Position"][0];
    }
    
    // Fielding Box
    // const fieldingImg = fieldingDetailView.querySelectorAll('#detail-fielding .letter-rating').item(0);
    // if (fieldingImg) {
    //     fieldingImg.setAttribute(
    //         'src',
    //         letterRatingUrl(player["Error Resistance"])
    //     );
    // }
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