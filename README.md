# YoMama 👁️📣

**Hackathon Submission – SpurHacks 2025**

**Demo Video:** [Link Coming Soon]  
**Team Members:**  DJ, Chloe, Adila, Jin

---

## 🧠 TL;DR

Tired of zoning out while studying?  
**YoMama** is your aggressively motivational AI assistant that tracks your attention, roasts your procrastination, and yells at you (in your mom's voice) until you get back to work.

Using real-time webcam ML, window tracking, and Gemini API sass — YoMama makes sure you're always **focused**, or else.

---

## 🧪 Features

- 🖥️ **Window Tracking:** Detects the title of the current active window (e.g., YouTube 👀)
- 🎭 **Emotion Detection:** Checks if you're crying, distracted, or not looking at the screen
- 🤳 **Phone Detection:** Determines if you're secretly texting instead of working
- 🧠 **Gemini AI Roasts:** Real-time roast generation using Google Gemini API
- 🎤 **Voice Output:** Roasts are turned into speech (with mood-based delivery)
- 👁️ **Eye Tracking:** Detects eye movement and loss of screen focus
- 📸 **Image Upload:** Upload your face to personalize roast behavior
- 🔥 **Adjustable Meanness:** Pick how savage you want YoMama to be
- 🚨 **Popup & Flash Alerts:** Triggers a red screen flash + popup character roast if you slack off

---

## 🛠️ Tech Stack

**Languages & Frameworks:**
- TypeScript
- React
- Electron
- Python (Flask)
- C (desktop control)
- Machine Learning 
- CSS/HTML

**Libraries & APIs:**
- Google Gemini API (text generation)
- Custom Machine Learning Models (phone, face, eye, emotion detection)
- Real-time image analysis (Webcam feed to Flask backend)
- Audio synthesis for Gemini TTS
- Electron preload bridge for system info

---

## 📷 Screenshots

> _Coming Soon: Full UI with background, character circle, and popup demo._

---

## 🧪 Installation

1. Clone the repo:

```bash
git clone https://github.com/yourteam/yomama.git
```
2. Install backend dependencies:
```bash
cd server
pip install -r requirements.txt
python app.py
```
3. Install frontend (Electron React) dependencies:
```bash
cd ../client
npm install
npm run start
```
##  Opportunity

LLMs and productivity AI tools are booming, but most are too polite or passive.
**YoMama** fills that gap by offering an agentic, emotionally expressive AI that adapts to your behavior, with real consequences (popups, sound, and social shame).

Think: your mom yelling at you, but with generative sass and ML-powered presence detection.

## Future Integration
Fine-tuned **Gemini agent memory** for long-term study session tracking
**“YoMama Leaderboard” **for public shaming among friends
Chrome extension + system-wide monitoring
IRL version: Raspberry Pi **camera and speaker **for real-life tracking

## 🤝 Team
- **DJ** - Electron / Systems / Window + Camera tracking
- **Adila** - UI Design / Branding / Frontend polish
- **Jin** - Frontend Logic / Animation / Popups
- **Chloe** - Backend / ML integration / Vision models

