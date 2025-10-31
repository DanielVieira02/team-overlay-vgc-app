import { useOBSState } from "@/src/hooks/use-obs-state";
import { OBSConnection } from "@/src/lib/obs-connection";
import { useEffect, useState } from "react"

interface BattleOverlayPlayerScoreProps {
    connection: OBSConnection | null,
    bottom: boolean,
    initialScore: number,
}

export const BattleOverlayPlayerScore = ({
    connection,
    bottom,
    initialScore,
}: BattleOverlayPlayerScoreProps) => {
    const {
        addEventListener,
        removeEventListener,
    } = useOBSState(connection);    
    const [ score, setScore ] = useState<number>(initialScore);
    const scoreCoords = bottom ?
    {
        x: -48, y: -450,
    } :
    {
        x: 48, y: 490,
    };

    const handleEventListener = (eventData: any) => {
        const { eventName, isBottomPlayer, score} = eventData;

        if (eventName === "UpdateScore" && isBottomPlayer === bottom) {
            setScore(score);
        }
        if (eventName === "ResetBattle") {
            setScore(0);
        }
    }

    useEffect(() => {
        addEventListener(connection, "CustomEvent", handleEventListener);
        return () => {
            removeEventListener(connection, "CustomEvent", handleEventListener);
        };
    })

    return (
        <text 
            x={scoreCoords.x}
            y={scoreCoords.y}
            className="scoreText"
        >
            {score}
        </text>
    )
}