import { Box, Button, Typography, CircularProgress } from '@mui/material';

function MintingUI({ status, videoRef, startCamera, handleMint, isLoading, onFileChange }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Typography color="text.secondary">Status: {status}</Typography>
      
      <Button variant="contained" component="label">
        Upload Asset Image
        <input type="file" hidden onChange={onFileChange} />
      </Button>

      <Box sx={{ width: 320, height: 240, backgroundColor: 'black', borderRadius: '8px' }}>
        <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%' }}></video>
      </Box>
      <Box>
        <Button variant="outlined" onClick={startCamera} sx={{ mr: 2 }}>Start Camera</Button>
        <Button variant="contained" onClick={handleMint} disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> : 'Validate Face & Mint Token'}
        </Button>
      </Box>
    </Box>
  );
}

export default MintingUI;