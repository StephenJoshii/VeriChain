import { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import contractAbi from './contract-abi.json'; // Import the ABI

// --- Configuration ---
const contractAddress = "0x3b3B89a9607830714cDdc549178825C13e255e3A";
const aiApiUrl = "http://127.0.0.1:5001/validate";

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [status, setStatus] = useState("Not connected.");
  const videoRef = useRef(null);

  // Function to connect the wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
        
        setAccount(address);
        setContract(contractInstance);
        setStatus("Wallet connected. Ready to mint.");
      } catch (error) {
        console.error("Connection failed", error);
        setStatus("Connection failed.");
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  // Function to start the webcam
  const startCamera = async () => {
    setStatus("Starting camera... Please allow permission.");
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
        setStatus("Could not access webcam.");
      }
    }
  };
  
  // The main function for minting
  const handleMint = async () => {
    if (!videoRef.current || !videoRef.current.srcObject) {
      alert("Please start the camera first.");
      return;
    }

    // 1. Capture image from webcam
    setStatus("Capturing image...");
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg');

    // 2. Send to AI for validation
    setStatus("Validating face with AI...");
    try {
      const response = await fetch(aiApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData }),
      });
      const result = await response.json();

      if (result.success) {
        setStatus("Face validated! Please approve the transaction in MetaMask...");
        // 3. If AI validation is successful, mint the token
        const metadataURI = `ipfs://token-for-${account}`; // Placeholder URI
        const tx = await contract.safeMint(account, metadataURI);
        await tx.wait(); // Wait for the transaction to be mined
        
        setStatus(`✅ Token minted successfully! Tx: ${tx.hash.substring(0, 10)}...`);
      } else {
        setStatus("❌ Face validation failed. Please try again.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setStatus("Error during minting process. Check the console.");
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>PM Accelerator</h1>
      <p>Status: {status}</p>
      <hr style={{ margin: '20px 0' }} />

      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected: {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}</p>
          <div style={{ margin: '20px' }}>
            <video ref={videoRef} autoPlay playsInline style={{ width: '320px', height: '240px', border: '1px solid black' }}></video>
          </div>
          <button onClick={startCamera} style={{ marginRight: '10px' }}>Start Camera</button>
          <button onClick={handleMint}>Validate Face & Mint Token</button>
        </div>
      )}
    </div>
  );
}

export default App;