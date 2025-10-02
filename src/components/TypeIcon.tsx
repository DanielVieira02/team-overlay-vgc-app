
interface TypeIconProps {
    type: string,
    position: {x: number, y: number}
}

export const TypeIcon = ({
    type,
    position
}: TypeIconProps) => {
    const typeHref = `/assets/TypeIcons/${type.toLowerCase()}.svg`;
    
    return (
        <image
            x={position.x}
            y={position.y}
            href={typeHref}
            className="typeIcon"
        />
    )
}