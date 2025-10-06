import flask
from flask import request, jsonify
from flask_cors import CORS
import face_recognition
import numpy as np
import base64
import cv2
import face_utils # <-- Import our new utility file

app = flask.Flask(__name__)
CORS(app)

# --- Load the saved encodings at startup ---
all_known_encodings = face_utils.load_encodings()
print(f"Loaded {len(all_known_encodings)} known user(s).")


@app.route('/register', methods=['POST'])
def register_face():
    data = request.get_json()
    if not data or 'name' not in data or 'images' not in data:
        return jsonify({"error": "Missing name or image data"}), 400

    name = data['name']
    
    # Use our utility function to process the images
    user_encodings = face_utils.generate_encodings_from_base64(data['images'])
    
    if not user_encodings:
        return jsonify({"error": "Could not detect a face in any of the provided images."}), 400

    all_known_encodings[name] = user_encodings
    face_utils.save_encodings(all_known_encodings) # Save the updated data
    
    print(f"Successfully registered new user: {name}")
    return jsonify({"success": True, "message": f"User {name} registered successfully."})


@app.route('/validate', methods=['POST'])
def validate_face():
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
        # Use our utility function to find a match
        matched_name = face_utils.find_match(unknown_encoding, all_known_encodings)
        
        if matched_name:
            print(f"Validation successful for user: {matched_name}")
            return jsonify({"success": True, "name": matched_name})

    print("Validation failed: face not recognized.")
    return jsonify({"success": False})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)