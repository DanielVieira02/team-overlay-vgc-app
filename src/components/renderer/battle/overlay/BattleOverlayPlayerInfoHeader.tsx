import { useOBSState } from "@/src/hooks/use-obs-state";
import "./style.css";
import { useEffect, useState } from "react";
import { OBSConnection } from "@/src/lib/obs-connection";
import { BattleOverlayPlayerInfo } from "./BattleOverlayPlayerInfo";

interface BattleOverlayPlayerInfoHeaderProps {
    connection: OBSConnection | null,
    bottom?: boolean,
}

export const BattleOverlayPlayerInfoHeader = ({
    connection,
    bottom = false,
}: BattleOverlayPlayerInfoHeaderProps) => {
    const [ playerName, setPlayerName ] = useState<string>("");
    const [ country ] = useState<string>();

    const { addEventListener, removeEventListener, getPersistentData } = useOBSState(connection);

    const handleCustomEvent = async (eventData: any) => {
        const eventName = eventData.eventName;

        switch(eventName) {
            case "SetBattlePlayer":
                const playerName = eventData.player;
                const isBottom = eventData.bottom;

                if (isBottom === bottom) {
                    setPlayerName(playerName);
                }
                
                break;

            default:
                break;
        }
    }

    useEffect(() => {
        addEventListener(connection, "CustomEvent", handleCustomEvent);
        return () => {
            removeEventListener(connection, "CustomEvent", handleCustomEvent);
        };
    });

    useEffect(() => {
        getPersistentData(connection, bottom ? "bottom_player" : "top_player").then((result) => {
            setPlayerName(result ?? "PLAYER");
        });
    }, [connection]);


    const path = bottom ?
        "M-12 0H616Q620-0 624-4L647-28C651-32 650-36 643-36H7Q-12-37-12-59Z" :
        "M12 0H-616Q-620 0-624 4L-647 28C-651 32-650 36-643 36H-7Q12 37 12 59Z";

    const pathClass = `battleOverlayHeader ${bottom ? "bottomHeader" : "topHeader"}`; 
    
    return (
        <g>
            <path
                className={pathClass}
                d={path}
            />
            <BattleOverlayPlayerInfo 
                playerName={playerName}
                country={country}
                bottom={bottom}
            />
        </g>
    )
}