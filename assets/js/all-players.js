---
---

const all_players = allPlayers().players;

{% raw %}
/**
 * @returns { { players: Object[] }}
 */{% endraw %}
function allPlayers() {
    return {{ site.data.players | jsonify }};
}
