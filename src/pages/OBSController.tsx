import { useEffect, useState } from "react";
import { createOBSConnection, GetInputSettings, getScenesItemList, SetWebsourceUrl } from "../lib/obsConnection"
import OBSWebSocket from "obs-websocket-js";
import { Button } from "../components/ui/Button";
import { InputField } from "../components/ui/InputField";

export const OBSController = () => {
    const pokepastePrefix = "https://pokepast.es/";
    const urlPrefix = "http://localhost:3000/teamlist/";
    
    const [ pokepaste, setPokepaste ] = useState<string>("");
    const [ obsConnection, setOBSConnection ] = useState<OBSWebSocket>();
    const [ sceneItems, setSceneItems ] = useState<any[]>([]);

    useEffect(() => {
        async function connectToOBS() {
            const obsConn = await createOBSConnection();
            setOBSConnection(obsConn);
        };

        if (!obsConnection)
            connectToOBS();
    }, [])

    const updateObsData = async () => {
        if (!obsConnection) {
            return;
        }
        
        const sceneItems = await getScenesItemList(obsConnection);
        setSceneItems(sceneItems.filter((source) => source.inputKind === "browser_source"));
    }

    const setWebSourceUrl = async (sourceName: string) => {
        if (!obsConnection) {
            return;
        }

        const pokepasteId = pokepaste.split(pokepastePrefix)[1];
        const url = urlPrefix + pokepasteId;
        SetWebsourceUrl(obsConnection, sourceName, url);
    }

    return (
        <div>
            <div>
                Insira a poképaste: 
                <InputField
                    value={pokepaste}
                    onChange={(e) => setPokepaste(e.target.value)}
                />
            </div>
            <div>
                <Button
                    label="Pegar itens da cena"
                    onClick={async () => {await updateObsData()}}
                />
                <div>
                    <ul>
                    {sceneItems?.map((sceneItem: any) => (
                        <li key={sceneItem.sourceUuid}>
                            <Button
                                label={sceneItem.sourceName}
                                onClick={async () => { await setWebSourceUrl(sceneItem.sourceName)}}
                            />
                        </li>
                    ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}