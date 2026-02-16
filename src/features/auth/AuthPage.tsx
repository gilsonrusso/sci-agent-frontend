import { Science } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser, registerUser, clearError } from '../../store/slices/authSlice';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading: loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Clear error on tab switch
  useEffect(() => {
    dispatch(clearError());
  }, [activeTab, dispatch]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (activeTab === 0) {
      dispatch(loginUser({ username: email, password }));
    } else {
      if (password !== confirmPassword) {
        // We can dispatch a manual error or just set a local one,
        // but for simplicity let's rely on standard flow.
        // Or strictly strictly:
        alert('Passwords do not match');
        return;
      }
      dispatch(registerUser({ email, password, full_name: '' }));
    }
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

            {/* Error Display */}
            {error && (
              <Alert severity='error' sx={{ mb: 3 }}>
                {typeof error === 'string' ? error : 'Authentication failed'}
              </Alert>
            )}

            <Box component='form' onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label='Email'
                type='email'
                variant='outlined'
                sx={{ mb: 2 }}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <TextField
                fullWidth
                label='Password'
                type='password'
                variant='outlined'
                sx={{ mb: 1 }}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />

              {activeTab === 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                  <Button size='small' sx={{ textTransform: 'none' }} disabled={loading}>
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
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              )}

              <Button
                type='submit'
                fullWidth
                variant='contained'
                size='large'
                disabled={loading}
                sx={{
                  mb: 3,
                  py: 1.5,
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color='inherit' />
                ) : activeTab === 0 ? (
                  'Sign In'
                ) : (
                  'Create Account'
                )}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
