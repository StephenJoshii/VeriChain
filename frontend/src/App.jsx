import { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import contractAbi from './contract-abi.json';

// --- Configuration ---
const contractAddress = "0x3b3B89a9607830714cDdc549178825C13e255e3A";
const aiApiUrl = "http://127.0.0.1:5001/validate";

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [tokens, setTokens] = useState([]); // <-- New state for storing token data
  const [status, setStatus] = useState("Not connected.");
  const videoRef = useRef(null);

  const connectWallet = async () => {
    // ... (connectWallet function is the same as before)
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

  // --- NEW FUNCTION TO FETCH TOKENS ---
  useEffect(() => {
    const fetchTokens = async () => {
      if (contract && account) {
        setStatus("Fetching your tokens...");
        try {
          const balance = await contract.balanceOf(account);
          const fetchedTokens = [];

          for (let i = 0; i < balance; i++) {
            const tokenId = await contract.tokenOfOwnerByIndex(account, i);
            let tokenURI = await contract.tokenURI(tokenId);
            
            // For this project, we'll just display the placeholder URI
            fetchedTokens.push({ id: tokenId.toString(), uri: tokenURI });
          }

          setTokens(fetchedTokens);
          setStatus("Your tokens are displayed below.");
        } catch (error) {
          console.error("Could not fetch tokens:", error);
          setStatus("Could not fetch tokens.");
        }
      }
    };

    fetchTokens();
  }, [contract, account]); // This effect runs when the contract or account changes


  const startCamera = async () => {
    // ... (startCamera function is the same as before)
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
  
  const handleMint = async () => {
    // ... (handleMint function is the same as before)
    if (!videoRef.current || !videoRef.current.srcObject) {
      alert("Please start the camera first.");
      return;
    }
    setStatus("Capturing image...");
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg');
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
        const metadataURI = `ipfs://token-for-${account}-${new Date().getTime()}`;
        const tx = await contract.safeMint(account, metadataURI);
        await tx.wait();
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

          {/* --- NEW SECTION TO DISPLAY TOKENS --- */}
          <div style={{ marginTop: '40px' }}>
            <h2>Your Digital Assets</h2>
            {tokens.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
                {tokens.map(token => (
                  <div key={token.id} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', width: '200px' }}>
                    <p><strong>Token ID:</strong> {token.id}</p>
                    <p style={{ wordWrap: 'break-word' }}><strong>URI:</strong> {token.uri}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>You do not own any tokens yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;