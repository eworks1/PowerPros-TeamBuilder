/** @type {HTMLTextAreaElement} */
const jsonBox = document.getElementById('json-text-box');
function generateJson(event) {
    /** @type {{name: string, pitchers: string[], fielders: string[], backups: string[]}} */
    const teamTemp = {
        name: document.getElementById('team-name').value,
        pitchers: [],
        fielders: [],
        backups: [],
    };

    teamTemp.pitchers = team.pitchers.map(p => p.id);
    teamTemp.fielders = team.fielders.map(p => p.id);
    teamTemp.backups = team.backups.map(p => p.id);

    teamTemp.name = document.getElementById('team-name').value;
    const teamJSONStr = JSON.stringify(teamTemp);
    jsonBox.value = teamJSONStr;
}

/**
 * @param {Event} event
 */
async function copyJson(event) {
    await changeButtonTextOnAction(
        event.target,
        'Copied!',
        'Failed',
        3000,
        () => { return navigator.clipboard.writeText(jsonBox.value) }
    );
}

/**
 * @param {Event} event
 */
async function importJson(event) {
    const jsonText = jsonBox.value;

    await changeButtonTextOnAction(
        event.target,
        'Imported!',
        'Failed',
        3000,
        () => {
            /** @type {{name: string, pitchers: string[], fielders: string[], backups: string[]}} */
            const newTeam = JSON.parse(jsonText);
            console.info(newTeam);
            
            // Update team name
            document.getElementById('team-name').value = newTeam.name;

            // Clear current team (maybe have a warning)
            const existingTeam = getAllPlayersOnTeam()
                .map(p => p.id);
            const allNewPlayers = [
                ...newTeam.pitchers,
                ...newTeam.fielders,
                ...newTeam.backups
            ];

            if (JSON.stringify(existingTeam) == JSON.stringify(allNewPlayers)) { return; }
            if (existingTeam.length > 0
                && !confirm('This will clear your existing team. Are you sure you\'d like to import a new team?')) {
                return;
            }

            existingTeam.forEach(p => removePlayer(p));

            // Add each player of imported team
            allNewPlayers
                .map(id => findPlayer(id))
                .forEach(p => addPlayer(p));
        }
    );
}

/**
 * @param {HTMLButtonElement} element 
 * @param {string} successText 
 * @param {string} failureText 
 * @param {number} duration 
 * @param {function(): Promise<void>} action
 * @returns {Promise<void>}
 */
async function changeButtonTextOnAction(element, successText, failureText, duration, action) {
    const originalText = element.innerText;

    try {
        await action();
        element.innerText = successText;
    } catch (error) {
        element.innerText = failureText;
    } finally {
        element.disabled = true;
        await new Promise(resolve => setTimeout(resolve, duration));
        element.innerText = originalText;
        element.disabled = false;
    }
}
