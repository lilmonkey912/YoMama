import React, { useState, useEffect, useRef } from 'react';
import ChatPopup from "./ChatPopup";
import './style.css';

const imageGroups = [
  ['1.png', '2.png'],
  ['3.png', '4.png'],
  ['5.png', '6.png'],
  ['7.png', '8.png'],
  ['9.png', '10.png'],
];

const LandingPage: React.FC = () => {
  const [tabFocused, setTabFocused] = useState(true);
  const [meanLevel, setMeanLevel] = useState(3);
  const [image, setImage] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const chatMsgRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const handleVisibility = () => {
      setTabFocused(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const slider = document.getElementById('custom-slider') as HTMLInputElement;
    if (slider) {
      const event = { target: slider } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleSliderChange(event);
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setMeanLevel(val);
    const fillPercent = ((val - 1) / 4) * 100;
    const slider = document.getElementById('custom-slider');
    if (slider) {
      slider.style.setProperty('--slider-fill', `${fillPercent}%`);
    }
  };

  const flashRedOnce = () => {
    const overlay = document.getElementById('flash-overlay');
    if (!overlay) return;
    overlay.style.opacity = '0.5';
    setTimeout(() => {
      overlay.style.opacity = '0';
    }, 150);
  };

  const triggerMessage = () => {
    const msg = 'YoMama says: Study! (will change to Gemini API)';
    flashRedOnce();
    setShowPopup(true);
    if (document.hidden && Notification.permission === 'granted') {
      new Notification('YoMama says:', { body: msg });
    }
  };

  return (
    <div className="background-container">
      <div className="test-controls">
        <h2>Tab Focus Test</h2>
        <p>Current tab status: {tabFocused ? 'Focused' : 'Hidden (background)'}</p>
        <button onClick={triggerMessage}>Test Message Now</button>
        <button onClick={() => setShowPopup(false)}>Reset</button>
      </div>

      <div id="upload-circle-container">
        <div id="upload-circle" onClick={() => document.getElementById('upload-input')?.click()}>
          <input
            type="file"
            id="upload-input"
            accept="image/png, image/jpeg"
            onChange={handleImageUpload}
          />
          {image ? (
            <img id="uploaded-image" src={image} alt="Preview" style={{ display: 'block' }} />
          ) : (
            <span id="upload-placeholder">Upload Face</span>
          )}
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

      <div id="flash-overlay"></div>

      {showPopup && (
        <ChatPopup
          meanLevel={meanLevel}
          imageGroups={imageGroups}
          message="YoMama says: Study! (will change to Gemini API)"
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
};

export default LandingPage;
