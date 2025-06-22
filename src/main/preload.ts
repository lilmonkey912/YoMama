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
    };
  }
}
