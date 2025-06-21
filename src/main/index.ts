import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { getFrontWindowTitle } from "frontwindow";

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}

ipcMain.handle("get-foremost-window-title", getFrontWindowTitle);

app.whenReady().then(createWindow);
