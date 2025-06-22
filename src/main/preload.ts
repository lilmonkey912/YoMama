import { contextBridge, ipcRenderer } from "electron";
import { dataStore } from "./data";

contextBridge.exposeInMainWorld("electronAPI", {
  onYell: (callback: (text: string, audio: ArrayBuffer) => void) => {
    ipcRenderer.on("yell", (event, data) => {
      callback(data.text, data.audio);
    });
  },
  sendWebcamFrame: (frame: ArrayBuffer, width: number, height: number) => {
    ipcRenderer.send("webcam-frame", frame, width, height);
  },
  dismiss: () => {
    ipcRenderer.send("dismiss");
  },
  setMeanLevel: (meanLevel: number) => {
    dataStore.setMeanLevelOverride(meanLevel);
  },
  getMeanLevel: () => {
    return dataStore.getMeanLevelOverride();
  },
  getProfilePicture: () => {
    return dataStore.getProfilePicture();
  },
  setProfilePicture: (profilePicture: string) => {
    dataStore.setProfilePicture(profilePicture);
  },
});

declare global {
  interface Window {
    electronAPI: {
      onYell: (callback: (text: string, audio: ArrayBuffer) => void) => void;
      sendWebcamFrame: (
        frame: ArrayBuffer,
        width: number,
        height: number,
      ) => void;
      dismiss: () => void;
      setMeanLevel: (meanLevel: number) => void;
      getMeanLevel: () => number;
      getProfilePicture: () => string | null;
      setProfilePicture: (profilePicture: string) => void;
    };
  }
}
