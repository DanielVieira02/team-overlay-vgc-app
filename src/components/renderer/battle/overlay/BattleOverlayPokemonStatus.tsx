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
    <g>
        <image
          className={`battleOverlayPokemonIcon 
            ${active !== undefined && active ? "hidePokeball" : ""}
          `}
          x="0"
          y="0"
          href={"assets/Pokeballs/pokeballB.png"}
      />
      {active && <image
          className={`battleOverlayPokemonIcon 
            ${active !== undefined && active ? "active" : ""}
            ${fainted !== undefined && fainted ? "fainted" : ""}
          `}
          x="0"
          y="0"
          href={pokemonIcon}
      />}
      {item && active &&
      (
      <image 
        className={`battleItemIcon 
          ${active !== undefined && active ? "active" : ""}
        `}
        x="40"
        y="48"
        href={itemIcon} 
      />
      )}
    </g>
  );
};