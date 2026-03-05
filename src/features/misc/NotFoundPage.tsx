import { Home, Science } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router';

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
        bgcolor: 'background.default',
        textAlign: 'center',
        px: 4,
      }}
    >
      <Science sx={{ fontSize: 200, color: 'primary.main', mb: 4, opacity: 0.8 }} />
      <Typography
        variant='h1'
        sx={{ fontSize: 120, fontWeight: 700, color: 'primary.main', mb: 2 }}
      >
        404
      </Typography>
      <Typography variant='h4' sx={{ mb: 2, fontWeight: 600 }}>
        Page Not Found
      </Typography>
      <Typography variant='body1' color='text.secondary' sx={{ mb: 4, maxWidth: 500 }}>
        The page you're looking for doesn't exist or has been moved.
      </Typography>
      <Button
        onClick={() => navigate('/dashboard')}
        variant='contained'
        size='large'
        startIcon={<Home />}
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          '&:hover': { bgcolor: 'primary.dark' },
        }}
      >
        Go to Dashboard
      </Button>
    </Box>
  );
}
