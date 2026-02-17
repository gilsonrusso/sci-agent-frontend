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
// @ts-ignore
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

  // PDF State
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Yjs Provider State
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);

  // Fetch Project Metadata
  const { data: project, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectsApi.getProject(projectId!),
    enabled: !!projectId,
  });

  // Initialize CodeMirror + Yjs
  useEffect(() => {
    if (!projectId || !editorRef.current || !user) return;

    // 1. Setup Yjs Document & Provider
    const ydoc = new Y.Doc();
    // Using localhost:8000 directly for now. In prod, use window.location or env var.
    const wsProvider = new WebsocketProvider(
      `ws://localhost:8000/api/v1/editor/${projectId}/ws`, // Base URL
      'sci-agent', // Room name
      ydoc,
    );

    setProvider(wsProvider);

    // Set User Awareness
    const userColor = stringToColor(user.full_name || user.email);
    wsProvider.awareness.setLocalStateField('user', {
      name: user.full_name || user.email,
      color: userColor,
    });

    const ytext = ydoc.getText('codemirror');

    // DEBUG: Log Yjs updates (Keep this for verification)
    ydoc.on('update', (update, origin) => {
      console.log('[YJS] Update received:', {
        byteLength: update.length,
        origin: origin,
      });
    });

    // B. Setup CodeMirror
    const startState = EditorState.create({
      doc: ytext.toString(), // Initial state is empty until sync
      extensions: [
        basicSetup,
        keymap.of([...defaultKeymap, indentWithTab]), // Correctly spread keymaps
        markdown(),
        EditorView.lineWrapping,
        oneDark, // Keeping oneDark as dracula is not imported. Replace with dracula if imported.
        // dracula, // Uncomment and import if using dracula theme
        // Yjs Binding
        yCollab(ytext, wsProvider.awareness),
        // No more updateListener for auto-save!
        EditorView.updateListener.of((_) => {
          // We can track local changes if needed for UI state, but not for saving.
        }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current!,
    });

    viewRef.current = view;

    // DEBUG: Expose to window
    (window as any).ydoc = ydoc;
    (window as any).ytext = ytext;
    (window as any).provider = wsProvider;

    // 3. Cleanup
    return () => {
      view.destroy();
      wsProvider.destroy();
      ydoc.destroy();
      setProvider(null);
    };
  }, [projectId, user]); // Re-run if user changes (e.g. login)

  // Auto-compile ... (removed for now)
  const hasCompiledRef = useRef(false);
  useEffect(() => {
    if (hasCompiledRef.current) return;
  }, []);

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
