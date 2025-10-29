import { OBSConnection } from "@/src/lib/obs-connection"
import { usePlayersQuery } from "@/src/hooks/use-players";
import { useEffect, useState } from "react";
import { Player } from "@/src/lib/types";
import { BattleManagerPlayerCard } from "./BattleManagerPlayerCard";
import { Button } from "../../ui/button";
import { useOBSState } from "@/src/hooks/use-obs-state";

interface BattleManagerControllerProps {
    connection: OBSConnection,
}

export const BattleManagerController = ({
    connection,
}: BattleManagerControllerProps) => {
    const { setPersistentData, getPersistentData, broadcastCustomEvent } = useOBSState(connection);

    const [ playerA, setPlayerA ] = useState<Player>();
    const [ playerB, setPlayerB ] = useState<Player>();
    const [ showBattleOverlay, setShowBattleOverlay ] = useState<boolean>(false);
    const { data: players = [] } = usePlayersQuery();

    useEffect(() => {
        getPersistentData(connection, "top_player").then((result) => {
            const player = players.find((player) => player.name === result.slotValue);
            setPlayerA(player);
        })
        getPersistentData(connection, "bottom_player").then((result) => {
            const player = players.find((player) => player.name === result.slotValue);
            setPlayerB(player);
        })
    }, [players]);

    const handleSelectPlayerA = (playerId: string) => {
        const selectedPlayer = players.find((player) => player.id === playerId)
        setPlayerA(selectedPlayer);
    }

    const handleSelectPlayerB = (playerId: string) => {
        const selectedPlayer = players.find((player) => player.id === playerId)
        setPlayerB(selectedPlayer);
    }

    const handleToggleOverlay = (state: boolean) => {
        setShowBattleOverlay(state);
        setPersistentData(connection, "show_battle_overlay", { show: !state });   
        broadcastCustomEvent({ eventData: { eventName: "UpdateBattleStatus"}});
    }

    return (
        <div className="items-center gap-4">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">Battle Overlay</h2>
                    <p className="text-muted-foreground">
                        Manage the current battle on stream
                    </p>
                    <Button
                        onClick={() => handleToggleOverlay(!showBattleOverlay)}
                        variant="outline"
                    >
                        {showBattleOverlay ? "Show overlay" : "Hide overlay"}
                    </Button>
                </div>
        
                <div className="grid gap-6 md:grid-cols-2">
                    <BattleManagerPlayerCard
                        connection={connection}
                        header="Player A"
                        player={playerA}
                        setPlayer={handleSelectPlayerA}
                        bottom={false}
                    />
                    <BattleManagerPlayerCard
                        connection={connection}
                        header="Player B"
                        player={playerB}
                        setPlayer={handleSelectPlayerB}
                        bottom={true}
                    />
                </div>
            </div>
        </div>
    );
}