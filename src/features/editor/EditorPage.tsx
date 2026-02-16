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
import { axiosClient } from '../../api/axiosClient';
import { projectsApi } from '../dashboard/projectsApi';

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

import { defaultKeymap } from '@codemirror/commands';

import AIChatSidebar from './components/AIChatSidebar';

export default function EditorPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Editor Ref
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  // PDF State
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Save State
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch Project Metadata (Title, etc.)
  const { data: project, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectsApi.getProject(projectId!),
    enabled: !!projectId,
  });

  // Save Function
  const saveContent = async (content: string) => {
    if (!projectId) return;
    setSaveStatus('saving');
    try {
      await projectsApi.updateProject(projectId, { content });
      setSaveStatus('saved');
    } catch (error) {
      console.error('Failed to save:', error);
      setSaveStatus('unsaved'); // Retry?
    }
  };

  // Debounced Save Trigger
  const triggerSave = (content: string) => {
    setSaveStatus('unsaved');
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveContent(content);
    }, 2000); // 2 seconds debounce
  };

  // Initialize CodeMirror + Yjs
  useEffect(() => {
    if (!projectId || !editorRef.current) return;

    // 1. Setup Yjs Document & Provider
    const ydoc = new Y.Doc();
    // Using localhost:8000 directly for now. In prod, use window.location or env var.
    const provider = new WebsocketProvider(
      `ws://localhost:8000/api/v1/editor/${projectId}`, // Base URL
      'ws', // Room Name (appended to URL -> .../projectId/ws)
      ydoc,
    );

    const ytext = ydoc.getText('codemirror');

    // 1.1 Load Initial Content from DB
    // Since our backend is stateless (for now), we trust the DB content on invalid/first load.
    // We insert it immediately so it shows up.
    if (ytext.toString().length === 0 && project?.content) {
      console.log('Loading initial content from DB...');
      ydoc.transact(() => {
        ytext.insert(0, project.content || '');
      });
    }

    // 2. Setup CodeMirror
    const state = EditorState.create({
      doc: ytext.toString(), // Initial content
      extensions: [
        basicSetup,
        keymap.of(defaultKeymap),
        markdown(), // Using markdown as syntax highlighter for now
        oneDark,
        yCollab(ytext, provider.awareness), // Yjs Collab Extension
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            triggerSave(update.state.doc.toString());
          }
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    // 3. Cleanup
    return () => {
      view.destroy();
      provider.destroy();
      ydoc.destroy();
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [projectId, project?.content]); // Re-run if project content loads

  // Auto-compile on load
  const hasCompiledRef = useRef(false);
  useEffect(() => {
    if (projectId && project?.content && !hasCompiledRef.current && viewRef.current) {
      console.log('Triggering auto-compile on load...');
      handleCompile();
      hasCompiledRef.current = true;
    }
  }, [projectId, project?.content]);

  // Handle Compile
  const handleCompile = async () => {
    if (!projectId) return;
    setIsCompiling(true);
    // Force save before compile
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    const content = viewRef.current?.state.doc.toString() || '';
    await saveContent(content);

    try {
      const response = await axiosClient.post(
        `/editor/${projectId}/compile`,
        { content },
        { responseType: 'blob' }, // Important for binary data
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
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

          {/* Save Status */}
          <Typography
            variant='caption'
            sx={{ mr: 2, color: 'text.secondary', fontStyle: 'italic' }}
          >
            {saveStatus === 'saved' && 'All changes saved'}
            {saveStatus === 'saving' && 'Saving...'}
            {saveStatus === 'unsaved' && 'Unsaved changes'}
          </Typography>

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
