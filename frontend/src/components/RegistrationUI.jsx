import { Box, Button, Typography, TextField, Grid, Card } from '@mui/material';

function RegistrationUI({ status, videoRef, startCamera, takeSnapshot, snapshots, username, setUsername, handleRegister, isRegistering }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: '100%' }}>
      <Typography color="text.secondary">{status}</Typography>
      <TextField
        label="Enter your name"
        variant="outlined"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        sx={{ width: '320px' }}
      />
      <Box sx={{ width: 320, height: 240, backgroundColor: 'black', borderRadius: '8px' }}>
        <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%' }}></video>
      </Box>
      <Box>
        <Button variant="outlined" onClick={startCamera} sx={{ mr: 2 }}>Start Camera</Button>
        <Button variant="contained" color="secondary" onClick={takeSnapshot}>Take Snapshot ({snapshots.length}/10)</Button>
      </Box>

      <Grid container spacing={1} sx={{ maxWidth: '320px', mt: 2 }}>
        {snapshots.map((src, index) => (
          <Grid item xs={2.4} key={index}>
            <img src={src} style={{ width: '100%', height: 'auto', borderRadius: '4px' }} />
          </Grid>
        ))}
      </Grid>

      <Button 
        variant="contained" 
        color="primary"
        onClick={handleRegister} 
        disabled={isRegistering || snapshots.length < 10 || !username}
        sx={{ mt: 2 }}
      >
        {isRegistering ? 'Registering...' : 'Register My Face'}
      </Button>
    </Box>
  );
}

export default RegistrationUI;