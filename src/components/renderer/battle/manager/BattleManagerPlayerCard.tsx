import { Player } from "@/src/lib/types"
import { PlayerSelect } from "../../../shared/PlayerSelect"
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card"
import { BattleManagerTeamPanel } from "./BattleManagerTeamPanel"
import { OBSConnection } from "@/src/lib/obs-connection"
import { useOBSState } from "@/src/hooks/use-obs-state"
import { usePlayersQuery } from "@/src/hooks/use-players"
import { useOBSBattleData } from "@/src/hooks/use-obs-battle-data"
import { BattleManagerPlayerScore } from "./BattleManagerPlayerScore"

interface BattleManagerPlayerCardProps {
    connection: OBSConnection,
    player?: Player,
    setPlayer: any,
    header?: string,
    bottom?: boolean,
}

export const BattleManagerPlayerCard = ({
    connection,
    player,
    setPlayer,
    header,
    bottom,
}: BattleManagerPlayerCardProps) => {
    const { setPersistentData, broadcastCustomEvent } = useOBSState(connection);
    const { battleStateData, battleStateLoading } = useOBSBattleData(connection, bottom);
    const { data: players = [] } = usePlayersQuery();

    if (battleStateLoading) {
        return (<></>);
    }

    const handleSetPlayer = (player: string | undefined) => {
        const foundPlayer = players.find((p) => p.id === player);

        setPersistentData(connection, bottom ? "bottom_player" : "top_player", foundPlayer?.name);
        setPlayer(player);

        broadcastCustomEvent({
            eventData: {
                eventName: "SetBattlePlayer",
                player: foundPlayer ? foundPlayer.name : undefined,
                bottom: bottom ? bottom : false,
            },
        })
        broadcastCustomEvent({
            eventData: {
                eventName: "ResetBattle",
            },
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {header ?? ""}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-row justify-between border rounded-lg p-4 space-y-3">
                    <PlayerSelect
                        defaultPlayer={player?.id}
                        onValueChange={handleSetPlayer}
                    />
                    <BattleManagerPlayerScore 
                        connection={connection}
                        bottom={bottom}
                        initialScore={battleStateData?.score}
                    />
                </div>
                <div>
                    {player &&
                    <BattleManagerTeamPanel
                        connection={connection}
                        teamUrl={player?.teamUrl}
                        bottom={bottom}
                        initialSelectedPokemon={battleStateData?.pokemon}
                    />
                    }
                </div>
            </CardContent>
        </Card>        
    )
}