import { Box, Typography, IconButton, Chip } from '@mui/material';
import { MoreHoriz, Add } from '@mui/icons-material';
import type { Article, MacroStatus } from '../types/workflow';
import BoardCard from './BoardCard';

interface BoardColumnProps {
    stage: { id: MacroStatus; title: string };
    articles: Article[];
}

export default function BoardColumn({ stage, articles }: BoardColumnProps) {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            width: 320, // GitHub projects fixed width feel
            flexShrink: 0,
            backgroundColor: '#0D1117',
            borderRadius: '6px',
            border: '1px solid #30363D',
            maxHeight: '100%',
        }}>
            {/* Column Header */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                pb: 1
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{
                        color: '#F0F6FC',
                        fontWeight: 600,
                        fontSize: '14px',
                        fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif'
                    }}>
                        {stage.title}
                    </Typography>
                    <Chip
                        label={articles.length}
                        size="small"
                        sx={{
                            backgroundColor: 'rgba(110,118,129,0.4)',
                            color: '#C9D1D9',
                            height: 20,
                            fontSize: '12px',
                            fontWeight: 600
                        }}
                    />
                </Box>
                <Box>
                    <IconButton size="small" sx={{ color: '#8B949E' }}>
                        <Add fontSize="small" />
                    </IconButton>
                    <IconButton size="small" sx={{ color: '#8B949E' }}>
                        <MoreHoriz fontSize="small" />
                    </IconButton>
                </Box>
            </Box>

            {/* Cards Area */}
            <Box sx={{
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
                    backgroundColor: '#30363D',
                    borderRadius: '4px',
                }
            }}>
                {articles.map((article) => (
                    <BoardCard key={article.id} article={article} />
                ))}
            </Box>
        </Box>
    );
}
