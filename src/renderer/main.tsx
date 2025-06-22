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
    // You can process the imageData here if needed
    console.log("Frame captured:", imageData.width, "x", imageData.height);
    const now = Date.now();
    if (now - lastFrameTimestamp > 1000) {
      lastFrameTimestamp = now;
      console.log("Analyzing image");
      window.electronAPI.analyzeImage(imageData.data).then((res) => {
        console.log(res);
        setModelResponse(JSON.stringify(res));
      });
    }
  };

  return (
    <div>
      <h2 style={{ color: "#666", marginBottom: "30px" }}>
        Current Window: {foremostWindowTitle}
      </h2>

      <p>{modelResponse}</p>

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
