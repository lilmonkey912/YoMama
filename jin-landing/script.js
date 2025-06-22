let originalTitle = document.title;
let blinkInterval;

const imageGroups = [
  ['1.png', '2.png'],
  ['3.png', '4.png'],
  ['5.png', '6.png'],
  ['7.png', '8.png'],
  ['9.png', '10.png']
];

// Ask for notification permission once
if (Notification.permission !== "granted") {
  Notification.requestPermission();
}



document.addEventListener("visibilitychange", () => {
  const statusElement = document.getElementById("tab-status");
  if (document.hidden) {
    if (statusElement) statusElement.textContent = "Hidden (background)";
  } else {
    if (statusElement) statusElement.textContent = "Focused (active)";
    stopFlashing();
  }
});

function showChatBox(msg) {

  // Show the chat box but with empty message initially
  if (chatMsgElement) chatMsgElement.textContent = "";
  if (chatBoxElement) chatBoxElement.style.display = "flex";

  // Flash red once regardless of tab focus
  flashRedOnce();

  // Start typing animation
  if (chatMsgElement) typeMessage(msg, chatMsgElement);

  if (document.hidden) {
    // Flash title and send notification
    if (typeof flashTitle === 'function') {
      flashTitle();
    }
    if (Notification.permission === "granted") {
      new Notification("YoMama says:", { body: msg });
    }
  }
}

let currentTimeouts = [];

function typeMessage(message, element) {
  // Cancel any ongoing timeouts
  currentTimeouts.forEach(timeout => clearTimeout(timeout));
  currentTimeouts = [];

  // Reset text content
  element.textContent = "";

  let index = 0;
  const typingSpeed = 50; // milliseconds per character

  function typeCharacter() {
    if (index < message.length) {
      element.textContent += message.charAt(index);
      index++;
      const timeout = setTimeout(typeCharacter, typingSpeed);
      currentTimeouts.push(timeout);
    }
  }

  typeCharacter();
}


// Simulating a backend signal using setTimeout (replace this with actual backend logic)
setTimeout(() => {
  openChatPopup();
}, 3000); // Waits 3 seconds before triggering popup

function flashRedOnce() {
  const overlay = document.getElementById('flash-overlay');
  if (!overlay) return;
  overlay.style.opacity = '0.5'; // show red flash
  setTimeout(() => {
    overlay.style.opacity = '0'; // fade out
  }, 150);
}



let chatPopup = null;

function openChatPopup(message = "YoMama says: Study! (will change to gemini API)") {
  flashRedOnce();
  const selectedGroup = imageGroups[parseInt(slider.value) - 1];

  if (!chatPopup || chatPopup.closed) {
    chatPopup = window.open('', 'chatPopup', 'width=500,height=300,resizable=no,scrollbars=no');

  if (!chatPopup) {
      alert('Popup was blocked. Please allow popups for this site.');
      return;
    }
      
      ;

    const [img1, img2] = selectedGroup;

    if (chatPopup) {
      chatPopup.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              margin: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              font-family: sans-serif;
            }
            #chat-box {
              width: 400px;
              height: 120px;
              background-color: #b8d4f0;
              border-radius: 20px;
              position: relative;
              padding: 60px 20px 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            }
            #circle {
              width: 100px;
              height: 100px;
              border-radius: 50%;
              position: absolute;
              top: -50px;
              left: 50%;
              transform: translateX(-50%);
              background-size: cover;
              background-position: center;
              background-repeat: no-repeat;
              background-image: url('${img1}');
            }
            #chat-msg {
              text-align: center;
              font-size: 20px;
              font-weight: 500;
            }
          </style>
        </head>
        <body>
          <div id="chat-box">
            <div id="circle"></div>
            <p id="chat-msg"></p>
          </div>
          <script>
            let img1 = "${img1}";
            let img2 = "${img2}";
            let index = 0;
            let interval;

            function updateImages(new1, new2) {
              img1 = new1;
              img2 = new2;
              index = 0; // Reset animation cycle
            }

            function animateCircle() {
              const circle = document.getElementById('circle');
              if (!circle) return;
              if (interval) clearInterval(interval);
              interval = setInterval(() => {
                circle.style.backgroundImage = 'url(' + (index % 2 === 0 ? img1 : img2) + ')';
                index++;
              }, 400);
            }

            function typeMessage(msg) {
              const el = document.getElementById("chat-msg");
              el.textContent = "";
              let i = 0;
              function type() {
                if (i < msg.length) {
                  el.textContent += msg[i++];
                  setTimeout(type, 50);
                }
              }
              type();
            }

            window.addEventListener('message', (event) => {
              if (event.data.type === 'update-images') {
                updateImages(event.data.img1, event.data.img2);
              }
            });

            window.onload = () => {
              typeMessage("${message}");
              animateCircle();
            };
          </script>
        </body>
        </html>
      `);

      chatPopup.document.close();
    }
  } else {
    // Popup already exists — just send new images
    const [img1, img2] = selectedGroup;
    chatPopup.postMessage({ type: 'update-images', img1, img2 }, '*');
  }
}

function closeChatBox() {
  document.getElementById("chat-box").style.display = "none";
  stopFlashing();
}

// ***WebSocket*** connection for real-time messages
function connectWebSocket() {
  // Replace with your actual WebSocket server URL
  const ws = new WebSocket('wss://your-websocket-server.com');
  
  ws.onopen = function() {
    console.log('WebSocket connected');
  };
  
  ws.onmessage = function(event) {
    const message = JSON.parse(event.data);
    showChatBox(message.text);
  };
  
  ws.onerror = function(error) {
    console.log('WebSocket error:', error);
  };
  
  ws.onclose = function() {
    console.log('WebSocket disconnected, attempting to reconnect...');
    setTimeout(connectWebSocket, 3000); // Reconnect after 3 seconds
  };
}

// For polling alternative (if WebSocket isn't available)
function pollForMessages() {
  setInterval(async () => {
    try {
      const response = await fetch('/api/messages');
      const messages = await response.json();
      if (messages.length > 0) {
        showChatBox(messages[0].text);
      }
    } catch (error) {
      console.log('Polling error:', error);
    }
  }, 5000); // Poll every 5 seconds
}

// Choose your connection method
// connectWebSocket(); // For WebSocket
// pollForMessages(); // For polling

// Test functions for easier debugging
function testMessage() {
  openChatPopup();
}

function resetTest() {
  closeChatBox();
  stopFlashing();
}


const uploadInput = document.getElementById('upload-input');
const uploadedImage = document.getElementById('uploaded-image');
const uploadCircle = document.getElementById('upload-circle');
const placeholder = document.getElementById('upload-placeholder');

// Clicking anywhere on the circle opens the file picker
uploadCircle.addEventListener('click', () => {
  uploadInput.click();
});

// Handle image file upload and preview
uploadInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
    const reader = new FileReader();
    reader.onload = function (e) {
      uploadedImage.src = e.target.result;
      uploadedImage.style.display = 'block';
      placeholder.style.display = 'none';
    };
    reader.readAsDataURL(file);
  } else {
    alert('Please select a .jpg or .png image.');
  }
});


// Mean Level Slider
const slider = document.getElementById('custom-slider');
const sliderValue = document.getElementById('slider-value');

function updateSlider() {

  slider.style.setProperty('--value', slider.value);
}

slider.addEventListener('input', updateSlider);

slider.addEventListener('change', () => {
  console.log('Saved value:', slider.value);
});

updateSlider();
