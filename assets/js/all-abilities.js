---
---

{% raw %}
/**
 * @typedef {Object} Trait
 * @property {string} abbr
 * @property {string} [fullName]
 * @property {string} description
 * @property {string} [sName]
 * @property {string} [sDescription]
 * @property {number} order
 */

/**
 * @typedef {Object} Ability
 * @property {string} abbr
 * @property {string} effect
 * @property {string} fullName
 * @property {string} description
 */
    
/** @type {{traits: Object.<string, Trait>, abilities: Object.<string, Ability>}} */
const all_abilities = allAbilities();
{% endraw %}

function allAbilities() {
    return {{ site.data.abilities | jsonify }};
}
