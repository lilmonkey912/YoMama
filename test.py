#from deepface import DeepFace

#result = DeepFace.analyze(
   # img_path = "https://raw.githubusercontent.com/serengil/deepface/master/tests/dataset/img1.jpg",
 #   img_path = "crying.jpeg",
  #  actions = ["emotion"],
   # enforce_detection=False
#)

#print("Result:", result[0]["dominant_emotion"])

import requests
import json

# Base64 encoded
with open("jinphone.jpeg", "rb") as image_file:
    img_bytes = image_file.read()

# send POST request to flask server
response = requests.post("http://127.0.0.1:5000/analyze", 
                         data=img_bytes, 
                         headers={"Content-Type": "image/jpeg"})

# print result
print(response.json())
