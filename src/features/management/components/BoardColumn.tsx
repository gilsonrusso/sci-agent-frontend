import { Add, MoreHoriz } from '@mui/icons-material';
import { Box, Chip, IconButton, Typography } from '@mui/material';
import type { Article, MacroStatus } from '../types/workflow';
import BoardCard from './BoardCard';

interface BoardColumnProps {
  stage: { id: MacroStatus; title: string };
  articles: Article[];
}

export default function BoardColumn({ stage, articles }: BoardColumnProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: 320, // GitHub projects fixed width feel
        flexShrink: 0,
        bgcolor: 'background.paper',
        borderRadius: '6px',
        border: 1,
        borderColor: 'divider',
        maxHeight: '100%',
      }}
    >
      {/* Column Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          pb: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            sx={{
              color: 'text.primary',
              fontWeight: 600,
              fontSize: '14px',
              fontFamily:
                '-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif',
            }}
          >
            {stage.title}
          </Typography>
          <Chip
            label={articles.length}
            size='small'
            sx={{
              bgcolor: 'action.disabledBackground',
              color: 'text.secondary',
              height: 20,
              fontSize: '12px',
              fontWeight: 600,
            }}
          />
        </Box>
        <Box>
          <IconButton size='small' sx={{ color: 'text.secondary' }}>
            <Add fontSize='small' />
          </IconButton>
          <IconButton size='small' sx={{ color: 'text.secondary' }}>
            <MoreHoriz fontSize='small' />
          </IconButton>
        </Box>
      </Box>

      {/* Cards Area */}
      <Box
        sx={{
          p: 1,
          pt: 0,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'action.disabledBackground',
            borderRadius: '4px',
          },
        }}
      >
        {articles.map((article) => (
          <BoardCard key={article.id} article={article} />
        ))}
      </Box>
    </Box>
  );
}
