import { OBSConnection } from "@/src/lib/obs-connection"
import { BattleOverlayPlayerInfo } from "./BattleOverlayPlayerInfo"
import { BattleOverlayPokemonContainer } from "./BattleOverlayPokemonContainer"
import { useOBSState } from "@/src/hooks/use-obs-state"
import { useEffect, useState } from "react"

interface BattleOverlayRendererProps {
    connection: OBSConnection | null,
}

export const BattleOverlayRenderer = ({
    connection
}: BattleOverlayRendererProps) => {
    const [ topPlayer, setTopPlayer ] = useState<string>("");
    const [ bottomPlayer, setBottomPlayer ] = useState<string>("");

    const { addEventListener, removeEventListener, getPersistentData } = useOBSState(connection);


    useEffect(() => {
        addEventListener(connection, "CustomEvent", handleCustomEvent);
        return () => {
            removeEventListener(connection, "CustomEvent", handleCustomEvent);
        };
    });

    useEffect(() => {
        getPersistentData(connection, "top_player").then((result) => {
            setTopPlayer(result);
        });
        getPersistentData(connection, "bottom_player").then((result) => {
            setBottomPlayer(result);
        });
    }, [connection]);

    const handleCustomEvent = async (eventData: any) => {
        const eventName = eventData.eventName;

        switch(eventName) {
            case "SetBattlePlayer":
                const playerName = eventData.player;
                const isBottom = eventData.bottom;

                if (isBottom) {
                    setBottomPlayer(playerName);
                    break;
                }
                
                setTopPlayer(playerName);
                break;
            default:
                break;
        }
    }

    return (
        <div>
            <svg width="1920px" height="1080px">
                <g 
                    transform={`translate(${1920 - 92}, 0)`}
                >
                    <BattleOverlayPlayerInfo 
                        name={topPlayer}
                    />
                    <BattleOverlayPokemonContainer 
                        connection={connection}
                        score={1}
                    />
                </g>
                <g 
                    transform={`translate(92, 1080)`}
                >
                    <BattleOverlayPlayerInfo 
                        name={bottomPlayer}
                        bottom={true}
                    />
                    <BattleOverlayPokemonContainer 
                        connection={connection}
                        bottom={true}
                    />
                </g>
            </svg>
        </div>
    )
}