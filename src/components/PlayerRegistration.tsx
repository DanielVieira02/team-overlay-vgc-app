import { useEffect, useState } from "react";
import "./style/Forms.css";
import { getPlayers, savePlayer } from "../lib/playerStorage";
import { PlayerList } from "./PlayerList";

type Player = {
    name: string,
    team: string
}

export const PlayerRegistration = () => {
    const [playerList, setPlayerList] = useState<Player[]>(getPlayers());

    const [playerName, setName] = useState("");
    const [playerTeam, setTeam] = useState("");

    function handleSubmit(event: any) {
        event.preventDefault();
        savePlayer(playerName, playerTeam);
        playerList.push({ name: playerName, team: playerTeam });
        setPlayerList(playerList);
    }
    
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label className="labelField">Insira o nome do jogador:
                        <input 
                            type="text" 
                            name="playerName"
                            value={playerName}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label className="labelField">Insira a paste
                        <input 
                            type="text" 
                            name="playerTeam"
                            value={playerTeam}
                            onChange={(e) => setTeam(e.target.value)}
                        />
                    </label>
                </div>
                <input type="submit" />
            </form>
            <PlayerList players={playerList}/>
        </div>
    )
}