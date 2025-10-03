
export function savePlayer(playerName, playerTeam) {
    playerName = playerName.replace(" ", "_").toLowerCase();
    const player = {
        name: playerName,
        team: playerTeam,
    };

    let playersStorage = localStorage.getItem("players");

    playersStorage = playersStorage ? JSON.parse(playersStorage) : [];

    playersStorage.push(player);

    localStorage.setItem("players", JSON.stringify(playersStorage));

    console.log("Jogador salvo");
}

export function getPlayers() {
    let playersStorage = localStorage.getItem("players");
    let players = playersStorage ? JSON.parse(playersStorage) : [];
    return players;
}

export function getPlayer(playerName) {
    playerName = playerName.replace(" ", "_").toLowerCase();
    let playersStorage = localStorage.getItem("players");
    let players = playersStorage ? JSON.parse(playersStorage) : [];
    console.log(players);
    return players.find((player) => player.name == playerName);
}