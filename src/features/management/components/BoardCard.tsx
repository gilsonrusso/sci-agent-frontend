import { Box, Typography, Avatar, AvatarGroup, Chip, LinearProgress } from '@mui/material';
import { Description, ChatBubbleOutline } from '@mui/icons-material';
import { useWorkflowStore } from '../store/workflowStore';
import type { Article } from '../types/workflow';

interface BoardCardProps {
    article: Article;
}

export default function BoardCard({ article }: BoardCardProps) {
    const setActiveArticle = useWorkflowStore(state => state.setActiveArticle);

    // Cor baseada no status (como labels no GitHub)
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'IDEATION': return '#E34C26';
            case 'RESEARCH': return '#D2A8FF';
            case 'WRITING': return '#58A6FF';
            case 'AI_REVIEW': return '#8957E5';
            case 'HUMAN_REVIEW': return '#D29922';
            case 'APPROVED': return '#238636';
            case 'SUBMITTED': return '#1F6FEB';
            default: return '#8B949E';
        }
    };

    return (
        <Box
            onClick={() => setActiveArticle(article.id)}
            sx={{
                backgroundColor: '#161B22',
                border: '1px solid #30363D',
                borderRadius: '6px',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                cursor: 'grab',
                '&:hover': {
                    borderColor: '#8B949E',
                    backgroundColor: '#1C2128'
                }
            }}>
            {/* Labels / Tags */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                    label={article.macroStatus.replace('_', ' ')}
                    size="small"
                    sx={{
                        height: 20,
                        fontSize: '11px',
                        backgroundColor: 'transparent',
                        color: getStatusColor(article.macroStatus),
                        border: `1px solid ${getStatusColor(article.macroStatus)}40`,
                        borderRadius: '10px'
                    }}
                />
                {/* Mocking a second label for visual fidelity */}
                <Chip
                    label="Computer Science"
                    size="small"
                    sx={{
                        height: 20,
                        fontSize: '11px',
                        backgroundColor: '#1F6FEB20',
                        color: '#58A6FF',
                        border: '1px solid #1F6FEB40',
                        borderRadius: '10px'
                    }}
                />
            </Box>

            {/* Title */}
            <Typography sx={{
                color: '#C9D1D9',
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: 1.4,
                fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif'
            }}>
                {article.title}
            </Typography>

            {/* Progress / Checklist (GitHub Style) */}
            <Box sx={{ mt: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography sx={{ fontSize: '12px', color: '#8B949E' }}>
                        {article.subSections.filter(s => s.status === 'DONE').length} of {Math.max(article.subSections.length, 1)} tasks
                    </Typography>
                </Box>
                <LinearProgress
                    variant="determinate"
                    value={article.progress}
                    sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: '#30363D',
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: '#238636'
                        }
                    }}
                />
            </Box>

            {/* Footer (Avatars and Metadata) */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mt: 1
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#8B949E' }}>
                    <Description sx={{ fontSize: 14 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ChatBubbleOutline sx={{ fontSize: 14 }} />
                        <Typography sx={{ fontSize: '12px' }}>3</Typography>
                    </Box>
                </Box>

                <AvatarGroup max={3} sx={{
                    '& .MuiAvatar-root': {
                        width: 22,
                        height: 22,
                        fontSize: '10px',
                        border: '2px solid #161B22'
                    }
                }}>
                    {article.authors.map(author => (
                        <Avatar key={author.id} alt={author.name} sx={{ bgcolor: '#8957E5' }}>
                            {author.name.charAt(0)}
                        </Avatar>
                    ))}
                </AvatarGroup>
            </Box>
        </Box>
    );
}
