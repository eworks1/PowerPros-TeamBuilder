/** @type {HTMLTextAreaElement} */
const jsonBox = document.getElementById('json-text-box');
function generateJson(event) {
    const teamJSONStr = JSON.stringify(team);
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
            /** @type {{pitchers: Player[], fielders: Player[], backups: Player[]}} */
            const newTeam = JSON.parse(jsonText);
            console.info(newTeam);
            
            // TODO: actual process 
            // clear current team (maybe have a warning)
            const existingTeam = getAllPlayersOnTeam();
            existingTeam.forEach(p => removePlayer(p));

            // add each player of imported team
            const allNewPlayers = [
                ...newTeam.pitchers,
                ...newTeam.fielders,
                ...newTeam.backups
            ];
            allNewPlayers.forEach(p => addPlayer(p));
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
