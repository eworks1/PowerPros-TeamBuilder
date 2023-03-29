/**
 * @param {string} position Primary position.
 */
function updateCounts(position) {
    let primary_position = position;
    if (isPitcher(primary_position)) {
        primary_position = 'P';
    }

    const fullTeamCostSpan = document.getElementById('full-point-count');
    const positionCountSpan = document.getElementById(`${primary_position}-player-position-count`);
    const fieldersGroupCountSpan = document.getElementById('F-player-position-count');
    const fullTeamCountSpan = document.getElementById('player-count-total');

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
    
    if (fullTeamCostSpan && positionCountSpan && fieldersGroupCountSpan && positionGroupCostSpan && fullTeamCountSpan) {
        fullTeamCostSpan.textContent = `${getFullTeamCost()}`;
        positionGroupCostSpan.textContent = `${positionGroupCost}`;

        positionCountSpan.textContent = `${positionCount}`;
        fieldersGroupCountSpan.textContent = `${getAllFielders().length}`;
        fullTeamCountSpan.textContent = `${getAllPlayers().length}`;
    }
}