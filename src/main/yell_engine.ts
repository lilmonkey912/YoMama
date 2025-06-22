import { BrowserWindow, ipcMain } from "electron";
import {
  generateYellText,
  generateYellVoice,
  windowTitleRelevant,
} from "./genai";
import { getFrontWindowTitle } from "frontwindow";
import { inferVisionModel, VisionModelResponse } from "./vision_model";
import jpeg from "@jimp/jpeg";
import { dataStore } from "./data";
import { writeFileSync } from "fs";

let instance: YellEngine | null = null;

export class YellEngine {
  private browserWindow: BrowserWindow;

  isYelling = false;
  intervalId: NodeJS.Timeout | null = null;

  lastWindowTitle = "";
  lastWebcamFrame: Buffer | null = null;

  recentVisionModelResponses: VisionModelResponse[] = [];

  constructor(browserWindow: BrowserWindow) {
    if (instance) {
      throw new Error("YellEngine already initialized");
    }

    instance = this;

    this.browserWindow = browserWindow;

    this.intervalId = setInterval(() => {
      const title = getFrontWindowTitle();
      if (title.includes("YoMama")) {
        return;
      }

      if (title !== this.lastWindowTitle) {
        const old = this.lastWindowTitle;
        this.lastWindowTitle = title;
        this.onWindowTitleChange(title, old);
      }
    }, 500);

    ipcMain.on(
      "webcam-frame",
      (event, frame: Buffer, width: number, height: number) => {
        this.onWebcamFrame(frame, width, height);
      },
    );

    ipcMain.on("dismiss", () => {
      this.dismiss();
    });
  }

  async onWindowTitleChange(title: string, old: string) {
    const cache = dataStore.getWindowTitleRelevanceCache();
    const overrides = dataStore.getAppOverrides();

    if (overrides.some((app) => title.startsWith(app))) {
      return;
    }

    let relevant = false;
    if (cache[title]) {
      relevant = cache[title];
    } else {
      relevant = await windowTitleRelevant(title, old);
      cache[title] = relevant;
      dataStore.setWindowTitleRelevanceCache(cache);
    }

    if (!relevant) {
      console.log("not relevant", title, old);

      await this.yell(
        `${title} (Window Title) is not relevant to ${dataStore.getFocusTarget()} (Focus Target).
      User is ${dataStore.getUser() ?? "Dj"} (User).
      Mean Level is ${dataStore.getMeanLevel()} (out of 5).
      User override for mean level is: ${
          dataStore.getMeanLevelOverride() ?? "None"
        }.
      Make sure to adjust the mean level based on the user's override and our own mean level value.
      Do not talk about these values in the roast.
      Keep it single line.
      Roast:`,
      );
    }
  }

  async onWebcamFrame(frame: Buffer, width: number, height: number) {
    const encodedFrame = jpeg().encoders["image/jpeg"]({
      bitmap: { data: frame, width, height },
    });

    this.lastWebcamFrame = encodedFrame;

    const response = await inferVisionModel(encodedFrame);
    this.recentVisionModelResponses.push(response);

    // console.log("recentVisionModelResponse", response);

    if (this.recentVisionModelResponses.length > 10) {
      this.recentVisionModelResponses.shift();
    }

    if (this.recentVisionModelResponses.length < 6) {
      return;
    }

    const usingPhone = this.recentVisionModelResponses.filter(
          (r) => r.has_phone,
        ).length / this.recentVisionModelResponses.length > 0.6;

    if (!usingPhone) {
      return;
    }

    this.recentVisionModelResponses = [];

    await this.yell(
      `You are a mom yelling at their child.
      "${
        dataStore.getUser() ?? "Dj"
      }" (User) is using their phone when they're supposed to focus on "${dataStore.getFocusTarget()}" (Focus Target).
      Eyes Closed: ${response.eye_closed}, Eyes Centre: ${response.eye_centre}, Emotion: ${response.emotion}.
      Write a roast for the user acting as their mom. Mean Level is ${dataStore.getMeanLevel()} (out of 5).
      If provided the webcam image, integrate it to make it more personal. But make sure to not make fun of their
      appearance.
      User override for mean level is ${
        dataStore.getMeanLevelOverride() ?? "None"
      }.
      Make sure to adjust the mean level based on the user's override and our own mean level value.
      Do not talk about these values in the roast.
      Keep it single line.
      Roast:`,
    );
  }

  async yell(message: string) {
    if (this.isYelling) {
      return;
    }

    this.isYelling = true;

    console.log("yell", message);

    const text = await generateYellText({
      message,
      // image: this.lastWebcamFrame ?? undefined,
    });

    console.log("text", text);

    const audio = await generateYellVoice(text!);

    writeFileSync("audio.pcm", audio);

    this.browserWindow.maximize();

    this.browserWindow.webContents.send("yell", {
      text,
      audio,
    });
  }

  dismiss() {
    this.isYelling = false;
    this.browserWindow.setSize(0, 0, false);
  }
}
