/**
 * @param {Event} event 
 */
function hidePopover(event) {
    event.target.classList.add('hidden');
}

/**
 * @param {Event} event 
 */
function updateSelectedPopoverTab(event) {
    // If the tab selected was already selected, do nothing.
    if (event.target.classList.contains('selected')) { return; }

    // Find selected element and remove the .selected class
    const selectedTab = Array.from(event.target.parentNode.childNodes).find(el => el.classList.contains('selected'));
    if (selectedTab) {
        selectedTab.classList.remove('selected');
    }

    // Add .selected class
    event.target.classList.add('selected');
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
