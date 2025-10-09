import { OBSSceneList } from "./OBSSceneList";
import { OBSWebsourcesList } from "./OBSSourcesList";
import { OBSWebsourcePokepasteController } from "./OBSWebsourcePokepasteController";
import OBSWebSocket from "obs-websocket-js";
import { useState } from "react";
import { OBSAuthentication } from "./OBSAuthentication";

export const OBSConnectionController = () => {
    const [ selectedScene, setSelectedScene ] = useState<string>();
    const [ selectedSource, setSelectedSource ] = useState<string>();

    const [ obsConnection, setObsConnection ] = useState<OBSWebSocket>();

    const handleSelectedScene = function(newSelectedScene: string) {
        setSelectedScene(newSelectedScene);
    }

    const handleSelectedSource = function(newSelectedSource: string) {
        setSelectedSource(newSelectedSource)
    }

    return (
        <div>
            {
                obsConnection
                ?
                <div>
                    <OBSSceneList 
                        onSelectScene={handleSelectedScene}
                        obsConnection={obsConnection}
                    />
                    {selectedScene
                    ?
                    <OBSWebsourcesList
                        onSelectSource={handleSelectedSource}
                        scene={selectedScene}
                        obsConnection={obsConnection}
                    />
                    :
                    "Selecione uma cena"}
                    {selectedSource &&
                    <OBSWebsourcePokepasteController 
                        inputName={selectedSource}
                        obsConnection={obsConnection}
                    />
                    }
                </div>
                :
                <OBSAuthentication 
                    onConnect={setObsConnection}
                />
            }
        </div>
    )
}