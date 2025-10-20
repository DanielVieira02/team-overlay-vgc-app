import { getTypeIconPath } from "@/src/lib/asset-utils";

interface TypeIconProps {
  type: string;
  position: { x: number; y: number };
  className?: string;
  teraType?: boolean;
}

export const TypeIcon = ({
  type,
  position,
  className,
  teraType,
}: TypeIconProps) => {
  const typeHref = getTypeIconPath(type, teraType);

  return (
    <image
      x={position.x}
      y={position.y}
      href={typeHref}
      className={teraType ? "teraTypeIcon" : (className ?? "typeIcon")}
    />
  );
};
