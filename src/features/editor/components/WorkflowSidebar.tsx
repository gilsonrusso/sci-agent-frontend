import { Box, Typography, Button, Stepper, Step, StepLabel } from '@mui/material';
import { Send, CheckCircle, RadioButtonUnchecked, PlayCircleFilled } from '@mui/icons-material';
import type { Article, MacroStatus } from '../../management/types/workflow';

interface WorkflowSidebarProps {
    article: Article;
    onRequestReview?: () => void;
}

const STAGES: { value: MacroStatus; label: string }[] = [
    { value: 'IDEATION', label: '1. Ideação' },
    { value: 'RESEARCH', label: '2. Pesquisa' },
    { value: 'WRITING', label: '3. Escrita' },
    { value: 'AI_REVIEW', label: '4. Revisão IA' },
    { value: 'HUMAN_REVIEW', label: '5. Revisão Humana' },
    { value: 'APPROVED', label: '6. Aprovado' },
];

export default function WorkflowSidebar({ article, onRequestReview }: WorkflowSidebarProps) {
    const currentStageIndex = STAGES.findIndex(s => s.value === article.macroStatus);

    return (
        <Box sx={{
            height: '100%',
            backgroundColor: '#0D1117',
            display: 'flex',
            flexDirection: 'column',
            borderLeft: '1px solid #30363D'
        }}>
            <Box sx={{ p: 2, borderBottom: '1px solid #30363D', backgroundColor: '#161B22' }}>
                <Typography variant="subtitle2" sx={{ color: '#C9D1D9', fontWeight: 600, textTransform: 'uppercase', fontSize: 12 }}>
                    Workflow Status
                </Typography>
            </Box>

            <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto' }}>
                <Stepper activeStep={currentStageIndex} orientation="vertical" sx={{
                    '& .MuiStepConnector-line': { borderColor: '#30363D' },
                }}>
                    {STAGES.map((stage, index) => {
                        const isCompleted = index < currentStageIndex;
                        const isActive = index === currentStageIndex;

                        let IconComponent = RadioButtonUnchecked;
                        let iconColor = '#8B949E';

                        if (isCompleted) {
                            IconComponent = CheckCircle;
                            iconColor = '#238636';
                        } else if (isActive) {
                            IconComponent = PlayCircleFilled;
                            iconColor = '#58A6FF';
                        }

                        return (
                            <Step key={stage.value} completed={isCompleted}>
                                <StepLabel
                                    StepIconComponent={() => <IconComponent sx={{ color: iconColor, fontSize: 20 }} />}
                                    sx={{
                                        '& .MuiStepLabel-label': {
                                            color: isActive ? '#C9D1D9' : '#8B949E',
                                            fontWeight: isActive ? 600 : 400,
                                            '&.Mui-completed': { color: '#8B949E' }
                                        }
                                    }}
                                >
                                    {stage.label}
                                </StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
            </Box>

            <Box sx={{ p: 2, borderTop: '1px solid #30363D', backgroundColor: '#161B22' }}>
                <Button
                    fullWidth
                    variant="contained"
                    endIcon={<Send />}
                    onClick={onRequestReview}
                    disabled={article.macroStatus === 'HUMAN_REVIEW' || article.macroStatus === 'APPROVED'}
                    sx={{
                        backgroundColor: '#238636',
                        color: '#fff',
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': { backgroundColor: '#2EA043' },
                        '&.Mui-disabled': {
                            backgroundColor: '#23863650',
                            color: '#ffffff50'
                        }
                    }}
                >
                    {article.macroStatus === 'HUMAN_REVIEW' ? 'Aguardando Mentor'
                        : article.macroStatus === 'APPROVED' ? 'Finalizado'
                            : 'Submeter para Revisão'}
                </Button>
            </Box>
        </Box>
    );
}
