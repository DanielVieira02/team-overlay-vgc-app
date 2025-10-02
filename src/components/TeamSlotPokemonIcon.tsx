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

    const pokemonName = pokemon.name;
    console.log(allData);

    return (
        <image 
            width="200px"
            height="200px"
            x="648"
            y="356"
            href={pokemonName ? `../assets/PokeIcons/${allData[pokemonName]}.png}` : "../assets/PokeIcons/038_001.png"}
            className="pokemonIcon"
        />
    )
}