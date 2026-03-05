import { Drawer, Box, Typography, Card, CardContent, LinearProgress, Chip, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useWorkflowStore } from '../../management/store/workflowStore';
import { useNavigate } from 'react-router';

interface EditorProjectsSidebarProps {
    open: boolean;
    onClose: () => void;
    currentProjectId: string;
}

export default function EditorProjectsSidebar({ open, onClose, currentProjectId }: EditorProjectsSidebarProps) {
    const { articles } = useWorkflowStore();
    const navigate = useNavigate();

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
        <Drawer
            anchor="left"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: 320,
                    bgcolor: '#161B22',
                    color: '#C9D1D9',
                    borderRight: '1px solid #30363D'
                }
            }}
        >
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', borderBottom: '1px solid #30363D' }}>
                <IconButton onClick={() => navigate('/dashboard')} sx={{ color: '#8B949E', mr: 1 }}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="h6" sx={{ fontSize: 16, fontWeight: 600 }}>My Projects</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, p: 2, overflowY: 'auto' }}>
                {articles.map(art => (
                    <Card
                        key={art.id}
                        onClick={() => {
                            navigate(`/editor/${art.id}`);
                            onClose();
                        }}
                        sx={{
                            bgcolor: art.id === currentProjectId ? '#0D1117' : 'transparent',
                            border: '1px solid',
                            borderColor: art.id === currentProjectId ? '#58A6FF' : '#30363D',
                            cursor: 'pointer',
                            boxShadow: 'none',
                            '&:hover': { borderColor: '#8B949E' }
                        }}
                    >
                        <CardContent sx={{ p: '12px !important' }}>
                            <Typography variant="subtitle2" sx={{ lineHeight: 1.3, mb: 1.5, color: '#F0F6FC' }}>
                                {art.title}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Chip
                                    label={art.macroStatus.replace('_', ' ')}
                                    size="small"
                                    sx={{
                                        height: 20,
                                        fontSize: 10,
                                        bgcolor: `${getStatusColor(art.macroStatus)}20`,
                                        color: getStatusColor(art.macroStatus),
                                        border: `1px solid ${getStatusColor(art.macroStatus)}50`,
                                        borderRadius: '12px'
                                    }}
                                />
                                <Typography variant="caption" sx={{ color: '#8B949E', fontWeight: 600 }}>
                                    {art.progress}%
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={art.progress}
                                sx={{
                                    height: 4,
                                    borderRadius: 2,
                                    bgcolor: '#30363D',
                                    '& .MuiLinearProgress-bar': { bgcolor: getStatusColor(art.macroStatus) }
                                }}
                            />
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Drawer>
    )
}
