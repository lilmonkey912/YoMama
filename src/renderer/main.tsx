import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

const App = () => {
  const [foremostWindowTitle, setForemostWindowTitle] = useState("");
  useEffect(() => {
    window.electronAPI.onForemostWindowTitleChange((title) => {
      setForemostWindowTitle(title);
    });
  }, []);

  return <h1>{foremostWindowTitle}</h1>;
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
