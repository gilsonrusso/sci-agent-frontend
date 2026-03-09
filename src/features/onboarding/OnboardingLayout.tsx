import { Box, IconButton, useTheme } from '@mui/material';
import { Menu } from '@mui/icons-material';
import { useState } from 'react';
import OnboardingSidebar from './components/OnboardingSidebar';
import OnboardingChat from './components/OnboardingChat';

export default function OnboardingLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const theme = useTheme();

    return (
        <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
            {/* Sidebar */}
            <OnboardingSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

            {/* Main Chat Area */}
            <Box sx={{ flexGrow: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
                {/* Toggle Button for Sidebar (floats on top left) */}
                {!isSidebarOpen && (
                    <IconButton
                        onClick={() => setIsSidebarOpen(true)}
                        sx={{
                            position: 'absolute',
                            top: 16,
                            left: 16,
                            zIndex: 10,
                            bgcolor: 'background.paper',
                            boxShadow: theme.shadows[2],
                            '&:hover': { bgcolor: 'action.hover' },
                        }}
                    >
                        <Menu />
                    </IconButton>
                )}

                {isSidebarOpen && (
                    <IconButton
                        onClick={() => setIsSidebarOpen(false)}
                        sx={{
                            position: 'absolute',
                            top: 16,
                            left: 16,
                            zIndex: 10,
                            bgcolor: 'transparent',
                            '&:hover': { bgcolor: 'action.hover' },
                        }}
                    >
                        <Menu />
                    </IconButton>
                )}

                <OnboardingChat />
            </Box>
        </Box>
    );
}
