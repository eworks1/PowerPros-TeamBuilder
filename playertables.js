import { players } from "./players.json";

const playerPoolTable = document.getElementById('player-pool-table');
if (playerPoolTable) {
    players.forEach(player => {
        const tableRow = document.createElement('tr');
        const tableData = document.createElement('td');
        tableData.innerHTML = `<span>${player.Name}</span> <span>${player["Point Cost"]}</span>`
        tableRow.appendChild(tableData);
        playerPoolTable.appendChild(tableRow);
    })
}