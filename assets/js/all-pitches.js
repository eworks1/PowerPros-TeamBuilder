---
---

{% raw %}
/** 
 * @typedef {"Up 1"|"Up 2"|"Inside"|"Down-Inside"|"Down"|"Down-Outside"|"Outside"} PitchDirection
 */

/**
 * @typedef {Object} Pitch
 * @property {string} Name
 * @property {string} Abbreviation
 * @property {PitchDirection} Direction
 */

/** @type {Object.<string, Pitch>} */
const all_pitches = allPitches().pitches;

/**
 * @returns {{ pitches: Object.<string, Pitch> }}
 */
function allPitches() {
{% endraw %}
    return {{ site.data.pitches | jsonify }};
}
