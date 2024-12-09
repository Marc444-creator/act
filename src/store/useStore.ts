import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createTaskStore, TaskStore } from './taskStore';
import { Project, Context, TaskStatus, Habit, Note, NoteType } from '../types';

interface Store extends TaskStore {
  projects: Project[];
  contexts: Context[];
  statuses: TaskStatus[];
  habits: Habit[];
  notes: Note[];
  noteTypes: NoteType[];
  addProject: (project: Omit<Project, 'id'>) => void;
  addContext: (context: Omit<Context, 'id'>) => void;
  addStatus: (status: Omit<TaskStatus, 'id'>) => void;
  deleteProject: (id: string) => void;
  deleteContext: (id: string) => void;
  deleteStatus: (id: string) => void;
  updateProject: (id: string, name: string, color: string) => void;
  updateContext: (id: string, name: string, color: string) => void;
  addHabit: (habit: Omit<Habit, 'id'>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitDay: (habitId: string, date: string) => void;
  updateHabit: (id: string, name: string) => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, content: string, title: string, noteTypeId: string | null) => void;
  deleteNote: (id: string) => void;
  addNoteType: (noteType: Omit<NoteType, 'id'>) => void;
  deleteNoteType: (id: string) => void;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      ...createTaskStore(set, get),
      projects: [],
      contexts: [],
      statuses: [
        { id: 'not-started', name: 'Not Started', color: '#64748b' },
        { id: 'in-progress', name: 'In Progress', color: '#3b82f6' },
        { id: 'blocked', name: 'Blocked', color: '#ef4444' },
        { id: 'completed', name: 'Completed', color: '#22c55e' },
      ],
      habits: [],
      notes: [],
      noteTypes: [],
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
      addHabit: (habit) =>
        set((state) => ({
          habits: [...state.habits, { ...habit, id: crypto.randomUUID() }],
        })),
      deleteHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter((habit) => habit.id !== id),
        })),
      toggleHabitDay: (habitId, date) =>
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === habitId
              ? {
                  ...habit,
                  completedDays: {
                    ...habit.completedDays,
                    [date]: !habit.completedDays[date],
                  },
                }
              : habit
          ),
        })),
      updateHabit: (id, name) =>
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === id ? { ...habit, name } : habit
          ),
        })),
      addNote: (note) =>
        set((state) => ({
          notes: [
            ...state.notes,
            {
              ...note,
              id: crypto.randomUUID(),
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        })),
      updateNote: (id, content, title, noteTypeId) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, content, title, noteTypeId, updatedAt: new Date() }
              : note
          ),
        })),
      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        })),
      addNoteType: (noteType) =>
        set((state) => ({
          noteTypes: [...state.noteTypes, { ...noteType, id: crypto.randomUUID() }],
        })),
      deleteNoteType: (id) =>
        set((state) => ({
          noteTypes: state.noteTypes.filter((noteType) => noteType.id !== id),
          notes: state.notes.map((note) =>
            note.noteTypeId === id ? { ...note, noteTypeId: null } : note
          ),
        })),
    }),
    {
      name: 'productivity-store',
    }
  )
);