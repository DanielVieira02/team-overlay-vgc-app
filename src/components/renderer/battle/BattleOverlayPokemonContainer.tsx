import { OBSConnection } from "@/src/lib/obs-connection";
import { BattleOverlayPokemonStatus } from "./BattleOverlayPokemonStatus";
import "./style.css";
import { useOBSState } from "@/src/hooks/use-obs-state";
import { useEffect, useState } from "react";

interface BattleOverlayPokemonContainerProps {
    connection: OBSConnection | null,
    bottom?: boolean,
    score?: number,
}

interface PokemonSlot {
    species: string | undefined,
    item: string | undefined,
    active: boolean,
    fainted?: boolean,
}

const initialActivePokemon = [
    {
        species: undefined,
        item: undefined,
        active: false,
        fainted: false,
    },
    {
        species: undefined,
        item: undefined,
        active: false,
        fainted: false,
    },
    {
        species: undefined,
        item: undefined,
        active: false,
        fainted: false,
    },
    {
        species: undefined,
        item: undefined,
        active: false,
        fainted: false,
    },
];

export const BattleOverlayPokemonContainer = ({
    connection,
    bottom = false,
    score = 0,
}: BattleOverlayPokemonContainerProps) => {
    const [ addedPokemon, setAddedPokemon ] = useState<number>(0);
    const [ activePokemon, setActivePokemon ] = useState<PokemonSlot[]>(initialActivePokemon);

    const {
        addEventListener,
        removeEventListener,
    } = useOBSState(connection);

    const handleCustomEvent = (eventData: any) => {
        const eventName = eventData.eventName;
    
        switch(eventName) {
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
                        if(index !== pokemonIndex) {
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
                setActivePokemon(initialActivePokemon.map((p) => p));
                setAddedPokemon(0);
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
    "translate(-91, -428)" :
    "translate(3,4)";
    const scoreCoords = bottom ?
    {
        x: -48, y: -450,
    } :
    {
        x: 48, y: 490,
    };

    return (
        <g>
            <path
                className="battleOverlayContainer"
                d={path}
            />
            <text 
                x={scoreCoords.x}
                y={scoreCoords.y}
                className="scoreText"
            >
                {score}
            </text>
            <g
                transform={slotsTransform}
            >
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
            </g>
        </g>
    )
}