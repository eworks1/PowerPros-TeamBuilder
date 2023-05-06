---
---

const all_players = allPlayers().players;

{% raw %}
/**
 * @returns { { players: Player[] }}
 */
function allPlayers() {
{% endraw %}
    return {{ site.data.players | jsonify }};
}


{% raw %}
/**
 * @typedef {"P"|"SP"|"MR"|"CP"|"1B"|"2B"|"3B"|"SS"|"OF"} Position
 */
/**
 * @typedef {"L"|"R"} ThrowingHandedness
 */
/**
 * @typedef {"L"|"R"|"S"} BattingHandedness
 */

/**
 * @typedef {Object} Player
 * @prop {string} id
 * @prop {string} name
 * @prop {string} nameAbbr
 * @prop {string} pfpFileName
 * @prop {string} jerseyNum
 * @prop {Position[]} positions
 * @prop {Object.<Position, number>} allFieldingRatings
 * @prop {ThrowingHandedness} throwingHandedness
 * @prop {BattingHandedness} battingHandedness
 * @prop {number} starPoints
 * @prop {number} cost
 * @prop {number} trajectory
 * @prop {number} contact
 * @prop {number} power
 * @prop {number} runSpeed
 * @prop {number} armStrength
 * @prop {number} fielding
 * @prop {number} catching
 * @prop {number} pitchingVelo
 * @prop {number} control
 * @prop {number} stamina
 * @prop {{id: string, level: ?number}[]} breakingBalls
 * @prop {string} pitchingForm
 * @prop {string} battingForm
 * @prop {Object.<string, string>} traits
 * @prop {{pitcher: string[], fielder: string[],positionAssignment: string[]}} abilities
 * @prop {string} uniformName
 */
{% endraw %}
