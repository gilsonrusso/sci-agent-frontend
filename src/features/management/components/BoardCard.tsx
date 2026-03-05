import {
  Box,
  Typography,
  Avatar,
  AvatarGroup,
  Chip,
  LinearProgress,
  useTheme,
} from '@mui/material';
import { Description, ChatBubbleOutline } from '@mui/icons-material';
import { useWorkflowStore } from '../store/workflowStore';
import type { Article } from '../types/workflow';

interface BoardCardProps {
  article: Article;
}

export default function BoardCard({ article }: BoardCardProps) {
  const setActiveArticle = useWorkflowStore((state) => state.setActiveArticle);
  const theme = useTheme();

  // Cor baseada no status (como labels no GitHub)
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IDEATION':
        return theme.palette.error.main;
      case 'RESEARCH':
        return theme.palette.secondary.main;
      case 'WRITING':
        return theme.palette.primary.main;
      case 'AI_REVIEW':
        return theme.palette.secondary.light;
      case 'HUMAN_REVIEW':
        return theme.palette.warning.main;
      case 'APPROVED':
        return theme.palette.success.main;
      case 'SUBMITTED':
        return theme.palette.info.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  return (
    <Box
      onClick={() => setActiveArticle(article.id)}
      sx={{
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        borderRadius: '6px',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        cursor: 'grab',
        '&:hover': {
          borderColor: 'text.secondary',
          bgcolor: 'action.hover',
        },
      }}
    >
      {/* Labels / Tags */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip
          label={article.macroStatus.replace('_', ' ')}
          size='small'
          sx={{
            height: 20,
            fontSize: '11px',
            backgroundColor: 'transparent',
            color: getStatusColor(article.macroStatus),
            border: `1px solid ${getStatusColor(article.macroStatus)}40`,
            borderRadius: '10px',
          }}
        />
        {/* Mocking a second label for visual fidelity */}
        <Chip
          label='Computer Science'
          size='small'
          sx={{
            height: 20,
            fontSize: '11px',
            bgcolor: 'action.selected',
            color: 'info.main',
            border: 1,
            borderColor: 'info.light',
            borderRadius: '10px',
          }}
        />
      </Box>

      {/* Title */}
      <Typography
        sx={{
          color: 'text.primary',
          fontSize: '14px',
          fontWeight: 500,
          lineHeight: 1.4,
          fontFamily:
            '-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif',
        }}
      >
        {article.title}
      </Typography>

      {/* Progress / Checklist (GitHub Style) */}
      <Box sx={{ mt: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
            {article.subSections.filter((s) => s.status === 'DONE').length} of{' '}
            {Math.max(article.subSections.length, 1)} tasks
          </Typography>
        </Box>
        <LinearProgress
          variant='determinate'
          value={article.progress}
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: 'divider',
            '& .MuiLinearProgress-bar': {
              bgcolor: 'success.main',
            },
          }}
        />
      </Box>

      {/* Footer (Avatars and Metadata) */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mt: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.secondary' }}>
          <Description sx={{ fontSize: 14 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <ChatBubbleOutline sx={{ fontSize: 14 }} />
            <Typography sx={{ fontSize: '12px' }}>3</Typography>
          </Box>
        </Box>

        <AvatarGroup
          max={3}
          sx={{
            '& .MuiAvatar-root': {
              width: 22,
              height: 22,
              fontSize: '10px',
              border: '2px solid #161B22',
            },
          }}
        >
          {article.authors.map((author) => (
            <Avatar
              key={author.id}
              alt={author.name}
              sx={{ bgcolor: 'secondary.main', color: 'secondary.contrastText' }}
            >
              {author.name.charAt(0)}
            </Avatar>
          ))}
        </AvatarGroup>
      </Box>
    </Box>
  );
}
