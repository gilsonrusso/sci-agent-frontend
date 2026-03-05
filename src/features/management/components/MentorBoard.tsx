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
    { id: 'SUBMITTED', title: 'Submitted' }
];

export default function MentorBoard() {
    const { articles } = useWorkflowStore();

    return (
        <Box sx={{
            display: 'flex',
            height: '100%',
            width: '100%',
            overflowX: 'auto',
            overflowY: 'hidden',
            p: 3,
            gap: 2,
            backgroundColor: '#0D1117'
        }}>
            {/* 
        Note: Future implementation will wrap this in DragDropContext 
        from @hello-pangea/dnd. Currently focusing on visual layout.
      */}
            {STAGES.map((stage) => {
                const stageArticles = articles.filter(a => a.macroStatus === stage.id);
                return (
                    <BoardColumn
                        key={stage.id}
                        stage={stage}
                        articles={stageArticles}
                    />
                );
            })}

            {/* Empty space at the end to allow scrolling past the last column */}
            <Box sx={{ minWidth: 24, flexShrink: 0 }} />
        </Box>
    );
}
