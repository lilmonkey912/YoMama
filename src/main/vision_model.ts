import { ipcMain } from "electron";

const API_BASE = "http://localhost:5000";

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

ipcMain.handle("analyze-image", async (_event, image: ArrayBuffer) => {
  return inferVisionModel(image);
});
