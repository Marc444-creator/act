import { Task } from "@/types";
import { addDays, addWeeks, addMonths } from "date-fns";

export interface TaskStore {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  moveTaskToLater: (id: string) => void;
  generateRecurringTasks: () => void;
}

export const createTaskStore = (set: any, get: any): TaskStore => ({
  tasks: [],
  addTask: (task) =>
    set((state: any) => ({
      tasks: [
        ...state.tasks,
        { ...task, id: crypto.randomUUID(), createdAt: new Date() },
      ],
    })),
  deleteTask: (id) =>
    set((state: any) => ({
      tasks: state.tasks.filter((task: Task) => task.id !== id),
    })),
  toggleTask: (id) =>
    set((state: any) => ({
      tasks: state.tasks.map((task: Task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ),
    })),
  updateTask: (id, updates) =>
    set((state: any) => ({
      tasks: state.tasks.map((task: Task) =>
        task.id === id ? { ...task, ...updates } : task
      ),
    })),
  moveTaskToLater: (id) =>
    set((state: any) => ({
      tasks: state.tasks.map((task: Task) =>
        task.id === id ? { ...task, isForLater: !task.isForLater } : task
      ),
    })),
  generateRecurringTasks: () => {
    const state = get();
    const now = new Date();
    
    state.tasks.forEach((task: Task) => {
      if (!task.recurring || task.completed) return;

      const timeSinceLastGenerated = now.getTime() - new Date(task.recurring.lastGenerated).getTime();
      const daysSinceLastGenerated = timeSinceLastGenerated / (1000 * 60 * 60 * 24);

      let shouldGenerate = false;
      let nextDeadline = null;

      switch (task.recurring.frequency) {
        case 'daily':
          shouldGenerate = daysSinceLastGenerated >= 1;
          nextDeadline = task.deadline ? addDays(new Date(task.deadline), 1) : null;
          break;
        case 'weekly':
          shouldGenerate = daysSinceLastGenerated >= 7;
          nextDeadline = task.deadline ? addWeeks(new Date(task.deadline), 1) : null;
          break;
        case 'monthly':
          shouldGenerate = daysSinceLastGenerated >= 30;
          nextDeadline = task.deadline ? addMonths(new Date(task.deadline), 1) : null;
          break;
      }

      if (shouldGenerate) {
        state.addTask({
          ...task,
          completed: false,
          deadline: nextDeadline,
          recurring: {
            ...task.recurring,
            lastGenerated: now
          }
        });
      }
    });
  },
});