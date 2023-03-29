/**
 * @param {string} position Primary position.
 */
function updateCounts(position) {
    let primary_position = getPrimaryPosition(position);
    if (isPitcher(primary_position)) {
        primary_position = 'P';
    }

    const fullTeamCostSpan = document.getElementById('full-point-count');
    const positionCountSpan = document.getElementById(`${primary_position}-player-position-count`);
    const fieldersGroupCountSpan = document.getElementById('F-player-position-count');

    /** @type {HTMLElement|null} */
    let positionGroupCostSpan;

    let positionGroupCost = 0;
    let positionCount = 0;

    if (isPitcher(primary_position)) {
        positionGroupCostSpan = document.getElementById('pitcher-point-count');
        positionGroupCost = getPitchersTotalCost();
        positionCount = getAllPitchers().length;
    } else {
        positionGroupCostSpan = document.getElementById('fielder-point-count');
        positionGroupCost = getFieldersTotalCost();
        positionCount = getPlayerCountByPosition(primary_position);
    }
    
    if (fullTeamCostSpan && positionCountSpan && fieldersGroupCountSpan && positionGroupCostSpan) {
        fullTeamCostSpan.textContent = `${getFullTeamCost()}`;
        positionGroupCostSpan.textContent = `${positionGroupCost}`;

        positionCountSpan.textContent = `${positionCount}`;
        fieldersGroupCountSpan.textContent = `${getAllFielders().length}`;
    }
}