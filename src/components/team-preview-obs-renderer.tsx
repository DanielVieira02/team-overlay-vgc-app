import { useParams } from "react-router";
import { useOBSConnection } from "../hooks/use-obs-connection";
import { TeamRendererController } from "./renderer/team/TeamRendererController";
import { useEffect } from "react";

export function TeamPreviewOBSRenderer() {
  const { connection, isConnected, connect, disconnect } = useOBSConnection();
  const { pokepaste } = useParams();

  useEffect(() => {
    if(!isConnected)
      connect("ws://localhost:4455", undefined, false);
    return () => {disconnect(false);};
  })

  if(!isConnected) {
    return (
      <>
      </>
    )
  }

  return <TeamRendererController connection={connection} pokepaste={pokepaste} />;
}
