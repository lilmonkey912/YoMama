import { GoogleGenAI, Part } from "@google/genai";
import { readFileSync } from "fs";
import path from "path";

const secrets: {
  GEMINI_API_KEY: string;
} = JSON.parse(
  readFileSync(path.join(__dirname, "..", "..", "secrets.json"), "utf8"),
);

export const genai = new GoogleGenAI({
  apiKey: secrets.GEMINI_API_KEY,
});

export async function generateYellText(prompt: {
  message: string;
  image?: ArrayBuffer;
}) {
  const parts: Part[] = [];
  if (prompt.image) {
    parts.push({
      inlineData: {
        mimeType: "image/png",
        data: Buffer.from(prompt.image).toString("base64"),
      },
    });
  }
  parts.push({
    text: prompt.message,
  });
  const response = await genai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts,
      },
    ],
  });

  return response.text;
}

export async function generateYellVoice() {}
