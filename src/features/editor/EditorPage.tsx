import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  AvatarGroup,
  Breadcrumbs,
  Link,
  Menu,
  MenuItem,
  Tooltip,
  Divider,
  Paper,
  Drawer,
} from '@mui/material';
import {
  PlayArrow,
  KeyboardArrowDown,
  FormatBold,
  FormatItalic,
  Functions,
  Image as ImageIcon,
  FormatQuote,
  History,
  Settings,
  Chat,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { Group, Panel, Separator } from 'react-resizable-panels';
import { AIChatSidebar } from './components/AIChatSidebar';
import { VersionHistory } from './components/VersionHistory';

const sampleLatex = `\\documentclass[12pt]{article}
\\usepackage{amsmath}
\\usepackage{graphicx}
\\usepackage{cite}

\\title{Quantum Computing Applications in Cryptography}
\\author{Dr. Jane Smith, Dr. Alex Martinez}
\\date{February 2026}

\\begin{document}

\\maketitle

\\begin{abstract}
This paper explores the revolutionary applications of quantum computing 
in modern cryptographic systems. We present novel approaches to 
post-quantum cryptography and analyze their efficiency compared to 
classical methods.
\\end{abstract}

\\section{Introduction}
Quantum computing represents a paradigm shift in computational power.
The ability to leverage quantum superposition and entanglement opens
new possibilities for both breaking and creating cryptographic systems.

\\subsection{Background}
Classical cryptography relies on computational complexity. However,
Shor's algorithm demonstrates that quantum computers can factor large
numbers exponentially faster than classical computers \\cite{shor1994}.

\\section{Methodology}
We implement our quantum algorithms using the following approach:

\\begin{equation}
H|0\\rangle = \\frac{1}{\\sqrt{2}}(|0\\rangle + |1\\rangle)
\\end{equation}

This Hadamard gate creates superposition, fundamental to quantum
computation.

\\subsection{Experimental Setup}
Our experiments were conducted on IBM's quantum computers with
the following parameters:
\\begin{itemize}
    \\item Qubits: 127
    \\item Gate fidelity: 99.9\\%
    \\item Coherence time: 100 μs
\\end{itemize}

\\section{Results}
The quantum key distribution protocol showed remarkable improvements:

\\begin{equation}
E_{\\text{eff}} = 1 - H(p)
\\end{equation}

where $H(p)$ represents the binary entropy function.

\\section{Discussion}
Our findings indicate that quantum-resistant cryptography is not only
feasible but necessary for future secure communications.

\\section{Conclusion}
Quantum computing will fundamentally transform cryptographic systems.
Preparation for post-quantum cryptography is essential.

\\bibliographystyle{plain}
\\bibliography{references}

\\end{document}`;

export default function EditorPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [compileMenu, setCompileMenu] = useState<null | HTMLElement>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [code] = useState(sampleLatex);

  const handleCompile = () => {
    console.log('Compiling LaTeX...');
    setCompileMenu(null);
  };

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#0F1419' }}
    >
      {/* Top Header */}
      <AppBar position='static' elevation={0} sx={{ backgroundColor: '#1A1F2E', zIndex: 1300 }}>
        <Toolbar>
          <IconButton
            edge='start'
            color='inherit'
            sx={{ mr: 2 }}
            onClick={() => navigate('/dashboard')}
          >
            <MenuIcon />
          </IconButton>

          <Breadcrumbs sx={{ flexGrow: 1 }} separator='›'>
            <Link
              underline='hover'
              color='inherit'
              sx={{ cursor: 'pointer' }}
              onClick={() => navigate('/dashboard')}
            >
              Projects
            </Link>
            <Typography color='text.primary'>Quantum Computing in Cryptography</Typography>
          </Breadcrumbs>

          <AvatarGroup
            max={4}
            sx={{ mr: 3, '& .MuiAvatar-root': { width: 32, height: 32, fontSize: 14 } }}
          >
            <Avatar sx={{ bgcolor: '#10B981' }}>JS</Avatar>
            <Avatar sx={{ bgcolor: '#3949AB' }}>AM</Avatar>
            <Avatar sx={{ bgcolor: '#F59E0B' }}>RK</Avatar>
          </AvatarGroup>

          <Button
            variant='contained'
            startIcon={<PlayArrow />}
            endIcon={<KeyboardArrowDown />}
            onClick={(e) => setCompileMenu(e.currentTarget)}
            sx={{
              backgroundColor: '#10B981',
              color: '#fff',
              fontWeight: 600,
              px: 3,
              '&:hover': {
                backgroundColor: '#059669',
              },
            }}
          >
            Recompile
          </Button>

          <Menu
            anchorEl={compileMenu}
            open={Boolean(compileMenu)}
            onClose={() => setCompileMenu(null)}
          >
            <MenuItem onClick={handleCompile}>Recompile from scratch</MenuItem>
            <MenuItem onClick={handleCompile}>Fast compile</MenuItem>
            <MenuItem onClick={handleCompile}>Download PDF</MenuItem>
          </Menu>

          <IconButton color='inherit' sx={{ ml: 1 }} onClick={() => setHistoryOpen(true)}>
            <History />
          </IconButton>
          <IconButton color='inherit' onClick={() => navigate(`/settings/${projectId}`)}>
            <Settings />
          </IconButton>
          <IconButton color='inherit' onClick={() => setChatOpen(!chatOpen)}>
            <Chat />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Toolbar */}
      <Box
        sx={{
          backgroundColor: '#1A1F2E',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          px: 2,
          py: 1,
          display: 'flex',
          gap: 1,
        }}
      >
        <Tooltip title='Bold'>
          <IconButton size='small' sx={{ color: 'text.secondary' }}>
            <FormatBold fontSize='small' />
          </IconButton>
        </Tooltip>
        <Tooltip title='Italic'>
          <IconButton size='small' sx={{ color: 'text.secondary' }}>
            <FormatItalic fontSize='small' />
          </IconButton>
        </Tooltip>
        <Divider orientation='vertical' flexItem sx={{ mx: 1 }} />
        <Tooltip title='Math Formula'>
          <IconButton size='small' sx={{ color: 'text.secondary' }}>
            <Functions fontSize='small' />
          </IconButton>
        </Tooltip>
        <Tooltip title='Insert Image'>
          <IconButton size='small' sx={{ color: 'text.secondary' }}>
            <ImageIcon fontSize='small' />
          </IconButton>
        </Tooltip>
        <Tooltip title='Citation'>
          <IconButton size='small' sx={{ color: 'text.secondary' }}>
            <FormatQuote fontSize='small' />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Main Editor Area */}
      <Box sx={{ flexGrow: 1, overflow: 'hidden', display: 'flex' }}>
        <Group orientation='horizontal'>
          {/* Left Pane - Code Editor */}
          <Panel defaultSize={50} minSize={30}>
            <Box
              sx={{
                height: '100%',
                backgroundColor: '#1E1E1E',
                overflow: 'auto',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 14,
              }}
            >
              <Box sx={{ p: 2 }}>
                {code.split('\n').map((line, idx) => (
                  <Box key={idx} sx={{ display: 'flex', minHeight: 20 }}>
                    <Box
                      sx={{
                        width: 50,
                        textAlign: 'right',
                        pr: 2,
                        color: '#858585',
                        userSelect: 'none',
                        flexShrink: 0,
                      }}
                    >
                      {idx + 1}
                    </Box>
                    <Box sx={{ color: '#D4D4D4', whiteSpace: 'pre', flexGrow: 1 }}>
                      {line.includes('\\documentclass') && (
                        <span>
                          <span style={{ color: '#C586C0' }}>\\documentclass</span>
                          <span style={{ color: '#CE9178' }}>[12pt]</span>
                          <span style={{ color: '#4EC9B0' }}>{'{'}</span>
                          <span style={{ color: '#CE9178' }}>article</span>
                          <span style={{ color: '#4EC9B0' }}>{'}'}</span>
                        </span>
                      )}
                      {line.includes('\\usepackage') && (
                        <span>
                          <span style={{ color: '#C586C0' }}>{line.split('{')[0]}</span>
                          <span style={{ color: '#4EC9B0' }}>{'{'}</span>
                          <span style={{ color: '#CE9178' }}>
                            {line.split('{')[1]?.replace('}', '')}
                          </span>
                          <span style={{ color: '#4EC9B0' }}>{'}'}</span>
                        </span>
                      )}
                      {line.includes('\\title') && (
                        <span>
                          <span style={{ color: '#C586C0' }}>\\title</span>
                          <span style={{ color: '#4EC9B0' }}>{'{'}</span>
                          <span style={{ color: '#CE9178' }}>
                            {line.split('{')[1]?.replace('}', '')}
                          </span>
                          <span style={{ color: '#4EC9B0' }}>{'}'}</span>
                        </span>
                      )}
                      {line.includes('\\section') && (
                        <span>
                          <span style={{ color: '#569CD6' }}>
                            {line.includes('\\subsection') ? '\\subsection' : '\\section'}
                          </span>
                          <span style={{ color: '#4EC9B0' }}>{'{'}</span>
                          <span style={{ color: '#CE9178' }}>
                            {line.split('{')[1]?.replace('}', '')}
                          </span>
                          <span style={{ color: '#4EC9B0' }}>{'}'}</span>
                        </span>
                      )}
                      {line.includes('\\begin') && (
                        <span>
                          <span style={{ color: '#C586C0' }}>\\begin</span>
                          <span style={{ color: '#4EC9B0' }}>{'{'}</span>
                          <span style={{ color: '#4FC1FF' }}>
                            {line.split('{')[1]?.replace('}', '')}
                          </span>
                          <span style={{ color: '#4EC9B0' }}>{'}'}</span>
                        </span>
                      )}
                      {line.includes('\\end') && (
                        <span>
                          <span style={{ color: '#C586C0' }}>\\end</span>
                          <span style={{ color: '#4EC9B0' }}>{'{'}</span>
                          <span style={{ color: '#4FC1FF' }}>
                            {line.split('{')[1]?.replace('}', '')}
                          </span>
                          <span style={{ color: '#4EC9B0' }}>{'}'}</span>
                        </span>
                      )}
                      {line.includes('\\item') && (
                        <span>
                          <span style={{ color: '#C586C0' }}>\\item</span>
                          <span style={{ color: '#D4D4D4' }}>{line.replace('\\item', '')}</span>
                        </span>
                      )}
                      {!line.includes('\\') && line.trim() !== '' && <span>{line}</span>}
                      {line.trim() === '' && <span> </span>}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Panel>

          <Separator
            style={{
              width: '8px',
              backgroundColor: '#0F1419',
              cursor: 'col-resize',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                width: '2px',
                height: '40px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '2px',
              }}
            />
          </Separator>

          {/* Right Pane - PDF Preview */}
          <Panel defaultSize={50} minSize={30}>
            <Box
              sx={{
                height: '100%',
                backgroundColor: '#525659',
                overflow: 'auto',
                display: 'flex',
                justifyContent: 'center',
                p: 4,
              }}
            >
              <Paper
                sx={{
                  width: '100%',
                  maxWidth: 800,
                  minHeight: '100%',
                  backgroundColor: '#fff',
                  color: '#000',
                  p: 6,
                  fontFamily: 'serif',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                }}
              >
                <Typography
                  variant='h4'
                  align='center'
                  sx={{ fontWeight: 700, mb: 1, color: '#000' }}
                >
                  Quantum Computing Applications in Cryptography
                </Typography>
                <Typography variant='body1' align='center' sx={{ mb: 0.5, color: '#000' }}>
                  Dr. Jane Smith, Dr. Alex Martinez
                </Typography>
                <Typography variant='body2' align='center' sx={{ mb: 4, color: '#000' }}>
                  February 2026
                </Typography>

                <Typography variant='h6' sx={{ fontWeight: 700, mb: 2, color: '#000' }}>
                  Abstract
                </Typography>
                <Typography paragraph sx={{ textAlign: 'justify', color: '#000' }}>
                  This paper explores the revolutionary applications of quantum computing in modern
                  cryptographic systems. We present novel approaches to post-quantum cryptography
                  and analyze their efficiency compared to classical methods.
                </Typography>

                <Typography variant='h6' sx={{ fontWeight: 700, mt: 3, mb: 2, color: '#000' }}>
                  1. Introduction
                </Typography>
                <Typography paragraph sx={{ textAlign: 'justify', color: '#000' }}>
                  Quantum computing represents a paradigm shift in computational power. The ability
                  to leverage quantum superposition and entanglement opens new possibilities for
                  both breaking and creating cryptographic systems.
                </Typography>

                <Typography
                  variant='subtitle1'
                  sx={{ fontWeight: 600, mt: 2, mb: 1, color: '#000' }}
                >
                  1.1 Background
                </Typography>
                <Typography paragraph sx={{ textAlign: 'justify', color: '#000' }}>
                  Classical cryptography relies on computational complexity. However, Shor's
                  algorithm demonstrates that quantum computers can factor large numbers
                  exponentially faster than classical computers [1].
                </Typography>

                <Typography variant='h6' sx={{ fontWeight: 700, mt: 3, mb: 2, color: '#000' }}>
                  2. Methodology
                </Typography>
                <Typography paragraph sx={{ textAlign: 'justify', color: '#000' }}>
                  We implement our quantum algorithms using the following approach:
                </Typography>
                <Box sx={{ my: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography
                    align='center'
                    sx={{ fontFamily: 'serif', fontStyle: 'italic', color: '#000' }}
                  >
                    H|0⟩ = 1/√2(|0⟩ + |1⟩)
                  </Typography>
                </Box>
                <Typography paragraph sx={{ textAlign: 'justify', color: '#000' }}>
                  This Hadamard gate creates superposition, fundamental to quantum computation.
                </Typography>
              </Paper>
            </Box>
          </Panel>
        </Group>

        {/* AI Chat Sidebar */}
        {chatOpen && (
          <Box sx={{ width: 360, flexShrink: 0, borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
            <AIChatSidebar onClose={() => setChatOpen(false)} />
          </Box>
        )}
      </Box>

      {/* Version History Drawer */}
      <Drawer anchor='right' open={historyOpen} onClose={() => setHistoryOpen(false)}>
        <VersionHistory onClose={() => setHistoryOpen(false)} />
      </Drawer>
    </Box>
  );
}
