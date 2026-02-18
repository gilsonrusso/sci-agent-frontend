import { CheckCircle, HourglassEmpty, Pending, Cancel, Check } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { type ProjectTask, TaskStatus } from '../projectsApi';

interface TaskCardProps {
  task: ProjectTask;
  projectName?: string;
  isSupervisor: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export default function TaskCard({
  task,
  projectName,
  isSupervisor,
  onApprove,
  onReject,
}: TaskCardProps) {
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.DONE:
        return 'success';
      case TaskStatus.WAITING_APPROVAL:
        return 'warning';
      case TaskStatus.IN_PROGRESS:
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.DONE:
        return <CheckCircle fontSize='small' />;
      case TaskStatus.WAITING_APPROVAL:
        return <HourglassEmpty fontSize='small' />;
      case TaskStatus.IN_PROGRESS:
        return <Pending fontSize='small' />;
      default:
        return null;
    }
  };

  return (
    <Card sx={{ mb: 2, backgroundColor: '#212838' }}>
      <CardContent sx={{ pb: '16px !important' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
          <Box>
            <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
              {task.title}
            </Typography>
            {projectName && (
              <Typography variant='caption' color='text.secondary'>
                {projectName}
              </Typography>
            )}
          </Box>
          <Chip
            label={task.status.replace('_', ' ')}
            color={getStatusColor(task.status)}
            size='small'
            icon={getStatusIcon(task.status) || undefined}
          />
        </Box>

        {task.description && (
          <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
            {task.description}
          </Typography>
        )}

        {task.status === TaskStatus.WAITING_APPROVAL && isSupervisor && (
          <Stack direction='row' spacing={1} justifyContent='flex-end'>
            <Button
              size='small'
              variant='outlined'
              color='error'
              startIcon={<Cancel />}
              onClick={() => onReject(task.id)}
            >
              Reject
            </Button>
            <Button
              size='small'
              variant='contained'
              color='success'
              startIcon={<Check />}
              onClick={() => onApprove(task.id)}
            >
              Approve
            </Button>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
