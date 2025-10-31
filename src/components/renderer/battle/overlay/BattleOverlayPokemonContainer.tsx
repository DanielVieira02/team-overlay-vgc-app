import { OBSConnection } from "@/src/lib/obs-connection";
import "./style.css";
import { BattleOverlayPokemonStatusList } from "./BattleOverlayPokemonStatusList";
import { useOBSBattleData } from "@/src/hooks/use-obs-battle-data";
import { BattleOverlayPlayerScore } from "./BattleOverlayPlayerScore";

interface BattleOverlayPokemonContainerProps {
    connection: OBSConnection | null,
    bottom?: boolean,
}

export const BattleOverlayPokemonContainer = ({
    connection,
    bottom = false,
}: BattleOverlayPokemonContainerProps) => {
    const {
        battleStateData,
        battleStateLoading,
        battleStateError,
    } = useOBSBattleData(connection, bottom);

    if (battleStateLoading) {
        return(<></>);
    }

    if (battleStateError) {
        console.log(battleStateError.message);
        return (<></>)
    }

    const path = bottom ?
    "M -94 0 H 0 V -480 q -0 -4 -4 -10 c -16.6667 -16.6667 -33.3333 -33.3333 -50 -50 H -72 q -22 0 -22 22 V -490 Z" :
    "M 94 -0 H 0 V 480 q 0 4 4 10 c 16.6667 16.6667 33.3333 33.3333 50 50 H 72 q 22 -0 22 -22 V 490 Z";
    const slotsTransform = bottom ? 
    "translate(-91, -428)" :
    "translate(3,4)";

    let initialPokemonData = (battleStateData && battleStateData.pokemon) ?
        battleStateData.pokemon.map((p) => {
            return {
                species: p.pokemon,
                active: true,
                item: p.item,
                fainted: p.fainted,
            }
        })
    : [];

    while (initialPokemonData.length < 4) {
        initialPokemonData.push({
            species: undefined,
            active: false,
            item: undefined,
            fainted: false,
        });
    }


    return (
        <g>
            <path
                className="battleOverlayContainer"
                d={path}
            />
            <BattleOverlayPlayerScore
                connection={connection}
                bottom={bottom}
                initialScore={battleStateData?.score ?? 0}
            />
            <g
                transform={slotsTransform}
            >
                <BattleOverlayPokemonStatusList
                    connection={connection}
                    initialPokemon={initialPokemonData}
                    bottom={bottom}
                />
            </g>
        </g>
    )
}