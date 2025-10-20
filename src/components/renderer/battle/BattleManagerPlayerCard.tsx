import { Player } from "@/src/lib/types"
import { PlayerSelect } from "../../shared/PlayerSelect"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { BattleManagerTeamPanel } from "./BattleManagerTeamPanel"
import { OBSConnection } from "@/src/lib/obs-connection"
import { useOBSState } from "@/src/hooks/use-obs-state"

interface BattleManagerPlayerCardProps {
    connection: OBSConnection,
    player?: Player,
    playerIdentifier?: string,
    setPlayer: any,
    header?: string,
}

export const BattleManagerPlayerCard = ({
    connection,
    player,
    playerIdentifier,
    setPlayer,
    header
}: BattleManagerPlayerCardProps) => {
    const { setPersistentData } = useOBSState(connection);

    const handleSetPlayer = (player: string) => {
        if(playerIdentifier)
            setPersistentData(connection, playerIdentifier, player);
        setPlayer(player);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {header ?? ""}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="border rounded-lg p-4 space-y-3">
                    <PlayerSelect
                        defaultPlayer={player?.id}
                        onValueChange={handleSetPlayer}
                    />
                </div>
                <div>
                    {player &&
                    <BattleManagerTeamPanel
                        teamUrl={player?.teamUrl}
                    />
                    }
                </div>
            </CardContent>
        </Card>        
    )
}