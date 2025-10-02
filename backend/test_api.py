import requests
import base64
import os

# --- Constants ---
API_URL = 'http://127.0.0.1:5000/validate'
IMAGE_PATH = os.path.join('dataset', 'user', '0.jpg') # Using the first image we collected

def test_validation_api():
    """
    Sends an image to the validation API and prints the result.
    """
    print(f"Sending image {IMAGE_PATH} to the API for validation...")

    try:
        # Read the image file and encode it in base64
        with open(IMAGE_PATH, 'rb') as f:
            image_bytes = f.read()
            base64_image = base64.b64encode(image_bytes).decode('utf-8')

        # Prepare the JSON payload
        payload = {'image': f'data:image/jpeg;base64,{base64_image}'}

        # Send the POST request
        response = requests.post(API_URL, json=payload)
        response.raise_for_status() # Raise an exception for bad status codes (4xx or 5xx)

        print(f"✅ Response from server: {response.json()}")

    except FileNotFoundError:
        print(f"Error: Could not find the image at {IMAGE_PATH}. Make sure you have collected the data.")
    except requests.exceptions.RequestException as e:
        print(f"Error: Could not connect to the API server at {API_URL}. Is it running?")
        print(f"Details: {e}")


if __name__ == '__main__':
    test_validation_api()