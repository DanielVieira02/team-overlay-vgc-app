import { OBSConnection } from "@/src/lib/obs-connection"
import { BattleOverlayPlayerInfoHeader } from "./BattleOverlayPlayerInfoHeader"
import { BattleOverlayPokemonContainer } from "./BattleOverlayPokemonContainer"

interface BattleOverlayRendererProps {
    connection: OBSConnection | null,
}

export const BattleOverlayRenderer = ({
    connection
}: BattleOverlayRendererProps) => {
    if(!connection) {
        return (<></>);
    }

    return (
        <div>
            <svg width="1920px" height="1080px">
                <g 
                    transform={`translate(${1920 - 92}, 0)`}
                >
                    <BattleOverlayPlayerInfoHeader 
                        connection={connection} 
                    />
                    <BattleOverlayPokemonContainer 
                        connection={connection}
                    />
                </g>
                <g 
                    transform={`translate(92, 1080)`}
                >
                    <BattleOverlayPlayerInfoHeader 
                        connection={connection}
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