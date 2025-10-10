import { TeamSlotBody } from "./TeamSlotBody"
import { TeamSlotHeader } from "./TeamSlotHeader"
import { TeamSlotPokemonInfo } from "./TeamSlotPokemonInfo"
import { TeamSlotPokemonIcon } from "./TeamSlotPokemonIcon"
import { TeamSlotMove } from "./TeamSlotMove"
import { Pokemon } from "@/src/lib/types"

interface TeamSlotProps {
    pokemon: Pokemon,
    slotId: number,
}

export const TeamSlot = ({ 
    pokemon,
    slotId,
}: TeamSlotProps) => {
    return (
        <g transform={`translate(${330 * (slotId % 2)}, ${200 * Math.floor(slotId / 2)}) scale(0.33, 0.33)`}>
            <TeamSlotBody />
            <TeamSlotHeader pokemon={pokemon}/>
            <TeamSlotPokemonInfo pokemon={pokemon}/>
            <TeamSlotPokemonIcon pokemon={pokemon}/>
            {pokemon.moves && 
            (pokemon.moves.map((move, moveSlotId) => (
                <TeamSlotMove move={move} slotId={moveSlotId} key={`${pokemon.name}-${move}`}/>
            )))}
        </g>
    )
}