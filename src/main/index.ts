import { app, BrowserWindow } from "electron";
import path from "path";
import "./genai";
import "./vision_model";
import { YellEngine } from "./yell_engine";

function createLandingWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 820,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: path.join(__dirname, "../../assets/icon.png"),
    show: true,
    titleBarStyle: "hidden",
    title: "YoMama",
    center: true,
  });

  win.loadFile(path.join(__dirname, "../renderer/landing.html"));

  return win;
}

function createWindow() {
  const win = new BrowserWindow({
    width: 100,
    height: 100,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    frame: false,
    titleBarStyle: "hidden",
    center: true,
    alwaysOnTop: true,
    hasShadow: false,
    roundedCorners: false,
    hiddenInMissionControl: true,
    transparent: true,
    focusable: false,
    icon: path.join(__dirname, "../../assets/icon.png"),
    show: true,
  });

  new YellEngine(win);

  if (process.platform === "darwin") {
    app.dock?.setIcon(path.join(__dirname, "../../assets/icon.png"));
  }

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}

app.whenReady().then(() => {
  createLandingWindow();
  createWindow();
});
