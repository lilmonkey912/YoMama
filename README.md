Flask backend takes an input image and uses YOLO (v8n) to detect phones and DeepFace to analyze emotion.
It returns a JSON response with the results, and optionally saves an annotated image as output.jpg.

Sample output response in JSON:
{'emotion': 'happy', 'has_phone': True, 'eye_closed': False, 'eye_centre': False}
