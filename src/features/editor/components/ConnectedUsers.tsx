import { Avatar, AvatarGroup, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import { WebsocketProvider } from 'y-websocket';
import { stringToColor } from '../../../lib/colors';

interface ConnectedUsersProps {
  provider: WebsocketProvider | null;
}

interface UserAwareness {
  user?: {
    name: string;
    color: string;
  };
}

export default function ConnectedUsers({ provider }: ConnectedUsersProps) {
  const [users, setUsers] = useState<UserAwareness[]>([]);

  useEffect(() => {
    if (!provider) return;

    const awareness = provider.awareness;

    const updateUsers = () => {
      const states = Array.from(awareness.getStates().values()) as UserAwareness[];
      setUsers(states.filter((s) => s.user));
    };

    updateUsers();

    awareness.on('change', updateUsers);

    return () => {
      awareness.off('change', updateUsers);
    };
  }, [provider]);

  if (!provider || users.length === 0) return null;

  return (
    <AvatarGroup max={4} sx={{ mr: 2 }}>
      {users.map((u, i) => (
        <Tooltip key={i} title={u.user?.name || 'Anonymous'}>
          <Avatar
            sx={{
              bgcolor: u.user?.color || stringToColor(u.user?.name || 'Anonymous'),
              width: 32,
              height: 32,
              fontSize: '0.875rem',
            }}
          >
            {u.user?.name?.charAt(0).toUpperCase()}
          </Avatar>
        </Tooltip>
      ))}
    </AvatarGroup>
  );
}
