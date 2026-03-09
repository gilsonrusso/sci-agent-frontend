import { Box, Button, Typography, List, ListItem, ListItemButton, ListItemText, IconButton, useTheme, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Add, ChatBubbleOutline, DeleteOutline } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { onboardingApi } from '../onboardingApi';

interface Session {
    id: string;
    title: string;
    updated_at: string;
}

export default function OnboardingSidebar({ isOpen, onToggle: _ }: { isOpen: boolean, onToggle: () => void }) {
    const navigate = useNavigate();
    const { conversationId } = useParams();
    const theme = useTheme();

    const [sessions, setSessions] = useState<Session[]>([]);
    const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

    useEffect(() => {
        // Fetch sessions from new API endpoint
        const fetchSessions = async () => {
            try {
                const response = await onboardingApi.getSessions();
                if (Array.isArray(response)) {
                    setSessions(response);
                } else {
                    setSessions([]);
                }
            } catch (error) {
                console.error("Failed to load chat sessions", error);
            }
        };

        fetchSessions();
    }, [conversationId]); // Re-fetch when we change conversations just to ensure updated titles

    const handleNewChat = () => {
        navigate('/onboarding');
    };

    const handleSelectChat = (id: string) => {
        navigate(`/onboarding/c/${id}`);
    };

    const handleDeleteClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setSessionToDelete(id);
    };

    const confirmDelete = async () => {
        if (!sessionToDelete) return;

        try {
            await onboardingApi.deleteSession(sessionToDelete);
            setSessions(prev => prev.filter(s => s.id !== sessionToDelete));
            if (conversationId === sessionToDelete) {
                navigate('/onboarding');
            }
        } catch (error) {
            console.error("Failed to delete chat session", error);
        } finally {
            setSessionToDelete(null);
        }
    };

    const cancelDelete = () => {
        setSessionToDelete(null);
    };

    return (
        <Box
            sx={{
                width: isOpen ? 280 : 0,
                flexShrink: 0,
                height: '100vh',
                bgcolor: 'background.paper',
                borderRight: isOpen ? `1px solid ${theme.palette.divider}` : 'none',
                display: 'flex',
                flexDirection: 'column',
                transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Button
                    startIcon={<Add />}
                    onClick={handleNewChat}
                    variant="contained"
                    sx={{
                        flexGrow: 1,
                        justifyContent: 'flex-start',
                        borderRadius: '24px',
                        bgcolor: 'background.default',
                        color: 'text.primary',
                        boxShadow: 'none',
                        '&:hover': {
                            bgcolor: 'action.hover',
                            boxShadow: 'none',
                        },
                        textTransform: 'none',
                        mr: 1,
                        py: 1
                    }}
                >
                    Novo Chat
                </Button>
            </Box>

            <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 2, mt: 1 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, mb: 1, display: 'block', px: 2 }}>
                    Recentes
                </Typography>
                <List sx={{ pt: 0 }}>
                    {sessions.map((session) => (
                        <ListItem key={session.id} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                selected={conversationId === session.id}
                                onClick={() => handleSelectChat(session.id)}
                                sx={{
                                    borderRadius: '8px',
                                    '&.Mui-selected': {
                                        bgcolor: 'action.selected',
                                        '&:hover': { bgcolor: 'action.focus' }
                                    }
                                }}
                            >
                                <ChatBubbleOutline sx={{ fontSize: '1.2rem', mr: 2, color: 'text.secondary' }} />
                                <ListItemText
                                    primary={session.title}
                                    slotProps={{
                                        primary: {
                                            variant: 'body2',
                                            noWrap: true,
                                            fontWeight: conversationId === session.id ? 600 : 400
                                        }
                                    }}
                                />
                            </ListItemButton>
                            <IconButton
                                size="small"
                                onClick={(e) => handleDeleteClick(e, session.id)}
                                sx={{
                                    position: 'absolute',
                                    right: 8,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    opacity: 0.6,
                                    '&:hover': { opacity: 1, color: 'error.main' }
                                }}
                            >
                                <DeleteOutline fontSize="small" />
                            </IconButton>
                        </ListItem>
                    ))}
                    {sessions.length === 0 && (
                        <Typography variant="body2" sx={{ color: 'text.secondary', p: 2 }}>
                            Nenhuma conversa recente.
                        </Typography>
                    )}
                </List>
            </Box>

            <Dialog
                open={!!sessionToDelete}
                onClose={cancelDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Excluir conversa?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Tem certeza que deseja excluir esta conversa? Esta ação não pode ser desfeita.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete} color="inherit">Cancelar</Button>
                    <Button onClick={confirmDelete} color="error" autoFocus>
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
