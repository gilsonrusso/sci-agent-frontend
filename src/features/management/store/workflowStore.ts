import { create } from 'zustand';
import type { ApprovalRequest, Article, MacroStatus, UserRole, Task } from '../types/workflow';
import { axiosClient } from '../../../api/axiosClient';
import { projectsApi } from '../../dashboard/projectsApi';

interface WorkflowState {
  articles: Article[];
  tasks: Task[]; // US03 & US04
  approvals: ApprovalRequest[];
  currentUserRole: UserRole;
  activeArticleId: string | null;
  wsConnected: boolean;

  setRole: (role: UserRole) => void;
  setActiveArticle: (id: string | null) => void;

  // API Actions
  fetchBoard: () => Promise<void>;
  fetchTasks: (projectId: string) => Promise<void>; // US03
  moveArticleStage: (articleId: string, newStage: MacroStatus) => Promise<void>;
  moveTask: (taskId: string, newStatus: Task['status']) => Promise<void>; // US03
  requestApproval: (articleId: string, targetStage: MacroStatus) => Promise<void>;
  approveRequest: (requestId: string) => Promise<void>;
  rejectRequest: (requestId: string) => Promise<void>;

  // WebSocket Actions
  connectWebSocket: (token: string) => void;
  disconnectWebSocket: () => void;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

let ws: WebSocket | null = null;

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  articles: [],
  tasks: [],
  approvals: [],
  currentUserRole: 'MENTOR',
  activeArticleId: null,
  wsConnected: false,

  setRole: (role: UserRole) => set({ currentUserRole: role }),
  setActiveArticle: (id: string | null) => {
    set({ activeArticleId: id });
    if (id) {
      get().fetchTasks(id);
    } else {
      set({ tasks: [] });
    }
  },

  fetchBoard: async () => {
    try {
      const response = await axiosClient.get('/workflow/articles/board');
      const data = response.data;
      if (Array.isArray(data)) {
        set({ articles: data });
      } else {
        set({ articles: data.articles || [], approvals: data.approvals || [] });
      }
    } catch (error) {
      console.error('Failed to fetch board:', error);
    }
  },

  fetchTasks: async (projectId: string) => {
    try {
      const data = await projectsApi.getTasks(projectId);
      // Map ProjectTask to Task (handling field differences if any)
      const mappedTasks: Task[] = data.map(t => ({
        id: t.id,
        projectId: t.project_id,
        title: t.title,
        description: t.description || undefined,
        status: t.status as Task['status'],
        assignedTo: t.assigned_to || undefined,
        dueDate: t.due_date || undefined
      }));
      set({ tasks: mappedTasks });
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  },

  moveArticleStage: async (articleId: string, newStage: MacroStatus) => {
    // Optimistic UI update
    const previousArticles = get().articles;
    set((state) => ({
      articles: state.articles.map((art) =>
        art.id === articleId ? { ...art, macroStatus: newStage } : art,
      ),
    }));

    try {
      await axiosClient.post(`/workflow/articles/${articleId}/advance`, {
        role: get().currentUserRole
      });
    } catch (error) {
      console.error('Failed to move stage, reverting optimistic update', error);
      set({ articles: previousArticles });
    }
  },

  moveTask: async (taskId: string, newStatus: Task['status']) => {
    const previousTasks = get().tasks;
    // Optimistic UI update
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status: newStatus } : t,
      ),
    }));

    try {
      await projectsApi.updateTask(taskId, { status: newStatus });
    } catch (error) {
      console.error('Failed to move task, reverting optimistic update', error);
      set({ tasks: previousTasks });
    }
  },

  requestApproval: async (articleId: string, targetStage: MacroStatus) => {
    // Mocked for now until Backend Phase 3 (Approvals) is fully API-exposed
    set((state) => {
      const article = state.articles.find((a) => a.id === articleId);
      if (!article) return state;

      const newReq: ApprovalRequest = {
        id: `req_${Date.now()}`,
        articleId,
        articleTitle: article.title,
        requestedStage: targetStage,
        requestedBy: { id: 'test_user', name: 'Current User' },
        requestedAt: new Date().toISOString(),
        status: 'PENDING',
      };
      return { approvals: [...state.approvals, newReq] };
    });
  },

  approveRequest: async (requestId: string) => {
    set((state) => {
      const req = state.approvals.find((r) => r.id === requestId);
      if (!req) return state;

      return {
        approvals: state.approvals.filter((r) => r.id !== requestId),
        articles: state.articles.map((art) =>
          art.id === req.articleId ? { ...art, macroStatus: req.requestedStage } : art,
        ),
      };
    });
  },

  rejectRequest: async (requestId: string) => {
    set((state) => ({
      approvals: state.approvals.filter((r) => r.id !== requestId),
    }));
  },

  connectWebSocket: (token: string) => {
    if (ws) return;

    // Use a global board channel, or the first article id for specific updates
    // In a real app we would subscribe to a generic `/ws/workflow` 
    // Since backend expect article_id, let's connect to a dummy "board" channel
    const wsUrl = `${API_BASE_URL.replace('http', 'ws')}/api/v1/workflow/ws/board?token=${token}`;

    ws = new WebSocket(wsUrl);

    ws.onopen = () => set({ wsConnected: true });

    ws.onclose = () => {
      set({ wsConnected: false });
      ws = null;
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.event_type === 'ArticleStageAdvancedEvent' || payload.event_type === 'ArticleReturnedEvent') {
          // Update the specific article in the state
          set((state) => ({
            articles: state.articles.map((a) =>
              a.id === payload.event_data.article_id
                ? { ...a, macroStatus: payload.event_data.new_stage as MacroStatus }
                : a
            )
          }));
        }
      } catch (e) {
        console.error('WebSocket message parsing error:', e);
      }
    };
  },

  disconnectWebSocket: () => {
    if (ws) {
      ws.close();
      ws = null;
    }
  }
}));
