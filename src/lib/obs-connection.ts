import OBSWebSocket, { OBSWebSocketError } from "obs-websocket-js";

export class OBSConnection {
  private obs: OBSWebSocket | null = null;

  async connect(url: string, password?: string): Promise<void> {
    this.obs = new OBSWebSocket();
    try {
      const { obsWebSocketVersion, negotiatedRpcVersion } =
        await this.obs.connect(url, password);
      console.log(
        `[v0] Connected to OBS ${obsWebSocketVersion} (RPC ${negotiatedRpcVersion})`,
      );
    } catch (error: any) {
      console.error("[v0] Failed to connect to OBS:", error);
      throw new OBSWebSocketError(error.code, error.message);
    }
  }

  async disconnect(): Promise<void> {
    if (this.obs) {
      await this.obs.disconnect();
      this.obs = null;
    }
  }

  async getScenes(): Promise<any[]> {
    if (!this.obs) throw new Error("Not connected to OBS");
    const { scenes } = await this.obs.call("GetSceneList");
    return scenes;
  }

  async getSources(sceneName: string): Promise<any[]> {
    if (!this.obs) throw new Error("Not connected to OBS");
    const { sceneItems } = await this.obs.call("GetSceneItemList", {
      sceneName,
    });
    return sceneItems.filter(
      (item: any) => item.inputKind === "browser_source",
    );
  }

  async setSourceUrl(inputName: string, url: string): Promise<void> {
    if (!this.obs) throw new Error("Not connected to OBS");
    await this.obs.call("SetInputSettings", {
      inputName,
      inputSettings: { url },
      overlay: true,
    });
  }

  async setPersistentData(slotName: string, slotValue: any): Promise<void> {
    if (!this.obs) throw new Error("Not connected to OBS");
    await this.obs.call("SetPersistentData", {
      realm: "OBS_WEBSOCKET_DATA_REALM_GLOBAL",
      slotName,
      slotValue,
    });
  }

  async getPersistentData(slotName: string): Promise<any> {
    if (!this.obs) throw new Error("Not connected to OBS");
    const result = await this.obs.call("GetPersistentData", {
      realm: "OBS_WEBSOCKET_DATA_REALM_GLOBAL",
      slotName,
    });
    return result.slotValue;
  }

  async broadcastCustomEvent(eventData: any): Promise<void> {
    if (!this.obs) throw new Error("Not connected to OBS");
    console.log("Broadcasting Custom Event: ", eventData.eventName);
    await this.obs.call("BroadcastCustomEvent", {
      eventData,
    });
  }

  addEventListener(event: string, handler: Function) {
    if (!this.obs) throw new Error("Not connected to OBS");
    this.obs.on(event, handler);
  }

  removeEventListener(event: string, handler: Function) {
    if (!this.obs) throw new Error("Not connected to OBS");
    this.obs.off(event, handler);
  }

  isConnected(): boolean {
    return this.obs !== null;
  }

  getConnection(): OBSWebSocket | null {
    return this.obs;
  }
}
