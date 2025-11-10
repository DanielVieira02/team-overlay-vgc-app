import { getMoveType } from "../../../lib/pokedex";
import { TypeIcon } from "./TypeIcon";

import "./style.css";

interface TeamSlotMoveProps {
  move: string;
  slotId: number;
}

export const TeamSlotMove = ({ move, slotId }: TeamSlotMoveProps) => {
  const moveType = getMoveType(move);

  return (
    <g transform={`translate(0, ${slotId * 78})`}>
      <path d={`M 84 241 H 578 V 313 H 84`} className="teamSlotMove" />
      <TypeIcon
        position={{ x: 100, y: 249 }}
        type={moveType}
        className="moveTypeIcon"
      />
      <text x="176" y="291" className="textPokemonMove">
        {move}
      </text>
    </g>
  );
};
