#from deepface import DeepFace

#result = DeepFace.analyze(
   # img_path = "https://raw.githubusercontent.com/serengil/deepface/master/tests/dataset/img1.jpg",
 #   img_path = "crying.jpeg",
  #  actions = ["emotion"],
   # enforce_detection=False
#)

#print("Result:", result[0]["dominant_emotion"])

import requests
import base64
import json

# Base64 encoded
with open("testing.jpeg", "rb") as image_file:
    img_b64 = base64.b64encode(image_file.read()).decode('utf-8')

# request
payload = json.dumps({
    "image": img_b64
})

# send POST request to flask server
response = requests.post("http://127.0.0.1:5000/analyze", data=payload, headers={"Content-Type": "application/json"})

# print result
print(response.json())
