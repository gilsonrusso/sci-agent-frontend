import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Select,
  MenuItem,
  Chip,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import { ArrowBack, PersonAdd, Delete, Save } from '@mui/icons-material';

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: 'Student' | 'Mentor' | 'Manager';
  avatar: string;
  joinedDate: string;
}

const mockTeam: TeamMember[] = [
  {
    id: 1,
    name: 'Dr. Jane Smith',
    email: 'jane.smith@university.edu',
    role: 'Manager',
    avatar: 'JS',
    joinedDate: 'Jan 10, 2026',
  },
  {
    id: 2,
    name: 'Dr. Alex Martinez',
    email: 'alex.martinez@university.edu',
    role: 'Mentor',
    avatar: 'AM',
    joinedDate: 'Jan 12, 2026',
  },
  {
    id: 3,
    name: 'Rachel Kim',
    email: 'rachel.kim@university.edu',
    role: 'Student',
    avatar: 'RK',
    joinedDate: 'Jan 15, 2026',
  },
  {
    id: 4,
    name: 'Emily Thompson',
    email: 'emily.thompson@university.edu',
    role: 'Student',
    avatar: 'ET',
    joinedDate: 'Feb 1, 2026',
  },
];

export default function ProjectSettingsPage() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [team, setTeam] = useState<TeamMember[]>(mockTeam);
  const [projectInfo, setProjectInfo] = useState({
    title: 'Quantum Computing Applications in Cryptography',
    description: 'Research on post-quantum cryptography methods',
    targetJournal: 'Nature Quantum Information',
    deadline: '2026-06-30',
    keywords: 'quantum computing, cryptography, post-quantum',
  });

  const handleRoleChange = (memberId: number, newRole: TeamMember['role']) => {
    setTeam(team.map((member) => (member.id === memberId ? { ...member, role: newRole } : member)));
  };

  const handleRemoveMember = (memberId: number) => {
    setTeam(team.filter((member) => member.id !== memberId));
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0F1419' }}>
      {/* Top AppBar */}
      <AppBar position='static' elevation={0} sx={{ backgroundColor: '#1A1F2E' }}>
        <Toolbar>
          <IconButton edge='start' color='inherit' onClick={() => navigate(`/editor/${projectId}`)}>
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
                        <TableCell>Joined</TableCell>
                        <TableCell align='right'>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {team.map((member) => (
                        <TableRow key={member.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar sx={{ bgcolor: '#3949AB' }}>{member.avatar}</Avatar>
                              <Typography variant='body2'>{member.name}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant='body2' color='text.secondary'>
                              {member.email}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Select
                              size='small'
                              value={member.role}
                              onChange={(e) =>
                                handleRoleChange(member.id, e.target.value as TeamMember['role'])
                              }
                              sx={{ minWidth: 120 }}
                            >
                              <MenuItem value='Student'>Student</MenuItem>
                              <MenuItem value='Mentor'>Mentor</MenuItem>
                              <MenuItem value='Manager'>Manager</MenuItem>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Typography variant='body2' color='text.secondary'>
                              {member.joinedDate}
                            </Typography>
                          </TableCell>
                          <TableCell align='right'>
                            <IconButton
                              size='small'
                              onClick={() => handleRemoveMember(member.id)}
                              disabled={member.role === 'Manager'}
                            >
                              <Delete fontSize='small' />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box
                  sx={{ mt: 4, p: 3, backgroundColor: 'rgba(57, 73, 171, 0.1)', borderRadius: 2 }}
                >
                  <Typography variant='subtitle2' sx={{ fontWeight: 600, mb: 1 }}>
                    Role Permissions
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label='Manager' color='error' size='small' />
                      <Typography variant='body2' color='text.secondary'>
                        Full access - Can manage team, settings, and publish
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label='Mentor' color='primary' size='small' />
                      <Typography variant='body2' color='text.secondary'>
                        Can edit, review, and comment on documents
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label='Student' color='success' size='small' />
                      <Typography variant='body2' color='text.secondary'>
                        Can edit and comment on documents
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
