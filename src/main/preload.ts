import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  onForemostWindowTitleChange: (callback: (title: string) => void) => {
    ipcRenderer.on("foremost-window-title", (event, title) => {
      callback(title);
    });
  },
  getForemostWindowTitle: () => ipcRenderer.invoke("get-foremost-window-title"),
});

declare global {
  interface Window {
    electronAPI: {
      onForemostWindowTitleChange: (callback: (title: string) => void) => void;
      getForemostWindowTitle: () => Promise<string>;
    };
  }
}
