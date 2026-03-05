import {
  Drawer,
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  IconButton,
  useTheme,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useWorkflowStore } from '../../management/store/workflowStore';
import { useNavigate } from 'react-router';

interface EditorProjectsSidebarProps {
  open: boolean;
  onClose: () => void;
  currentProjectId: string;
}

export default function EditorProjectsSidebar({
  open,
  onClose,
  currentProjectId,
}: EditorProjectsSidebarProps) {
  const { articles } = useWorkflowStore();
  const navigate = useNavigate();
  const theme = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IDEATION':
        return theme.palette.error.main;
      case 'RESEARCH':
        return theme.palette.secondary.main;
      case 'WRITING':
        return theme.palette.info.main;
      case 'AI_REVIEW':
        return theme.palette.secondary.dark;
      case 'HUMAN_REVIEW':
        return theme.palette.warning.main;
      case 'APPROVED':
        return theme.palette.success.main;
      case 'SUBMITTED':
        return theme.palette.primary.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  return (
    <Drawer
      anchor='left'
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 320,
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <IconButton onClick={() => navigate('/dashboard')} sx={{ color: 'text.secondary', mr: 1 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant='h6' sx={{ fontSize: 16, fontWeight: 600 }}>
          My Projects
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, p: 2, overflowY: 'auto' }}>
        {articles.map((art) => (
          <Card
            key={art.id}
            onClick={() => {
              navigate(`/editor/${art.id}`);
              onClose();
            }}
            sx={{
              bgcolor: art.id === currentProjectId ? 'background.default' : 'transparent',
              border: '1px solid',
              borderColor: art.id === currentProjectId ? 'info.main' : 'divider',
              cursor: 'pointer',
              boxShadow: 'none',
              '&:hover': { borderColor: 'text.secondary' },
            }}
          >
            <CardContent sx={{ p: '12px !important' }}>
              <Typography
                variant='subtitle2'
                sx={{ lineHeight: 1.3, mb: 1.5, color: 'text.primary' }}
              >
                {art.title}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1,
                }}
              >
                <Chip
                  label={art.macroStatus.replace('_', ' ')}
                  size='small'
                  sx={{
                    height: 20,
                    fontSize: 10,
                    bgcolor: 'transparent',
                    color: getStatusColor(art.macroStatus),
                    border: `1px solid ${getStatusColor(art.macroStatus)}`,
                    borderRadius: '12px',
                  }}
                />
                <Typography variant='caption' sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  {art.progress}%
                </Typography>
              </Box>
              <LinearProgress
                variant='determinate'
                value={art.progress}
                sx={{
                  height: 4,
                  borderRadius: 2,
                  bgcolor: 'divider',
                  '& .MuiLinearProgress-bar': { bgcolor: getStatusColor(art.macroStatus) },
                }}
              />
            </CardContent>
          </Card>
        ))}
      </Box>
    </Drawer>
  );
}
