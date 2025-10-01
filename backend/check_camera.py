import cv2

print("Attempting to connect to webcam...")

# Try to open the default camera (index 0)
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Error: Cannot open camera at index 0.")
else:
    ret, frame = cap.read()
    if ret:
        print("✅ Success! A frame was read from the webcam.")
        cv2.imshow('Camera Test - Press any key to quit', frame)
        cv2.waitKey(0) # Wait indefinitely for a key press
    else:
        print("Error: Camera is open, but could not read a frame.")

# Clean up
cap.release()
cv2.destroyAllWindows()