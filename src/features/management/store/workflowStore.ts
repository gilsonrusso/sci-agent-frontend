import { create } from 'zustand';
import type { ApprovalRequest, Article, MacroStatus, UserRole } from '../types/workflow';

interface WorkflowState {
    // Dados Emulados
    articles: Article[];
    approvals: ApprovalRequest[];

    // Estado de Visualização
    currentUserRole: UserRole;
    setRole: (role: UserRole) => void;

    // Ações do Quadro
    moveArticleStage: (articleId: string, newStage: MacroStatus) => void;
    requestApproval: (articleId: string, targetStage: MacroStatus) => void;
    approveRequest: (requestId: string) => void;
    rejectRequest: (requestId: string) => void;

    // UI Split View
    activeArticleId: string | null;
    setActiveArticle: (id: string | null) => void;
}

// Mock Data
const MOCK_ARTICLES: Article[] = [
    {
        id: 'a1',
        title: 'Detection of Soybean Pests using Computer Vision',
        macroStatus: 'WRITING',
        subSections: [
            { id: 's1', name: 'Introduction', status: 'DONE', wordCount: 800 },
            { id: 's2', name: 'Methodology', status: 'WRITING', wordCount: 450 },
        ],
        deadline: '2026-11-20T00:00:00.000Z',
        createdAt: '2026-03-01T00:00:00.000Z',
        updatedAt: '2026-03-04T12:00:00.000Z',
        authors: [{ id: 'u1', name: 'Gilson Russo' }],
        progress: 45
    },
    {
        id: 'a2',
        title: 'Blockchain for Coffee Supply Chain Traceability',
        macroStatus: 'HUMAN_REVIEW',
        subSections: [
            { id: 's1', name: 'Full Draft', status: 'DONE', wordCount: 4500 }
        ],
        deadline: '2026-06-15T00:00:00.000Z',
        createdAt: '2026-01-10T00:00:00.000Z',
        updatedAt: '2026-03-03T09:00:00.000Z',
        authors: [{ id: 'u2', name: 'Ana Silva' }],
        progress: 90
    },
    {
        id: 'a3',
        title: 'Machine Learning Models for Economic Forecasting',
        macroStatus: 'RESEARCH',
        subSections: [],
        deadline: '2026-12-01T00:00:00.000Z',
        createdAt: '2026-03-02T00:00:00.000Z',
        updatedAt: '2026-03-02T00:00:00.000Z',
        authors: [{ id: 'u1', name: 'Gilson Russo' }, { id: 'u3', name: 'Carlos Mendes' }],
        progress: 10
    }
];

const MOCK_APPROVALS: ApprovalRequest[] = [
    {
        id: 'req1',
        articleId: 'a2',
        articleTitle: 'Blockchain for Coffee Supply Chain Traceability',
        requestedStage: 'APPROVED',
        requestedBy: { id: 'u2', name: 'Ana Silva' },
        requestedAt: '2026-03-03T10:00:00.000Z',
        status: 'PENDING'
    }
];

export const useWorkflowStore = create<WorkflowState>((set) => ({
    articles: MOCK_ARTICLES,
    approvals: MOCK_APPROVALS,
    currentUserRole: 'MENTOR', // Default para ver tudo no início do dev
    activeArticleId: null,

    setRole: (role) => set({ currentUserRole: role }),
    setActiveArticle: (id) => set({ activeArticleId: id }),

    moveArticleStage: (articleId, newStage) => set((state) => ({
        articles: state.articles.map(art =>
            art.id === articleId ? { ...art, macroStatus: newStage } : art
        )
    })),

    requestApproval: (articleId, targetStage) => set((state) => {
        const article = state.articles.find(a => a.id === articleId);
        if (!article) return state;

        const newReq: ApprovalRequest = {
            id: `req_${Date.now()}`,
            articleId,
            articleTitle: article.title,
            requestedStage: targetStage,
            requestedBy: { id: 'test_user', name: 'Current User' }, // Simplificado
            requestedAt: new Date().toISOString(),
            status: 'PENDING'
        };

        return { approvals: [...state.approvals, newReq] };
    }),

    approveRequest: (requestId) => set((state) => {
        const req = state.approvals.find(r => r.id === requestId);
        if (!req) return state;

        return {
            approvals: state.approvals.filter(r => r.id !== requestId),
            articles: state.articles.map(art =>
                art.id === req.articleId ? { ...art, macroStatus: req.requestedStage } : art
            )
        };
    }),

    rejectRequest: (requestId) => set((state) => ({
        approvals: state.approvals.filter(r => r.id !== requestId)
    }))
}));
