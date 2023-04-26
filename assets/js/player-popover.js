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

    // Update viewable content
    let index = Array.prototype.slice.call(event.target.parentElement.children).indexOf(event.target);
    if (index == 0) {
        index = popoverIsPitcher ? 1 : 2;
    }

    event.target.parentElement.setAttribute('current-tab', popoverTabIDs[index]);
}

/** Defines whether the first tab should show pitcher or batter data */
let popoverIsPitcher = false;

/** Popover tab IDs */
const popoverTabIDs = [
    "default",
    "pitching",
    "batting",
    "position",
    "profile"
];

/**
 * Update all parts of popover
 * @param {Object} player 
 */
function playerDoubleClicked(player) {
    const popover = document.getElementById('popover-wrapper');
    if (!popover) { console.error('Could not find #popover-wrapper.'); return; }

    popoverIsPitcher = isPitcher(player);
    popover.setAttribute(
        'primary-pos',
        popoverIsPitcher ? 'pitcher' : 'fielder'
    );
    
    const tabbar = document.getElementById('popover-tabbar');
    if (tabbar) {
        tabbar.setAttribute(
            'current-tab',
            popoverTabIDs[popoverIsPitcher ? 1 : 2]
        );
    }

    // TODO: update all info

    // Update Player Name Box
    const playerNameBox = popover.querySelector('#popover-name-section .player-name-box');
    updatePlayerNameBox.apply(
        playerNameBox,
        [
            player.Name,
            player["Name Abbreviation"],
            player["Field Position"]
        ]
    );

    // Show popover once all info is updated
    popover.classList.remove('hidden');
}
