import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import WebcamComponent from "./WebcamComponent";
import ChatPopup from "./ChatPopup";

const imageGroups = [
  ["1.png", "2.png"],
  ["3.png", "4.png"],
  ["5.png", "6.png"],
  ["7.png", "8.png"],
  ["9.png", "10.png"],
];

function playPCMBuffer(buffer: ArrayBuffer) {
  const s16le = new Int16Array(buffer);
  const f32le = new Float32Array(s16le.length);
  for (let i = 0; i < s16le.length; i++) {
    f32le[i] = s16le[i] / 32768;
  }
  const SAMPLE_RATE = 24000;
  const audioContext = new AudioContext();
  const bufferSource = audioContext.createBufferSource();
  const audioBuffer = new AudioBuffer({
    sampleRate: SAMPLE_RATE,
    numberOfChannels: 1,
    length: f32le.length,
  });
  audioBuffer.copyToChannel(f32le, 0);
  bufferSource.buffer = audioBuffer;
  bufferSource.connect(audioContext.destination);
  bufferSource.start();
}

const App = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [meanLevel, setMeanLevel] = useState(3);

  let lastFrameTimestamp = 0;

  const handleFrame = (imageData: ImageData) => {
    const now = Date.now();
    if ((now - lastFrameTimestamp) > 1000) {
      lastFrameTimestamp = now;
      window.electronAPI.sendWebcamFrame(
        imageData.data,
        imageData.width,
        imageData.height,
      );
    }
  };

  const flashRedOnce = () => {
    const overlay = document.getElementById("flash-overlay");
    if (!overlay) return;
    overlay.style.opacity = "0.5";
    setTimeout(() => {
      overlay.style.opacity = "0";
    }, 150);
  };

  const [message, setMessage] = useState(
    "YoMama says: Study! (will change to Gemini API)",
  );

  const triggerMessage = () => {
    flashRedOnce();
    setShowPopup(true);
    if (document.hidden && Notification.permission === "granted") {
      new Notification("YoMama says:", { body: message });
    }
  };

  window.electronAPI.onYell((text, audio) => {
    setMessage(text);
    triggerMessage();
    playPCMBuffer(audio);
  });

  return (
    <div>
      <div id="flash-overlay" onClick={() => window.electronAPI.dismiss()}>
      </div>

      {showPopup && (
        <ChatPopup
          meanLevel={meanLevel}
          imageGroups={imageGroups}
          message={message}
          onClose={() => setShowPopup(false)}
        />
      )}

      <WebcamComponent
        width={640}
        height={480}
        facingMode="user"
        onFrame={handleFrame}
      />
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
