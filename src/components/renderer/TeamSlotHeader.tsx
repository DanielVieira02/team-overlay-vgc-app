import "./style.css";

import { Pokemon } from "koffing"
import { TypeIcon } from "./TypeIcon";
import * as pokedex from "../../lib/pokedex";

interface TeamSlotHeader {
    pokemon: Pokemon,
}

export const TeamSlotHeader = ({
    pokemon
}: TeamSlotHeader) => {

    const TYPE_ICONS_X_POSITION = 784;
    const TYPE_ICONS_Y_POSITION = 44;
    
    const TERA_LINE_X_POSITION = 786;
    const TERA_LINE_Y_POSITION = 36;
    const TERA_LINE_SIZE = 92;
    
    const types = pokedex.getPokemonTypes(pokemon.name);

    const pokemonName = pokedex.formatPokemonNameTitle(pokemon.name);

    console.log(types);

    return (
        <g>
            <path 
                d="M 34 121 L 121 31 C 125 27 127 27 132 27 H 963 C 979 27 979 40 973 47 L 889 133 C 883 138 880 138 872 138 C 595.6667 138 319.3333 138 43 138 C 30 138 28 128 34 121 Z" 
                className="teamSlotHeader"
            />
            <text x="125" y="100" className="textPokemonName">
                {pokemonName}
            </text>
            {types?.map((type: string, slotId: number) => (
                <TypeIcon 
                    position={{x: TYPE_ICONS_X_POSITION - ((slotId + 1) * 92), y: TYPE_ICONS_Y_POSITION}}
                    type={type}
                />
            ))}
            <line 
                x1={TERA_LINE_X_POSITION}
                y1={TERA_LINE_Y_POSITION}
                x2={TERA_LINE_X_POSITION}
                y2={TERA_LINE_Y_POSITION + TERA_LINE_SIZE}
                className="teraTab"
            />
            <TypeIcon 
                position={{x: TYPE_ICONS_X_POSITION, y: TYPE_ICONS_Y_POSITION - 24}}
                type={pokemon.teraType ?? ""}
                teraType={true}
            />
        </g>
    )
}