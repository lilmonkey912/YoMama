import React, { useEffect, useState } from "react";
import "./style.css";

interface Props {
  meanLevel: number;
  imageGroups: string[][];
  message: string;
  onClose: () => void;
}

const ChatPopup: React.FC<Props> = (
  { meanLevel, imageGroups, message, onClose },
) => {
  const [chatMsg, setChatMsg] = useState("");
  const [imgIndex, setImgIndex] = useState(0);

  const images = imageGroups[meanLevel - 1];

  useEffect(() => {
    setChatMsg("");
    let i = 0;

    const interval = setInterval(() => {
      setImgIndex((prev) => (prev === 0 ? 1 : 0));
    }, 400);

    const type = () => {
      if (i < message.length) {
        setChatMsg((prev) => prev + (message[i++] || ""));
        setTimeout(type, 50);
      }
    };
    type();

    return () => {
      clearInterval(interval);
    };
  }, [message]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "5%",
        right: "5%",
        width: "280px",
        padding: "70px 20px 20px",
        borderRadius: "20px",
        backgroundColor: "#D44350",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        border: "2px solid #7aa3cc",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          backgroundImage: `url('./assets/${images[imgIndex]}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          border: "2px solid #7aa3cc",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          position: "absolute",
          top: -50,
        }}
      />
      <p style={{ textAlign: "center", fontSize: 16, fontWeight: 500 }}>
        {chatMsg}
      </p>
    </div>
  );
};

export default ChatPopup;
