import "./style.css";

interface BattleOverlayPlayerInfoProps {
    name?: string,
    country?: string | undefined,
    bottom?: boolean,
}

export const BattleOverlayPlayerInfo = ({
    name = "no_player_defined",
    country,
    bottom
}: BattleOverlayPlayerInfoProps) => {
    const path = bottom ?
        "M -92 0 L 772 -0 Q 789 -6 853 -30 Q 862 -53 853 -53 L -92 -53 Z" :
        "M 92 -0 L -772 0 Q -789 6 -853 30 Q -862 53 -853 53 L 92 53 Z";
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
        <g>
            <path
                className="battleOverlayContainer"
                d={path}
            />
            <text 
                className={`battleOverlayPlayerName${bottom ? "Bottom" : "Top"}`}
                x={nameCoords.x}
                y={nameCoords.y}
            >
                {name}
            </text>
            (country &&
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
            )
        </g>
    )
}