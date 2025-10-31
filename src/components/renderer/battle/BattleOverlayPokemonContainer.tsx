import { OBSConnection } from "@/src/lib/obs-connection";
import { BattleOverlayPokemonStatus } from "./BattleOverlayPokemonStatus";
import "./style.css";
import { useOBSState } from "@/src/hooks/use-obs-state";
import { useEffect, useState } from "react";
import { PokemonSlot } from "@/src/lib/types";
import { BattleOverlayPokemonStatusList } from "./BattleOverlayPokemonStatusList";
import { useOBSBattleData } from "@/src/hooks/use-obs-battle-data";

interface BattleOverlayPokemonContainerProps {
    connection: OBSConnection | null,
    bottom?: boolean,
    score?: number,
}

export const BattleOverlayPokemonContainer = ({
    connection,
    bottom = false,
    score = 0,
}: BattleOverlayPokemonContainerProps) => {
    const {
        battleStateData,
        battleStateLoading,
    } = useOBSBattleData(connection, bottom);

    if (battleStateLoading) {
        return(<></>);
    }

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

    let initialPokemonData = battleStateData ? 
        battleStateData.map((p) => {
            return {
                species: p.pokemon,
                active: true,
                item: p.item,
                fainted: p.fainted,
            }
        })
    : [];

    while (initialPokemonData.length < 4)
        initialPokemonData.push({
            species: undefined,
            active: false,
            item: undefined,
            fainted: false,
        });

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
                <BattleOverlayPokemonStatusList
                    connection={connection}
                    initialPokemon={initialPokemonData}
                    bottom={bottom}
                />
            </g>
        </g>
    )
}