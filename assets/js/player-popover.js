/**
 * @param {Event} event 
 */
function hidePopover(event) {
    event.target.classList.add('hidden');
}

/**
 * Update all parts of popover
 * @param {Object} player 
 */
function playerDoubleClicked(player) {
    const popover = document.getElementById('popover-wrapper');
    if (!popover) { console.error('Could not find #popover-wrapper.'); return; }

    popover.classList.remove('hidden');
}
