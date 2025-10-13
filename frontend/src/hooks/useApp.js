import { useState, useEffect, useRef } from 'react';
import * as Web3Service from '../services/web3Service';
import * as ApiService from '../services/apiService';
import * as CameraService from '../services/cameraService';

export const useApp = () => {
  const [account, setAccount] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [status, setStatus] = useState("Not connected.");
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);

  const [view, setView] = useState('mint');
  const [username, setUsername] = useState('');
  const [snapshots, setSnapshots] = useState([]);
  
  // --- NEW STATE FOR THE UPLOADED FILE ---
  const [imageFile, setImageFile] = useState(null);

  const handleConnectWallet = async () => {
    try {
      const { address } = await Web3Service.connectWallet();
      setAccount(address);
      setStatus("Wallet connected. Ready to mint.");
    } catch (error) {
      console.error("Connection failed", error);
      setStatus("Connection failed.");
      alert(error.message);
    }
  };

  useEffect(() => {
    const loadTokens = async () => {
      if (account) {
        setStatus("Fetching your tokens...");
        try {
          const fetchedTokens = await Web3Service.fetchTokens(account);
          setTokens(fetchedTokens);
          setStatus("Ready to mint or register.");
        } catch (error) {
          console.error("Could not fetch tokens:", error);
          setStatus("Could not fetch tokens.");
        }
      }
    };
    // Re-fetch tokens after the account connects OR after a successful mint (status change)
    if (account) loadTokens();
  }, [account, status]);

  const handleStartCamera = async () => {
    setStatus("Starting camera...");
    try {
      await CameraService.startCamera(videoRef);
    } catch (error) {
      console.error(error);
      setStatus("Could not access webcam.");
    }
  };

  const handleTakeSnapshot = () => {
    if (snapshots.length >= 10) {
      setStatus("You have already taken 10 snapshots.");
      return;
    }
    const imageData = CameraService.takeSnapshot(videoRef);
    if (imageData) {
      setSnapshots([...snapshots, imageData]);
      setStatus(`Snapshot ${snapshots.length + 1} taken.`);
    }
  };

  const handleRegister = async () => {
    if (snapshots.length < 10 || !username) {
      alert("Please enter a name and take 10 snapshots.");
      return;
    }
    setIsLoading(true);
    setStatus(`Registering ${username}...`);
    try {
      const result = await ApiService.registerFace(username, snapshots);
      if (result.success) {
        setStatus(`✅ User ${username} registered successfully! You can now switch back to minting.`);
      } else {
        setStatus(`❌ Registration failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setStatus("Error during registration.");
    }
    setIsLoading(false);
    setSnapshots([]);
    setUsername('');
  };

  // --- UPDATED MINT FUNCTION ---
  const handleMint = async () => {
    if (!imageFile) {
      alert("Please upload an image for your asset first!");
      return;
    }
    setIsLoading(true);
    setStatus("Capturing and validating face...");
    try {
      const imageData = CameraService.takeSnapshot(videoRef);
      if (!imageData) throw new Error("Could not capture image from webcam.");
      
      const validationResult = await ApiService.validateFace(imageData);
      if (validationResult.success) {
        setStatus(`Face validated! Uploading asset to IPFS...`);
        
        // Upload the selected image file to Pinata
        const ipfsHash = await ApiService.uploadToPinata(imageFile);
        const metadataURI = `ipfs://${ipfsHash}`;
        
        setStatus(`Asset uploaded! Please approve transaction for user: ${validationResult.name}`);
        
        // Mint the token with the new IPFS link
        const tx = await Web3Service.mintToken(account, metadataURI);
        setStatus(`✅ Token minted successfully! Tx: ${tx.hash.substring(0, 10)}...`);
      } else {
        setStatus("❌ Face validation failed. Please try again.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setStatus("Error during minting process. Check the console.");
    }
    setIsLoading(false);
  };

  return {
    account,
    tokens,
    status,
    isLoading,
    videoRef,
    view,
    username,
    snapshots,
    connectWallet: handleConnectWallet,
    startCamera: handleStartCamera,
    handleMint,
    setView,
    setUsername,
    takeSnapshot: handleTakeSnapshot,
    handleRegister,
    // --- NEW HANDLER FOR THE FILE INPUT ---
    onFileChange: (e) => setImageFile(e.target.files[0]),
  };
};