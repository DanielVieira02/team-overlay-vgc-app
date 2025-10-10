import "./style.css";

import { Pokemon } from "@/src/lib/types";
import React from "react";
import { getPokemonIconPath } from "@/src/lib/asset-utils";

interface TeamSlotPokemonIconProps {
  pokemon: Pokemon;
}

export const TeamSlotPokemonIcon = ({ pokemon }: TeamSlotPokemonIconProps) => {
  const pokemonIcon = React.useMemo(
    () => getPokemonIconPath(pokemon.species),
    [pokemon.species],
  );

  return (
    <image
      width="200px"
      height="200px"
      x="648"
      y="300"
      href={pokemonIcon}
      className="pokemonIcon"
    />
  );
};
