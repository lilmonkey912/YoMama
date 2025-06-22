import { contextBridge, ipcRenderer } from "electron";
import type { VisionModelResponse } from "./vision_model";

contextBridge.exposeInMainWorld("electronAPI", {
  onForemostWindowTitleChange: (callback: (title: string) => void) => {
    ipcRenderer.on("foremost-window-title", (event, title) => {
      callback(title);
    });
  },
  getForemostWindowTitle: () => ipcRenderer.invoke("get-foremost-window-title"),
  analyzeImage: (image: ArrayBuffer) =>
    ipcRenderer.invoke("analyze-image", image),
});

declare global {
  interface Window {
    electronAPI: {
      onForemostWindowTitleChange: (callback: (title: string) => void) => void;
      getForemostWindowTitle: () => Promise<string>;
      analyzeImage: (image: ArrayBuffer) => Promise<VisionModelResponse>;
    };
  }
}
