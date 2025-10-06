import PokemonTranslator from "../assets/TranslatorPokes.json"

import pokedex from "../pokedex.json";
import moves from "../moves.json";

function formatPokemonName(pokemonName) {
    if(!pokemonName) {
        return "";
    }

    let result = pokemonName.replace(/ /g,'').replace(/-/g, "").toLowerCase();

    if(result.indexOf("tatsugiri") !== -1) {
        return "tatsugiri";
    }

    return result;
}

function formatMoveName(moveName) {
    if(!moveName) {
        return "";
    }

    let result = moveName.replace(/-/g,'');
    result = result.replace(/ /g,'');
    result = result.toLowerCase();
    return result;
}

export function getPokemonTypes(pokemonName) {
    if(!pokemonName) {
        return [];
    }

    const pokemonNameFormatted = formatPokemonName(pokemonName);
    const pokemon = pokedex[pokemonNameFormatted];
    return pokemon ? pokemon.types : [];
}

export function getMoveType(moveName) {
    if(!moveName) {
        return "";
    }

    const moveNameFormatted = formatMoveName(moveName);
    const move = moves[moveNameFormatted];
    return move ? move.type : "";
}

export function formatPokemonNameTitle(pokemonName) {
    if(!pokemonName) {
        return "";
    }

    let result = pokemonName.replace(/-/g,' ');

    switch(result) {
        case "Indeedee":
            return "Indeedee Male";
        case "Maushold Four":
            return "Maushold of Four";
        case "Maushold Three":
            return "Maushold Family of Three";
    }

    return result;
}

export function getPokemonIcon(pokemonName) {
    return PokemonTranslator[pokemonName];
}