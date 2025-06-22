import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import WebcamComponent from "./WebcamComponent";

const App = () => {
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

  return (
    <div>
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
