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
from gazetracking.gaze_tracking import GazeTracking
 
import traceback

app = Flask(__name__)
CORS(app)

#yolov11 nano
yolo_model = YOLO("yolov8n.pt")


@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        # read binary  image
        img_bytes = request.data
        nparr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # phone detection with YOLO
        results = yolo_model(img)
        has_phone = False
        for box in results[0].boxes:
            cls_id = int(box.cls[0])
            label = results[0].names[cls_id]
            print (label)
            if label in ['cell phone', 'remote', 'teddy bear', 'donut', 'toilet']:
                has_phone = True
                break
            # Draw boxes on the image
            annotated_frame = results[0].plot()
            # DEBUG
            # cv2.imwrite("output.jpg", annotated_frame)

        # facial expression detection with DeepFace
        face_result = DeepFace.analyze(img, actions=['emotion'], enforce_detection=False)
        emotion = face_result[0]['dominant_emotion']

        # eye tracking feature with GazeTracking
        gaze = GazeTracking()
        gaze.refresh(img)
        eye_centre = gaze.is_center()
        eye_closed = gaze.is_blinking()
        eye_centre = False
        if not eye_closed:
            eye_centre = gaze.is_center()
        # Return Json results
        return jsonify({
            "has_phone": has_phone,
            "emotion": emotion,
            "eye_centre": eye_centre,
            "eye_closed": eye_closed
        })

    except Exception as e:
        return jsonify({"error": traceback.format_exc()})

if __name__ == '__main__':
    app.run(port=5000, debug=True)
