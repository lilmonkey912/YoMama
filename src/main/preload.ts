import { contextBridge, ipcRenderer } from "electron";
import type { VisionModelResponse } from "./vision_model";

contextBridge.exposeInMainWorld("electronAPI", {
  onForemostWindowTitleChange: (callback: (title: string) => void) => {
    ipcRenderer.on("foremost-window-title", (event, title) => {
      callback(title);
    });
  },
  getForemostWindowTitle: () => ipcRenderer.invoke("get-foremost-window-title"),
  analyzeImage: (width: number, height: number, image: ArrayBuffer) =>
    ipcRenderer.invoke("analyze-image", width, height, image),
});

declare global {
  interface Window {
    electronAPI: {
      onForemostWindowTitleChange: (callback: (title: string) => void) => void;
      getForemostWindowTitle: () => Promise<string>;
      analyzeImage: (
        width: number,
        height: number,
        image: ArrayBuffer,
      ) => Promise<VisionModelResponse>;
    };
  }
}
