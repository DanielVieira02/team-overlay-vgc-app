import { Pokemon } from "koffing";
import { getPokemonIcon } from "../lib/pokedex.js";

import "./style/TeamSlot.css";
interface TeamSlotPokemonIconProps {
    pokemon: Pokemon
}

export const TeamSlotPokemonIcon = ({
    pokemon
}: TeamSlotPokemonIconProps) => {

    const pokemonImg = getPokemonIcon(pokemon.name);
    const imgRef = pokemonImg ? `/assets/PokeIcons/${pokemonImg}.png` :  "/assets/Pokeballs/pokeballA.png";

    return (
        <image 
            width="200px"
            height="200px"
            x="648"
            y="300"
            href={imgRef}
            className="pokemonIcon"
        />
    )
}