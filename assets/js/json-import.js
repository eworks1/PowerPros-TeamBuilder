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
    return navigator.clipboard.writeText(jsonBox.value).then(() => {
        event.target.innerText = 'Copied!';
        return new Promise(resolve => setTimeout(resolve, 3000));
    }, () => {
        event.target.innerText = 'Failed';
        return new Promise(resolve => setTimeout(resolve, 3000));
    }).finally(() => {
        event.target.innerText = 'Copy';
    });
}

/**
 * @param {Event} event
 */
function importJson(event) {
    const jsonText = jsonBox.value;
    /** @type {{pitchers: Player[], fielders: Player[], backups: Player[]}} */
    const json = JSON.parse(jsonText);
    console.info(json);
}
