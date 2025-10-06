import { CreateOBSConnection, GetOBSWebsourcesList } from "../../lib/obsConnection"
import { useQuery } from "@tanstack/react-query";
import { OBSSceneList } from "./OBSSceneList";
import { OBSSourcesList } from "./OBSSourcesList";
import { OBSWebsourcePokepasteController } from "./OBSWebsourcePokepasteController";
import OBSWebSocket from "obs-websocket-js";
import { useState } from "react";

export const OBSConnectionController = () => {
    const [ selectedSource, setSelectedSource ] = useState<string>();

    const { data: obsConnection } = useQuery({
        queryKey: ["createOBSConnection"],
        queryFn: CreateOBSConnection,
    })

    function useOBSSourceList(selectedScene: string, obsConnection?: OBSWebSocket) {
        const { data } = useQuery({
            queryKey: ['OBS_source_list', selectedScene],
            queryFn: () => {
                if (!obsConnection) {
                    return [];
                }
                return GetOBSWebsourcesList(obsConnection, selectedScene)
            },
        })

        return data;
    }

    const { data: sourcesList, refetch: getWebsources } = useQuery({
        queryKey: ["getOBSWebsourcesList"],
        queryFn: () => obsConnection && selectedScene ? GetOBSWebsourcesList(obsConnection, selectedScene) : [],
        enabled: false,
    })

    let selectedScene = "";

    const handleSelectedScene = function(newSelectedScene: string) {
        selectedScene = newSelectedScene;
        getWebsources();
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
                    {!!sourcesList && sourcesList.length > 0
                    ?
                    <OBSSourcesList
                        onSelectSource={handleSelectedSource}
                        sources={sourcesList}
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
                "Sem conexão"
            }
        </div>
    )
}