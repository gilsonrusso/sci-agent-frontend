import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Divider,
  Tab,
  Tabs,
} from '@mui/material';
import { Google, GitHub, Science } from '@mui/icons-material';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to dashboard after "login"
    navigate('/dashboard');
  };

  const handleSocialAuth = (provider: string) => {
    console.log(`Authenticating with ${provider}`);
    navigate('/dashboard');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #0F1419 0%, #1A1F2E 50%, #283593 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Abstract scientific pattern overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Left side - Branding */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 8,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Placeholder for Mascot using Icon */}
        <Science
          sx={{
            fontSize: 180,
            color: '#10B981',
            mb: 4,
            filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.4))',
          }}
        />

        <Typography variant='h2' sx={{ fontWeight: 700, color: '#fff', mb: 2 }}>
          SciAgent OS
        </Typography>
        <Typography
          variant='h6'
          sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', maxWidth: 500 }}
        >
          Scientific Writing & Collaboration Platform powered by AI Agents
        </Typography>
        <Box sx={{ mt: 6, display: 'flex', gap: 4, opacity: 0.6 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant='h3' sx={{ fontWeight: 700, color: '#10B981' }}>
              10K+
            </Typography>
            <Typography variant='body2' sx={{ color: 'rgba(255,255,255,0.6)' }}>
              Papers Published
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant='h3' sx={{ fontWeight: 700, color: '#10B981' }}>
              500+
            </Typography>
            <Typography variant='body2' sx={{ color: 'rgba(255,255,255,0.6)' }}>
              Universities
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Right side - Auth form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 4,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Card
          sx={{
            width: '100%',
            maxWidth: 480,
            backgroundColor: 'rgba(26, 31, 46, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant='h5' sx={{ mb: 1, fontWeight: 600 }}>
              Welcome back
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
              Sign in to continue your research
            </Typography>

            <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mb: 3 }}>
              <Tab label='Sign In' />
              <Tab label='Register' />
            </Tabs>

            <Box component='form' onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label='Email'
                type='email'
                variant='outlined'
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                label='Password'
                type='password'
                variant='outlined'
                sx={{ mb: 1 }}
                required
              />

              {activeTab === 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                  <Button size='small' sx={{ textTransform: 'none' }}>
                    Forgot password?
                  </Button>
                </Box>
              )}

              {activeTab === 1 && (
                <TextField
                  fullWidth
                  label='Confirm Password'
                  type='password'
                  variant='outlined'
                  sx={{ mb: 2 }}
                  required
                />
              )}

              <Button
                type='submit'
                fullWidth
                variant='contained'
                size='large'
                sx={{
                  mb: 3,
                  py: 1.5,
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                {activeTab === 0 ? 'Sign In' : 'Create Account'}
              </Button>

              <Divider sx={{ mb: 3 }}>
                <Typography variant='body2' color='text.secondary'>
                  OR
                </Typography>
              </Divider>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  fullWidth
                  variant='outlined'
                  startIcon={<Google />}
                  onClick={() => handleSocialAuth('Google')}
                  sx={{ py: 1.5 }}
                >
                  Google
                </Button>
                <Button
                  fullWidth
                  variant='outlined'
                  startIcon={<GitHub />}
                  onClick={() => handleSocialAuth('GitHub')}
                  sx={{ py: 1.5 }}
                >
                  GitHub
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
