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
 * @property {string[]} category
 * @property {string} [effectType]
 * @property {string} [fullName]
 * @property {string} description
 */
    
/** @type {{traits: {pitcher: Object.<string, Trait>, fielder: Object.<string, Trait>}, abilities: Object.<string, Ability>}} */
const all_abilities = allAbilities();
{% endraw %}

function allAbilities() {
    return {{ site.data.abilities | jsonify }};
}
