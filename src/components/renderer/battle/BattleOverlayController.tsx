import { useEffect, useState } from "react";
import { OBSConnection } from "@/src/lib/obs-connection";
import { useOBSState } from "@/src/hooks/use-obs-state";
import { BattleOverlayRenderer } from "./BattleOverlayRenderer";

interface OBSSourceControllerProps {
  connection: OBSConnection | null;
  pokepaste?: string;
}

export function BattleOverlayController({ connection }: OBSSourceControllerProps) {    
  const {
    addEventListener,
    removeEventListener,
    getPersistentData,
  } = useOBSState(connection);
  const [ overlayActive, setOverlayActive ] = useState<boolean>(false);

  const handleCustomEvent = (eventData: any) => {
    const eventName = eventData.eventName;

    switch(eventName) {
      case "UpdateBattleStatus":
        getPersistentData(connection, "show_battle_overlay").then((result) => {
          setOverlayActive(result.show);
        })
        break;
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

  useEffect(() => {
    getPersistentData(connection, "show_battle_overlay").then((result) => {
      setOverlayActive(result.show);
    })
  }, [connection])
  
  return (
    <div className={`transition-all duration-1000 ${overlayActive ? "opacity-100" : "opacity-0"}`}>
        <BattleOverlayRenderer 
          connection={connection}
        />
    </div>
  );
}
