import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import WebcamComponent from "./WebcamComponent";

const App = () => {
  const [foremostWindowTitle, setForemostWindowTitle] = useState("");
  const [modelResponse, setModelResponse] = useState("no data");

  useEffect(() => {
    window.electronAPI.onForemostWindowTitleChange((title) => {
      setForemostWindowTitle(title);
    });
  }, []);

  let lastFrameTimestamp = 0;

  const handleFrame = (imageData: ImageData) => {
    const now = Date.now();
    if ((now - lastFrameTimestamp) > 1000) {
      lastFrameTimestamp = now;
      window.electronAPI.analyzeImage(
        imageData.width,
        imageData.height,
        imageData.data,
      ).then((res) => {
        setModelResponse(
          `has_phone: ${res.has_phone}\nemotion: ${res.emotion}\neye_centre: ${res.eye_centre}\neye_closed: ${res.eye_closed}`,
        );
      });
    }
  };

  return (
    <div>
      <h2 style={{ color: "#666", marginBottom: "30px" }}>
        Current Window: {foremostWindowTitle}
      </h2>

      <p style={{ color: "#666", marginBottom: "30px" }}>{modelResponse}</p>

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
