#Python3 -m venv env
#source env/bin/activate
#pip install flask flask-cors deepface ultralytics opencv-python
#export FLASK_APP=app
# flask run
from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import numpy as np
import cv2
import json
from deepface import DeepFace
from ultralytics import YOLO

app = Flask(__name__)
CORS(app)

#yolov11 nano
yolo_model = YOLO("yolov8n.pt")


@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        # read base 64 encoded image
        data = request.get_json()
        img_b64 = data['image']
        img_bytes = base64.b64decode(img_b64)
        nparr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # phone detection with YOLO
        results = yolo_model(img)
        has_phone = False
        for box in results[0].boxes:
            cls_id = int(box.cls[0])
            label = results[0].names[cls_id]
            if label in ['cell phone', 'mobile phone', 'phone']:
                has_phone = True
                break

        # facial expression detection with DeepFace
        face_result = DeepFace.analyze(img, actions=['emotion'], enforce_detection=False)
        emotion = face_result[0]['dominant_emotion']

        # Return Json results
        return jsonify({
            "has_phone": has_phone,
            "emotion": emotion
        })

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(port=5000, debug=True)
