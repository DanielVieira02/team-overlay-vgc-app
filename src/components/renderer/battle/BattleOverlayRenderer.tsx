import { BattleOverlayPlayerInfo } from "./BattleOverlayPlayerInfo"
import { BattleOverlayPokemonContainer } from "./BattleOverlayPokemonContainer"

export const BattleOverlayRenderer = () => {
    return (
        <div>
            <svg width="1920px" height="1080px">
                <g 
                    transform={`translate(${1920 - 92}, 0)`}
                >
                    <BattleOverlayPokemonContainer />
                    <BattleOverlayPlayerInfo />
                </g>
                <g 
                    transform={`translate(92, 1080) rotate(180, 0, 0)`}
                >
                    <BattleOverlayPokemonContainer />
                    <BattleOverlayPlayerInfo />
                </g>
            </svg>
        </div>
    )
}