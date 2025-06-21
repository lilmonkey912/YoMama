import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  getForemostWindowTitle: () => ipcRenderer.invoke("get-foremost-window-title"),
});
