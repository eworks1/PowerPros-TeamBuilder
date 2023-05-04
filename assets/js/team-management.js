---
---

const empty_player_slots = {{ site.data.players.empty_slots | jsonify }};
const max_counts = {
    pitchers: 15,
    fielders: 18,
    backups: 37
};
/** @type {{pitchers: Player[], fielders: Player[], backups: Player[]}} */
var team = {
    pitchers: Array(),
    fielders: Array(),
    backups: Array()
};

{% raw %}
/**
 * @param {Player} player
 */
function rightClicked(player) {
{% endraw %}
    // If they're on the team, they'll be removed here.
    const deleted = removePlayer(player);

    // If they were removed, exit the function.
    if (deleted) { return; }

    // If they weren't removed, add them to the team.
    addPlayer(player);
}

{% raw %}
/**
 * @param {Player} player
 * @returns {boolean} If it succeeded.
 */
function addPlayer(player) {
{% endraw %}
    // Add to team
    const primary_position = getPrimaryPosition(player);
    let added = true;
    let position_group = '';
    if (isPitcher(primary_position)) {
        if (team.pitchers.length < max_counts.pitchers) {
            team.pitchers.push(player);
            position_group = 'pitchers';
        } else if (team.backups.length < max_counts.backups) {
            team.backups.push(player);
            position_group = 'backups';
        } else {
            added = false;
        }
    } else {
        if (team.fielders.length < max_counts.fielders) {
            team.fielders.push(player);
            position_group = 'fielders';
        } else if (team.backups.length < max_counts.backups) {
            team.backups.push(player);
            position_group = 'backups';
        } else {
            added = false;
        }
    }

    if (!added) { return added; }

    // Update in team table
    const playerNameBoxCSSSelector = `#team-table .no-player.${position_group}-group`;
    // This finds the first empty player-name-box of the correct position group
    const firstEmptyPlayerNameBox = document.querySelector(playerNameBoxCSSSelector);

    // Finds the cost-span by looking at the immediately adjacent sibling
    const costSpan = document.querySelector(`${playerNameBoxCSSSelector} + .cost-span`);

    if (firstEmptyPlayerNameBox && costSpan) {
        // Update player-name-box
        firstEmptyPlayerNameBox.id = `${player.id}-name-box`;

        // pass player-name-box to updatePlayerNameBox with .apply
        updatePlayerNameBox.apply(
            firstEmptyPlayerNameBox,
            [
                player.name,
                player.nameAbbr,
                player.positions
            ]
        );

        // Update cost-span
        // Manually update cost-span and add `.cost-zero` class to hide if 0
        costSpan.textContent = player.cost;
        if (player.cost > 0) {
            costSpan.classList.remove('cost-zero');
        } else {
            costSpan.classList.add('cost-zero');
        }
    }

    // Fade down player from the player-pool-table
    const playerCellInPool = document
        .querySelector(`#player-pool-table #${CSS.escape(player.id)}-name-box`)
        ?.parentElement;
    
    if (playerCellInPool) {
        playerCellInPool.classList.add('player-used');
    }

    // Update position and point counts
    updateCounts(primary_position);

    return added;
}

{% raw %}
/**
 * @param {Player} player
 * @returns {boolean} If it succeeded.
 */
function removePlayer(player) {
{% endraw %}
    // Confirm if they're on the team or not
    const primary_position = getPrimaryPosition(player);
    /** @type {"pitchers"|"fielders"|"backup"} */
    let position_group = '';
    let deleted = false;
    if (isPitcher(primary_position)) {
        position_group = 'pitchers';
    } else {
        position_group = 'fielders';
    }

    // Check if player exists in `team`, and deleted if so.
    if (team[position_group]) {
        let index = team[position_group].findIndex(p => p.id == player.id);
        if (index > -1) {
            team[position_group].splice(index, 1);
            deleted = true;
        } else {
            index = team.backups.findIndex(p => p.id == player.id);
            if (index > -1) {
                team.backups.splice(index, 1);
                deleted = true;
                position_group = 'backups';
            }
        }
    }

    // If they were continue. Otherwise, return `deleted`.
    if (!deleted) { return deleted; }

    // Update in team table
    const playerNameBoxID = `${player.id}-name-box`;
    // This finds the first empty player-name-box of the correct position group
    const assocPlayerNameBox = document.getElementById(playerNameBoxID);

    // Finds the cost-span by looking at the immediately adjacent sibling
    const costSpan = document.querySelector(`#${CSS.escape(playerNameBoxID)} + .cost-span`);

    if (assocPlayerNameBox && costSpan) {
        // Update player-name-box
        assocPlayerNameBox.removeAttribute('id');

        // pass player-name-box to updatePlayerNameBox with .apply
        const emptyPlayer = empty_player_slots[position_group];
        updatePlayerNameBox.apply(
            assocPlayerNameBox,
            [
                emptyPlayer.name,
                emptyPlayer.nameAbbr,
                emptyPlayer.positions
            ]
        );

        // Update cost-span
        // Manually update cost-span and add `.cost-zero` class to hide if 0
        costSpan.textContent = emptyPlayer.cost;
        if (emptyPlayer.cost > 0) {
            costSpan.classList.remove('cost-zero');
        } else {
            costSpan.classList.add('cost-zero');
        }
    }

    // TODO: FADE BACK IN PLAYER FROM ALL PLAYER TABLE
    // Fade up player from the player-pool-table
    const playerCellInPool = document
        .querySelector(`#player-pool-table #${CSS.escape(playerNameBoxID)}`)
        ?.parentElement;
    
    if (playerCellInPool) {
        playerCellInPool.classList.remove('player-used');
    }

    // Update position and point counts
    updateCounts(primary_position);

    return deleted;
}
