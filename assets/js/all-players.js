---
---

const all_players = allPlayers().players;

{% raw %}
/**
 * @returns { { players: { [key: string]: string }[] }}
 */{% endraw %}
function allPlayers() {
    return {{ site.data.players | jsonify }};
}
