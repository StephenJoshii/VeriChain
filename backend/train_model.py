import face_recognition
import os
import pickle
import numpy as np
from PIL import Image # <-- Import the Image library

# --- Constants ---
DATASET_DIR = 'dataset'
USER_NAME = 'user'
ENCODINGS_FILE = 'encodings.pkl'

def train_face_recognition_model():
    """
    Loads face images from the dataset, computes their encodings,
    and saves them to a file.
    """
    print("--- Starting Model Training ---")

    known_encodings = []
    image_dir = os.path.join(DATASET_DIR, USER_NAME)

    if not os.path.exists(image_dir):
        print(f"Error: Dataset directory not found at {image_dir}")
        return

    image_files = [f for f in os.listdir(image_dir) if f.endswith('.jpg')]
    if not image_files:
        print(f"No .jpg images found in {image_dir}")
        return

    print(f"Loading {len(image_files)} images from dataset...")

    for image_file in image_files:
        image_path = os.path.join(image_dir, image_file)

        # --- UPDATED THIS SECTION ---
        # Load the image using Pillow and convert to a numpy array
        pil_image = Image.open(image_path)
        image = np.array(pil_image)
        # --- END OF UPDATED SECTION ---

        encodings = face_recognition.face_encodings(image)

        if encodings:
            known_encodings.append(encodings[0])

    if not known_encodings:
        print("Could not generate any face encodings. Make sure faces are clear in the images.")
        return

    all_encodings = {"names": [USER_NAME], "encodings": [known_encodings]}

    print(f"Saving encodings to {ENCODINGS_FILE}...")
    with open(ENCODINGS_FILE, 'wb') as f:
        pickle.dump(all_encodings, f)

    print("--- Model Training Finished Successfully ---")


if __name__ == '__main__':
    train_face_recognition_model()