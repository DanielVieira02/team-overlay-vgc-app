import { OBSConnection } from "@/src/lib/obs-connection";
import { PokemonSlot } from "@/src/lib/types";
import { BattleOverlayPokemonStatus } from "./BattleOverlayPokemonStatus";
import { useEffect, useState } from "react";
import { useOBSState } from "@/src/hooks/use-obs-state";

interface BattleOverlayPokemonStatusListProps {
    connection: OBSConnection | null,
    activePokemon: PokemonSlot[],
    setActivePokemon: any,
    bottom?: boolean,
}

export const BattleOverlayPokemonStatusList = ({
    connection,
    activePokemon,
    setActivePokemon,
    bottom = false,
}: BattleOverlayPokemonStatusListProps) => {
    const {
        addEventListener,
        removeEventListener,
    } = useOBSState(connection);

    const [ addedPokemon, setAddedPokemon ] = useState<number>(activePokemon ? activePokemon.filter((p) => p.active).length : 0);

    const handleCustomEvent = (eventData: any) => {            
        const eventName = eventData.eventName;

        switch (eventName) {
            case "BattlePokemonActive":
                const { pokemonSpecies, item, bottom: isBottomPlayer } = eventData;
                if (isBottomPlayer === bottom && addedPokemon < 4) {
                    const auxActivePokemon = activePokemon;
                    auxActivePokemon[addedPokemon] = {
                        species: pokemonSpecies,
                        item,
                        active: true,
                        fainted: false,
                    };
                    setActivePokemon(auxActivePokemon);
                    setAddedPokemon(addedPokemon + 1);
                }
                break;
            case "BattlePokemonFainted":
                const { pokemonIndex, bottom: isBottomPlayerFainted, fainted } = eventData;
                if (isBottomPlayerFainted === bottom) {
                    const auxActivePokemon = activePokemon.map((pokemon, index) => {
                        if (index !== pokemonIndex) {
                            return pokemon;
                        }
                        return {
                            ...pokemon,
                            fainted: fainted,
                        };
                    });
                    setActivePokemon(auxActivePokemon);
                }
                break;
            case "ResetBattle":
                const cleanState = {
                    active: false,
                    species: undefined,
                    item: undefined,
                    fainted: false,
                };
                
                setAddedPokemon(0);
                setActivePokemon([cleanState, cleanState, cleanState, cleanState]);
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

    return (
        <>
            {activePokemon.map((p: PokemonSlot, index: number) => 
                (
                    <g 
                        key={`${p}-${index}`}
                        transform={`translate(0, ${index * 108})`}
                    >
                        <BattleOverlayPokemonStatus
                            pokemon={p.species}
                            item={p.item}
                            active={p.active}
                            fainted={p.fainted}
                        />
                    </g>
                )
            )}
        </>
    )
}