const API_BASE = "http://localhost:8080";

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
