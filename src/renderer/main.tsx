import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import WebcamComponent from "./WebcamComponent";

const App = () => {
  const [foremostWindowTitle, setForemostWindowTitle] = useState("");

  useEffect(() => {
    window.electronAPI.onForemostWindowTitleChange((title) => {
      setForemostWindowTitle(title);
    });
  }, []);

  const handleFrame = (imageData: ImageData) => {
    // You can process the imageData here if needed
    // console.log('Frame captured:', imageData.width, 'x', imageData.height);
  };

  return (
    <div>
      <h2 style={{ color: "#666", marginBottom: "30px" }}>
        Current Window: {foremostWindowTitle}
      </h2>

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
