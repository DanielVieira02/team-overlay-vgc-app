import { OBSConnection } from "@/src/lib/obs-connection"
import { useEffect, useState } from "react"
import { Button } from "../../../ui/button";
import { Minus, Plus } from "lucide-react";
import { useOBSState } from "@/src/hooks/use-obs-state";

interface BattleManagerPlayerScoreProps {
    connection: OBSConnection | null,
    initialScore?: number,
    bottom?: boolean,
}

export const BattleManagerPlayerScore = ({
    connection,
    initialScore = 0,
    bottom = false,
}: BattleManagerPlayerScoreProps) => {
    const {
        addEventListener,
        removeEventListener,
    } = useOBSState(connection);
    const {
        setPersistentData,
        broadcastCustomEvent,
    } = useOBSState(connection);
    const [score, setScore] = useState<number>(initialScore);

    const handleCustomEvent = (eventData: any) => {
        const eventName = eventData.eventName;

        switch (eventName) {
            case "ResetBattle":
                setScore(0);
                updateScore(0);
            default:
                break;
        }
    }

    useEffect(() => {
        addEventListener(connection, "CustomEvent", handleCustomEvent);
        return () => {
            removeEventListener(connection, "CustomEvent", handleCustomEvent);
        };
    })

    const updateScore = (newScore: number) => {
        const slotName = bottom ? "bottom_score" : "top_score";

        setPersistentData(connection, slotName, newScore);
        broadcastCustomEvent({
            eventData: {
                eventName: "UpdateScore",
                score: newScore,
                isBottomPlayer: bottom,
            }
        });
    }

    const addScore = () => {
        setScore(score + 1);
        updateScore(score + 1);
    }

    const subtractScore = () => {
        if (score == 0)
            return;

        setScore(score - 1);
        updateScore(score - 1);
    }

    return (
        <div className="space-x-2">
            <Button
                variant="ghost"
                size="sm"
                onClick={subtractScore}
            >
                <Minus />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                disabled={true}
            >
                {score}
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={addScore}
            >
                <Plus />
            </Button>
        </div>
    )
}