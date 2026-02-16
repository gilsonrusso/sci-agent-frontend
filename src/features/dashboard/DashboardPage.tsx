import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Box,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Chip,
  Avatar,
  AvatarGroup,
  LinearProgress,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
  Paper,
  Grid,
} from '@mui/material';
import {
  Description,
  Assignment,
  Analytics,
  Settings,
  Menu as MenuIcon,
  Add,
  Search,
  Notifications,
  Science,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const mockProjects = [
  {
    id: 1,
    title: 'Quantum Computing Applications in Cryptography',
    status: 'Draft',
    progress: 65,
    lastModified: '2 hours ago',
    team: ['JS', 'AM', 'RK'],
  },
  {
    id: 2,
    title: 'Machine Learning for Climate Prediction',
    status: 'Review',
    progress: 85,
    lastModified: '1 day ago',
    team: ['EM', 'TC'],
  },
  {
    id: 3,
    title: 'Neural Network Optimization Techniques',
    status: 'Submitted',
    progress: 100,
    lastModified: '3 days ago',
    team: ['JS', 'PL', 'KM', 'AN'],
  },
  {
    id: 4,
    title: 'Bioinformatics: Gene Expression Analysis',
    status: 'Draft',
    progress: 42,
    lastModified: '5 hours ago',
    team: ['RK', 'HS'],
  },
  {
    id: 5,
    title: 'Renewable Energy Grid Optimization',
    status: 'Review',
    progress: 78,
    lastModified: '2 days ago',
    team: ['TC', 'JS'],
  },
  {
    id: 6,
    title: 'Natural Language Processing Survey',
    status: 'Draft',
    progress: 35,
    lastModified: '1 hour ago',
    team: ['AM', 'PL'],
  },
];

const mockTasks = [
  { id: 1, title: 'Review Methodology section', project: 'Quantum Computing', priority: 'high' },
  { id: 2, title: 'Add references for Section 3', project: 'Machine Learning', priority: 'medium' },
  { id: 3, title: 'Respond to reviewer comments', project: 'Neural Network', priority: 'high' },
  { id: 4, title: 'Update figures and captions', project: 'Bioinformatics', priority: 'low' },
];

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
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft':
        return 'warning';
      case 'Review':
        return 'info';
      case 'Submitted':
        return 'success';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const navItems = [
    { text: 'Projects', icon: <Description /> },
    { text: 'Tasks', icon: <Assignment /> },
    { text: 'Analytics', icon: <Analytics /> },
    { text: 'Settings', icon: <Settings /> },
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
              onClick={() => setActiveNav(item.text)}
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
            <IconButton
              edge='start'
              color='inherit'
              sx={{ mr: 2, display: { md: 'none' } }}
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant='h6' sx={{ flexGrow: 1 }}>
              Dashboard
            </Typography>
            <IconButton color='inherit'>
              <Search />
            </IconButton>
            <IconButton color='inherit'>
              <Notifications />
            </IconButton>
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
                You have 3 active projects and 4 pending tasks
              </Typography>
            </Box>
            <IconButton
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
              <Grid container spacing={3}>
                {mockProjects.map((project) => (
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
                            <Chip
                              label={project.status}
                              color={
                                getStatusColor(project.status) as
                                  | 'default'
                                  | 'primary'
                                  | 'secondary'
                                  | 'error'
                                  | 'info'
                                  | 'success'
                                  | 'warning'
                              }
                              size='small'
                            />
                            <AvatarGroup
                              max={3}
                              sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: 12 } }}
                            >
                              {project.team.map((member, idx) => (
                                <Avatar key={idx} sx={{ bgcolor: '#3949AB' }}>
                                  {member}
                                </Avatar>
                              ))}
                            </AvatarGroup>
                          </Box>
                          <Typography variant='h6' sx={{ mb: 2, fontWeight: 500 }}>
                            {project.title}
                          </Typography>
                          <Box sx={{ mb: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant='caption' color='text.secondary'>
                                Progress
                              </Typography>
                              <Typography variant='caption' color='text.secondary'>
                                {project.progress}%
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant='determinate'
                              value={project.progress}
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
                            Last modified: {project.lastModified}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Tasks Sidebar */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Paper sx={{ p: 3, backgroundColor: '#1A1F2E' }}>
                <Typography variant='h6' sx={{ mb: 3, fontWeight: 600 }}>
                  Pending Tasks
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {mockTasks.map((task) => (
                    <Paper
                      key={task.id}
                      sx={{
                        p: 2,
                        backgroundColor: '#212838',
                        borderLeft: `4px solid ${getPriorityColor(task.priority)}`,
                      }}
                    >
                      <Typography variant='body2' sx={{ fontWeight: 500, mb: 0.5 }}>
                        {task.title}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {task.project}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
