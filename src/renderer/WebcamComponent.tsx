import React, { useEffect, useRef, useState } from "react";

interface WebcamComponentProps {
  width?: number;
  height?: number;
  facingMode?: "user" | "environment";
  onFrame?: (imageData: ImageData) => void;
}

const WebcamComponent: React.FC<WebcamComponentProps> = ({
  width = 640,
  height = 480,
  facingMode = "user",
  onFrame,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [isStreaming, setIsStreaming] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const startStream = async () => {
    try {
      setError(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: width },
          height: { ideal: height },
          facingMode: facingMode,
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsStreaming(true);

        captureFrames();
      }
    } catch (err) {
      setError(
        `Failed to access webcam: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
      );
      console.error("Webcam access error:", err);
    }
  };

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsStreaming(false);
  };

  const captureFrames = () => {
    if (!videoRef.current || !canvasRef.current || !isStreaming) {
      return console.log("Not streaming", videoRef, canvasRef, isStreaming);
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = video.videoWidth || width;
    canvas.height = video.videoHeight || height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();

    ctx.scale(-1, 1);
    ctx.translate(-canvas.width, 0);

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    ctx.restore();

    if (onFrame) {
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        onFrame(imageData);
      } catch (err) {
        console.error("Error getting image data:", err);
      }
    }

    animationFrameRef.current = requestAnimationFrame(captureFrames);
  };

  useEffect(() => {
    startStream();

    return () => {
      stopStream();
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <div style={{ position: "relative" }}>
        <video
          ref={videoRef}
          width={width}
          height={height}
          style={{
            border: "2px solid #333",
            borderRadius: "8px",
            backgroundColor: "#000",
            transform: "scaleX(-1)",
            display: "none",
          }}
          muted
          playsInline
        />

        <canvas
          ref={canvasRef}
          style={{ display: "none" }}
        />
      </div>

      <style>
        {`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}
      </style>
    </div>
  );
};

export default WebcamComponent;
