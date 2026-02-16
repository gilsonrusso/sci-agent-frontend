import {
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Chip,
  Divider,
} from '@mui/material';
import { Close, History, Save, AutoFixHigh, Restore } from '@mui/icons-material';

interface VersionItem {
  id: number;
  type: 'auto' | 'manual' | 'ai';
  title: string;
  description: string;
  timestamp: string;
  changes: {
    additions: number;
    deletions: number;
  };
}

const mockVersions: VersionItem[] = [
  {
    id: 1,
    type: 'auto',
    title: 'Auto-save',
    description: 'Current version',
    timestamp: '2 minutes ago',
    changes: { additions: 3, deletions: 1 },
  },
  {
    id: 2,
    type: 'manual',
    title: 'Manual Save',
    description: 'Added methodology section',
    timestamp: '1 hour ago',
    changes: { additions: 45, deletions: 12 },
  },
  {
    id: 3,
    type: 'ai',
    title: 'AI Refactor',
    description: 'Improved introduction clarity',
    timestamp: '2 hours ago',
    changes: { additions: 18, deletions: 22 },
  },
  {
    id: 4,
    type: 'manual',
    title: 'Manual Save',
    description: 'Updated abstract',
    timestamp: '3 hours ago',
    changes: { additions: 8, deletions: 5 },
  },
  {
    id: 5,
    type: 'auto',
    title: 'Auto-save',
    description: 'Background section edits',
    timestamp: '5 hours ago',
    changes: { additions: 15, deletions: 8 },
  },
  {
    id: 6,
    type: 'ai',
    title: 'AI Refactor',
    description: 'Added recent citations',
    timestamp: '1 day ago',
    changes: { additions: 12, deletions: 3 },
  },
  {
    id: 7,
    type: 'manual',
    title: 'Manual Save',
    description: 'Initial draft',
    timestamp: '2 days ago',
    changes: { additions: 250, deletions: 0 },
  },
];

interface VersionHistoryProps {
  onClose: () => void;
}

export function VersionHistory({ onClose }: VersionHistoryProps) {
  const getTypeIcon = (type: VersionItem['type']) => {
    switch (type) {
      case 'auto':
        return <History fontSize='small' />;
      case 'manual':
        return <Save fontSize='small' />;
      case 'ai':
        return <AutoFixHigh fontSize='small' />;
    }
  };

  const getTypeColor = (type: VersionItem['type']) => {
    switch (type) {
      case 'auto':
        return 'default';
      case 'manual':
        return 'info';
      case 'ai':
        return 'secondary';
    }
  };

  return (
    <Box
      sx={{
        width: 400,
        height: '100%',
        backgroundColor: '#1A1F2E',
        display: 'flex',
        flexDirection: 'column',
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
          Version History
        </Typography>
        <IconButton size='small' onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      {/* Description */}
      <Box
        sx={{
          p: 2,
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Typography variant='body2' color='text.secondary'>
          Track all changes to your document. Click any version to view or restore.
        </Typography>
      </Box>

      {/* Version List */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <List sx={{ py: 0 }}>
          {mockVersions.map((version, index) => (
            <Box key={version.id}>
              <ListItem
                disablePadding
                secondaryAction={
                  <IconButton edge='end' size='small' title='Restore this version'>
                    <Restore fontSize='small' />
                  </IconButton>
                }
              >
                <ListItemButton>
                  <Box sx={{ width: '100%' }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Chip
                        icon={getTypeIcon(version.type)}
                        label={
                          version.type === 'auto'
                            ? 'Auto'
                            : version.type === 'manual'
                              ? 'Manual'
                              : 'AI'
                        }
                        size='small'
                        color={getTypeColor(version.type)}
                        sx={{ height: 24 }}
                      />
                      <Typography variant='caption' color='text.secondary'>
                        {version.timestamp}
                      </Typography>
                    </Box>

                    {/* Title & Description */}
                    <Typography variant='body2' sx={{ fontWeight: 500, mb: 0.5 }}>
                      {version.description}
                    </Typography>

                    {/* Changes */}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: '#10B981',
                          }}
                        />
                        <Typography variant='caption' color='text.secondary'>
                          +{version.changes.additions}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: '#EF4444',
                          }}
                        />
                        <Typography variant='caption' color='text.secondary'>
                          -{version.changes.deletions}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Diff Preview (for demonstration) */}
                    {index === 1 && (
                      <Box
                        sx={{
                          mt: 1,
                          p: 1,
                          backgroundColor: '#212838',
                          borderRadius: 1,
                          fontSize: 11,
                          fontFamily: 'JetBrains Mono, monospace',
                        }}
                      >
                        <Box sx={{ color: '#10B981', mb: 0.5 }}>
                          + \\subsection{'{'} Experimental Setup {'}'}
                        </Box>
                        <Box sx={{ color: '#10B981', mb: 0.5 }}>
                          + Our experiments were conducted on...
                        </Box>
                        <Box sx={{ color: '#EF4444', textDecoration: 'line-through' }}>
                          - The methodology follows standard...
                        </Box>
                      </Box>
                    )}
                  </Box>
                </ListItemButton>
              </ListItem>
              {index < mockVersions.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      </Box>
    </Box>
  );
}
