function playerClicked(player) {
    // update all 3 detail views (just fielding for now)
    const fieldingDetailView = document.getElementById('fielding-detail-view');

    const playerNameBox = fieldingDetailView.getElementsByClassName('player-name-box').item(0);
    if (playerNameBox) {
        playerNameBox.textContent = player['Name Abbreviation'];
    }
}