/**
 * @param {Event} event 
 */
function hidePopover(event) {
    if (event.target.id == 'popover-wrapper') {
        event.target.classList.add('hidden');
    }
}

/**
 * @param {Event} event 
 */
function updateSelectedPopoverTab(event) {
    // If the tab selected was already selected, do nothing.
    if (event.target.classList.contains('selected')) { return; }

    // Find selected element and remove the .selected class
    const alreadySelectedTab = Array.from(event.target.parentElement.children).find(el => el.classList.contains('selected'));
    if (alreadySelectedTab) {
        alreadySelectedTab.classList.remove('selected');
    }

    // Add .selected class
    event.target.classList.add('selected');

    // Update border color to background color newly-selected tab
    const popoverBody = document.getElementById('popover-body');
    if (popoverBody) {
        popoverBody.style.borderColor = event.target.style.backgroundColor;
    }
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
