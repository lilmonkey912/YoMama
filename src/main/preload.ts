import { contextBridge, ipcRenderer } from "electron";

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
    ipcRenderer.send("set-mean-level", meanLevel);
  },
  getMeanLevel: () => {
    return ipcRenderer.invoke("get-mean-level");
  },
  getProfilePicture: () => {
    return ipcRenderer.invoke("get-profile-picture");
  },
  setProfilePicture: (profilePicture: string) => {
    ipcRenderer.send("set-profile-picture", profilePicture);
  },
});

declare global {
  interface Window {
    electronAPI: {
      onYell: (callback: (text: string, audio: Uint8Array) => void) => void;
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
