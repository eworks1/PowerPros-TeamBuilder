/**
 * @param {Player} player 
 * @returns {Position}
 */
function getPrimaryPosition(player) {
    return player.positions[0];
}

/**
 * @param {(Position|Player)} primaryPositionOrPlayer
 * @returns {boolean}
 */
function isPitcher(primaryPositionOrPlayer) {
    /** @type {Position} */
    let primary_position;
    if (typeof primaryPositionOrPlayer == 'string') {
        primary_position = primaryPositionOrPlayer;
    } else {
        primary_position = getPrimaryPosition(primaryPositionOrPlayer);
    }
    
    return ['SP', 'MR', 'CP', 'P'].includes(primary_position);
}


/**
 * @returns {Player[]}
 */
function getAllPlayersOnTeam() {
    return [
        ...team.pitchers,
        ...team.fielders,
        ...team.backups
    ];
}

/**
 * @returns {Player[]}
 */
function getAllPitchersOnTeam() {
    return [
        ...team.pitchers,
        ...team.backups
            .filter(player => isPitcher(player))
    ];
}

/**
 * @returns {Player[]}
 */
function getAllFieldersOnTeam() {
    return [
        ...team.fielders,
        ...team.backups
            .filter(player => !isPitcher(player))
    ];
}


/**
 * @param {Position} position
 * @returns {Player[]}
 */
function getAllPlayersByPostion(position) {
    return getAllPlayersOnTeam()
        .filter(player => position == getPrimaryPosition(player));
}

/**
 * @param {Position} position
 * @returns {number}
 */
function getPlayerCountByPosition(position) {
    return getAllPlayersByPostion(position).length;
}

/**
 * @returns {number}
 */
function getPitchersTotalCost() {
    return getAllPitchersOnTeam()
        .map(p => p.cost)
        .reduce((prev, current) => prev + current, 0);
}

/**
 * @returns {number}
 */
function getFieldersTotalCost() {
    return getAllFieldersOnTeam()
        .map(p => p.cost)
        .reduce((prev, current) => prev + current, 0);
}

/**
 * @returns {number}
 */
function getFullTeamCost() {
    return getPitchersTotalCost() + getFieldersTotalCost();
}
