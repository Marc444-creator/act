import { create } from 'zustand';
import { Task, Project, Context, TaskStatus } from '../types';
import { persist } from 'zustand/middleware';

interface Store {
  tasks: Task[];
  projects: Project[];
  contexts: Context[];
  statuses: TaskStatus[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  addContext: (context: Omit<Context, 'id'>) => void;
  addStatus: (status: Omit<TaskStatus, 'id'>) => void;
  deleteTask: (id: string) => void;
  deleteProject: (id: string) => void;
  deleteContext: (id: string) => void;
  deleteStatus: (id: string) => void;
  toggleTask: (id: string) => void;
  updateProject: (id: string, name: string, color: string) => void;
  updateContext: (id: string, name: string, color: string) => void;
  updateTaskStatus: (taskId: string, statusId: string) => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      tasks: [],
      projects: [],
      contexts: [],
      statuses: [
        { id: 'not-started', name: 'Not Started', color: '#64748b' },
        { id: 'in-progress', name: 'In Progress', color: '#3b82f6' },
        { id: 'blocked', name: 'Blocked', color: '#ef4444' },
        { id: 'completed', name: 'Completed', color: '#22c55e' },
      ],
      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            { ...task, id: crypto.randomUUID(), createdAt: new Date() },
          ],
        })),
      addProject: (project) =>
        set((state) => ({
          projects: [...state.projects, { ...project, id: crypto.randomUUID() }],
        })),
      addContext: (context) =>
        set((state) => ({
          contexts: [...state.contexts, { ...context, id: crypto.randomUUID() }],
        })),
      addStatus: (status) =>
        set((state) => ({
          statuses: [...state.statuses, { ...status, id: crypto.randomUUID() }],
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
          tasks: state.tasks.map((task) =>
            task.projectId === id ? { ...task, projectId: null } : task
          ),
        })),
      deleteContext: (id) =>
        set((state) => ({
          contexts: state.contexts.filter((context) => context.id !== id),
          tasks: state.tasks.map((task) =>
            task.contextId === id ? { ...task, contextId: null } : task
          ),
        })),
      deleteStatus: (id) =>
        set((state) => ({
          statuses: state.statuses.filter((status) => status.id !== id),
        })),
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        })),
      updateProject: (id, name, color) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id ? { ...project, name, color } : project
          ),
        })),
      updateContext: (id, name, color) =>
        set((state) => ({
          contexts: state.contexts.map((context) =>
            context.id === id ? { ...context, name, color } : context
          ),
        })),
      updateTaskStatus: (taskId, statusId) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, status: statusId } : task
          ),
        })),
    }),
    {
      name: 'productivity-store',
    }
  )
);