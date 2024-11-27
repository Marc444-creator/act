import { create } from 'zustand';
import { Task, Project, Context } from '../types';
import { persist } from 'zustand/middleware';

interface Store {
  tasks: Task[];
  projects: Project[];
  contexts: Context[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  addContext: (context: Omit<Context, 'id'>) => void;
  deleteTask: (id: string) => void;
  deleteProject: (id: string) => void;
  deleteContext: (id: string) => void;
  toggleTask: (id: string) => void;
  updateProject: (id: string, name: string, color: string) => void;
  updateContext: (id: string, name: string, color: string) => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      tasks: [],
      projects: [],
      contexts: [],
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
    }),
    {
      name: 'productivity-store',
    }
  )
);