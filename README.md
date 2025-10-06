# PM Accelerator (Digital Asset & Biometric Authentication System)

This project is a full-stack, decentralized application (dApp) that demonstrates how to secure blockchain actions using AI-powered facial recognition. Users can register their face with the system and then mint unique digital assets (NFTs) on the Sepolia testnet only after their identity is biometrically verified.

## 🚀 Features

* **Blockchain Integration:** A Solidity ERC721 smart contract deployed on the Sepolia testnet to manage digital assets.
* **AI Facial Recognition:** A Python backend service that can learn new faces and validate a user's identity from a webcam image.
* **Multi-User Registration:** New users can register their facial signature with the AI backend through the frontend.
* **Decentralized Minting:** Users can create new, unique NFT tokens that are assigned to their wallet address.
* **Web3 Frontend:** A React frontend built with Material-UI that connects to MetaMask and interacts with both the smart contract and the AI backend.

## 🛠️ Tech Stack

* **Blockchain:** Solidity, Ethereum (Sepolia Testnet), Hardhat
* **AI / Backend:** Python, Flask, PyTorch, `face-recognition`, OpenCV
* **Frontend:** React (Vite), Ethers.js, Material-UI (MUI)

## ⚙️ Setup and Installation

To run this project locally, you will need three separate terminals.

### Prerequisites
* [Node.js](https://nodejs.org/)
* [Python 3](https://www.python.org/downloads/)
* [MetaMask](https://metamask.io/) browser extension
* A free account with [Alchemy](https://www.alchemy.com) to get a Sepolia RPC URL.

---
### 1. Backend AI Server Setup

Navigate to the `backend` directory and set up the Python environment.

```bash
# Navigate to the backend folder
cd backend

# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install Flask Flask-Cors torch torchvision torchaudio opencv-python face-recognition
```

---
### 2. Frontend Setup

Navigate to the `frontend` directory and install the Node.js dependencies.

```bash
# Navigate to the frontend folder
cd frontend

# Install dependencies
npm install
```

---
### 3. Running the Application

1.  **Start the Backend Server:** In one terminal, run the AI server.
    ```bash
    # From the 'backend' directory
    source venv/bin/activate
    python3 app.py
    ```

2.  **Start the Frontend Server:** In a second, separate terminal, run the React development server.
    ```bash
    # From the 'frontend' directory
    npm run dev
    ```
3.  **Open the App:** Your browser will open to the `localhost` URL provided by the frontend server. You can now connect your wallet, register a new face, and mint a token.