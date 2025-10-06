import OBSWebSocket from "obs-websocket-js";

export async function CreateOBSConnection(): Promise<OBSWebSocket> {
    const obs = new OBSWebSocket();
    await obs.connect();
    return obs;
}

export async function GetOBSScenesList(obsConnection: OBSWebSocket): Promise<Array<Object>> {
    const { scenes } = await obsConnection.call("GetSceneList");
    return scenes;
}

export async function GetOBSWebsourcesList(obsConnection: OBSWebSocket, sceneName: string): Promise<Array<Object>> {
    const { sceneItems } = await obsConnection.call("GetSceneItemList", { sceneName: sceneName });
    return sceneItems.filter((sceneItem) => sceneItem.inputKind === "browser_source");
}

export async function SetOBSWebsourceUrl(obsConnection: OBSWebSocket, inputName: string, url: string) {
    await obsConnection.call("SetInputSettings", {
        inputName: inputName,
        inputSettings: {
            url: url,
        },
        overlay: true,
    })
}