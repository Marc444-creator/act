import { Task } from "@/types";
import { addDays, addWeeks, addMonths, getDay, getDate, isBefore, startOfDay, endOfDay, isWithinInterval, subDays } from "date-fns";
import { toast } from "sonner";

export interface TaskStore {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  moveTaskToLater: (id: string) => void;
  generateRecurringTasks: () => void;
  checkAndMoveForLaterTasks: () => void;
}

export const createTaskStore = (set: any, get: any): TaskStore => ({
  tasks: [],
  
  addTask: (task) => {
    console.log("Adding new task:", task);
    set((state: any) => ({
      tasks: [
        ...state.tasks,
        { ...task, id: crypto.randomUUID(), createdAt: new Date() },
      ],
    }));
  },

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

  checkAndMoveForLaterTasks: () => {
    const state = get();
    const now = new Date();
    let tasksToMove: Task[] = [];

    state.tasks.forEach((task: Task) => {
      if (task.isForLater && task.deadline) {
        const deadlineDate = new Date(task.deadline);
        const oneDayBefore = subDays(deadlineDate, 1);
        
        // Check if current date is within the day before deadline
        if (isWithinInterval(now, { 
          start: startOfDay(oneDayBefore),
          end: endOfDay(oneDayBefore)
        })) {
          tasksToMove.push(task);
        }
      }
    });

    if (tasksToMove.length > 0) {
      set((state: any) => ({
        tasks: state.tasks.map((task: Task) =>
          tasksToMove.some(t => t.id === task.id)
            ? { ...task, isForLater: false }
            : task
        ),
      }));

      // Notify user about moved tasks
      tasksToMove.forEach(task => {
        toast.info(`Task "${task.title}" was moved to main list as deadline approaches`);
      });
    }
  },

  generateRecurringTasks: () => {
    const state = get();
    const now = new Date();
    const today = startOfDay(now);
    const tomorrow = endOfDay(now);
    let newTasks: Task[] = [];

    console.log("Checking for recurring tasks to generate...");

    state.tasks.forEach((task: Task) => {
      if (!task.recurring) return;

      const lastGenerated = new Date(task.recurring.lastGenerated);
      console.log(`Checking task "${task.title}" - Last generated: ${lastGenerated}`);

      let shouldGenerate = false;
      let nextDeadline = null;

      switch (task.recurring.frequency) {
        case 'daily':
          const interval = task.recurring.interval || 1;
          const daysSinceLastGenerated = Math.floor((now.getTime() - lastGenerated.getTime()) / (1000 * 60 * 60 * 24));
          shouldGenerate = daysSinceLastGenerated >= interval;
          if (shouldGenerate && task.deadline) {
            nextDeadline = addDays(new Date(task.deadline), interval);
          }
          break;

        case 'weekly':
          if (task.recurring.daysOfWeek && task.recurring.daysOfWeek.length > 0) {
            const currentDayOfWeek = getDay(now);
            shouldGenerate = task.recurring.daysOfWeek.includes(currentDayOfWeek) &&
              isBefore(lastGenerated, today);
            
            if (shouldGenerate && task.deadline) {
              nextDeadline = addWeeks(new Date(task.deadline), 1);
            }
          }
          break;

        case 'monthly':
          if (task.recurring.daysOfMonth && task.recurring.daysOfMonth.length > 0) {
            const currentDayOfMonth = getDate(now);
            shouldGenerate = task.recurring.daysOfMonth.includes(currentDayOfMonth) &&
              isBefore(lastGenerated, today);
            
            if (shouldGenerate && task.deadline) {
              nextDeadline = addMonths(new Date(task.deadline), 1);
            }
          }
          break;
      }

      if (shouldGenerate) {
        console.log(`Generating new occurrence for task "${task.title}"`);
        
        const newTask: Task = {
          ...task,
          id: crypto.randomUUID(),
          completed: false,
          deadline: nextDeadline,
          createdAt: new Date(),
          recurring: {
            ...task.recurring,
            lastGenerated: now
          }
        };

        newTasks.push(newTask);

        // Update the lastGenerated date of the original task
        set((state: any) => ({
          tasks: state.tasks.map((t: Task) =>
            t.id === task.id
              ? {
                  ...t,
                  recurring: {
                    ...t.recurring!,
                    lastGenerated: now
                  }
                }
              : t
          ),
        }));
      }
    });

    if (newTasks.length > 0) {
      console.log(`Adding ${newTasks.length} new recurring tasks`);
      set((state: any) => ({
        tasks: [...state.tasks, ...newTasks],
      }));
    }
  },
});
