
interface TypeIconProps {
    type: string,
    position: {x: number, y: number},
    className?: string,
    teraType?: boolean
}

export const TypeIcon = ({
    type,
    position,
    className,
    teraType,
}: TypeIconProps) => {
    const typeHref = teraType ? `/assets/TypeIcons/TeraType/${type.toLowerCase()}.png` : `/assets/TypeIcons/${type.toLowerCase()}.png`;

    return (
        <image
            x={position.x}
            y={position.y}
            href={typeHref}
            className={teraType ? "teraTypeIcon" : className ?? "typeIcon"}
        />
    )
}