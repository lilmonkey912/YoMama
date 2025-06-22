import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { getFrontWindowTitle } from "frontwindow";
import { generateYellText } from "./genai";
import "./vision_model";

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    // frame: false,
    // titleBarStyle: "hidden",
    // center: true,
    // alwaysOnTop: true,
    // hasShadow: false,
    // roundedCorners: false,
    // transparent: true,
    // fullscreen: true,
    // simpleFullscreen: true,
    // focusable: false,
    // icon: path.join(__dirname, "../../assets/icon.png"),
  });

  if (process.platform === "darwin") {
    app.dock?.setIcon(path.join(__dirname, "../../assets/icon.png"));
  }

  setInterval(() => {
    const title = getFrontWindowTitle();
    win.webContents.send("foremost-window-title", title);
  }, 500);

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}

ipcMain.handle("get-foremost-window-title", getFrontWindowTitle);

ipcMain.handle("generate-response", async (event, prompt: {
  message: string;
  image?: ArrayBuffer;
}) => {
  const text = await generateYellText(prompt);
  return text;
});

app.whenReady().then(createWindow);
