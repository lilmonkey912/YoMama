import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

declare global {
  interface Window {
    electronAPI: {
      getForemostWindowTitle: () => Promise<string>;
    };
  }
}

const App = () => {
  const [foremostWindowTitle, setForemostWindowTitle] = useState("");
  useEffect(() => {
    setInterval(() => {
      window.electronAPI.getForemostWindowTitle().then((title) => {
        setForemostWindowTitle(title);
      });
    }, 2000);
  }, []);

  return <h1>Window Title: {foremostWindowTitle}</h1>;
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
