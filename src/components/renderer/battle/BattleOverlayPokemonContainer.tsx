import { OBSConnection } from "@/src/lib/obs-connection";
import { BattleOverlayPokemonStatus } from "./BattleOverlayPokemonStatus";
import "./style.css";
import { useOBSState } from "@/src/hooks/use-obs-state";
import { useEffect, useState } from "react";

interface BattleOverlayPokemonContainerProps {
    connection: OBSConnection | null,
    bottom?: boolean,
}

interface PokemonSlot {
    species: string | undefined,
    active: boolean,
    fainted?: boolean,
}

export const BattleOverlayPokemonContainer = ({
    connection,
    bottom = false,
}: BattleOverlayPokemonContainerProps) => {
    const [ addedPokemon, setAddedPokemon ] = useState<number>(0);
    const [ activePokemon, setActivePokemon ] = useState<PokemonSlot[]>([
        {
            species: undefined,
            active: false,
            fainted: false,
        },
        {
            species: undefined,
            active: false,
            fainted: false,
        },
        {
            species: undefined,
            active: false,
            fainted: false,
        },
        {
            species: undefined,
            active: false,
            fainted: false,
        },
    ]);

    const {
        addEventListener,
        removeEventListener,
    } = useOBSState(connection);

    const handleCustomEvent = (eventData: any) => {
        const eventName = eventData.eventName;
    
        switch(eventName) {
            case "BattlePokemonActive":
                const { pokemonSpecies, bottom: isBottomPlayer } = eventData;

                if (isBottomPlayer === bottom && addedPokemon < 4) {
                    const auxActivePokemon = activePokemon;
                    auxActivePokemon[addedPokemon] = {
                        species: pokemonSpecies,
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
                    const auxActivePokemon = activePokemon;
                    const auxPokemon = activePokemon[pokemonIndex];
                    auxActivePokemon[pokemonIndex] = {
                        species: auxPokemon.species,
                        active: auxPokemon.active,
                        fainted,
                    };
                    setActivePokemon(auxActivePokemon);
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

    const path = bottom ?
    "M -94 0 H 0 V -480 q -0 -4 -4 -10 c -16.6667 -16.6667 -33.3333 -33.3333 -50 -50 H -72 q -22 0 -22 22 V -490 Z" :
    "M 94 -0 H 0 V 480 q 0 4 4 10 c 16.6667 16.6667 33.3333 33.3333 50 50 H 72 q 22 -0 22 -22 V 490 Z";
    const slotsTransform = bottom ? 
    "translate(-91, -480)" :
    "translate(3,24)";

    return (
        <g>
            <path
                className="battleOverlayContainer"
                d={path}
            />
            <g
                transform={slotsTransform}
            >
                {activePokemon.map((p: PokemonSlot, index: number) => 
                    (
                        <g 
                            key={`${p}-${index}`}
                            transform={`translate(0, ${index * 116})`}
                        >
                            <BattleOverlayPokemonStatus
                                pokemon={p.species}
                                active={p.active}
                                fainted={p.fainted}
                            />
                        </g>
                    )
                )}
            </g>
        </g>
    )
}