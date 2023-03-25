---
---

const all_players = allPlayers().players;

function allPlayers() {
    return {{ site.data.players | jsonify }};
}
