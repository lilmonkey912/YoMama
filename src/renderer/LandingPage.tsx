import React, { useEffect, useRef, useState } from "react";
import "./style.css";

const LandingPage: React.FC = () => {
  const [tabFocused, setTabFocused] = useState(true);
  const [meanLevel, setMeanLevel] = useState(3);
  const [image, setImage] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const handleVisibility = () => {
      setTabFocused(!document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const slider = document.getElementById("custom-slider") as HTMLInputElement;
    if (slider) {
      const event = { target: slider } as unknown as React.ChangeEvent<
        HTMLInputElement
      >;
      const meanLevel = window.electronAPI.getMeanLevel();
      setMeanLevel(meanLevel);
      const profilePicture = window.electronAPI.getProfilePicture();
      if (profilePicture) {
        setImage(profilePicture);
      }
      handleSliderChange(event);
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      window.electronAPI.setProfilePicture(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setMeanLevel(val);
    window.electronAPI.setMeanLevel(val);
    const fillPercent = ((val - 1) / 4) * 100;
    const slider = document.getElementById("custom-slider");
    if (slider) {
      slider.style.setProperty("--slider-fill", `${fillPercent}%`);
    }
  };

  return (
    <div className="background-container">
      <div id="upload-circle-container">
        <div
          id="upload-circle"
          onClick={() => document.getElementById("upload-input")?.click()}
        >
          <input
            type="file"
            id="upload-input"
            accept="image/png, image/jpeg"
            onChange={handleImageUpload}
          />
          {image
            ? (
              <img
                id="uploaded-image"
                src={image}
                alt="Preview"
                style={{ display: "block" }}
              />
            )
            : <span id="upload-placeholder">Upload Face</span>}
        </div>
      </div>

      <div id="slider-container">
        <input
          type="range"
          id="custom-slider"
          min="1"
          max="5"
          step="1"
          value={meanLevel}
          onChange={handleSliderChange}
        />
      </div>
    </div>
  );
};

export default LandingPage;
