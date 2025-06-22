import { ipcMain } from "electron";
import jpeg from "@jimp/jpeg";

const API_BASE = "http://127.0.0.1:5000";

export interface VisionModelResponse {
  has_phone: boolean;
  emotion: string;
  eye_centre: boolean;
  eye_closed: boolean;
}

export function inferVisionModel(
  image: ArrayBuffer,
): Promise<VisionModelResponse> {
  return fetch(`${API_BASE}/analyze`, {
    method: "POST",
    body: image,
    headers: {
      "Content-Type": "application/octet-stream",
    },
  }).then((res) => res.json());
}

ipcMain.handle(
  "analyze-image",
  async (_event, width: number, height: number, image: ArrayBuffer) => {
    return await inferVisionModel(
      jpeg().encoders["image/jpeg"]({
        bitmap: { data: Buffer.from(image), width, height },
      }),
    );
  },
);
