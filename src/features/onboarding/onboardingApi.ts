import { axiosClient } from '../../api/axiosClient';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface Article {
  title: string;
  authors: string[];
  year: number;
  url: string;
  snippet: string;
  citation_count: number;
}

export interface RoadmapTask {
  title: string;
  due_in_days: number;
  description: string;
}

export interface ChatResponse {
  message: string;
  structured_data?: {
    suggested_articles?: Article[];
    roadmap?: RoadmapTask[];
    project_title?: string;
    project_structure?: { abstract: string };
  };
}

export const onboardingApi = {
  sendMessage: async (message: string, context?: any): Promise<ChatResponse> => {
    const response = await axiosClient.post<ChatResponse>('/onboarding/chat', {
      message,
      // Use local storage or context for real ID
      conversation_id: context?.conversation_id || 'temp-id',
      project_context: context,
    });
    return response.data;
  },

  createProjectFromOnboarding: async (data: {
    topic: string;
    roadmap: RoadmapTask[];
    selected_articles: Article[];
    project_title?: string;
    project_structure?: { abstract: string };
  }): Promise<any> => {
    const response = await axiosClient.post('/onboarding/create-project', data);
    return response.data;
  },
};
