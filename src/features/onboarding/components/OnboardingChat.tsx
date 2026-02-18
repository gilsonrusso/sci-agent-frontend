import { RecordVoiceOverTwoTone, Send, SmartToyTwoTone } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Container,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { v4 as uuidv4 } from 'uuid';
import { onboardingApi, type Article, type ChatMessage, type RoadmapTask } from '../onboardingApi';

export default function OnboardingChat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Olá! Sou a SciAgent. Posso ajudar você a planejar seu novo projeto de pesquisa. Qual é o tema de seu interesse?',
    },
  ]);
  const [suggestedArticles, setSuggestedArticles] = useState<Article[]>([]);
  const [selectedArticles, setSelectedArticles] = useState<Article[]>([]);
  const [roadmap, setRoadmap] = useState<RoadmapTask[]>([]);
  const [projectTitle, setProjectTitle] = useState<string>('');
  const [projectStructure, setProjectStructure] = useState<{ abstract: string } | undefined>(
    undefined,
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Generate unique ID per session to avoid state collisions
  const conversationId = useState(() => uuidv4())[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: (msg: string) =>
      onboardingApi.sendMessage(msg, {
        conversation_id: conversationId,
        topic: messages.find((m) => m.role === 'user')?.content, // Simple context passing
        selected_articles: selectedArticles,
      }),
    onSuccess: (data) => {
      setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);

      if (data.structured_data?.suggested_articles) {
        setSuggestedArticles(data.structured_data.suggested_articles);
      }

      if (data.structured_data?.roadmap) {
        setRoadmap(data.structured_data.roadmap);
      }

      if (data.structured_data?.project_title) {
        setProjectTitle(data.structured_data.project_title);
      }

      if (data.structured_data?.project_structure) {
        setProjectStructure(data.structured_data.project_structure);
      }
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: onboardingApi.createProjectFromOnboarding,
    onSuccess: (project) => {
      // Navigate to the new project
      navigate(`/editor/${project.id}`);
    },
  });

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    chatMutation.mutate(userMsg);
  };

  const handleArticleToggle = (article: Article) => {
    if (selectedArticles.find((a) => a.url === article.url)) {
      setSelectedArticles((prev) => prev.filter((a) => a.url !== article.url));
    } else {
      setSelectedArticles((prev) => [...prev, article]);
    }
  };

  const handleCreateProjectParams = () => {
    const topic = messages.find((m) => m.role === 'user')?.content || 'New Project';
    createProjectMutation.mutate({
      topic,
      roadmap,
      selected_articles: selectedArticles,
      project_title: projectTitle || topic, // Fallback to topic if title missing
      project_structure: projectStructure,
    });
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
          {messages.map((msg, idx) => (
            <ListItem
              key={idx}
              sx={{ justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
            >
              <Paper
                sx={{
                  p: 2,
                  maxWidth: '80%',
                  backgroundColor: msg.role === 'user' ? '#3949AB' : '#212838',
                  color: '#fff',
                }}
              >
                <Stack direction='row' spacing={1}>
                  {msg.role === 'user' ? (
                    <RecordVoiceOverTwoTone sx={{ fontSize: '3rem' }} />
                  ) : (
                    <SmartToyTwoTone sx={{ fontSize: '3rem' }} />
                  )}
                  <Typography variant='body1'>{msg.content}</Typography>
                </Stack>
              </Paper>
            </ListItem>
          ))}
          {chatMutation.isPending && (
            <ListItem>
              <CircularProgress size={20} />
            </ListItem>
          )}
          <div ref={messagesEndRef} />
        </List>

        {/* Structured Data Display */}
        {suggestedArticles.length > 0 && roadmap.length === 0 && (
          <Box sx={{ mt: 2, p: 2, border: '1px solid #333', borderRadius: 2 }}>
            <Typography variant='h6' sx={{ mb: 1 }}>
              Artigos Sugeridos
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              Selecione artigos relevantes para incluir no contexto do seu projeto.
            </Typography>
            <Stack spacing={1} sx={{ mt: 1 }}>
              {suggestedArticles.map((article, idx) => (
                <Card key={idx} variant='outlined' sx={{ backgroundColor: 'transparent' }}>
                  <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={!!selectedArticles.find((a) => a.url === article.url)}
                          onChange={() => handleArticleToggle(article)}
                        />
                      }
                      label={
                        <Box>
                          <Typography variant='subtitle2'>{article.title}</Typography>
                          <Typography variant='caption' color='text.secondary'>
                            {article.authors.join(', ')} ({article.year})
                          </Typography>
                        </Box>
                      }
                    />
                  </CardContent>
                </Card>
              ))}
            </Stack>
            <Button
              variant='contained'
              sx={{ mt: 2 }}
              onClick={() => {
                setMessages((prev) => [
                  ...prev,
                  { role: 'user', content: `Eu selecionei ${selectedArticles.length} artigos.` },
                ]);
                chatMutation.mutate(`Eu selecionei ${selectedArticles.length} artigos.`);
                // Clear suggestions to hide this block, giving disabling effect
                setSuggestedArticles([]);
              }}
              disabled={selectedArticles.length === 0}
            >
              Confirmar Seleção
            </Button>
          </Box>
        )}

        {roadmap.length > 0 && (
          <Box sx={{ mt: 2, p: 2, border: '1px solid #10B981', borderRadius: 2 }}>
            <Typography variant='h6' sx={{ mb: 1, color: '#10B981' }}>
              Roadmap Proposto
            </Typography>
            <Stack spacing={1}>
              {roadmap.map((task, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    p: 1,
                    backgroundColor: '#0F1419',
                  }}
                >
                  <Typography>{task.title}</Typography>
                  <Chip label={`Dia ${task.due_in_days}`} size='small' color='primary' />
                </Box>
              ))}
            </Stack>
            <Button
              variant='contained'
              color='success'
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleCreateProjectParams}
              disabled={createProjectMutation.isPending}
            >
              {createProjectMutation.isPending ? 'Criando...' : 'Criar Projeto'}
            </Button>
          </Box>
        )}
      </Paper>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          variant='outlined'
          placeholder='Digite sua mensagem...'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={chatMutation.isPending}
        />
        <IconButton
          color='primary'
          onClick={handleSend}
          disabled={chatMutation.isPending || !input.trim()}
          sx={{ backgroundColor: '#3949AB', '&:hover': { backgroundColor: '#283593' } }}
        >
          <Send sx={{ color: '#fff' }} />
        </IconButton>
      </Box>
    </Container>
  );
}
