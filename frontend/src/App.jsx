import { Container, Box, Divider, ButtonGroup, Button } from '@mui/material';
import Header from './components/Header';
import MintingUI from './components/MintingUI';
import TokenGallery from './components/TokenGallery';
import RegistrationUI from './components/RegistrationUI';
import { useApp } from './hooks/useApp'; // <-- Import the custom hook
import './App.css'; 

function App() {
  const {
    account,
    tokens,
    status,
    isLoading,
    videoRef,
    view,
    username,
    snapshots,
    connectWallet,
    startCamera,
    handleMint,
    setView,
    setUsername,
    takeSnapshot,
    handleRegister,
  } = useApp();

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Header account={account} connectWallet={connectWallet} />
        <Divider sx={{ my: 4 }} />
        {account && (
          <Box>
            <ButtonGroup variant="outlined" sx={{ mb: 4 }}>
              <Button onClick={() => setView('mint')} variant={view === 'mint' ? 'contained' : 'outlined'}>Mint Token</Button>
              <Button onClick={() => setView('register')} variant={view === 'register' ? 'contained' : 'outlined'}>Register New Face</Button>
            </ButtonGroup>

            {view === 'mint' ? (
              <MintingUI 
                status={status}
                videoRef={videoRef}
                startCamera={startCamera}
                handleMint={handleMint}
                isLoading={isLoading}
              />
            ) : (
              <RegistrationUI 
                status={status}
                videoRef={videoRef}
                startCamera={startCamera}
                takeSnapshot={takeSnapshot}
                snapshots={snapshots}
                username={username}
                setUsername={setUsername}
                handleRegister={handleRegister}
                isRegistering={isLoading} // Reuse isLoading for the button
              />
            )}
            
            <Divider sx={{ my: 4 }} />
            <TokenGallery tokens={tokens} />
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default App;