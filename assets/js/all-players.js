---
---

const all_players = allPlayers()

/**
 * @returns {{[key: string]: string}[]}
 */
function allPlayers() {
    return {{ site.data.players.players | jsonify }};
}
