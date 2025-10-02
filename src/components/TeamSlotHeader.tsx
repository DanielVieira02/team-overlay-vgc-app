import "./TeamSlot.css";
import { Pokemon } from "koffing"

interface TeamSlotHeader {
    pokemon: Pokemon,
}

export const TeamSlotHeader = ({
    pokemon
}: TeamSlotHeader) => {
    return (
        <g>
            <path 
                d="M 34 121 L 121 31 C 125 27 127 27 132 27 H 963 C 979 27 979 40 973 47 L 889 133 C 883 138 880 138 872 138 C 595.6667 138 319.3333 138 43 138 C 30 138 28 128 34 121 Z" 
                className="teamSlotHeader"
            />
            <text x="115" y="100" className="textPokemonName">
                {pokemon.name}
            </text>
        </g>
    )
}