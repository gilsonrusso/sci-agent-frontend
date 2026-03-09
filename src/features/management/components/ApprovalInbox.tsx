import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import { CheckCircleOutline, CancelOutlined, OpenInNew } from '@mui/icons-material';
import { useWorkflowStore } from '../store/workflowStore';
import { format } from 'date-fns';

export default function ApprovalInbox() {
  const { approvals, approveRequest, rejectRequest, setActiveArticle } = useWorkflowStore();

  if (approvals.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant='body1'>No pending approvals in your inbox.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant='h6' sx={{ fontWeight: 600, mb: 1 }}>
          Inbox: Pendências de Aprovação
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Revisões críticas necessárias para progressão de macro-fases de documentos no sistema.
          Assinaturas deferidas serão registradas no Audit Log.
        </Typography>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          border: 1,
          borderColor: 'divider',
          boxShadow: 'none',
          bgcolor: 'background.paper',
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell>Postulante</TableCell>
              <TableCell>Artigo / Documento</TableCell>
              <TableCell>Solicitação de Transição</TableCell>
              <TableCell>Data da Solicitação</TableCell>
              <TableCell align='right'>Ação Necessária</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {approvals.map((req) => (
              <TableRow key={req.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar
                      sx={{ width: 28, height: 28, fontSize: '12px', bgcolor: 'primary.main' }}
                    >
                      {req.requestedBy.name.charAt(0)}
                    </Avatar>
                    <Typography variant='body2' sx={{ fontWeight: 500 }}>
                      {req.requestedBy.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant='body2'>{req.articleTitle}</Typography>
                    <Tooltip title='View details'>
                      <IconButton size='small' onClick={() => setActiveArticle(req.articleId)}>
                        <OpenInNew sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {/* Simplified for demo, ideally we show From -> To */}
                    <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                      To
                    </Typography>
                    <Chip
                      label={req.requestedStage.replace('_', ' ')}
                      size='small'
                      color='info'
                      variant='outlined'
                      sx={{ fontSize: '12px', height: 22 }}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant='body2' color='text.secondary'>
                    {format(new Date(req.requestedAt), 'dd MMM yyyy, HH:mm')}
                  </Typography>
                </TableCell>
                <TableCell align='right'>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Button
                      size='small'
                      variant='outlined'
                      color='error'
                      startIcon={<CancelOutlined />}
                      onClick={() => rejectRequest(req.id)}
                    >
                      Rejeitar
                    </Button>
                    <Button
                      size='small'
                      variant='contained'
                      color='success'
                      startIcon={<CheckCircleOutline />}
                      onClick={() => approveRequest(req.id)}
                    >
                      Autorizar
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
