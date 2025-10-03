import { getPlayers } from "../lib/playerStorage";
import "./style/Forms.css";

type Player = {
    name: string,
    team: string
}

interface PlayerListProps {
    players: Player[],
}

export const PlayerList = ({
    players
}: PlayerListProps) => {
    return (
        <div>
            {players.map((player: Player) => (
                <div key={player.name}>{player.name} - {player.team}</div>
            ))}
        </div>
    )
}