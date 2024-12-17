import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Task, Project, Context, Note, NoteType, Habit } from '@/types';
import { createTaskStore } from './taskStore';

interface Store {
  habits: Habit[];
  tasks: Task[];
  projects: Project[];
  contexts: Context[];
  notes: Note[];
  noteTypes: NoteType[];
  remindersEnabled: boolean;
  addHabit: (habit: Omit<Habit, "id">) => void;
  deleteHabit: (id: string) => void;
  toggleHabitDay: (habitId: string, date: string) => void;
  updateHabit: (id: string, name: string) => void;
  toggleReminders: () => void;
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  moveTaskToLater: (id: string) => void;
  generateRecurringTasks: () => void;
  checkAndMoveForLaterTasks: () => void;
  addProject: (project: Omit<Project, "id">) => void;
  deleteProject: (id: string) => void;
  addContext: (context: Omit<Context, "id">) => void;
  deleteContext: (id: string) => void;
  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => void;
  deleteNote: (id: string) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  addNoteType: (noteType: Omit<NoteType, "id">) => void;
  deleteNoteType: (id: string) => void;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      ...createTaskStore(set, get),
      habits: [],
      projects: [],
      contexts: [],
      notes: [],
      noteTypes: [],
      remindersEnabled: true,
      
      // Habit methods
      addHabit: (habit) => {
        set((state) => ({
          habits: [...state.habits, { ...habit, id: uuidv4() }],
        }));
      },
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
      toggleReminders: () =>
        set((state) => ({
          remindersEnabled: !state.remindersEnabled,
        })),
      // Project methods
      addProject: (project) => {
        set((state) => ({
          projects: [...state.projects, { ...project, id: uuidv4() }],
        }));
      },
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
        })),

      // Context methods
      addContext: (context) => {
        set((state) => ({
          contexts: [...state.contexts, { ...context, id: uuidv4() }],
        }));
      },
      deleteContext: (id) =>
        set((state) => ({
          contexts: state.contexts.filter((context) => context.id !== id),
        })),

      // Note methods
      addNote: (note) => {
        const now = new Date();
        set((state) => ({
          notes: [
            ...state.notes,
            {
              ...note,
              id: uuidv4(),
              createdAt: now,
              updatedAt: now,
            },
          ],
        }));
      },
      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        })),
      updateNote: (id, updates) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, ...updates, updatedAt: new Date() }
              : note
          ),
        })),

      // NoteType methods
      addNoteType: (noteType) => {
        set((state) => ({
          noteTypes: [...state.noteTypes, { ...noteType, id: uuidv4() }],
        }));
      },
      deleteNoteType: (id) =>
        set((state) => ({
          noteTypes: state.noteTypes.filter((noteType) => noteType.id !== id),
        })),
    }),
    {
      name: 'app-storage',
    }
  )
);
