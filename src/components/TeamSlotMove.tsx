import "./TeamSlot.css";

interface TeamSlotMoveProps {
    move: string,
    slotId: number,
}

export const TeamSlotMove = ({
    move,
    slotId
}: TeamSlotMoveProps) => {
    return (
        <g transform={`translate(0, ${slotId * 78})`}>
            <path 
                d={`M 84 241 H 578 V 313 H 84`}
                className="teamSlotMove"
            />
            <text
                x="154"
                y="291"
                className="textPokemonMove"
            >
                {move}
            </text>
        </g>
        
    )
}