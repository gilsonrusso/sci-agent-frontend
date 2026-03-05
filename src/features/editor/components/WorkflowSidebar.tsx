import { Box, Typography, Button, Stepper, Step, StepLabel, useTheme } from '@mui/material';
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
  const theme = useTheme();
  const currentStageIndex = STAGES.findIndex((s) => s.value === article.macroStatus);

  return (
    <Box
      sx={{
        height: '100%',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        borderLeft: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
        }}
      >
        <Typography
          variant='subtitle2'
          sx={{ color: 'text.primary', fontWeight: 600, textTransform: 'uppercase', fontSize: 12 }}
        >
          Workflow Status
        </Typography>
      </Box>

      <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto' }}>
        <Stepper
          activeStep={currentStageIndex}
          orientation='vertical'
          sx={{
            '& .MuiStepConnector-line': { borderColor: 'divider' },
          }}
        >
          {STAGES.map((stage, index) => {
            const isCompleted = index < currentStageIndex;
            const isActive = index === currentStageIndex;

            let IconComponent = RadioButtonUnchecked;
            let iconColor = theme.palette.text.secondary;

            if (isCompleted) {
              IconComponent = CheckCircle;
              iconColor = theme.palette.success.main;
            } else if (isActive) {
              IconComponent = PlayCircleFilled;
              iconColor = theme.palette.info.main;
            }

            return (
              <Step key={stage.value} completed={isCompleted}>
                <StepLabel
                  StepIconComponent={() => (
                    <IconComponent sx={{ color: iconColor, fontSize: 20 }} />
                  )}
                  sx={{
                    '& .MuiStepLabel-label': {
                      color: isActive ? 'text.primary' : 'text.secondary',
                      fontWeight: isActive ? 600 : 400,
                      '&.Mui-completed': { color: 'text.secondary' },
                    },
                  }}
                >
                  {stage.label}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Box>

      <Box
        sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper' }}
      >
        <Button
          fullWidth
          variant='contained'
          endIcon={<Send />}
          onClick={onRequestReview}
          disabled={article.macroStatus === 'HUMAN_REVIEW' || article.macroStatus === 'APPROVED'}
          sx={{
            bgcolor: 'success.main',
            color: 'success.contrastText',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': { bgcolor: 'success.dark' },
            '&.Mui-disabled': {
              bgcolor: 'action.disabledBackground',
              color: 'action.disabled',
            },
          }}
        >
          {article.macroStatus === 'HUMAN_REVIEW'
            ? 'Aguardando Mentor'
            : article.macroStatus === 'APPROVED'
              ? 'Finalizado'
              : 'Submeter para Revisão'}
        </Button>
      </Box>
    </Box>
  );
}
