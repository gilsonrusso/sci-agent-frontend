import { axiosClient } from '../../api/axiosClient';
import { z } from 'zod';

export const ProjectSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  owner_id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const ProjectCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  content: z.string().optional(),
});

export const ProjectUpdateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  content: z.string().optional(),
});

export type Project = z.infer<typeof ProjectSchema>;
export type ProjectCreate = z.infer<typeof ProjectCreateSchema>;
export type ProjectUpdate = z.infer<typeof ProjectUpdateSchema>;

export const projectsApi = {
  getProjects: async (): Promise<Project[]> => {
    const response = await axiosClient.get<Project[]>('/projects');
    return response.data;
  },

  getProject: async (id: string): Promise<Project> => {
    const response = await axiosClient.get<Project>(`/projects/${id}`);
    return response.data;
  },

  createProject: async (data: ProjectCreate): Promise<Project> => {
    const response = await axiosClient.post<Project>('/projects', data);
    return response.data;
  },

  updateProject: async (id: string, data: ProjectUpdate): Promise<Project> => {
    const response = await axiosClient.put<Project>(`/projects/${id}`, data);
    return response.data;
  },

  deleteProject: async (id: string): Promise<Project> => {
    const response = await axiosClient.delete<Project>(`/projects/${id}`);
    return response.data;
  },
};
