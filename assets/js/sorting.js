/**
 * @this {HTMLElement} DOM
 * @param {Event} event 
 */
function sortRightClick(event) {
    // element is right clicked
    // check if it has the sort-asc attribute
    const key = event.target.getAttribute('sort-key');
    if (event.target && key) {
        event.preventDefault();
        sortPlayerPool(event.target, key);
    }
}

/**
 * @param {EventTarget} target
 * @param {string} sortKey 
 */
function sortPlayerPool(target, sortKey) {
    const poolTable = document.getElementById('player-pool-table');
    if (!poolTable) { return; }

    let sortAsc = target.getAttribute('sort-asc');
    if (!sortAsc) {
        sortAsc = 'true';
        target.setAttribute('sort-asc', 'true');
    }

    const sortedArr = all_players.toSorted((a, b) => {
        return ((sortAsc === 'true') ? 1 : -1) * (a[sortKey] - b[sortKey]);
    });

    for (const child of poolTable.children) {
        const id = child.firstElementChild.id.replace('-name-box', '');
        const order = sortedArr.findIndex(p => p.id == id);
        child.style.order = order;
    }

    target.setAttribute('sort-asc', !(sortAsc === 'true'));
}
