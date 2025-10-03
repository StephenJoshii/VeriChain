import cv2
import os

# --- Constants ---
FACE_CASCADE = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
OUTPUT_DIR = 'dataset'
NUM_IMAGES = 50 # Number of images to collect
USER_NAME = 'user' # Folder name for the images

def collect_face_data():
    """
    Activates the webcam to detect and save face images for training.
    """
    # Create a directory to save the user's face images
    user_dir = os.path.join(OUTPUT_DIR, USER_NAME)
    if not os.path.exists(user_dir):
        os.makedirs(user_dir)

    cap = cv2.VideoCapture(0) # Initialize webcam (0 is usually the default)
    count = 0

    print("--- Starting Face Data Collection ---")
    print(f"Look at the camera. We need to collect {NUM_IMAGES} images.")

    while count < NUM_IMAGES:
        ret, frame = cap.read()
        if not ret:
            print("Error: Could not read frame from webcam.")
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = FACE_CASCADE.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        # Draw a rectangle around the detected face
        for (x, y, w, h) in faces:
            cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)

        cv2.imshow('Collecting Images...', frame)

        # Save the frame when 's' key is pressed
        if cv2.waitKey(1) & 0xFF == ord('s'):
            if len(faces) > 0:
                # Save the detected face region
                face_img = frame[y:y+h, x:x+w]
                img_path = os.path.join(user_dir, f'{count}.jpg')
                cv2.imwrite(img_path, face_img)
                print(f"Image {count + 1}/{NUM_IMAGES} saved.")
                count += 1
            else:
                print("No face detected. Please try again.")

        # Exit if 'q' key is pressed
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    print("--- Data Collection Finished ---")
    cap.release()
    cv2.destroyAllWindows()


if __name__ == '__main__':
    collect_face_data()