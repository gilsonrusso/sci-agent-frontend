import {
  Box,
  Drawer,
  Typography,
  IconButton,
  Button,
  Divider,
  Avatar,
  TextField,
  Chip,
  useTheme,
} from '@mui/material';
import { Close, Check, ThumbDown, OpenInNew } from '@mui/icons-material';
import { useWorkflowStore } from '../store/workflowStore';
import { useNavigate } from 'react-router';

export default function ApprovalDrawer() {
  const { activeArticleId, setActiveArticle, articles } = useWorkflowStore();
  const navigate = useNavigate();
  const theme = useTheme();

  const article = articles.find((a) => a.id === activeArticleId);

  if (!article) return null;

  return (
    <Drawer
      anchor='right'
      open={!!activeArticleId}
      onClose={() => setActiveArticle(null)}
      PaperProps={{
        sx: {
          width: { xs: '100vw', md: '75vw', lg: '65vw' },
          bgcolor: 'background.default',
          borderLeft: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant='h6' sx={{ color: 'text.primary', fontWeight: 600, fontSize: 16 }}>
            PR #{article.id.replace('a', '')} - {article.title}
          </Typography>
          <Chip
            label={article.macroStatus}
            size='small'
            sx={{ bgcolor: 'success.main', color: 'success.contrastText', borderRadius: '12px' }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            startIcon={<OpenInNew />}
            size='small'
            variant='outlined'
            onClick={() => navigate(`/editor/${article.id}`)}
            sx={{
              color: 'text.secondary',
              borderColor: 'divider',
              textTransform: 'none',
              '&:hover': { borderColor: 'text.primary' },
            }}
          >
            View Full Editor
          </Button>
          <IconButton
            size='small'
            onClick={() => setActiveArticle(null)}
            sx={{ color: 'text.secondary' }}
          >
            <Close />
          </IconButton>
        </Box>
      </Box>

      {/* Split View Content */}
      <Box sx={{ display: 'flex', flexGrow: 1, height: 'calc(100vh - 65px)' }}>
        {/* Left Side: Document Preview (Rendered Markdown) */}
        <Box
          sx={{
            flex: 2,
            borderRight: `1px solid ${theme.palette.divider}`,
            p: 4,
            overflowY: 'auto',
            bgcolor: 'background.paper',
          }}
        >
          {/* Fake Document Content based on subsections */}
          <Typography variant='h4' sx={{ color: 'text.primary', fontWeight: 700, mb: 3 }}>
            {article.title}
          </Typography>

          {article.subSections.length > 0 ? (
            article.subSections.map((sub) => (
              <Box key={sub.id} sx={{ mb: 4 }}>
                <Typography variant='h6' sx={{ color: 'text.primary', fontWeight: 600, mb: 1 }}>
                  {sub.name}
                </Typography>
                <Typography variant='body1' sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                  [Content for {sub.name} goes here. This is a mock preview of the writer's exact
                  words rendered as a clean document. They have written approximately{' '}
                  {sub.wordCount} words so far.]
                </Typography>
                {sub.status !== 'DONE' && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      bgcolor:
                        theme.palette.mode === 'dark' ? 'rgba(255, 171, 0, 0.16)' : 'warning.light',
                      borderLeft: `4px solid ${theme.palette.warning.main}`,
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant='body2' sx={{ color: 'warning.main' }}>
                      ⚠️ This section is still marked as {sub.status}.
                    </Typography>
                  </Box>
                )}
              </Box>
            ))
          ) : (
            <Typography variant='body1' sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
              No sections drafted yet. Writer is currently in Ideation phase.
            </Typography>
          )}
        </Box>

        {/* Right Side: Conversation / Review Panel */}
        <Box
          sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}
        >
          <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto' }}>
            <Typography
              variant='subtitle2'
              sx={{ color: 'text.secondary', fontWeight: 600, mb: 2, textTransform: 'uppercase' }}
            >
              Review Conversation
            </Typography>

            {/* Mock AI or User Comments */}
            <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>AI</Avatar>
              <Box
                sx={{
                  bgcolor: 'background.paper',
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  p: 2,
                  flexGrow: 1,
                }}
              >
                <Typography
                  variant='body2'
                  sx={{ color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <strong style={{ color: theme.palette.info.main }}>SciAgent Reviewer</strong>{' '}
                  commented 2 hours ago
                </Typography>
                <Typography variant='body2' sx={{ color: 'text.secondary', mt: 1 }}>
                  I have analyzed the methodology draft. The arguments are solid, but it lacks
                  references to recent works on computer vision application in Brazilian agriculture
                  context.
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ borderColor: 'divider', my: 2 }} />

            {/* Leave a Comment Box */}
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                placeholder='Leave a comment or review...'
                variant='outlined'
                sx={{
                  bgcolor: 'background.paper',
                  '& .MuiOutlinedInput-root': {
                    color: 'text.primary',
                    '& fieldset': { borderColor: 'divider' },
                    '&:hover fieldset': { borderColor: 'text.secondary' },
                  },
                }}
              />
            </Box>
          </Box>

          {/* Bottom Action Bar */}
          <Box
            sx={{
              p: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              bgcolor: 'background.paper',
            }}
          >
            <Button
              variant='outlined'
              startIcon={<ThumbDown />}
              sx={{
                color: 'error.main',
                borderColor: theme.palette.mode === 'dark' ? 'error.dark' : 'error.light',
                textTransform: 'none',
                '&:hover': { borderColor: 'error.main' },
              }}
              onClick={() => setActiveArticle(null)}
            >
              Request Changes
            </Button>
            <Button
              variant='contained'
              startIcon={<Check />}
              sx={{
                bgcolor: 'success.main',
                color: 'success.contrastText',
                textTransform: 'none',
                '&:hover': { bgcolor: 'success.dark' },
              }}
              onClick={() => {
                // Logic for approval bulk/stamp
                alert('Aprovado! (Stamp Animation)');
                setActiveArticle(null);
              }}
            >
              Approve Stage
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}
