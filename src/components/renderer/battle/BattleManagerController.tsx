import { OBSConnection } from "@/src/lib/obs-connection"
import { usePlayersQuery } from "@/src/hooks/use-players";
import { useState } from "react";
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
    const { setPersistentData } = useOBSState(connection);

    const [ playerA, setPlayerA ] = useState<Player>();
    const [ playerB, setPlayerB ] = useState<Player>();
    const [ showBattleOverlay, setShowBattleOverlay ] = useState<boolean>(false);
    const { data: players = [] } = usePlayersQuery();

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
        setPersistentData(connection, "BattleOverlay", { show: state });
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
                        header="Player A"
                        player={playerA}
                        setPlayer={handleSelectPlayerA}
                    />
                    <BattleManagerPlayerCard
                        header="Player B"
                        player={playerB}
                        setPlayer={handleSelectPlayerB}
                    />
                </div>
            </div>
        </div>
    );
}