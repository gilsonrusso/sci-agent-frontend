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
  Tooltip,
  Fade,
  Drawer
} from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { Group, Panel, Separator } from 'react-resizable-panels';
import { useParams } from 'react-router';
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
import WorkflowSidebar from './components/WorkflowSidebar';
import EditorProjectsSidebar from './components/EditorProjectsSidebar';
import { useWorkflowStore } from '../management/store/workflowStore';

export default function EditorPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const user = useAppSelector((state) => state.auth.user);

  // Workflow Store
  const { articles, requestApproval, currentUserRole } = useWorkflowStore();
  const article = articles.find(a => a.id === projectId) || articles[0]; // Fallback for demo

  // Permissions Logic
  const isLockedForAuthor = currentUserRole === 'AUTHOR' && ['HUMAN_REVIEW', 'APPROVED', 'SUBMITTED', 'AI_REVIEW'].includes(article.macroStatus);

  // Editor Ref
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  // PDF State
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isProjectsSidebarOpen, setIsProjectsSidebarOpen] = useState(false);

  // Modern UX States
  const [isZenMode, setIsZenMode] = useState(false);
  const [dailyWords] = useState(350); // Mock data for Progress Ring
  const dailyGoal = 500;
  const progressPercent = Math.min((dailyWords / dailyGoal) * 100, 100);

  // Yjs Provider State
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectsApi.getProject(projectId!),
    enabled: !!projectId,
  });

  // Global Keyboard Shortcuts (Zen Mode)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+B or Ctrl+B specifically for Zen Mode
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsZenMode(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
        EditorState.readOnly.of(isLockedForAuthor),
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
      {/* Toolbar - Hidden in Zen Mode */}
      <Fade in={!isZenMode} mountOnEnter unmountOnExit>
        <AppBar
          position='static'
          color='default'
          sx={{
            borderBottom: 1,
            borderColor: '#30363D',
            boxShadow: 'none',
            backgroundColor: '#161B22',
            color: '#C9D1D9'
          }}
        >
          <Toolbar variant='dense'>
            <IconButton
              edge='start'
              color='inherit'
              aria-label='menu'
              sx={{ mr: 2 }}
              onClick={() => setIsProjectsSidebarOpen(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant='h6' color='#F0F6FC' component='div' sx={{ flexGrow: 1, fontSize: 16 }}>
              {project.title}
            </Typography>

            {/* Daily Progress Ring */}
            <Tooltip title={`${dailyWords} / ${dailyGoal} words today`}>
              <Box sx={{ position: 'relative', display: 'inline-flex', mr: 3, alignItems: 'center', gap: 1, cursor: 'pointer' }}>
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                  <CircularProgress variant="determinate" value={100} size={28} sx={{ color: '#30363D' }} />
                  <CircularProgress
                    variant="determinate"
                    value={progressPercent}
                    size={28}
                    sx={{
                      color: progressPercent >= 100 ? '#238636' : '#58A6FF',
                      position: 'absolute',
                      left: 0
                    }}
                  />
                </Box>
                {progressPercent >= 100 ? (
                  <CheckCircleOutline sx={{ color: '#238636', fontSize: 18 }} />
                ) : (
                  <Typography variant="caption" sx={{ color: '#8B949E', fontWeight: 600 }}>{Math.round(progressPercent)}%</Typography>
                )}
              </Box>
            </Tooltip>

            {/* Connected Users */}
            <ConnectedUsers provider={provider} />

            <Button
              variant='outlined'
              startIcon={<SmartToyIcon />}
              onClick={() => setIsChatOpen(!isChatOpen)}
              sx={{
                mr: 2,
                color: '#D2A8FF',
                borderColor: '#D2A8FF50',
                textTransform: 'none',
                '&:hover': { borderColor: '#D2A8FF' }
              }}
            >
              Copilot
            </Button>

            <Button
              variant='contained'
              startIcon={isCompiling ? <CircularProgress size={20} color='inherit' /> : <PlayIcon />}
              onClick={handleCompile}
              disabled={isCompiling}
              sx={{
                backgroundColor: '#238636',
                color: '#ffffff',
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: 'none',
                '&:hover': { backgroundColor: '#2EA043', boxShadow: 'none' }
              }}
            >
              {isCompiling ? 'Compiling...' : 'Recompile'}
            </Button>
          </Toolbar>
        </AppBar>
      </Fade>

      {/* Main Content: Split Pane */}
      <Box sx={{ flexGrow: 1, overflow: 'hidden', backgroundColor: '#0D1117' }}>
        {/* Subtle hint for Zen Mode early on */}
        {isZenMode && (
          <Box sx={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, pointerEvents: 'none' }}>
            <Typography sx={{ color: '#8B949E', fontSize: 12, backgroundColor: '#161B2290', px: 2, py: 0.5, borderRadius: 5 }}>
              Zen Mode Active (Press Cmd+B to exit)
            </Typography>
          </Box>
        )}
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

          {/* Panel 3: Workflow Checklist (Hidden in Zen Mode) */}
          {!isZenMode && (
            <>
              <Separator style={{ border: '1px solid #30363D' }} />
              <Panel defaultSize={20} minSize={15} maxSize={30}>
                <WorkflowSidebar
                  article={article}
                  onRequestReview={() => {
                    requestApproval(article.id, 'HUMAN_REVIEW');
                    alert('Artigo enviado para revisão do Mentor/Coordenador com sucesso!');
                  }}
                />
              </Panel>
            </>
          )}

        </Group>
      </Box>

      {/* RAG/AI Drawer (Floating Top Layer) */}
      <Drawer
        anchor="right"
        open={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        variant="temporary"
        PaperProps={{
          sx: {
            width: { xs: '100vw', sm: 400, md: 500 },
            backgroundColor: '#0D1117',
            borderLeft: '1px solid #30363D'
          }
        }}
        slotProps={{
          backdrop: { sx: { backgroundColor: 'transparent' } }
        }}
      >
        <AIChatSidebar
          open={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          projectId={projectId!}
          getContext={() => viewRef.current?.state.doc.toString() || ''}
        />
      </Drawer>

      {/* Left Sidebar (Projects) */}
      <EditorProjectsSidebar
        open={isProjectsSidebarOpen}
        onClose={() => setIsProjectsSidebarOpen(false)}
        currentProjectId={projectId || ''}
      />
    </Box>
  );
}
