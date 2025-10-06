import flask
from flask import request, jsonify
from flask_cors import CORS
import face_recognition
import pickle
import numpy as np
import base64
import cv2
import os

app = flask.Flask(__name__)
CORS(app)

# --- Constants ---
ENCODINGS_FILE = 'encodings.pkl'

def load_encodings():
    """Loads encodings from the file, or returns an empty dict if it doesn't exist."""
    if os.path.exists(ENCODINGS_FILE):
        with open(ENCODINGS_FILE, 'rb') as f:
            return pickle.load(f)
    return {} # Return an empty dictionary if file doesn't exist

# --- Load the saved encodings at startup ---
all_known_encodings = load_encodings()
print(f"Loaded {len(all_known_encodings)} known user(s).")


@app.route('/register', methods=['POST'])
def register_face():
    """
    Receives a name and images, creates encodings, and saves them.
    """
    data = request.get_json()
    if not data or 'name' not in data or 'images' not in data:
        return jsonify({"error": "Missing name or image data"}), 400

    name = data['name']
    base64_images = data['images']
    user_encodings = []

    for base64_image in base64_images:
        try:
            image_data = base64.b64decode(base64_image.split(',')[1])
            nparr = np.frombuffer(image_data, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            encodings = face_recognition.face_encodings(image)
            if encodings:
                user_encodings.append(encodings[0])
        except Exception as e:
            print(f"Error processing an image for {name}: {e}")
            # Continue to the next image even if one fails
    
    if not user_encodings:
        return jsonify({"error": "Could not detect a face in any of the provided images."}), 400

    # Add the new user's encodings to our master dictionary
    all_known_encodings[name] = user_encodings

    # Save the updated dictionary back to the file
    with open(ENCODINGS_FILE, 'wb') as f:
        pickle.dump(all_known_encodings, f)
    
    print(f"Successfully registered new user: {name}")
    return jsonify({"success": True, "message": f"User {name} registered successfully."})


@app.route('/validate', methods=['POST'])
def validate_face():
    """
    Receives an image and compares it against ALL known encodings.
    """
    data = request.get_json()
    if not data or 'image' not in data:
        return jsonify({"error": "Missing image data"}), 400

    image_data = base64.b64decode(data['image'].split(',')[1])
    nparr = np.frombuffer(image_data, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    face_locations = face_recognition.face_locations(image)
    unknown_encodings = face_recognition.face_encodings(image, face_locations)

    if unknown_encodings:
        unknown_encoding = unknown_encodings[0]
        # Iterate through all known users and their encodings
        for name, known_encodings in all_known_encodings.items():
            matches = face_recognition.compare_faces(known_encodings, unknown_encoding)
            
            if True in matches and np.mean(matches) > 0.6:
                print(f"Validation successful for user: {name}")
                return jsonify({"success": True, "name": name})

    print("Validation failed: face not recognized.")
    return jsonify({"success": False})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)