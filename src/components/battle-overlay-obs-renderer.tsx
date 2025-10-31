import { useOBSConnection } from "../hooks/use-obs-connection";
import { useEffect } from "react";
import { BattleOverlayController } from "./renderer/battle/BattleOverlayController";

export function BattleOverlayOBSRenderer() {
  const { connection, isConnected, connect, disconnect, isConnecting } = useOBSConnection();

  useEffect(() => {
    if(!isConnected)
      connect("ws://localhost:4455", undefined, false);
    return () => {disconnect(false);};
  }, [connection])

  if(!isConnected || isConnecting) {
    return (
      <>
      </>
    )
  }

  return <BattleOverlayController connection={connection} />;
}
