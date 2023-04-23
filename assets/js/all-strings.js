---
---

const all_strings = allStrings();

{% raw %}
/**
 * @returns {Object}
 */{% endraw %}
function allStrings() {
    return {{ site.data.strings | jsonify }};
}
