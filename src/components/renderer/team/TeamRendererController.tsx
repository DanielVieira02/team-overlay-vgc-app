import { TeamRenderer } from "./TeamRenderer";
import { useEffect, useState } from "react";
import { OBSConnection } from "@/src/lib/obs-connection";
import { useOBSState } from "@/src/hooks/use-obs-state";

interface OBSSourceControllerProps {
  connection: OBSConnection | null;
  pokepaste: string | undefined;
}

export function TeamRendererController({ connection, pokepaste }: OBSSourceControllerProps) {    
  const {
    addEventListener,
    removeEventListener,
  } = useOBSState(connection);

  const [ showTeam, setShowTeam ] = useState<boolean>(false);

  const handleCustomEvent = (eventData: any) => {
    const eventName = eventData.eventName;

    switch(eventName) {
        case "ShowPokemonTeam":
            setShowTeam(true);
            break;
        case "HidePokemonTeam":
            setShowTeam(false);
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
    <div className={`transition-all duration-1000 ${showTeam ? "opacity-100" : "opacity-0"}`}>
        <TeamRenderer pokepasteUrl={`https://pokepast.es/${pokepaste}`} />
    </div>
  );
}
