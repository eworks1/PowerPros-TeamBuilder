---
---

const empty_player_slots = {{ site.data.players.empty_slots | jsonify }};
const max_counts = {
    pitchers: 15,
    fielders: 18,
    backups: 37
};
var team = {
    pitchers: Array(),
    fielders: Array(),
    backups: Array()
};

{% raw %}
/**
 * @param {any} player
 * @returns {boolean}
 */{% endraw %}
function addPlayer(player) {
    // Add to team
    const primary_position = player["Field Position"][0];
    let added = true;
    let position_group = '';
    if (['SP', 'MR', 'CP'].includes(primary_position)) {
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
                player['Name Abbreviation'],
                player['Field Position']
            ]
        );

        // Update cost-span
        // Manually update cost-span and set opacity to 0 if 0
        costSpan.textContent = player["Point Cost"];
        const costOpacity = Math.min(1, player["Point Cost"]);
        costSpan.setAttribute(
            'style',
            `opacity: ${costOpacity};`
        );
    }

    return added;
}
