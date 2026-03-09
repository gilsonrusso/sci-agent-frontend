import { Box } from '@mui/material';
import { useWorkflowStore } from '../store/workflowStore';
import type { MacroStatus } from '../types/workflow';
import BoardColumn from './BoardColumn';

const STAGES: { id: MacroStatus; title: string }[] = [
  { id: 'IDEATION', title: 'Ideation' },
  { id: 'RESEARCH', title: 'Research' },
  { id: 'WRITING', title: 'Writing' },
  { id: 'AI_REVIEW', title: 'AI Review' },
  { id: 'HUMAN_REVIEW', title: 'Human Review' },
  { id: 'APPROVED', title: 'Approved' },
  { id: 'SUBMITTED', title: 'Submitted' },
];

import { DragDropContext } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';

import TaskBoard from './TaskBoard';

export default function MentorBoard() {
  const { articles, moveArticleStage, activeArticleId } = useWorkflowStore();

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    moveArticleStage(draggableId, destination.droppableId as MacroStatus);
  };

  if (activeArticleId) {
    return <TaskBoard />;
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Box
        sx={{
          display: 'flex',
          height: '100%',
          width: '100%',
          overflowX: 'auto',
          overflowY: 'hidden',
          p: 3,
          gap: 2,
          bgcolor: 'background.default',
        }}
      >
        {STAGES.map((stage) => {
          const stageArticles = articles.filter((a) => a.macroStatus === stage.id);
          return <BoardColumn key={stage.id} stage={stage} articles={stageArticles} />;
        })}

        {/* Empty space at the end to allow scrolling past the last column */}
        <Box sx={{ minWidth: 24, flexShrink: 0 }} />
      </Box>
    </DragDropContext>
  );
}
