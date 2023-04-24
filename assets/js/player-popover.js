/**
 * @param {Event} event 
 */
function hidePopover(event) {
    event.target.style.display = 'none';
}

/**
 * Update all parts of popover
 * @param {Object} player 
 */
function playerDoubleClicked(player) {
    const popover = document.getElementById('popover-wrapper');
    if (!popover) { console.error('Could not find #popover-wrapper.'); return; }

    popover.style.display = 'block';
}
