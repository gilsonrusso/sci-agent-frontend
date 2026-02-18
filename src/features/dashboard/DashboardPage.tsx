import {
  Add,
  Analytics,
  Assignment,
  Description,
  Menu as MenuIcon,
  Notifications,
  Science,
  Search,
  Settings,
} from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { projectsApi, type ProjectCreate, type ProjectTask } from './projectsApi';
import TaskCard from './components/TaskCard';
import { useNotifications } from '../../hooks/useNotifications';

const chartData = [
  { date: 'Feb 1', words: 2400 },
  { date: 'Feb 3', words: 3200 },
  { date: 'Feb 5', words: 4100 },
  { date: 'Feb 7', words: 4800 },
  { date: 'Feb 9', words: 5600 },
  { date: 'Feb 11', words: 6500 },
  { date: 'Feb 13', words: 7200 },
  { date: 'Feb 15', words: 8100 },
];

export default function DashboardPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('Projects');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { sendNotification } = useNotifications();

  // Fetch Projects
  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.getProjects,
  });

  // Fetch Tasks (For all projects - tricky without backend support for "my tasks",
  // so for now we might mock specific project ID or fetch all for loaded projects)
  // For MVP: let's fetch tasks for the FIRST project if available, or empty.
  // Ideally backend needs GET /tasks?assigned_to=me
  // We will assume backend supports filtering or we just show a placeholder "Select Project"
  // But wait, the previous mock was "Pending Tasks".
  // Let's trying to fetch tasks for ALL projects is n+1.
  // Let's just fetch tasks for the first project for demo purposes if projects exist.
  const firstProjectId = projects?.[0]?.id;

  const { data: tasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ['tasks', firstProjectId],
    queryFn: () => (firstProjectId ? projectsApi.getTasks(firstProjectId) : Promise.resolve([])),
    enabled: !!firstProjectId,
  });

  // Create Project Mutation
  const createProjectMutation = useMutation({
    mutationFn: (data: ProjectCreate) => projectsApi.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setCreateDialogOpen(false);
      setNewProjectTitle('');
      setNewProjectDescription('');
    },
  });

  // Approve/Reject Mutations
  const approveTaskMutation = useMutation({
    mutationFn: projectsApi.approveTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      sendNotification('Task Approved', { body: 'The student has been notified.' });
    },
  });

  const rejectTaskMutation = useMutation({
    mutationFn: projectsApi.rejectTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      sendNotification('Task Rejected', { body: 'The student has been notified to revise.' });
    },
  });

  const handleCreateProject = () => {
    if (!newProjectTitle.trim()) return;
    createProjectMutation.mutate({
      title: newProjectTitle,
      description: newProjectDescription,
      content: '', // Start empty
    });
  };

  const navItems = [
    { text: 'Projects', icon: <Description />, path: '/dashboard' },
    { text: 'Tasks', icon: <Assignment />, path: '/tasks' },
    { text: 'Analytics', icon: <Analytics />, path: '/analytics' },
    { text: 'New Project AI', icon: <Science />, path: '/onboarding' },
    { text: 'Account Settings', icon: <Settings />, path: '/settings' },
  ];

  const drawer = (
    <Box sx={{ width: 260, height: '100%', backgroundColor: '#1A1F2E' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Science sx={{ color: '#10B981', fontSize: 40 }} />
        <Typography variant='h5' sx={{ fontWeight: 700, color: '#10B981' }}>
          SciAgent OS
        </Typography>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={activeNav === item.text}
              onClick={() => {
                setActiveNav(item.text);
                if (item.path) navigate(item.path);
              }}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(57, 73, 171, 0.2)',
                  borderRight: '3px solid #3949AB',
                },
              }}
            >
              <ListItemIcon sx={{ color: activeNav === item.text ? '#3949AB' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0F1419' }}>
      {/* Sidebar - Desktop */}
      <Box
        sx={{
          display: { xs: 'none', md: 'block' },
          width: 260,
          flexShrink: 0,
        }}
      >
        {drawer}
      </Box>

      {/* Mobile Drawer */}
      <Drawer anchor='left' open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1 }}>
        {/* Top AppBar */}
        <AppBar
          position='static'
          elevation={0}
          sx={{ backgroundColor: '#1A1F2E', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
        >
          <Toolbar>
            <Button
              startIcon={<MenuIcon />}
              color='inherit'
              sx={{ mr: 2, display: { md: 'none' } }}
              onClick={() => setDrawerOpen(true)}
            />
            <Typography variant='h6' sx={{ flexGrow: 1 }}>
              Dashboard
            </Typography>
            <Button startIcon={<Search />} color='inherit'>
              Search
            </Button>
            <Button startIcon={<Notifications />} color='inherit'>
              Notifications
            </Button>
            <Avatar sx={{ ml: 2, bgcolor: '#3949AB' }}>JS</Avatar>
          </Toolbar>
        </AppBar>

        {/* Dashboard Content */}
        <Box sx={{ p: 4 }}>
          {/* Header */}
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}
          >
            <Box>
              <Typography variant='h4' sx={{ fontWeight: 600, mb: 1 }}>
                Welcome back, Dr. Smith
              </Typography>
              <Typography variant='body1' color='text.secondary'>
                You have {projects?.length || 0} active projects and {(tasks || []).length} tasks
              </Typography>
            </Box>
            <IconButton
              onClick={() => setCreateDialogOpen(true)}
              sx={{
                backgroundColor: '#10B981',
                color: '#fff',
                '&:hover': { backgroundColor: '#059669' },
                width: 56,
                height: 56,
              }}
            >
              <Add />
            </IconButton>
          </Box>

          <Grid container spacing={3}>
            {/* Analytics Widget */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Paper sx={{ p: 3, backgroundColor: '#1A1F2E', mb: 3 }}>
                <Typography variant='h6' sx={{ mb: 3, fontWeight: 600 }}>
                  Writing Progress
                </Typography>
                <ResponsiveContainer width='100%' height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray='3 3' stroke='rgba(255,255,255,0.1)' />
                    <XAxis dataKey='date' stroke='#9CA3AF' />
                    <YAxis stroke='#9CA3AF' />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1A1F2E',
                        border: '1px solid rgba(255,255,255,0.1)',
                      }}
                    />
                    <Line type='monotone' dataKey='words' stroke='#10B981' strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>

              {/* Project Cards */}
              <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
                Active Projects
              </Typography>

              {isLoadingProjects ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {projects?.map((project) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={project.id}>
                      <Card
                        sx={{
                          backgroundColor: '#1A1F2E',
                          '&:hover': {
                            backgroundColor: '#212838',
                            transform: 'translateY(-4px)',
                            transition: 'all 0.3s ease',
                          },
                        }}
                      >
                        <Stack sx={{ position: 'relative' }}>
                          <CardActionArea onClick={() => navigate(`/editor/${project.id}`)}>
                            <CardContent>
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'start',
                                  mb: 2,
                                }}
                              >
                                <Chip label='Draft' color='warning' size='small' />
                              </Box>
                              <Typography variant='h6' sx={{ mb: 2, fontWeight: 500 }}>
                                {project.title}
                              </Typography>
                              <Box sx={{ mb: 1 }}>
                                <Typography
                                  variant='body2'
                                  color='text.secondary'
                                  sx={{
                                    mb: 1,
                                    height: 40,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                  }}
                                >
                                  {project.description || 'No description provided.'}
                                </Typography>
                                <LinearProgress
                                  variant='determinate'
                                  value={30} // Placeholder progress/status
                                  sx={{
                                    height: 6,
                                    borderRadius: 3,
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    '& .MuiLinearProgress-bar': {
                                      backgroundColor: '#10B981',
                                    },
                                  }}
                                />
                              </Box>
                              <Typography variant='caption' color='text.secondary'>
                                Last modified: {new Date(project.updated_at).toLocaleDateString()}
                              </Typography>
                            </CardContent>
                          </CardActionArea>
                          <IconButton
                            size='small'
                            sx={{ position: 'absolute', top: 15, right: 15, zIndex: 1 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/settings/${project.id}`);
                            }}
                          >
                            <Settings fontSize='small' />
                          </IconButton>
                        </Stack>
                      </Card>
                    </Grid>
                  ))}
                  {projects?.length === 0 && (
                    <Box sx={{ p: 4, width: '100%', textAlign: 'center' }}>
                      <Typography color='text.secondary'>
                        No projects found. Create one to get started!
                      </Typography>
                    </Box>
                  )}
                </Grid>
              )}
            </Grid>

            {/* Tasks Sidebar */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Paper sx={{ p: 3, backgroundColor: '#1A1F2E' }}>
                <Typography variant='h6' sx={{ mb: 3, fontWeight: 600 }}>
                  Current Tasks (Project 1)
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {isLoadingTasks ? (
                    <CircularProgress size={20} />
                  ) : tasks && tasks.length > 0 ? (
                    tasks.map((task: ProjectTask) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        projectName={projects?.find((p) => p.id === task.project_id)?.title}
                        isSupervisor={true} // Hardcoded for demo, TODO: check User Role
                        onApprove={(id) => approveTaskMutation.mutate(id)}
                        onReject={(id) => rejectTaskMutation.mutate(id)}
                      />
                    ))
                  ) : (
                    <Typography color='text.secondary'>No tasks for the first project.</Typography>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Create Project Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)}>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            label='Project Title'
            fullWidth
            variant='outlined'
            value={newProjectTitle}
            onChange={(e) => setNewProjectTitle(e.target.value)}
          />
          <TextField
            margin='dense'
            label='Description'
            fullWidth
            variant='outlined'
            multiline
            rows={4}
            value={newProjectDescription}
            onChange={(e) => setNewProjectDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateProject}
            variant='contained'
            disabled={createProjectMutation.isPending || !newProjectTitle}
          >
            {createProjectMutation.isPending ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
