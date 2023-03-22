import players from "./getPlayers.js";

const playerPoolTable = document.getElementById('player-pool-table');
if (playerPoolTable) {
    players.forEach((player, i) => {
        if (i % 2 == 0) {
            // first item of row
            const tableRow = document.createElement('tr');
            const cellData = document.createElement('td');
            cellData.innerHTML = `<span>${player.Name}</span> <span>${player["Point Cost"]}</span>`;
            tableRow.appendChild(cellData);
            playerPoolTable.appendChild(tableRow);
        } else {
            // second item of row
            const rowElements = playerPoolTable.getElementsByTagName('tr');
            const lastRow = rowElements.item(rowElements.length - 1);

            const cellData = document.createElement('td');
            cellData.innerHTML = `<span>${player.Name}</span> <span>${player["Point Cost"]}</span>`;
            lastRow.appendChild(cellData);
        }

    })
}