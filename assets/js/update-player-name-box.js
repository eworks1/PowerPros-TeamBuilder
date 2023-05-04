---
---

{% raw %}
/**
 * @this Element
 * @param {string} fullName
 * @param {string} nameAbbr
 * @param {string[]} positions 
 */
function updatePlayerNameBox(fullName, nameAbbr, positions) {
{% endraw %}
    const gradient = createGradientString(positions);

    let elementText = nameAbbr;
    let styleString = `background: ${gradient};`;
    if (nameAbbr != 'Empty') { // if name is a real player
        elementText = nameAbbr;
        this.classList.add('has-player');
        this.classList.remove('no-player');
    } else { // if its an empty player
        this.classList.add('no-player');
        this.classList.remove('has-player');
    }

    this.setAttribute('style', styleString);
    this.textContent = elementText;
    this.setAttribute('title', fullName)
}

/**
 * @param {string[]} positions 
 * @returns {string}
 */
function createGradientString(positions) {
    const colors = new Array();
    for (const pos of positions) {
        const colorName = all_position_colors[pos.trim()];
        if (!colors.includes(colorName)) {
            colors.push(colorName);
        }
    }
    
    const colorCount = colors.length || 1;
    const percentDivided = 100 / colorCount;

    let gradientMiddle = '';
    colors.forEach((c, i) => {
        const percent1 = percentDivided * i;
        let percent2 = percent1 + percentDivided;

        if (i == colors.length - 1) {
            percent2 = 100;
        }

        gradientMiddle = gradientMiddle + `, ${c} ${percent1}%, ${c} ${percent2}%`;
    })
    
    return `linear-gradient(to right${gradientMiddle})`;
}

const all_position_colors = allPositionColors();

{% raw %}
/**
 * @returns {{[key: string]: string}}
 */
function allPositionColors() {
{% endraw %}
    return {{ site.data.colors.positions | jsonify }};
}
