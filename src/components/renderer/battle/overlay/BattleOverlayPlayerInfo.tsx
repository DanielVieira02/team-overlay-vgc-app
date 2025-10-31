import "./style.css";

interface BattleOverlayPlayerInfoProps {
    playerName: string,
    country?: string,
    bottom?: boolean,
}

export const BattleOverlayPlayerInfo = ({
    playerName,
    country,
    bottom = false,
}: BattleOverlayPlayerInfoProps) => {
    const nameCoords = bottom ?
        { x: "12", y: "-12"} :
        { x: "-12", y: "40"};
    const countryBgCoords = bottom ?
        { x: "684", y: "-48"} :
        { x: "-764", y: "6"};
    const countryCoords = bottom ?
        { x: "708", y: "-16"} :
        { x: "-708", y: "40"};
    
    return (
        <>
            <text 
                className={`battleOverlayPlayerName${bottom ? "Bottom" : "Top"}`}
                x={nameCoords.x}
                y={nameCoords.y}
            >
                {playerName}
            </text>
            {country &&
                <>
                    <rect 
                        className="battleOverlayCountryBox"
                        width="72"
                        height="42"
                        x={countryBgCoords.x}
                        y={countryBgCoords.y}
                        rx="10"
                        ry="10"
                        fill="white"
                    />
                    <text 
                        className={`battleOverlayPlayerCountry${bottom ? "Bottom" : "Top"}`}
                        x={countryCoords.x}
                        y={countryCoords.y}
                    >
                        {country}
                    </text>
                </>
            }
        </>
    )
}