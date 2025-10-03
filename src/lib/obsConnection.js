import OBSWebSocket from "obs-websocket-js";

export async function createOBSConnection(url) {
    const obs = new OBSWebSocket();

    const connection = await obs.connect(url).then(() => {});

    obs.call(
        "GetSceneItemSource",
        {
            sceneName: "Cena",
            sceneItemId: 1,
        },
    ).then((data) => console.log(data));

    return connection;
}