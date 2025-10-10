import pokedex from '../pokedex.json';
import moves from '../moves.json';

export function getPokemonTypes(pokemonName) {
  const clearName = pokemonName.toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-zA-Z0-9]/g, '');
  return pokedex[clearName].types;
}

export function getMoveType(move) {
  const clearName = move.toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-zA-Z0-9]/g, '');
  return moves[clearName].type;
}