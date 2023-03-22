const players = fetch("./players.json")
    .then(res => res.json())
    .then(json => json.players);

export default await players;