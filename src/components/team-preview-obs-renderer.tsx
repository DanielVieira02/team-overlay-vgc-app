import { useParams } from "react-router";
import { TeamRenderer } from "./renderer/TeamRenderer";

export function TeamPreviewOBSRenderer() {
  const { pokepaste } = useParams();
  return <TeamRenderer pokepasteUrl={`https://pokepast.es/${pokepaste}`} />;
}
