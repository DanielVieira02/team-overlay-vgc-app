import pokedex from "../pokedex.json";

export function getPokemonTypes(pokemonName) {
    if(!pokemonName) {
        return [];
    }

    let pokemonNameFormatted = pokemonName;
    pokemonNameFormatted = pokemonNameFormatted.replace("-", "").toLowerCase();

    const pokemon = pokedex[pokemonNameFormatted];
    return pokemon ? pokemon.types : [];
}

