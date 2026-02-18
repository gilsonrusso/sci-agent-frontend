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

export const ProjectRole = {
  OWNER: 'OWNER',
  EDITOR: 'EDITOR',
  VIEWER: 'VIEWER',
} as const;

export type ProjectRole = (typeof ProjectRole)[keyof typeof ProjectRole];

export const ProjectMemberSchema = z.object({
  project_id: z.string().uuid(),
  user_id: z.string().uuid(),
  role: z.enum([ProjectRole.OWNER, ProjectRole.EDITOR, ProjectRole.VIEWER]),
  user_email: z.string().email(),
  user_full_name: z.string().optional().nullable(),
});

export type ProjectMember = z.infer<typeof ProjectMemberSchema>;

export const TaskStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  WAITING_APPROVAL: 'waiting_approval',
  DONE: 'done',
} as const;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export const ProjectTaskSchema = z.object({
  id: z.string().uuid(),
  project_id: z.string().uuid(),
  title: z.string(),
  description: z.string().optional().nullable(),
  status: z.enum([
    TaskStatus.PENDING,
    TaskStatus.IN_PROGRESS,
    TaskStatus.WAITING_APPROVAL,
    TaskStatus.DONE,
  ]),
  due_date: z.string().datetime().optional().nullable(),
  assigned_to: z.string().uuid().optional().nullable(),
});

export type ProjectTask = z.infer<typeof ProjectTaskSchema>;

export const ProjectTaskCreateSchema = z.object({
  project_id: z.string().uuid(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z
    .enum([
      TaskStatus.PENDING,
      TaskStatus.IN_PROGRESS,
      TaskStatus.WAITING_APPROVAL,
      TaskStatus.DONE,
    ])
    .optional(),
  due_date: z.string().datetime().optional(),
  assigned_to: z.string().uuid().optional(),
});

export type ProjectTaskCreate = z.infer<typeof ProjectTaskCreateSchema>;

export const ProjectTaskUpdateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z
    .enum([
      TaskStatus.PENDING,
      TaskStatus.IN_PROGRESS,
      TaskStatus.WAITING_APPROVAL,
      TaskStatus.DONE,
    ])
    .optional(),
  due_date: z.string().datetime().optional(),
  assigned_to: z.string().uuid().optional(),
});

export type ProjectTaskUpdate = z.infer<typeof ProjectTaskUpdateSchema>;

export const projectsApi = {
  // ... existing methods ...
  getProjects: async (): Promise<Project[]> => {
    const response = await axiosClient.get<Project[]>('/projects');
    return response.data;
  },

  getProject: async (id: string): Promise<Project> => {
    const response = await axiosClient.get<Project>(`/projects/${id}`);
    return response.data;
  },

  compileProject: async (id: string, content?: string): Promise<Blob> => {
    const response = await axiosClient.post(
      `/editor/${id}/compile`,
      { content },
      { responseType: 'blob' },
    );
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

  // Member Management
  getMembers: async (projectId: string): Promise<ProjectMember[]> => {
    const response = await axiosClient.get<ProjectMember[]>(`/projects/${projectId}/members`);
    return response.data;
  },

  addMember: async (
    projectId: string,
    email: string,
    role: ProjectRole,
  ): Promise<ProjectMember> => {
    const response = await axiosClient.post<ProjectMember>(`/projects/${projectId}/members`, {
      email,
      role,
    });
    return response.data;
  },

  removeMember: async (projectId: string, userId: string): Promise<void> => {
    await axiosClient.delete(`/projects/${projectId}/members/${userId}`);
  },

  // Task Management
  getTasks: async (projectId: string): Promise<ProjectTask[]> => {
    const response = await axiosClient.get<ProjectTask[]>('/tasks', {
      params: { project_id: projectId },
    });
    return response.data;
  },

  createTask: async (data: ProjectTaskCreate): Promise<ProjectTask> => {
    const response = await axiosClient.post<ProjectTask>('/tasks', data);
    return response.data;
  },

  updateTask: async (id: string, data: ProjectTaskUpdate): Promise<ProjectTask> => {
    const response = await axiosClient.put<ProjectTask>(`/tasks/${id}`, data);
    return response.data;
  },

  requestTaskApproval: async (id: string): Promise<ProjectTask> => {
    const response = await axiosClient.post<ProjectTask>(`/tasks/${id}/request-approval`);
    return response.data;
  },

  approveTask: async (id: string): Promise<ProjectTask> => {
    const response = await axiosClient.post<ProjectTask>(`/tasks/${id}/approve`);
    return response.data;
  },

  rejectTask: async (id: string): Promise<ProjectTask> => {
    const response = await axiosClient.post<ProjectTask>(`/tasks/${id}/reject`);
    return response.data;
  },

  // User Management
  getUsers: async (): Promise<UserPublic[]> => {
    const response = await axiosClient.get<UserPublic[]>('/users');
    return response.data;
  },
};

export const UserPublicSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  full_name: z.string().optional().nullable(),
  is_active: z.boolean(),
});

export type UserPublic = z.infer<typeof UserPublicSchema>;
