---
---

const all_pitches = allPitches().pitches;

{% raw %}
/**
 * @returns { { pitches: Object }}
 */{% endraw %}
function allPitches() {
    return {{ site.data.pitches | jsonify }};
}
