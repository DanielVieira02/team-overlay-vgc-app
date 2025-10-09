import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { SelectList } from "../ui/SelectList"
import OBSWebSocket from "obs-websocket-js";
import { useQuery } from "@tanstack/react-query";
import { GetOBSScenesList } from "../../lib/obsConnection";

interface OBSSceneListProps {
    obsConnection: OBSWebSocket,
    onSelectScene: (scene: string) => void
}

export const OBSSceneList = ({
    obsConnection,
    onSelectScene,
}: OBSSceneListProps) => {
    const { isPending: scenesLoading, error: scenesError, data: scenesList } = useQuery({
        queryKey: ["getOBSScenesList"],
        queryFn: () => GetOBSScenesList(obsConnection),
        enabled: !!obsConnection,
    })

    const handleSelectScene = function (event: any) {
        onSelectScene(event.target.value);
    }

    if(scenesLoading) return "Loading...";

    if(scenesError) return "Error: " + scenesError.message;

    const scenesName = scenesList.map((scene) => scene.sceneName);

    return (
        <div>
            <SelectList 
                values={scenesName}
                multiple={true}
                onChange={handleSelectScene}
            />
        </div>
    )
}