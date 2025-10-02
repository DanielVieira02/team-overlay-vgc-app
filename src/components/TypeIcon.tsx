
interface TypeIconProps {
    type: string,
    position: {x: number, y: number},
    className?: string
}

export const TypeIcon = ({
    type,
    position,
    className,
}: TypeIconProps) => {
    const typeHref = `/assets/TypeIcons/${type.toLowerCase()}.svg`;
    
    return (
        <image
            x={position.x}
            y={position.y}
            href={typeHref}
            className={className ?? "typeIcon"}
        />
    )
}