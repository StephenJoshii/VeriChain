import face_recognition
import os
import pickle
import numpy as np
from PIL import Image

# --- Constants ---
DATASET_DIR = 'dataset'
USER_NAME = 'user' # This is the user we are training for
ENCODINGS_FILE = 'encodings.pkl'

def train_face_recognition_model():
    print("--- Starting Model Training ---")

    known_encodings = []
    image_dir = os.path.join(DATASET_DIR, USER_NAME)

    if not os.path.exists(image_dir):
        print(f"Error: Dataset directory not found at {image_dir}")
        return

    image_files = [f for f in os.listdir(image_dir) if f.endswith('.jpg')]
    print(f"Loading {len(image_files)} images from dataset...")

    for image_file in image_files:
        image_path = os.path.join(image_dir, image_file)
        pil_image = Image.open(image_path)
        image = np.array(pil_image)

        encodings = face_recognition.face_encodings(image)
        if encodings:
            known_encodings.append(encodings[0])

    if not known_encodings:
        print("Could not generate any face encodings.")
        return


    data = {USER_NAME: known_encodings}

    print(f"Saving encodings for user '{USER_NAME}' to {ENCODINGS_FILE}...")
    with open(ENCODINGS_FILE, 'wb') as f:
        pickle.dump(data, f)

    print("--- Model Training Finished Successfully ---")

if __name__ == '__main__':
    train_face_recognition_model()