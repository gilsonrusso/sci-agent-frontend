import { Box, Typography, Avatar, Tooltip } from '@mui/material';
import { WarningAmber, ErrorOutline } from '@mui/icons-material';
import { useWorkflowStore } from '../store/workflowStore';
import { format, differenceInDays, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

export default function CoordinatorRoadmap() {
    const { articles } = useWorkflowStore();

    // Configurações da Timeline
    const startDate = new Date(); // Hoje como base da view temporal

    // Eixo X: Gerar meses e dias para cabeçalho
    const months = [
        { name: format(startDate, 'MMMM yyyy'), days: eachDayOfInterval({ start: startOfMonth(startDate), end: endOfMonth(startDate) }).length },
        { name: format(addDays(endOfMonth(startDate), 1), 'MMMM yyyy'), days: eachDayOfInterval({ start: startOfMonth(addDays(endOfMonth(startDate), 1)), end: endOfMonth(addDays(endOfMonth(startDate), 1)) }).length }
    ];

    const dayWidth = 24; // pixels por dia na timeline

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
            backgroundColor: '#0D1117',
            overflow: 'hidden'
        }}>
            {/* Table Header / Timeline Axis */}
            <Box sx={{
                display: 'flex',
                borderBottom: '1px solid #30363D',
                height: 60,
                backgroundColor: '#161B22',
                flexShrink: 0
            }}>
                {/* Fixed column for titles */}
                <Box sx={{
                    width: 320,
                    flexShrink: 0,
                    borderRight: '1px solid #30363D',
                    p: 2,
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <Typography sx={{ color: '#8B949E', fontSize: 13, fontWeight: 600 }}>Article Title</Typography>
                </Box>

                {/* Scrollable Timeline Header */}
                <Box sx={{
                    flexGrow: 1,
                    overflowX: 'hidden', // Scroll is handled synchronously later
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Box sx={{ display: 'flex', borderBottom: '1px solid #30363D' }}>
                        {months.map((m, i) => (
                            <Box key={i} sx={{
                                width: m.days * dayWidth,
                                py: 0.5, px: 2,
                                borderRight: '1px solid #30363D'
                            }}>
                                <Typography sx={{ color: '#8B949E', fontSize: 12 }}>{m.name}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>

            {/* List of Articles (Rows) */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                {articles.map((article) => {
                    const createdDate = new Date(article.createdAt);
                    const deadlineDate = new Date(article.deadline);

                    // Simple offset logic
                    const offsetDays = differenceInDays(createdDate, startDate);
                    const durationDays = differenceInDays(deadlineDate, createdDate);

                    // Mock Predictive Risk for Demo
                    const riskRandom = Math.random();
                    let riskLevel = 'LOW';
                    if (riskRandom > 0.8) riskLevel = 'HIGH';
                    else if (riskRandom > 0.6) riskLevel = 'MEDIUM';

                    const getRiskColor = () => {
                        if (riskLevel === 'HIGH') return '#F85149';
                        if (riskLevel === 'MEDIUM') return '#D29922';
                        return '#238636';
                    };

                    const getRiskIcon = () => {
                        if (riskLevel === 'HIGH') return <ErrorOutline sx={{ fontSize: 14, color: '#F85149' }} />;
                        if (riskLevel === 'MEDIUM') return <WarningAmber sx={{ fontSize: 14, color: '#D29922' }} />;
                        return null; // <CheckCircleOutline sx={{ fontSize: 14, color: '#238636' }} />;
                    };

                    return (
                        <Box key={article.id} sx={{
                            display: 'flex',
                            height: 48,
                            borderBottom: '1px solid #30363D',
                            '&:hover': { backgroundColor: '#1C2128' }
                        }}>
                            {/* Left Pannel (Meta) */}
                            <Box sx={{
                                width: 320,
                                flexShrink: 0,
                                borderRight: '1px solid #30363D',
                                p: 1,
                                px: 2,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2
                            }}>
                                <Typography noWrap sx={{ color: '#C9D1D9', fontSize: 14, flexGrow: 1 }}>
                                    {article.title}
                                </Typography>
                                {article.authors[0] && (
                                    <Avatar sx={{ width: 20, height: 20, fontSize: 10, bgcolor: '#58A6FF' }}>
                                        {article.authors[0].name.charAt(0)}
                                    </Avatar>
                                )}
                            </Box>

                            {/* Timeline Pannel (Gantt Bar) */}
                            <Box sx={{
                                position: 'relative',
                                flexGrow: 1,
                                overflow: 'hidden'
                            }}>
                                {/* Timeline Grid Lines */}
                                <Box sx={{
                                    position: 'absolute',
                                    top: 0, bottom: 0, left: 0, right: 0,
                                    backgroundImage: `linear-gradient(to right, #30363D 1px, transparent 1px)`,
                                    backgroundSize: `${dayWidth}px 100%`,
                                    opacity: 0.3
                                }} />

                                {/* The Gantt Bar */}
                                {offsetDays > -30 && ( // Just to show something on screen
                                    <Tooltip title={`Risk Level: ${riskLevel} - AI predicts delivery in ${durationDays} days`}>
                                        <Box sx={{
                                            position: 'absolute',
                                            left: Math.max(0, offsetDays * dayWidth + 10),
                                            width: Math.max(50, durationDays * dayWidth),
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            height: 24,
                                            backgroundColor: `${getRiskColor()}20`,
                                            border: `1px solid ${getRiskColor()}80`,
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            px: 1.5,
                                            gap: 1,
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s ease',
                                            '&:hover': {
                                                transform: 'translateY(-50%) scale(1.02)'
                                            }
                                        }}>
                                            {getRiskIcon()}
                                            <Typography noWrap sx={{ color: getRiskColor(), fontSize: 11, fontWeight: 600 }}>
                                                {article.macroStatus.replace('_', ' ')}
                                            </Typography>
                                        </Box>
                                    </Tooltip>
                                )}
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
}

