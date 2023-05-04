---
---

const all_pitches = allPitches().pitches;

{% raw %}
/**
 * @returns { { pitches: Object }}
 */
function allPitches() {
{% endraw %}
    return {{ site.data.pitches | jsonify }};
}
