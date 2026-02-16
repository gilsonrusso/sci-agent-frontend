import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router';
import { Home, Science } from '@mui/icons-material';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0F1419',
        textAlign: 'center',
        px: 4,
      }}
    >
      <Science sx={{ fontSize: 200, color: '#3949AB', mb: 4, opacity: 0.8 }} />
      <Typography variant='h1' sx={{ fontSize: 120, fontWeight: 700, color: '#3949AB', mb: 2 }}>
        404
      </Typography>
      <Typography variant='h4' sx={{ mb: 2, fontWeight: 600 }}>
        Page Not Found
      </Typography>
      <Typography variant='body1' color='text.secondary' sx={{ mb: 4, maxWidth: 500 }}>
        The page you're looking for doesn't exist or has been moved.
      </Typography>
      <Button
        variant='contained'
        size='large'
        startIcon={<Home />}
        onClick={() => navigate('/dashboard')}
        sx={{
          backgroundColor: '#10B981',
          '&:hover': { backgroundColor: '#059669' },
        }}
      >
        Go to Dashboard
      </Button>
    </Box>
  );
}
