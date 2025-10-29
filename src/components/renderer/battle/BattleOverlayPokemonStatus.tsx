import "./style.css";

import React from "react";
import { getPokemonIconPath } from "@/src/lib/asset-utils";

interface TeamSlotPokemonIconProps {
  pokemon?: string;
  active?: boolean;
  fainted?: boolean;
}

export const BattleOverlayPokemonStatus = ({ 
    pokemon = "pikachu",
    active = false,
    fainted = false,
}: TeamSlotPokemonIconProps) => {
  const pokemonIcon = React.useMemo(
    () => getPokemonIconPath(pokemon),
    [pokemon],
  );

  return (
    <image
        className={`battleOverlayPokemonIcon${fainted !== undefined && fainted ? "Fainted" : ""}`}
        x="0"
        y="0"
        width="64px"
        height="64px"
        href={active ? pokemonIcon : "assets/Pokeballs/pokeballB.png"}
    />
  );
};