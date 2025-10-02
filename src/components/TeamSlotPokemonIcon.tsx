import { Pokemon } from "koffing";

import PokemonTranslator from "../assets/TranslatorPokes.json"
import "./TeamSlot.css";

type PokemonFile = {
    [key: string]: string
}

interface TeamSlotPokemonIconProps {
    pokemon: Pokemon
}

const allData: PokemonFile = PokemonTranslator;

export const TeamSlotPokemonIcon = ({
    pokemon
}: TeamSlotPokemonIconProps) => {

    const imgRef = pokemon.name ? `/assets/PokeIcons/${allData[pokemon.name]}.png` :  "/assets/Pokeballs/pokeballA.png";

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