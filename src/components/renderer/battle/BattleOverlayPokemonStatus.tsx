import "./style.css";

import React from "react";
import { getItemIconPath, getPokemonIconPath } from "@/src/lib/asset-utils";

interface TeamSlotPokemonIconProps {
  pokemon?: string;
  item?: string;
  active?: boolean;
  fainted?: boolean;
}

export const BattleOverlayPokemonStatus = ({ 
    pokemon = "pikachu",
    item,
    active = false,
    fainted = false,
}: TeamSlotPokemonIconProps) => {
  const pokemonIcon = React.useMemo(
    () => getPokemonIconPath(pokemon),
    [pokemon],
  );
  const itemIcon = React.useMemo(
    () => getItemIconPath(item),
    [item],
  );

  return (
    <g className={`${fainted !== undefined && fainted ? "opacity-50" : ""}`}>
      <image
          className={`battleOverlayPokemonIcon`}
          x="0"
          y="0"
          href={active ? pokemonIcon : "assets/Pokeballs/pokeballB.png"}
      />
      {item && active &&
      (
      <image 
        className="battleItemIcon"
        x="40"
        y="48"
        href={itemIcon} 
      />
      )}
    </g>
  );
};