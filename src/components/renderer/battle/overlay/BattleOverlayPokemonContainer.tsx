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
    "M-92 0V-431Q-93-459-65-433L-16-386Q-12-382-12-375V0Z" :
    "M92 0V431Q93 459 65 433L16 386Q12 382 12 375V0Z";
    const slotsTransform = bottom ? 
    "translate(-85, -340)" :
    "translate(20, 20)";
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