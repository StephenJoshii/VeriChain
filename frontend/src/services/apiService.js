const AI_API_URL = "http://127.0.0.1:5001";

export const validateFace = async (imageData) => {
  const response = await fetch(`${AI_API_URL}/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: imageData }),
  });
  return response.json();
};

export const registerFace = async (name, images) => {
  const response = await fetch(`${AI_API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, images }),
  });
  return response.json();
};