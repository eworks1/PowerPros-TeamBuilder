/**
 * @param {Event} event
 * @param {string} position
 */
function positionButtonLeftClicked(event, position) {
    updateSelectedFilterButton(position, false);
    updatePositionFilter(position, true);
}

/**
 * @param {Event} event
 * @param {string} position
 */
function positionButtonRightClicked(event, position) {
    event.preventDefault();

    if (position != 'All') {
        updateSelectedFilterButton(position, true);
        updatePositionFilter(position, false);
    }
}

/**
 * @param {string} position 
 * @param {boolean} rightClicked
 */
function updateSelectedFilterButton(position, rightClicked) {
    const filterBox = document.getElementById('position-filter-box');
    const currentlySelectedButton = filterBox.querySelector('.position-filter-button.clicked');
    if (currentlySelectedButton) {
        currentlySelectedButton.classList.remove('clicked', 'right-clicked');
    }

    const selectedButton = filterBox.querySelector(`.position-filter-button[position="${position}"]`)
    selectedButton.classList.add('clicked');
    if (rightClicked) {
        selectedButton.classList.add('right-clicked');
    }
}

/**
 * @param {string} positionGroup 
 * @param {boolean} primaryOnly If right-clicked, it should show players even if it's not their primary position.
 */
function updatePositionFilter(positionGroup, primaryOnly) {
    const playerPoolGrid = document.getElementById('player-pool-table');
    if (playerPoolGrid) {
        /**
         * Returns `true` if the player should stay.
         * @callback filterPredicate
         * @param {string[]} positions
         * @returns {boolean}
         */
        
        /** @type {filterPredicate} */
        let predicate;
        if (primaryOnly) {
            predicate = function (positions) {
                const primary_position = positions[0];
                return positionIsInGroup(primary_position, positionGroup);
            }
        } else {
            predicate = function (positions) {
                return positions.some(p => positionIsInGroup(p, positionGroup));
            }
        }

        for (const cell of playerPoolGrid.children) {
            const positions = cell.getAttribute('positions') || '';
            if (predicate(positions.split(' '))) {
                cell.classList.remove('hidden');
            } else {
                cell.classList.add('hidden');
            }
        }
    }
}

/**
 * 
 * @param {string} position 
 * @param {string} group 
 * @returns {boolean}
 */
function positionIsInGroup(position, group) {
    if (group == 'All') {
        return true;
    } else if (group == 'P') {
        return isPitcher(position);
    } else if (group == 'F') {
        return !isPitcher(position);
    } else {
        return group == position;
    }
}