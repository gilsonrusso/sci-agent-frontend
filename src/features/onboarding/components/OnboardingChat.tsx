import { RecordVoiceOverTwoTone, Send, SmartToyTwoTone } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  List,
  ListItem,
  Paper,
  Stack,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { sendMessage, resumeMessage, type InterruptActionRequest } from '../onboardingApi';


export default function OnboardingChat() {
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

  const renderMessageContent = (msg: any) => {
    // Default Text Display
    return (
      <Typography variant='body1' sx={{ whiteSpace: 'pre-wrap' }}>
        {msg.content}
      </Typography>
    );
  };

  const hitlRequest = pendingInterruptsList[0]?.value as any | undefined;
  const hitlInterruptId = pendingInterruptsList[0]?.id as string | undefined;

  // As in the docs, actionRequests is an array
  const pendingActions = hitlRequest?.action_requests || hitlRequest?.actionRequests || [];
  const isPendingInterrupt = pendingActions.length > 0;

  const handleApproveInterrupt = async (index: number) => {
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

  const handleRejectInterrupt = async (index: number, reason: string) => {
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
    <Container
      maxWidth='md'
      sx={{ height: '100vh', py: 4, display: 'flex', flexDirection: 'column' }}
    >
      <Typography variant='h4' sx={{ mb: 2, fontWeight: 700, color: '#10B981' }}>
        Assistente de Novo Projeto
      </Typography>

      <Paper sx={{ flexGrow: 1, mb: 2, p: 2, overflowY: 'auto', backgroundColor: '#1A1F2E' }}>
        <List>
          {localMessages.map((msg: any, idx: number) => (
            <ListItem
              key={msg.id || idx}
              sx={{
                justifyContent: msg.type === 'human' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-start',
              }}
            >
              <Paper
                sx={{
                  p: 2,
                  maxWidth: '85%',
                  backgroundColor: msg.type === 'human' ? '#3949AB' : '#212838',
                  color: '#fff',
                }}
              >
                <Stack direction='row' spacing={1}>
                  {msg.type === 'human' ? (
                    <RecordVoiceOverTwoTone sx={{ fontSize: '2rem' }} />
                  ) : (
                    <SmartToyTwoTone sx={{ fontSize: '2rem' }} />
                  )}
                  <Box sx={{ width: '100%' }}>
                    {msg.name && (
                      <Typography variant='caption' sx={{ display: 'block', mb: 1, color: '#6ee7b7' }}>
                        [{msg.name}]
                      </Typography>
                    )}
                    {renderMessageContent(msg)}
                  </Box>
                </Stack>
              </Paper>
            </ListItem>
          ))}
          {isLoading && (
            <ListItem sx={{ justifyContent: 'flex-start' }}>
              <Paper sx={{ p: 2, backgroundColor: '#212838', display: 'flex', alignItems: 'center', gap: 2 }}>
                <CircularProgress size={20} sx={{ color: '#10B981' }} />
                <Typography variant='body2' color='#aaa'>O Agente está pensando (pode levar 1 a 3 minutos)...</Typography>
              </Paper>
            </ListItem>
          )}

          {isPendingInterrupt && (
            <ListItem sx={{ justifyContent: 'center' }}>
              <Box sx={{ width: '100%', mt: 2, p: 2, border: '1px solid #F59E0B', borderRadius: 2, backgroundColor: '#451A03' }}>
                <Typography variant='subtitle1' color='#FBBF24' gutterBottom>Ação Requer Aprovação do Usuário</Typography>
                {pendingActions.map((action: InterruptActionRequest, i: number) => (
                  <Box key={i} sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: '#fff' }}>
                      O fluxo pede para aprovar a ação: <strong>{action.name || 'Ferramenta'}</strong>
                    </Typography>
                    {action.description && (
                      <Typography variant="body2" sx={{ color: '#aaa', mt: 1, mb: 1, whiteSpace: 'pre-wrap' }}>
                        {action.description}
                      </Typography>
                    )}
                    <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                      <Button variant="contained" color="success" size="small" onClick={() => handleApproveInterrupt(i)}>
                        Aprovar
                      </Button>
                      <Button variant="contained" color="error" size="small" onClick={() => handleRejectInterrupt(i, "Usuário rejeitou.")}>
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
      </Paper>


      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
          <Select
            value={searchSource}
            onChange={(e) => setSearchSource(e.target.value as string)}
            disabled={isLoading}
            sx={{ backgroundColor: '#fff' }}
          >
            <MenuItem value="semantic_scholar">Semantic Scholar (Default)</MenuItem>
            <MenuItem value="openalex">OpenAlex Database</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          variant='outlined'
          size='small'
          placeholder='Digite sua mensagem...'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={isLoading}
        />
        <IconButton
          color='primary'
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          sx={{ backgroundColor: '#3949AB', '&:hover': { backgroundColor: '#283593' } }}
        >
          <Send sx={{ color: '#fff' }} />
        </IconButton>
      </Box>
    </Container>
  );
}
