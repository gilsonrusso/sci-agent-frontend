import { Send, AutoAwesome, ArrowBack } from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  Paper,
  Stack,
  TextField,
  Typography,
  Select,
  MenuItem,
  Fade,
} from '@mui/material';
import { TuneRounded } from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { v4 as uuidv4 } from 'uuid';
import { sendMessage, resumeMessage, type InterruptActionRequest } from '../onboardingApi';


export default function OnboardingChat() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversationId = useState(() => {
    const saved = sessionStorage.getItem('sciagent_onboarding_id');
    if (saved) return saved;
    const newId = uuidv4();
    sessionStorage.setItem('sciagent_onboarding_id', newId);
    return newId;
  })[0];

  const [localMessages, setLocalMessages] = useState<any[]>([]);
  const [pendingInterruptsList, setPendingInterruptsList] = useState<any[]>([]);
  const [searchSource, setSearchSource] = useState('semantic_scholar');
  const [isLoading, setIsLoading] = useState(false);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [localMessages, pendingInterruptsList, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input;
    // Mostra o texto do usuário instantaneamente 
    setLocalMessages(prev => [...prev, { id: Date.now(), type: 'human', content: userText }]);
    setInput('');
    setIsLoading(true);

    try {
      const data = await sendMessage(conversationId, userText, searchSource);
      if (data.type === 'interrupt') {
        setPendingInterruptsList([{ id: data.id, value: data.interrupts }]);
      } else {
        setLocalMessages(prev => [...prev, {
          id: data.id,
          type: 'ai',
          agent_name: data.agent_name,
          content: data.text
        }]);
      }
    } catch (error) {
      console.error(error);
      setLocalMessages(prev => [...prev, { id: Date.now(), type: 'ai', agent_name: 'system', content: 'Erro ao conectar ao servidor.' }]);
    } finally {
      setIsLoading(false);
    }
  };



  const hitlRequest = pendingInterruptsList[0]?.value as any | undefined;
  const hitlInterruptId = pendingInterruptsList[0]?.id as string | undefined;

  // As in the docs, actionRequests is an array
  const pendingActions = hitlRequest?.action_requests || hitlRequest?.actionRequests || [];
  const isPendingInterrupt = pendingActions.length > 0;

  const handleApproveInterrupt = async () => {
    if (!hitlRequest || !hitlInterruptId) return;

    console.log("[handleApprove] Submitting resume. ID:", hitlInterruptId);

    setPendingInterruptsList([]);
    setIsLoading(true);

    try {
      const data = await resumeMessage(conversationId, hitlInterruptId, { type: "approve" }, searchSource);
      if (data.type === 'interrupt') {
        setPendingInterruptsList([{ id: data.id, value: data.interrupts }]);
      } else {
        setLocalMessages(prev => [...prev, {
          id: data.id,
          type: 'ai',
          agent_name: data.agent_name,
          content: data.text
        }]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectInterrupt = async (reason: string) => {
    if (!hitlRequest || !hitlInterruptId) return;

    console.log("[handleReject] Submitting resume. ID:", hitlInterruptId);

    setPendingInterruptsList([]);
    setIsLoading(true);

    try {
      const data = await resumeMessage(conversationId, hitlInterruptId, { type: "reject", message: reason }, searchSource);
      if (data.type === 'interrupt') {
        setPendingInterruptsList([{ id: data.id, value: data.interrupts }]);
      } else {
        setLocalMessages(prev => [...prev, {
          id: data.id,
          type: 'ai',
          agent_name: data.agent_name,
          content: data.text
        }]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100%',
        bgcolor: '#131314',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: '900px', flexGrow: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', px: { xs: 2, md: 4 }, pt: 4, pb: 2, '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#333', borderRadius: '4px' } }}>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/dashboard')}
            sx={{ color: '#a8c7fa', textTransform: 'none', borderRadius: '20px', '&:hover': { bgcolor: 'rgba(168, 199, 250, 0.08)' } }}
          >
            Voltar ao Dashboard
          </Button>
        </Box>
        {localMessages.length === 0 && (
          <Fade in={true} timeout={1000}>
            <Box sx={{ mt: '10vh', px: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 500, background: 'linear-gradient(90deg, #4285f4, #d96570, #bc65d9, #131314)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 1 }}>
                Olá!
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 500, color: '#444746' }}>
                Como Posso Ajudar?
              </Typography>
            </Box>
          </Fade>
        )}

        <List sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {localMessages.map((msg: any, idx: number) => {
            const isHuman = msg.type === 'human';
            return (
              <ListItem
                key={msg.id || idx}
                sx={{
                  justifyContent: isHuman ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start',
                  px: 0,
                  py: 1,
                }}
              >
                {isHuman ? (
                  <Box
                    sx={{
                      bgcolor: '#1e1f20',
                      color: '#e3e3e3',
                      px: 3,
                      py: 1.5,
                      borderRadius: '24px',
                      borderBottomRightRadius: '4px',
                      maxWidth: '85%',
                    }}
                  >
                    <Typography variant='body1' sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                      {msg.content}
                    </Typography>
                  </Box>
                ) : (
                  <Stack direction='row' spacing={2} sx={{ maxWidth: '100%' }}>
                    <AutoAwesome sx={{ color: '#a8c7fa', mt: 0.5, fontSize: '1.5rem' }} />
                    <Box sx={{ width: '100%', color: '#e3e3e3' }}>
                      {msg.agent_name && msg.agent_name !== 'system' && (
                        <Typography variant='caption' sx={{ display: 'block', mb: 0.5, color: '#a8c7fa', fontWeight: 500 }}>
                          {msg.agent_name}
                        </Typography>
                      )}
                      <Typography variant='body1' sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                        {msg.content}
                      </Typography>
                    </Box>
                  </Stack>
                )}
              </ListItem>
            );
          })}
          {isLoading && (
            <ListItem sx={{ justifyContent: 'flex-start', px: 0, py: 1 }}>
              <Stack direction='row' spacing={2} alignItems='center'>
                <AutoAwesome sx={{ color: '#a8c7fa', animation: 'spin 2s linear infinite', fontSize: '1.5rem' }} />
                <style>
                  {`
                    @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                    @keyframes pulse {
                      0% { opacity: 0.5; }
                      50% { opacity: 1; }
                      100% { opacity: 0.5; }
                    }
                  `}
                </style>
                <Typography variant='body1' sx={{ color: '#a8c7fa', animation: 'pulse 1.5s ease-in-out infinite' }}>
                  Pensando...
                </Typography>
              </Stack>
            </ListItem>
          )}

          {isPendingInterrupt && (
            <ListItem sx={{ justifyContent: 'center', px: 0, mt: 2 }}>
              <Box sx={{ width: '100%', p: 3, border: '1px solid #1e1f20', borderRadius: '16px', backgroundColor: '#131314' }}>
                <Typography variant='subtitle1' color='#a8c7fa' sx={{ fontWeight: 600, mb: 1 }}>
                  Ação Requer Aprovação
                </Typography>
                {pendingActions.map((action: InterruptActionRequest, i: number) => (
                  <Box key={i} sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: '#e3e3e3', mb: 1 }}>
                      Permitir ação: <strong>{action.name || 'Ferramenta'}</strong>?
                    </Typography>
                    {action.description && (
                      <Typography variant="body2" sx={{ color: '#8e8e8e', mb: 2, whiteSpace: 'pre-wrap' }}>
                        {action.description}
                      </Typography>
                    )}
                    <Stack direction="row" spacing={2}>
                      <Button variant="contained" sx={{ bgcolor: '#a8c7fa', color: '#000', '&:hover': { bgcolor: '#8ab4f8' }, borderRadius: '20px', textTransform: 'none', px: 3 }} onClick={() => handleApproveInterrupt()}>
                        Aprovar
                      </Button>
                      <Button variant="outlined" sx={{ color: '#e3e3e3', borderColor: '#5f6368', '&:hover': { borderColor: '#e3e3e3', bgcolor: 'rgba(255,255,255,0.05)' }, borderRadius: '20px', textTransform: 'none', px: 3 }} onClick={() => handleRejectInterrupt("Usuário rejeitou.")}>
                        Rejeitar
                      </Button>
                    </Stack>
                  </Box>
                ))}
              </Box>
            </ListItem>
          )}

          <div ref={messagesEndRef} />
        </List>
      </Box>

      {/* Input Section */}
      <Box sx={{ width: '100%', maxWidth: '900px', p: 2, pb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: '800px',
            minHeight: '60px',
            bgcolor: '#1e1f20',
            borderRadius: '32px',
            display: 'flex',
            alignItems: 'flex-end',
            px: 2,
            py: 1.5,
            border: 'none',
            '&:focus-within': {
              bgcolor: '#282a2c'
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, mr: 1, height: '100%' }}>
            <Select
              value={searchSource}
              onChange={(e) => setSearchSource(e.target.value as string)}
              disabled={isLoading}
              variant="standard"
              disableUnderline
              displayEmpty
              IconComponent={() => null} // Remove o ícone padrão da setinha
              renderValue={(value) => (
                <Stack direction="row" spacing={1} alignItems="center">
                  <TuneRounded sx={{ fontSize: '1.2rem', color: '#e3e3e3' }} />
                  <Typography variant="body2" sx={{ color: '#e3e3e3', fontWeight: 500 }}>
                    {value === 'semantic_scholar' ? 'Ferramentas' : 'Ferramentas'}
                  </Typography>
                </Stack>
              )}
              sx={{
                bgcolor: '#333538',
                borderRadius: '24px',
                px: 2,
                py: 0.75,
                '& .MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center',
                  paddingRight: '0 !important',
                },
                '&:hover': {
                  bgcolor: '#3c3f43'
                }
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: '#1e1f20',
                    color: '#e3e3e3',
                    borderRadius: '16px',
                    mt: 1,
                    '& .MuiMenuItem-root': {
                      py: 1.5,
                      px: 2,
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.08)'
                      },
                      '&.Mui-selected': {
                        bgcolor: 'rgba(255,255,255,0.12)',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.16)'
                        }
                      }
                    }
                  }
                }
              }}
            >
              <MenuItem value="semantic_scholar">Semantic Scholar</MenuItem>
              <MenuItem value="openalex">OpenAlex Database</MenuItem>
            </Select>
          </Box>
          <TextField
            multiline
            maxRows={8}
            fullWidth
            variant="standard"
            placeholder="Pergunte ao Agente..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isLoading}
            InputProps={{
              disableUnderline: true,
              sx: { color: '#e3e3e3', py: 0.5, fontSize: '1rem', lineHeight: 1.5 }
            }}
          />
          <IconButton
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            sx={{
              mb: 0.5,
              ml: 1,
              bgcolor: input.trim() ? '#e3e3e3' : 'transparent',
              color: input.trim() ? '#131314' : '#5f6368',
              '&:hover': { bgcolor: input.trim() ? '#fff' : 'transparent' },
              transition: 'all 0.2s',
              '&.Mui-disabled': {
                color: '#5f6368',
                bgcolor: 'transparent'
              }
            }}
          >
            <Send sx={{ fontSize: '1.2rem' }} />
          </IconButton>
        </Paper>
      </Box>
    </Box>
  );
}
