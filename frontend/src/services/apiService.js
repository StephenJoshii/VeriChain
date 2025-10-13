import axios from 'axios';

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


export const uploadToPinata = async (imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);

  const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
    headers: {
      'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
      'Authorization': `Bearer ${import.meta.env.VITE_PINATA_JWT}`
    }
  });


  return response.data.IpfsHash;
};