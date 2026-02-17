import { ArrowBack, Delete, PersonAdd, Save } from '@mui/icons-material';
import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Toolbar,
  Typography,
  Autocomplete,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ProjectRole, projectsApi } from '../dashboard/projectsApi';
import type { AxiosError } from 'axios';

export default function ProjectSettingsPage() {
  const navigate = useNavigate();
  const { id: projectId } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [emailToInvite, setEmailToInvite] = useState('');
  const [roleToInvite, setRoleToInvite] = useState<ProjectRole>(ProjectRole.VIEWER);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data: members } = useQuery({
    queryKey: ['projectMembers', projectId],
    queryFn: () => projectsApi.getMembers(projectId!),
    enabled: !!projectId,
  });

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: projectsApi.getUsers,
  });

  const addMemberMutation = useMutation({
    mutationFn: (data: { email: string; role: ProjectRole }) =>
      projectsApi.addMember(projectId!, data.email, data.role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectMembers', projectId] });
      setIsInviteOpen(false);
      setEmailToInvite('');
      setInviteError(null);
    },
    onError: (error: any) => {
      setInviteError(error.response?.data?.detail || 'Failed to add member');
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: (userId: string) => projectsApi.removeMember(projectId!, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectMembers', projectId] });
    },
  });

  const [projectInfo, setProjectInfo] = useState({
    title: 'Quantum Computing Applications in Cryptography',
    description: 'Research on post-quantum cryptography methods',
    targetJournal: 'Nature Quantum Information',
    deadline: '2026-06-30',
    keywords: 'quantum computing, cryptography, post-quantum',
  });

  const handleAddMember = () => {
    addMemberMutation.mutate({ email: emailToInvite, role: roleToInvite });
  };

  const handleRemoveMember = (userId: string) => {
    if (confirm('Are you sure you want to remove this member?')) {
      removeMemberMutation.mutate(userId);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0F1419' }}>
      {/* Top AppBar */}
      <AppBar position='static' elevation={0} sx={{ backgroundColor: '#1A1F2E' }}>
        <Toolbar>
          <IconButton edge='start' color='inherit' onClick={() => navigate(`/dashboard`)}>
            <ArrowBack />
          </IconButton>
          <Typography variant='h6' sx={{ flexGrow: 1, ml: 2 }}>
            Project Settings
          </Typography>
          <Button
            variant='contained'
            startIcon={<Save />}
            sx={{
              backgroundColor: '#10B981',
              '&:hover': { backgroundColor: '#059669' },
            }}
          >
            Save Changes
          </Button>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
        <Paper sx={{ backgroundColor: '#1A1F2E' }}>
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            sx={{
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              px: 3,
            }}
          >
            <Tab label='General' />
            <Tab label='Team Management' />
            <Tab label='Publishing' />
          </Tabs>

          <Box sx={{ p: 4 }}>
            {/* General Tab */}
            {activeTab === 0 && (
              <Box>
                <Typography variant='h6' sx={{ mb: 3, fontWeight: 600 }}>
                  Project Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    fullWidth
                    label='Project Title'
                    value={projectInfo.title}
                    onChange={(e) => setProjectInfo({ ...projectInfo, title: e.target.value })}
                  />
                  <TextField
                    fullWidth
                    label='Description'
                    multiline
                    rows={3}
                    value={projectInfo.description}
                    onChange={(e) =>
                      setProjectInfo({ ...projectInfo, description: e.target.value })
                    }
                  />
                  <TextField
                    fullWidth
                    label='Keywords'
                    helperText='Comma-separated keywords for your research'
                    value={projectInfo.keywords}
                    onChange={(e) => setProjectInfo({ ...projectInfo, keywords: e.target.value })}
                  />
                  <TextField
                    fullWidth
                    label='Submission Deadline'
                    type='date'
                    slotProps={{ inputLabel: { shrink: true } }}
                    value={projectInfo.deadline}
                    onChange={(e) => setProjectInfo({ ...projectInfo, deadline: e.target.value })}
                  />
                </Box>

                <Divider sx={{ my: 4 }} />

                <Typography variant='h6' sx={{ mb: 3, fontWeight: 600 }}>
                  Document Settings
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField fullWidth label='Document Class' defaultValue='article' />
                    <TextField fullWidth label='Font Size' defaultValue='12pt' />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField fullWidth label='Paper Size' defaultValue='letterpaper' />
                    <TextField fullWidth label='Bibliography Style' defaultValue='plain' />
                  </Box>
                </Box>
              </Box>
            )}

            {/* Team Management Tab */}
            {activeTab === 1 && (
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                  }}
                >
                  <Typography variant='h6' sx={{ fontWeight: 600 }}>
                    Team Members
                  </Typography>
                  <Button
                    variant='contained'
                    startIcon={<PersonAdd />}
                    sx={{ backgroundColor: '#3949AB' }}
                    onClick={() => setIsInviteOpen(true)}
                  >
                    Invite Member
                  </Button>
                </Box>

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Member</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell align='right'>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {members?.map((member) => (
                        <TableRow key={member.user_id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar sx={{ bgcolor: '#3949AB' }}>
                                {member.user_full_name?.charAt(0) || member.user_email.charAt(0)}
                              </Avatar>
                              <Typography variant='body2'>
                                {member.user_full_name || 'Unknown'}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant='body2' color='text.secondary'>
                              {member.user_email}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              size='small'
                              label={member.role}
                              color={member.role === ProjectRole.OWNER ? 'error' : 'default'}
                            />
                          </TableCell>
                          <TableCell align='right'>
                            <IconButton
                              size='small'
                              onClick={() => handleRemoveMember(member.user_id)}
                              disabled={member.role === ProjectRole.OWNER}
                            >
                              <Delete fontSize='small' />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Dialog open={isInviteOpen} onClose={() => setIsInviteOpen(false)}>
                  <DialogTitle>Invite Member</DialogTitle>
                  <DialogContent>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        mt: 1,
                        minWidth: 300,
                      }}
                    >
                      {inviteError && <Alert severity='error'>{inviteError}</Alert>}
                      <Autocomplete
                        options={users || []}
                        getOptionLabel={(option) =>
                          `${option.full_name || 'Unknown'} (${option.email})`
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label='Search User to Invite'
                            variant='outlined'
                            fullWidth
                          />
                        )}
                        value={users?.find((u) => u.email === emailToInvite) || null}
                        onChange={(_, newValue) => setEmailToInvite(newValue?.email || '')}
                        loading={isLoadingUsers}
                      />
                      <Select
                        value={roleToInvite}
                        onChange={(e) => setRoleToInvite(e.target.value as ProjectRole)}
                        fullWidth
                      >
                        <MenuItem value={ProjectRole.EDITOR}>Editor</MenuItem>
                        <MenuItem value={ProjectRole.VIEWER}>Viewer</MenuItem>
                        {/* Owner cannot be invited usually */}
                      </Select>
                    </Box>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setIsInviteOpen(false)}>Cancel</Button>
                    <Button
                      onClick={handleAddMember}
                      variant='contained'
                      disabled={addMemberMutation.isPending || !emailToInvite}
                    >
                      {addMemberMutation.isPending ? 'Inviting...' : 'Invite'}
                    </Button>
                  </DialogActions>
                </Dialog>

                <Box
                  sx={{ mt: 4, p: 3, backgroundColor: 'rgba(57, 73, 171, 0.1)', borderRadius: 2 }}
                >
                  <Typography variant='subtitle2' sx={{ fontWeight: 600, mb: 1 }}>
                    Role Permissions
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label='OWNER' color='error' size='small' />
                      <Typography variant='body2' color='text.secondary'>
                        Full access - Can manage team, settings, and delete project
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label='EDITOR' color='primary' size='small' />
                      <Typography variant='body2' color='text.secondary'>
                        Can edit content, compile PDF, and use AI features
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label='VIEWER' color='default' size='small' />
                      <Typography variant='body2' color='text.secondary'>
                        Read-only access to documents and settings
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}

            {/* Publishing Tab */}
            {activeTab === 2 && (
              <Box>
                <Typography variant='h6' sx={{ mb: 3, fontWeight: 600 }}>
                  Publication Settings
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    fullWidth
                    label='Target Journal'
                    value={projectInfo.targetJournal}
                    onChange={(e) =>
                      setProjectInfo({ ...projectInfo, targetJournal: e.target.value })
                    }
                  />
                  <TextField
                    fullWidth
                    label='Submission Deadline'
                    type='date'
                    slotProps={{ inputLabel: { shrink: true } }}
                    value={projectInfo.deadline}
                    onChange={(e) => setProjectInfo({ ...projectInfo, deadline: e.target.value })}
                  />
                  <TextField fullWidth select label='Paper Type' defaultValue='research'>
                    <MenuItem value='research'>Research Article</MenuItem>
                    <MenuItem value='review'>Review Article</MenuItem>
                    <MenuItem value='letter'>Letter</MenuItem>
                    <MenuItem value='conference'>Conference Paper</MenuItem>
                  </TextField>
                  <TextField
                    fullWidth
                    label='ArXiv Category'
                    placeholder='e.g., quant-ph, cs.CR'
                    helperText='ArXiv subject classification'
                  />
                </Box>

                <Divider sx={{ my: 4 }} />

                <Typography variant='h6' sx={{ mb: 3, fontWeight: 600 }}>
                  Submission Checklist
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Paper
                    sx={{
                      p: 2,
                      backgroundColor: '#212838',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: '#10B981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 14,
                      }}
                    >
                      ✓
                    </Box>
                    <Typography variant='body2'>Abstract completed</Typography>
                  </Paper>
                  <Paper
                    sx={{
                      p: 2,
                      backgroundColor: '#212838',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: '#10B981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 14,
                      }}
                    >
                      ✓
                    </Box>
                    <Typography variant='body2'>References formatted</Typography>
                  </Paper>
                  <Paper
                    sx={{
                      p: 2,
                      backgroundColor: '#212838',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 14,
                      }}
                    >
                      ○
                    </Box>
                    <Typography variant='body2' color='text.secondary'>
                      Figures captioned
                    </Typography>
                  </Paper>
                  <Paper
                    sx={{
                      p: 2,
                      backgroundColor: '#212838',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 14,
                      }}
                    >
                      ○
                    </Box>
                    <Typography variant='body2' color='text.secondary'>
                      Author affiliations complete
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
