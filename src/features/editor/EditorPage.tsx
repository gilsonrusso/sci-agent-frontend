import {
  Menu as MenuIcon,
  PlayArrow as PlayIcon,
  SmartToy as SmartToyIcon,
} from '@mui/icons-material';
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { Group, Panel, Separator } from 'react-resizable-panels';
import { useNavigate, useParams } from 'react-router';
import { projectsApi } from '../dashboard/projectsApi';
import { useAppSelector } from '../../store/hooks';
import { stringToColor } from '../../lib/colors';
import ConnectedUsers from './components/ConnectedUsers';

// CodeMirror & Yjs
import { yCollab } from 'y-codemirror.next';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';
import { markdown } from '@codemirror/lang-markdown';
import { EditorState } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView, keymap } from '@codemirror/view';
import { basicSetup } from 'codemirror';

import { defaultKeymap, indentWithTab } from '@codemirror/commands';

import AIChatSidebar from './components/AIChatSidebar';

export default function EditorPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  // Editor Ref
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  const [isSynced, setIsSynced] = useState(false);

  // PDF State
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Yjs Provider State
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);

  // Fetch Project Metadata (renamed loading variable to avoid conflict if needed, but existing is fine)
  const { data: project, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectsApi.getProject(projectId!),
    enabled: !!projectId,
  });

  // Handle Compile
  const handleCompile = async () => {
    if (!projectId) return;
    setIsCompiling(true);

    try {
      // Call API without content parameter, backend fetches from Yjs
      const pdfBlob = await projectsApi.compileProject(projectId, '');
      const url = URL.createObjectURL(pdfBlob);

      // Revoke old URL to fix memory leak
      setPdfUrl((oldUrl) => {
        if (oldUrl) URL.revokeObjectURL(oldUrl);
        return url;
      });
    } catch (error) {
      console.error('Compilation failed:', error);
      alert('Compilation failed! See console.');
    } finally {
      setIsCompiling(false);
    }
  };

  console.log('Component Rendered');
  console.log('projectId:', projectId);
  console.log('user:', user);

  // 1. Initialize Yjs Provider & Data Layer
  useEffect(() => {
    if (!projectId || !user) return;
    if (providerRef.current) return;
    console.log('Creating WebSocket Provider');

    const ydoc = new Y.Doc();

    // Construct WS URL dynamically
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname === 'localhost' ? 'localhost:8000' : window.location.host;

    // User Feedback: Simplify URL to avoid duplication.
    // Backend expects: /api/v1/editor/ws/{roomName}
    // y-websocket appends roomName automatically.
    const wsUrl = `${protocol}//${host}/api/v1/editor/ws`;

    const wsProvider = new WebsocketProvider(wsUrl, projectId, ydoc);

    // FIX: Client-side seeding for first connection if backend hydration is slow/missed.
    wsProvider.on('sync', (isSynced: boolean) => {
      if (isSynced) {
        const ytext = ydoc.getText('codemirror');
        if (ytext.length === 0 && project?.content) {
          console.log('[Editor] Seeding YDoc from DB content (First Load Fix)');
          ytext.insert(0, project.content);
        }
      }
    });

    providerRef.current = wsProvider;
    setProvider(wsProvider);

    return () => {
      // In Strict Mode, this might be called immediately.
      // Ideally we'd use a ref to prevent double-init, but for now specific cleanup:
      wsProvider.awareness.setLocalState(null); // Explicit cleanup
      wsProvider.destroy();
      ydoc.destroy();
      providerRef.current = null;
      setProvider(null);
    };
  }, [projectId, user]);

  // 2. Set User Awareness
  useEffect(() => {
    if (!provider || !user) return;

    const userColor = stringToColor(user.full_name || user.email);
    provider.awareness.setLocalStateField('user', {
      name: user.full_name || user.email,
      color: userColor,
    });
  }, [provider, user]);

  // 3. Initialize CodeMirror View (Only after Sync)
  useEffect(() => {
    if (!provider) return;
    if (!editorRef.current) return;
    if (viewRef.current) return; // evita recriação

    console.log('[Editor] Creating EditorView after sync');

    const ytext = provider.doc.getText('codemirror');

    const startState = EditorState.create({
      // doc: ytext.toString(), // Reverted: Ensure content is visible immediately. yCollab handles subsequent sync.
      extensions: [
        basicSetup,
        keymap.of([...defaultKeymap, indentWithTab]),
        markdown(),
        EditorView.lineWrapping,
        oneDark,
        yCollab(ytext, provider.awareness),
        // EditorView.updateListener.of(() => {}),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current!,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [provider]);

  // Auto-compile on load (OPTIONAL: Maybe remove this?)
  const hasCompiledRef = useRef(false);

  useEffect(() => {
    if (hasCompiledRef.current) return;
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!project) {
    return <Typography>Project not found</Typography>;
  }

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      {/* Toolbar */}
      <AppBar
        position='static'
        color='default'
        sx={{ borderBottom: 1, borderColor: 'divider', boxShadow: 'none' }}
      >
        <Toolbar variant='dense'>
          <IconButton
            edge='start'
            color='inherit'
            aria-label='menu'
            sx={{ mr: 2 }}
            onClick={() => navigate('/dashboard')}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' color='inherit' component='div' sx={{ flexGrow: 1 }}>
            {project.title}
          </Typography>

          {/* Connected Users */}
          <ConnectedUsers provider={provider} />

          <Button
            variant='outlined'
            startIcon={<SmartToyIcon />}
            onClick={() => setIsChatOpen(!isChatOpen)}
            sx={{ mr: 2 }}
          >
            AI Assistant
          </Button>

          <Button
            variant='contained'
            color='success'
            startIcon={isCompiling ? <CircularProgress size={20} color='inherit' /> : <PlayIcon />}
            onClick={handleCompile}
            disabled={isCompiling}
          >
            {isCompiling ? 'Compiling...' : 'Recompile'}
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content: Split Pane */}
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <Group orientation='horizontal'>
          {/* Panel 1: Editor */}
          <Panel defaultSize={'50%'} minSize={'33%'} maxSize={'50%'}>
            <Box
              sx={{
                height: '100%',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box
                ref={editorRef}
                sx={{
                  flexGrow: 1,
                  overflow: 'auto',
                  '& .cm-editor': { height: '100%' },
                  '& .cm-scroller': { overflow: 'auto' },
                }}
              />
            </Box>
          </Panel>

          <Separator style={{ border: '1px solid #ccc' }} />

          {/* Panel 2: PDF */}
          <Panel defaultSize={'50%'} minSize={'33%'}>
            <Box
              sx={{
                height: '100%',
                bgcolor: '#525659',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {pdfUrl ? (
                <iframe
                  src={pdfUrl}
                  title='PDF Preview'
                  style={{ width: '100%', height: '100%', border: 'none' }}
                />
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: 'white',
                  }}
                >
                  <Typography>Click "Recompile" to generate PDF</Typography>
                </Box>
              )}
            </Box>
          </Panel>

          {/* Panel 3: Chat (Conditional) */}
          {isChatOpen && (
            <>
              <Separator style={{ border: '1px solid #ccc' }} />
              <Panel defaultSize={500} minSize={350} maxSize={800}>
                <AIChatSidebar
                  open={isChatOpen}
                  onClose={() => setIsChatOpen(false)}
                  projectId={projectId!}
                  getContext={() => viewRef.current?.state.doc.toString() || ''}
                />
              </Panel>
            </>
          )}
        </Group>
      </Box>
    </Box>
  );
}
