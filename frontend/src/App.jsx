import { useState } from 'react';
import { ethers } from 'ethers';

function App() {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    // Check if MetaMask is installed
    if (window.ethereum) {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        console.log("Connected account:", address);
      } catch (error) {
        console.error("User rejected connection or an error occurred", error);
      }
    } else {
      alert("Please install MetaMask to use this dApp!");
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>PM Accelerator</h1>
      {account ? (
        <div>
          <p>Connected: {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}</p>
        </div>
      ) : (
        <button onClick={connectWallet} style={{ padding: '10px 20px', fontSize: '16px' }}>
          Connect Wallet
        </button>
      )}
    </div>
  );
}

export default App;