import OBSWebSocket from "obs-websocket-js";

export async function createOBSConnection(): Promise<OBSWebSocket> {
    const obs = new OBSWebSocket();    
    await obs.connect();
    return obs;
}

export async function getScenesItemList(obs: OBSWebSocket) {
    const { sceneItems } = await obs.call("GetSceneItemList", { sceneName: "rec" });
    return sceneItems;
}

export async function GetInputSettings(obs: OBSWebSocket, inputName?: string): Promise<{
    inputSettings: any;
    inputKind: string;
}> {
    const { inputSettings, inputKind } = await obs.call("GetInputSettings", { inputName: inputName });
    return { inputSettings, inputKind };
}

export async function SetWebsourceUrl(obs: OBSWebSocket, sourceName: string, url: string) {
    await obs.call(
        "SetInputSettings",
        {
            inputName: sourceName,
            inputSettings: {
                url,
                overlay: true,
            },
        }
    )
}