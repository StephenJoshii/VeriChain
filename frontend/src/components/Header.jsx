import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

function Header({ account, connectWallet }) {
  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid #333' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          PM Accelerator
        </Typography>
        {account ? (
          <Box sx={{ border: '1px solid #333', padding: '6px 12px', borderRadius: '20px' }}>
            <Typography variant="body2">{`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}</Typography>
          </Box>
        ) : (
          <Button variant="contained" onClick={connectWallet}>Connect Wallet</Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;