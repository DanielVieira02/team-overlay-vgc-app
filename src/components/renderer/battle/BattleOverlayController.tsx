import { useEffect, useState } from "react";
import { OBSConnection } from "@/src/lib/obs-connection";
import { useOBSState } from "@/src/hooks/use-obs-state";
import { BattleOverlay } from "./BattleOverlay";

interface OBSSourceControllerProps {
  connection: OBSConnection | null;
  pokepaste: string | undefined;
}

export function BattleOverlayController({ connection }: OBSSourceControllerProps) {    
  const {
    addEventListener,
    removeEventListener,
  } = useOBSState(connection);

  const handleCustomEvent = (eventData: any) => {
    const eventName = eventData.eventName;

    switch(eventName) {
        default:
            break;
    }
  }

  useEffect(() => {
    addEventListener(connection, "CustomEvent", handleCustomEvent);
    return () => {
        removeEventListener(connection, "CustomEvent", handleCustomEvent);
    };
  })
  
  return (
    <div>
        <BattleOverlay />
    </div>
  );
}
