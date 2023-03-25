---
---

function allPlayers() {
    return {{ site.site.data.players.players | jsonify }};
}
