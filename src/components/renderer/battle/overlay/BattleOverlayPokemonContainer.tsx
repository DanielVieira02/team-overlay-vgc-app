import { OBSConnection } from "@/src/lib/obs-connection";
import "./style.css";
import { BattleOverlayPokemonStatusList } from "./BattleOverlayPokemonStatusList";
import { useOBSBattleData } from "@/src/hooks/use-obs-battle-data";
import { BattleOverlayPlayerScore } from "./BattleOverlayPlayerScore";
import { PokemonSlot } from "@/src/lib/types";
import { useEffect, useState } from "react";
import { useOBSState } from "@/src/hooks/use-obs-state";

interface BattleOverlayPokemonContainerProps {
    connection: OBSConnection | null,
    bottom?: boolean,
}

export const BattleOverlayPokemonContainer = ({
    connection,
    bottom = false,
}: BattleOverlayPokemonContainerProps) => {
    const {
        getPersistentData,
    } = useOBSState(connection);
    
    const [initialPokemonData, setInitialPokemonData] = useState<PokemonSlot[]>([]);
    const [score, setScore] = useState<number>(0);
    
    useEffect(() => {
        getPersistentData(connection, bottom ? "bottom_pokemon" : "top_pokemon").then((result) => {
            const pokemonSlots = result ? result.map((p: PokemonSlot) => {
                return {
                    species: p.species,
                    active: true,
                    item: p.item,
                    fainted: p.fainted,
                }
            }) : [];

            while (pokemonSlots.length < 4) {
                pokemonSlots.push({
                    species: undefined,
                    active: false,
                    item: undefined,
                    fainted: false,
                });
            }

            setInitialPokemonData(pokemonSlots);
        });
        getPersistentData(connection, bottom ? "bottom_score" : "top_score").then((result) =>
            setScore(result)
        );
    }, [connection])

    const path = bottom ?
    "M -94 0 H 0 V -480 q -0 -4 -4 -10 c -16.6667 -16.6667 -33.3333 -33.3333 -50 -50 H -72 q -22 0 -22 22 V -490 Z" :
    "M 94 -0 H 0 V 480 q 0 4 4 10 c 16.6667 16.6667 33.3333 33.3333 50 50 H 72 q 22 -0 22 -22 V 490 Z";
    const slotsTransform = bottom ? 
    "translate(-91, -428)" :
    "translate(3,4)";
    const groupClass = `battleOverlayContainerParent ${bottom ? "bottomContainer" : "topContainer"}`; 

    return (
        <g className={groupClass}>
            <path
                className="battleOverlayContainer"
                d={path}
            />
            <BattleOverlayPlayerScore
                connection={connection}
                bottom={bottom}
                initialScore={score ?? 0}
            />
            <g
                transform={slotsTransform}
            >
                <BattleOverlayPokemonStatusList
                    connection={connection}
                    activePokemon={initialPokemonData}
                    setActivePokemon={setInitialPokemonData}
                    bottom={bottom}
                />
            </g>
        </g>
    )
}