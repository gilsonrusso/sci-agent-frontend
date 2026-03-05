import { Outlet, useNavigate, useLocation } from 'react-router';
import { Box, Typography, Button, IconButton, Avatar, Chip } from '@mui/material';
import { Science, ArrowBack, Settings, Search, FilterList } from '@mui/icons-material';
import { useWorkflowStore } from './store/workflowStore';
import ApprovalDrawer from './components/ApprovalDrawer';

export default function ManagementLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUserRole } = useWorkflowStore();

    const getTitle = () => {
        switch (currentUserRole) {
            case 'AUTHOR': return 'My Submissions';
            case 'COORDINATOR': return 'Department Roadmap';
            case 'MENTOR': return "Mentor's Board";
            default: return 'Management';
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#0D1117', color: '#C9D1D9' }}>

            {/* GitHub-like Header */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 3,
                py: 1.5,
                backgroundColor: '#161B22',
                borderBottom: '1px solid #30363D'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={() => navigate('/dashboard')} sx={{ color: '#8B949E' }}>
                        <ArrowBack />
                    </IconButton>
                    <Science sx={{ color: '#58A6FF' }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#F0F6FC' }}>
                        Institution <Box component="span" sx={{ color: '#8B949E', mx: 1 }}>/</Box> {getTitle()}
                    </Typography>
                    <Chip label="Public" size="small" sx={{ backgroundColor: 'transparent', border: '1px solid #30363D', color: '#8B949E', borderRadius: '12px' }} />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button startIcon={<FilterList />} size="small" sx={{ color: '#C9D1D9', textTransform: 'none' }}>
                        Filter
                    </Button>
                    <Button startIcon={<Search />} size="small" sx={{ color: '#C9D1D9', textTransform: 'none' }}>
                        Search
                    </Button>
                    <IconButton size="small" sx={{ color: '#8B949E' }}>
                        <Settings fontSize="small" />
                    </IconButton>
                    <Avatar sx={{ width: 28, height: 28, fontSize: 13, bgcolor: '#238636' }}>
                        {currentUserRole === 'MENTOR' ? 'M' : currentUserRole === 'COORDINATOR' ? 'C' : 'A'}
                    </Avatar>
                </Box>
            </Box>

            {/* GitHub-like Subheader (Views Tabs) */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                px: 3,
                borderBottom: '1px solid #30363D',
                backgroundColor: '#0D1117'
            }}>
                <Box sx={{ display: 'flex', gap: 3, height: 48 }}>
                    <Button
                        onClick={() => navigate('/management/board')}
                        sx={{
                            color: location.pathname.includes('board') ? '#C9D1D9' : '#8B949E',
                            textTransform: 'none',
                            fontWeight: location.pathname.includes('board') ? 600 : 400,
                            minWidth: 'auto',
                            borderBottom: location.pathname.includes('board') ? '2px solid #F78166' : '2px solid transparent',
                            borderRadius: 0,
                            px: 0,
                            '&:hover': { backgroundColor: 'transparent', color: '#C9D1D9' }
                        }}
                    >
                        Board
                    </Button>
                    <Button
                        onClick={() => navigate('/management/roadmap')}
                        sx={{
                            color: location.pathname.includes('roadmap') ? '#C9D1D9' : '#8B949E',
                            textTransform: 'none',
                            fontWeight: location.pathname.includes('roadmap') ? 600 : 400,
                            minWidth: 'auto',
                            borderBottom: location.pathname.includes('roadmap') ? '2px solid #F78166' : '2px solid transparent',
                            borderRadius: 0,
                            px: 0,
                            '&:hover': { backgroundColor: 'transparent', color: '#C9D1D9' }
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
