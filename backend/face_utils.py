import pickle
import os
import face_recognition
import numpy as np
import base64
import cv2

ENCODINGS_FILE = 'encodings.pkl'

def load_encodings():
    """Loads encodings from the file, or returns an empty dict if it doesn't exist."""
    if os.path.exists(ENCODINGS_FILE):
        with open(ENCODINGS_FILE, 'rb') as f:
            return pickle.load(f)
    return {}

def save_encodings(data):
    """Saves the given data to the encodings file."""
    with open(ENCODINGS_FILE, 'wb') as f:
        pickle.dump(data, f)

def generate_encodings_from_base64(base64_images):
    """Processes a list of base64 images and returns a list of face encodings."""
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
            print(f"Error processing an image: {e}")
    return user_encodings

def find_match(unknown_encoding, all_known_encodings):
    """Compares an unknown encoding against all known users and returns the matched name."""
    for name, known_encodings in all_known_encodings.items():
        matches = face_recognition.compare_faces(known_encodings, unknown_encoding)

        if True in matches and np.mean(matches) > 0.6:
            return name  # Return the name of the matched user
    return None  # Return None if no match is found