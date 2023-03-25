---
---

const all_players = allPlayers().players;

/**
 * @returns { { players: { [key: string]: string }[] }}
 */
function allPlayers() {
    return {{ site.data.players | jsonify }};
}
