import { Grid, Card, CardContent, Typography, Box } from '@mui/material';

function TokenGallery({ tokens }) {
  return (
    <Box sx={{ mt: 5, width: '100%' }}>
      <Typography variant="h4" gutterBottom>Your Digital Assets</Typography>
      {tokens.length > 0 ? (
        <Grid container spacing={3}>
          {tokens.map(token => (
            <Grid item xs={12} sm={6} md={4} key={token.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Token ID: {token.id}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ wordWrap: 'break-word', mt: 1 }}>
                    {token.uri}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography color="text.secondary">You do not own any tokens yet.</Typography>
      )}
    </Box>
  );
}

export default TokenGallery;