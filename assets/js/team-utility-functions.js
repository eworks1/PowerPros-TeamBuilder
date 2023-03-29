/**
 * @param {Object} player 
 * @returns {string}
 */
function getPrimaryPosition(player) {
    return player["Field Position"][0];
}

/**
 * @param {(string|Object)} primaryPositionOrPlayer
 * @returns {boolean}
 */
function isPitcher(primaryPositionOrPlayer) {
    let primary_position;
    if (typeof primaryPositionOrPlayer == 'string') {
        primary_position = primaryPositionOrPlayer;
    } else {
        primary_position = getPrimaryPosition(primaryPositionOrPlayer);
    }
    
    return ['SP', 'MR', 'CP', 'P'].includes(primary_position);
}


/**
 * @returns {Object[]}
 */
function getAllPlayers() {
    return [
        ...team.pitchers,
        ...team.fielders,
        ...team.backups
    ];
}

/**
 * @returns {Object[]}
 */
function getAllPitchers() {
    return [
        ...team.pitchers,
        ...team.backups
            .filter(player => isPitcher(player))
    ];
}

/**
 * @returns {Object[]}
 */
function getAllFielders() {
    return [
        ...team.fielders,
        ...team.backups
            .filter(player => !isPitcher(player))
    ];
}


/**
 * @param {string} position
 * @returns {Object[]}
 */
function getAllPlayersByPostion(position) {
    return [
        ...team.pitchers,
        ...team.fielders,
        ...team.backups
    ].filter(player => position == getPrimaryPosition(player));
}

/**
 * @param {string} position
 * @returns {number}
 */
function getPlayerCountByPosition(position) {
    return getAllPlayersByPostion(position).length;
}

/**
 * @returns {number}
 */
function getPitchersTotalCost() {
    return getAllPitchers()
        .map(p => p["Point Cost"])
        .reduce((prev, current) => prev + current, 0);
}

/**
 * @returns {number}
 */
function getFieldersTotalCost() {
    return getAllFielders()
        .map(p => p["Point Cost"])
        .reduce((prev, current) => prev + current, 0);
}

/**
 * @returns {number}
 */
function getFullTeamCost() {
    return getPitchersTotalCost() + getFieldersTotalCost();
}
