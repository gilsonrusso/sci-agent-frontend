import { useState } from 'react';
import { Box, Typography, TextField, IconButton, Paper, Avatar, Chip } from '@mui/material';
import { Send, Close, SmartToy, Person } from '@mui/icons-material';

interface Message {
  id: number;
  sender: 'user' | 'ai';
  agent?: string;
  content: string;
  timestamp: string;
}

const mockMessages: Message[] = [
  {
    id: 1,
    sender: 'ai',
    agent: 'Researcher Agent',
    content:
      'Hello! I can help you with research, citations, and methodology. What would you like to work on?',
    timestamp: '10:30 AM',
  },
  {
    id: 2,
    sender: 'user',
    content: 'Can you help me improve the introduction section?',
    timestamp: '10:32 AM',
  },
  {
    id: 3,
    sender: 'ai',
    agent: 'Researcher Agent',
    content:
      'Sure! I noticed your introduction could benefit from:\n\n1. A stronger hook to capture reader attention\n2. More recent citations (2024-2026)\n3. Clear statement of the research gap\n\nWould you like me to suggest specific improvements?',
    timestamp: '10:32 AM',
  },
  {
    id: 4,
    sender: 'user',
    content: 'Yes, please suggest improvements for the first paragraph',
    timestamp: '10:33 AM',
  },
  {
    id: 5,
    sender: 'ai',
    agent: 'Researcher Agent',
    content:
      "Here's a revised version:\n\n```latex\nQuantum computing represents a paradigm shift that threatens the foundation of modern cryptography. Recent breakthroughs in quantum error correction \\cite{wilkes2024} and qubit scalability \\cite{chen2025} suggest that large-scale quantum computers may be realized within the next decade, necessitating immediate development of quantum-resistant cryptographic protocols.\n```\n\nThis adds urgency and recent citations. Shall I insert this?",
    timestamp: '10:34 AM',
  },
];

interface AIChatSidebarProps {
  onClose: () => void;
}

export function AIChatSidebar({ onClose }: AIChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [input, setInput] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('Researcher Agent');

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      sender: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        sender: 'ai',
        agent: selectedAgent,
        content: 'I understand your request. Let me analyze that and provide suggestions...',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <Box
      sx={{
        height: '100%',
        backgroundColor: '#1A1F2E',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant='h6' sx={{ fontWeight: 600 }}>
          AI Assistant
        </Typography>
        <IconButton size='small' onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      {/* Agent Selector */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          gap: 1,
          flexWrap: 'wrap',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Chip
          label='Researcher Agent'
          onClick={() => setSelectedAgent('Researcher Agent')}
          color={selectedAgent === 'Researcher Agent' ? 'primary' : 'default'}
          size='small'
        />
        <Chip
          label='Reviewer Agent'
          onClick={() => setSelectedAgent('Reviewer Agent')}
          color={selectedAgent === 'Reviewer Agent' ? 'primary' : 'default'}
          size='small'
        />
        <Chip
          label='Editor Agent'
          onClick={() => setSelectedAgent('Editor Agent')}
          color={selectedAgent === 'Editor Agent' ? 'primary' : 'default'}
          size='small'
        />
      </Box>

      {/* Messages */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              mb: 3,
              display: 'flex',
              flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
              alignItems: 'flex-start',
              gap: 1.5,
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: message.sender === 'user' ? '#3949AB' : '#10B981',
              }}
            >
              {message.sender === 'user' ? (
                <Person fontSize='small' />
              ) : (
                <SmartToy fontSize='small' />
              )}
            </Avatar>

            <Box sx={{ maxWidth: '85%' }}>
              {message.agent && (
                <Typography
                  variant='caption'
                  color='text.secondary'
                  sx={{ mb: 0.5, display: 'block' }}
                >
                  {message.agent}
                </Typography>
              )}
              <Paper
                sx={{
                  p: 1.5,
                  backgroundColor: message.sender === 'user' ? '#3949AB' : '#212838',
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant='body2'
                  sx={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontFamily: message.content.includes('```')
                      ? 'JetBrains Mono, monospace'
                      : 'inherit',
                    fontSize: message.content.includes('```') ? 12 : 14,
                  }}
                >
                  {message.content}
                </Typography>
              </Paper>
              <Typography
                variant='caption'
                color='text.secondary'
                sx={{ mt: 0.5, display: 'block' }}
              >
                {message.timestamp}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Input */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size='small'
            placeholder='Ask AI assistant...'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#212838',
              },
            }}
          />
          <IconButton
            color='primary'
            onClick={handleSend}
            sx={{
              backgroundColor: '#10B981',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#059669',
              },
            }}
          >
            <Send />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
