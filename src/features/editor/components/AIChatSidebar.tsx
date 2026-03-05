import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import {
  Box,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatSidebarProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  getContext: () => string; // Callback to get current editor content
}

export default function AIChatSidebar({ onClose, projectId, getContext }: AIChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Placeholder for new Assistant Message
    const assistantMessage: Message = { role: 'assistant', content: '' };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const token =
        localStorage.getItem('access_token') ||
        JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.token;

      const response = await fetch('http://localhost:8000/api/v1/agent/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          project_id: projectId,
          message: userMessage.content,
          context: getContext(),
          chat_history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);

        setMessages((prev) => {
          const lastMsg = { ...prev[prev.length - 1] };
          lastMsg.content += chunkValue;
          return [...prev.slice(0, -1), lastMsg];
        });
      }
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Error: Failed to get response.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#0D1117',
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#161B22', borderBottom: '1px solid #30363D' }}>
        <Typography variant='h6' sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#C9D1D9', fontSize: 16 }}>
          <SmartToyIcon sx={{ color: '#D2A8FF' }} /> SciAgent Copilot
        </Typography>
        <IconButton onClick={onClose} sx={{ color: '#8B949E' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <List sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
        {messages.map((msg, index) => (
          <ListItem
            key={index}
            sx={{
              flexDirection: 'column',
              alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <Paper
              sx={{
                p: 1.5,
                maxWidth: '90%',
                bgcolor: msg.role === 'user' ? '#1F6FEB' : '#161B22',
                color: msg.role === 'user' ? '#FFFFFF' : '#C9D1D9',
                border: msg.role === 'user' ? 'none' : '1px solid #30363D',
                borderRadius: 2,
              }}
            >
              <Typography variant='body2' component='div'>
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </Typography>
            </Paper>
            <Typography variant='caption' sx={{ mt: 0.5, color: '#8B949E' }}>
              {msg.role === 'user' ? (
                <PersonIcon fontSize='small' />
              ) : (
                <SmartToyIcon fontSize='small' sx={{ color: '#D2A8FF' }} />
              )}
            </Typography>
          </ListItem>
        ))}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
            <CircularProgress size={20} />
          </Box>
        )}
        <div ref={messagesEndRef} />
      </List>

      <Box sx={{ p: 2, borderTop: '1px solid #30363D', backgroundColor: '#161B22' }}>
        <TextField
          fullWidth
          size='small'
          placeholder='Ask about your paper...'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          disabled={isLoading}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: '#C9D1D9',
              backgroundColor: '#0D1117',
              '& fieldset': { borderColor: '#30363D' },
              '&:hover fieldset': { borderColor: '#8B949E' },
              '&.Mui-focused fieldset': { borderColor: '#58A6FF' },
            }
          }}
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                sx={{ color: '#58A6FF', '&.Mui-disabled': { color: '#30363D' } }}
              >
                <SendIcon />
              </IconButton>
            ),
          }}
        />
      </Box>
    </Box>
  );
}
