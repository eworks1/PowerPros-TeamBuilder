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
        () => navigator.clipboard.writeText(jsonBox.value)
    );
}

/**
 * @param {Event} event
 */
function importJson(event) {
    const jsonText = jsonBox.value;
    
    try {
        /** @type {{pitchers: Player[], fielders: Player[], backups: Player[]}} */
        const json = JSON.parse(jsonText);
        console.info(json);
    } catch (error) {
        console.error(error instanceof SyntaxError);
        console.error(error.message);
    }
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
        setTimeout(resolve, duration);
        element.innerText = originalText;
    }
}
