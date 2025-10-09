import OBSWebSocket, { OBSWebSocketError } from "obs-websocket-js";

export async function CreateOBSConnection(url: string, password?: string): Promise<OBSWebSocket> {
    const obs = new OBSWebSocket();
    try {
        const {
            obsWebSocketVersion,
            negotiatedRpcVersion
        } = await obs.connect(url, password);
        console.log(`Connected to server ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`);
    } catch (error) {
        console.log("Erro ao tentar conectar com o OBS");
        throw new OBSWebSocketError(error.code, error.message);
    }
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