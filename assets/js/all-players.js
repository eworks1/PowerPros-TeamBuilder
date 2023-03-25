---
---

const all_players = allPlayers()

function allPlayers() {
    return {{ site.data.players.players | jsonify }};
}
