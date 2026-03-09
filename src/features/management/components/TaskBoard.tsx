import { Box, Typography, Button, IconButton, useTheme } from '@mui/material';
import { ArrowBack, FilterList, Add } from '@mui/icons-material';
import { useWorkflowStore } from '../store/workflowStore';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import type { Task } from '../types/workflow';

const TASK_STATUSES: { id: Task['status']; title: string }[] = [
    { id: 'pending', title: 'Backlog' },
    { id: 'in_progress', title: 'In Progress' },
    { id: 'waiting_approval', title: 'In Review' },
    { id: 'done', title: 'Done' },
];

export default function TaskBoard() {
    const { tasks, moveTask, activeArticleId, setActiveArticle, articles } = useWorkflowStore();
    const theme = useTheme();

    const activeArticle = articles.find(a => a.id === activeArticleId);

    const handleDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        moveTask(draggableId, destination.droppableId as Task['status']);
    };

    if (!activeArticleId) return null;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', bgcolor: 'background.default' }}>
            {/* Task Board Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2, borderBottom: `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={() => setActiveArticle(null)} size="small">
                        <ArrowBack fontSize="small" />
                    </IconButton>
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px' }}>
                        {activeArticle?.title} <Box component="span" sx={{ color: 'text.secondary', fontWeight: 400 }}>Tasks</Box>
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button startIcon={<FilterList />} size="small" variant="outlined" sx={{ textTransform: 'none', color: 'text.primary', borderColor: 'divider' }}>
                        Filter
                    </Button>
                    <Button startIcon={<Add />} size="small" variant="contained" sx={{ textTransform: 'none' }}>
                        New Task
                    </Button>
                </Box>
            </Box>

            {/* Kanban Area */}
            <DragDropContext onDragEnd={handleDragEnd}>
                <Box sx={{ display: 'flex', flexGrow: 1, p: 3, gap: 2, overflowX: 'auto', alignItems: 'flex-start' }}>
                    {TASK_STATUSES.map((status) => (
                        <Box
                            key={status.id}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: 300,
                                flexShrink: 0,
                                bgcolor: 'background.paper',
                                borderRadius: '8px',
                                border: 1,
                                borderColor: 'divider',
                                maxHeight: '100%',
                            }}
                        >
                            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>{status.title}</Typography>
                                    <Box sx={{ bgcolor: 'action.disabledBackground', px: 1, borderRadius: '10px', fontSize: '12px' }}>
                                        {tasks.filter(t => t.status === status.id).length}
                                    </Box>
                                </Box>
                            </Box>

                            <Droppable droppableId={status.id}>
                                {(provided, snapshot) => (
                                    <Box
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        sx={{
                                            p: 1,
                                            pt: 0,
                                            flexGrow: 1,
                                            overflowY: 'auto',
                                            minHeight: 100,
                                            bgcolor: snapshot.isDraggingOver ? 'action.hover' : 'transparent',
                                            transition: 'background-color 0.2s ease',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 1
                                        }}
                                    >
                                        {tasks.filter(t => t.status === status.id).map((task, index) => (
                                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                                {(p, s) => (
                                                    <Box
                                                        ref={p.innerRef}
                                                        {...p.draggableProps}
                                                        {...p.dragHandleProps}
                                                        sx={{
                                                            p: 2,
                                                            bgcolor: 'background.paper',
                                                            border: 1,
                                                            borderColor: s.isDragging ? 'primary.main' : 'divider',
                                                            borderRadius: '6px',
                                                            boxShadow: s.isDragging ? theme.shadows[3] : 'none',
                                                            cursor: 'grab',
                                                            '&:hover': { borderColor: 'text.secondary' }
                                                        }}
                                                    >
                                                        <Typography sx={{ fontSize: '14px', fontWeight: 500, mb: 1 }}>{task.title}</Typography>
                                                        {task.description && (
                                                            <Typography sx={{ fontSize: '12px', color: 'text.secondary', mb: 1 }} noWrap>
                                                                {task.description}
                                                            </Typography>
                                                        )}
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                                {/* Placeholder for labels or priority */}
                                                            </Box>
                                                            {task.assignedTo && (
                                                                <Box sx={{ width: 20, height: 20, bgcolor: 'info.main', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'white' }}>
                                                                    U
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    </Box>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </Box>
                                )}
                            </Droppable>
                        </Box>
                    ))}
                </Box>
            </DragDropContext>
        </Box>
    );
}
