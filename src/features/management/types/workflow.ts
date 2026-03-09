export type MacroStatus =
  | 'IDEATION'
  | 'RESEARCH'
  | 'WRITING'
  | 'AI_REVIEW'
  | 'HUMAN_REVIEW'
  | 'APPROVED'
  | 'SUBMITTED';

export type UserRole = 'AUTHOR' | 'COORDINATOR' | 'MENTOR';

export interface WorkflowPermissions {
  canEdit: boolean;
  canAdvanceMacroStage: boolean;
  canApproveFinal: boolean;
  canViewRoadmap: boolean;
}

export interface SectionStatus {
  id: string;
  name: string;
  status: 'DRAFT' | 'WRITING' | 'REVIEW' | 'DONE';
  wordCount: number;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'waiting_approval' | 'done';
  assignedTo?: string;
  dueDate?: string;
}

export interface Article {
  id: string;
  title: string;
  macroStatus: MacroStatus;
  subSections: SectionStatus[];
  tasks: Task[];
  deadline: string; // ISO Date
  createdAt: string;
  updatedAt: string;
  authors: { id: string; name: string; avatarUrl?: string }[];
  progress: number; // 0-100
}

export interface ApprovalRequest {
  id: string;
  articleId: string;
  articleTitle: string;
  requestedStage: MacroStatus;
  requestedBy: { id: string; name: string };
  requestedAt: string; // ISO date
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}
