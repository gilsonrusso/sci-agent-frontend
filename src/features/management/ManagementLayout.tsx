import { Outlet, useNavigate, useLocation } from 'react-router';
import { Box, Typography, Button, IconButton, Avatar, Chip, useTheme } from '@mui/material';
import { Science, ArrowBack, Settings, Search, FilterList } from '@mui/icons-material';
import { useWorkflowStore } from './store/workflowStore';
import ApprovalDrawer from './components/ApprovalDrawer';
import ThemeToggle from '../../components/ThemeToggle';

export default function ManagementLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUserRole } = useWorkflowStore();
  const theme = useTheme();

  const getTitle = () => {
    switch (currentUserRole) {
      case 'AUTHOR':
        return 'My Submissions';
      case 'COORDINATOR':
        return 'Department Roadmap';
      case 'MENTOR':
        return "Mentor's Board";
      default:
        return 'Management';
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
      }}
    >
      {/* GitHub-like Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 1.5,
          bgcolor: 'background.paper',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/dashboard')} sx={{ color: 'text.secondary' }}>
            <ArrowBack />
          </IconButton>
          <Science sx={{ color: 'primary.main' }} />
          <Typography variant='subtitle1' sx={{ fontWeight: 600, color: 'text.primary' }}>
            Institution{' '}
            <Box component='span' sx={{ color: 'text.secondary', mx: 1 }}>
              /
            </Box>{' '}
            {getTitle()}
          </Typography>
          <Chip
            label='Public'
            size='small'
            sx={{
              backgroundColor: 'transparent',
              border: `1px solid ${theme.palette.divider}`,
              color: 'text.secondary',
              borderRadius: '12px',
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<FilterList />}
            size='small'
            sx={{ color: 'text.primary', textTransform: 'none' }}
          >
            Filter
          </Button>
          <Button
            startIcon={<Search />}
            size='small'
            sx={{ color: 'text.primary', textTransform: 'none' }}
          >
            Search
          </Button>
          <IconButton size='small' sx={{ color: 'text.secondary' }}>
            <Settings fontSize='small' />
          </IconButton>
          <ThemeToggle />
          <Avatar
            sx={{
              width: 28,
              height: 28,
              fontSize: 13,
              bgcolor: 'success.main',
              color: 'success.contrastText',
            }}
          >
            {currentUserRole === 'MENTOR' ? 'M' : currentUserRole === 'COORDINATOR' ? 'C' : 'A'}
          </Avatar>
        </Box>
      </Box>

      {/* GitHub-like Subheader (Views Tabs) */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 3,
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.default',
        }}
      >
        <Box sx={{ display: 'flex', gap: 3, height: 48 }}>
          <Button
            onClick={() => navigate('/management/board')}
            sx={{
              color: location.pathname.includes('board') ? 'text.primary' : 'text.secondary',
              textTransform: 'none',
              fontWeight: location.pathname.includes('board') ? 600 : 400,
              minWidth: 'auto',
              borderBottom: location.pathname.includes('board')
                ? `2px solid ${theme.palette.primary.main}`
                : '2px solid transparent',
              borderRadius: 0,
              px: 0,
              '&:hover': { backgroundColor: 'transparent', color: 'text.primary' },
            }}
          >
            Board
          </Button>
          <Button
            onClick={() => navigate('/management/roadmap')}
            sx={{
              color: location.pathname.includes('roadmap') ? 'text.primary' : 'text.secondary',
              textTransform: 'none',
              fontWeight: location.pathname.includes('roadmap') ? 600 : 400,
              minWidth: 'auto',
              borderBottom: location.pathname.includes('roadmap')
                ? `2px solid ${theme.palette.primary.main}`
                : '2px solid transparent',
              borderRadius: 0,
              px: 0,
              '&:hover': { backgroundColor: 'transparent', color: 'text.primary' },
            }}
          >
            Roadmap
          </Button>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, overflow: 'hidden', display: 'flex' }}>
        <Outlet />
      </Box>

      {/* Split-View PR Style Review Drawer */}
      <ApprovalDrawer />
    </Box>
  );
}
