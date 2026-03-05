import { Box, Drawer, Typography, IconButton, Button, Divider, Avatar, TextField, Chip } from '@mui/material';
import { Close, Check, ThumbDown, OpenInNew } from '@mui/icons-material';
import { useWorkflowStore } from '../store/workflowStore';
import { useNavigate } from 'react-router';

export default function ApprovalDrawer() {
    const { activeArticleId, setActiveArticle, articles } = useWorkflowStore();
    const navigate = useNavigate();

    const article = articles.find(a => a.id === activeArticleId);

    if (!article) return null;

    return (
        <Drawer
            anchor="right"
            open={!!activeArticleId}
            onClose={() => setActiveArticle(null)}
            PaperProps={{
                sx: {
                    width: { xs: '100vw', md: '75vw', lg: '65vw' },
                    backgroundColor: '#0D1117',
                    borderLeft: '1px solid #30363D'
                }
            }}
        >
            {/* Header */}
            <Box sx={{
                p: 2,
                borderBottom: '1px solid #30363D',
                backgroundColor: '#161B22',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h6" sx={{ color: '#C9D1D9', fontWeight: 600, fontSize: 16 }}>
                        PR #{article.id.replace('a', '')} - {article.title}
                    </Typography>
                    <Chip label={article.macroStatus} size="small" sx={{ backgroundColor: '#23863620', color: '#3FB950', border: '1px solid #238636', borderRadius: '12px' }} />
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        startIcon={<OpenInNew />}
                        size="small"
                        variant="outlined"
                        onClick={() => navigate(`/editor/${article.id}`)}
                        sx={{
                            color: '#8B949E',
                            borderColor: '#30363D',
                            textTransform: 'none',
                            '&:hover': { borderColor: '#8B949E' }
                        }}
                    >
                        View Full Editor
                    </Button>
                    <IconButton size="small" onClick={() => setActiveArticle(null)} sx={{ color: '#8B949E' }}>
                        <Close />
                    </IconButton>
                </Box>
            </Box>

            {/* Split View Content */}
            <Box sx={{ display: 'flex', flexGrow: 1, height: 'calc(100vh - 65px)' }}>
                {/* Left Side: Document Preview (Rendered Markdown) */}
                <Box sx={{
                    flex: 2,
                    borderRight: '1px solid #30363D',
                    p: 4,
                    overflowY: 'auto',
                    backgroundColor: '#F0F6FC' // Markdown paper feel
                }}>
                    {/* Fake Document Content based on subsections */}
                    <Typography variant="h4" sx={{ color: '#24292F', fontWeight: 700, mb: 3 }}>
                        {article.title}
                    </Typography>

                    {article.subSections.length > 0 ? (
                        article.subSections.map(sub => (
                            <Box key={sub.id} sx={{ mb: 4 }}>
                                <Typography variant="h6" sx={{ color: '#24292F', fontWeight: 600, mb: 1 }}>
                                    {sub.name}
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#57606A', lineHeight: 1.6 }}>
                                    [Content for {sub.name} goes here. This is a mock preview of the writer's exact words rendered as a clean document. They have written approximately {sub.wordCount} words so far.]
                                </Typography>
                                {sub.status !== 'DONE' && (
                                    <Box sx={{ mt: 2, p: 2, backgroundColor: '#FFF8C5', borderLeft: '4px solid #D4A72C', borderRadius: 1 }}>
                                        <Typography variant="body2" sx={{ color: '#9A6700' }}>
                                            ⚠️ This section is still marked as {sub.status}.
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        ))
                    ) : (
                        <Typography variant="body1" sx={{ color: '#57606A', fontStyle: 'italic' }}>
                            No sections drafted yet. Writer is currently in Ideation phase.
                        </Typography>
                    )}
                </Box>

                {/* Right Side: Conversation / Review Panel */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#0D1117' }}>
                    <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto' }}>
                        <Typography variant="subtitle2" sx={{ color: '#8B949E', fontWeight: 600, mb: 2, textTransform: 'uppercase' }}>
                            Review Conversation
                        </Typography>

                        {/* Mock AI or User Comments */}
                        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: '#8957E5' }}>AI</Avatar>
                            <Box sx={{ backgroundColor: '#161B22', border: '1px solid #30363D', borderRadius: 2, p: 2, flexGrow: 1 }}>
                                <Typography variant="body2" sx={{ color: '#C9D1D9', display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <strong style={{ color: '#58A6FF' }}>SciAgent Reviewer</strong> commented 2 hours ago
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#8B949E', mt: 1 }}>
                                    I have analyzed the methodology draft. The arguments are solid, but it lacks references to recent works on computer vision application in Brazilian agriculture context.
                                </Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ borderColor: '#30363D', my: 2 }} />

                        {/* Leave a Comment Box */}
                        <Box sx={{ mt: 2 }}>
                            <TextField
                                fullWidth
                                multiline
                                minRows={3}
                                placeholder="Leave a comment or review..."
                                variant="outlined"
                                sx={{
                                    backgroundColor: '#161B22',
                                    '& .MuiOutlinedInput-root': {
                                        color: '#C9D1D9',
                                        '& fieldset': { borderColor: '#30363D' },
                                        '&:hover fieldset': { borderColor: '#8B949E' },
                                    }
                                }}
                            />
                        </Box>
                    </Box>

                    {/* Bottom Action Bar */}
                    <Box sx={{ p: 2, borderTop: '1px solid #30363D', display: 'flex', justifyContent: 'flex-end', gap: 2, backgroundColor: '#161B22' }}>
                        <Button
                            variant="outlined"
                            startIcon={<ThumbDown />}
                            sx={{ color: '#F85149', borderColor: '#F8514950', textTransform: 'none', '&:hover': { borderColor: '#F85149' } }}
                            onClick={() => setActiveArticle(null)}
                        >
                            Request Changes
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<Check />}
                            sx={{ backgroundColor: '#238636', color: '#fff', textTransform: 'none', '&:hover': { backgroundColor: '#2EA043' } }}
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
