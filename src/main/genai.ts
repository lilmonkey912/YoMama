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

export async function windowTitleRelevant(title: string, oldTitle: string) {
  const response = await genai.models.generateContent({
    model: "gemini-2.5-flash-lite-preview-06-17",
    contents: [{
      role: "user",
      parts: [{
        text:
          `Is the following window title relevant in a study/work environment? Reply in ABSOLUTELY one word only no matter what, true or false. Be a bit generous. Things like Visual Studio Code or any code editing software are good for example. Like Cursor. Title: ${title}, Old Title: ${oldTitle}`,
      }],
    }],
  });

  return response.text === "true" ? true : false;
}

export async function generateYellText(prompt: {
  message: string;
  image?: ArrayBuffer | Buffer;
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
    model: "gemini-2.5-flash-lite-preview-06-17",
    contents: [
      {
        role: "user",
        parts,
      },
    ],
  });

  return response.text;
}

// style instruction
const VOICE_STYLE_PREFIX =
  "Read aloud in a teasing, relentless, unyielding drill sergeant voice, as mean as the truth I need to hear: ";

export async function generateYellVoice(text: string) {
  const response = await genai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{
      parts: [{
        text: `${VOICE_STYLE_PREFIX}${text}`,
      }],
    }],
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName: "Despina",
          },
        },
      },
    },
  });

  const base64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData
    ?.data;
  if (!base64) {
    throw new Error("No audio data returned");
  }

  const audioBuffer = Buffer.from(base64, "base64");

  return audioBuffer;
}

// test input, should be deleted when connected to the generated prompt
if (require.main === module) {
  generateYellVoice(
    "You lazy pig! You better start studying before you become Porkchop thrown in the streets!",
  );
}
