import flask
from flask import request, jsonify
from flask_cors import CORS 
import face_recognition
import pickle
import numpy as np
import base64
import cv2

app = flask.Flask(__name__)
CORS(app)

# --- Load the saved encodings ---
print("Loading known face encodings...")
with open('encodings.pkl', 'rb') as f:
    all_encodings = pickle.load(f)

# We only have one user in this simple case
known_face_encodings = all_encodings['encodings'][0]


@app.route('/validate', methods=['POST'])
def validate_face():
    """
    Receives an image, finds the face, and compares it to the known encoding.
    """
    data = request.get_json()
    if not data or 'image' not in data:
        return jsonify({"error": "Missing image data"}), 400

    # Decode the base64 image
    image_data = base64.b64decode(data['image'].split(',')[1])
    nparr = np.frombuffer(image_data, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Find face locations and encodings in the new image
    face_locations = face_recognition.face_locations(image)
    unknown_encodings = face_recognition.face_encodings(image, face_locations)

    # Assume the first face found is the one to check
    if unknown_encodings:
        # compare_faces returns a list of True/False values for each known face
        # Since we have many encodings for one person, we check if any match
        matches = face_recognition.compare_faces(known_face_encodings, unknown_encodings[0])

        # If a significant number of our saved encodings match, we have a success
        if True in matches and np.mean(matches) > 0.6:
            return jsonify({"success": True})

    return jsonify({"success": False})


if __name__ == '__main__':
    # Note: This is a development server.
    app.run(host='0.0.0.0', port=5001, debug=True)