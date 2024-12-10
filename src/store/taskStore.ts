import { Task } from "@/types";
import { addDays, addWeeks, addMonths, getDay, getDate } from "date-fns";

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
          const interval = task.recurring.interval || 1;
          shouldGenerate = daysSinceLastGenerated >= interval;
          nextDeadline = task.deadline ? addDays(new Date(task.deadline), interval) : null;
          break;

        case 'weekly':
          if (task.recurring.daysOfWeek && task.recurring.daysOfWeek.length > 0) {
            const currentDayOfWeek = getDay(now);
            shouldGenerate = task.recurring.daysOfWeek.includes(currentDayOfWeek) &&
              daysSinceLastGenerated >= 1;
            if (task.deadline) {
              const nextOccurrence = task.recurring.daysOfWeek
                .find(day => day > currentDayOfWeek) || task.recurring.daysOfWeek[0];
              const daysToAdd = nextOccurrence > currentDayOfWeek
                ? nextOccurrence - currentDayOfWeek
                : 7 - (currentDayOfWeek - nextOccurrence);
              nextDeadline = addDays(new Date(task.deadline), daysToAdd);
            }
          }
          break;

        case 'monthly':
          if (task.recurring.daysOfMonth && task.recurring.daysOfMonth.length > 0) {
            const currentDayOfMonth = getDate(now);
            shouldGenerate = task.recurring.daysOfMonth.includes(currentDayOfMonth) &&
              daysSinceLastGenerated >= 1;
            if (task.deadline) {
              nextDeadline = addMonths(new Date(task.deadline), 1);
            }
          }
          break;
      }

      if (shouldGenerate) {
        console.log('Generating new recurring task:', {
          title: task.title,
          frequency: task.recurring.frequency,
          nextDeadline
        });
        
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