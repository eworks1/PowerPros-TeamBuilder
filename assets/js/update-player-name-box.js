---
---

/**
 * @param {Element} element
 * @param {string} name
 * @param {string[]} positions 
 */
function updatePlayerNameBox(element, name, positions) {
    const gradient = createGradientString(positions);

    // const span = document.querySelector('.player-name-box')
    let elementText = '';
    let styleString = `background: ${gradient};`;
    if (name) { // if name is not an empty string
        elementText = name;
    } else {
        elementText = 'Empty';
        styleString += ' color: rgba(0, 0, 0, 0.2);'
    }

    element.setAttribute('style', styleString)
    element.textContent = elementText
}

/**
 * @param {string[]} positions 
 * @returns {string}
 */
function createGradientString(positions) {
    const colors = new Array();
    for (const pos of positions) {
        const colorName = allPositionColors[pos];
        if (!colors.includes(colorName)) {
            prev.push(colorName);
        }
    }
    
    const colorCount = colors.length | 1;
    const percentDivided = 100 / colorCount;

    const gradientStart = 'linear-gradient(to right';

    let gradientMiddle = '';
    colors.forEach((c, i) => {
        const percent1 = percentDivided * i;
        let percent2 = percent1 + percentDivided;

        if (i == colors.length - 1) {
            percent2 = 100;
        }

        gradientMiddle = gradientMiddle + `, ${c} ${percent1}%, ${c} ${percent2}%`;
    })
    
    const gradientEnd = ')';
    return `linear-gradient(to right${gradientMiddle})`;
}

const allPositionColors = allColors();

function allColors() {
    return {{ site.data.colors.positions | jsonify }};
}