import { usePlayersQuery } from "@/src/hooks/use-players";
import { useState } from "react";
import { Player } from "@/src/lib/types";
import { BattleManagerPlayerCard } from "./BattleManagerPlayerCard";
import { Button } from "../../ui/button";
import { useOBSConnection } from "@/src/hooks/use-obs-connection";
import { BattleManagerController } from "./BattleManagerController";

export const BattleManager = () => {
    const { connection, isConnected } = useOBSConnection();

    if(!isConnected || !connection) {
        return (<></>);
    }

    return (
        <BattleManagerController connection={connection} />
    );
}